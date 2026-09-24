import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/project/ProjectCard";
import { isLocale, type Locale } from "@/i18n/config";
import {
  listApprovedServices,
  listGroupedApprovedServices,
  listPublishedProjects,
} from "@/lib/cms/content-source";
import { projectContentFields, projectQualityGates } from "@/lib/projects/projects";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    filters: string;
    emptyTitle: string;
    emptyBody: string;
    cmsNote: string;
    cta: string;
    published: string;
    qualityChecks: string;
    modelTitle: string;
    modelBody: string;
    qualityTitle: string;
    noProjectBadge: string;
  }
> = {
  de: {
    title: "Projekte",
    sub: "Echte Arbeiten, echte Fotos, echte Freigaben. Portfolio-Inhalte werden erst veröffentlicht, wenn Bildrechte und Kundendaten sauber geklärt sind.",
    filters: "Kategorien",
    emptyTitle: "Echte Projekte folgen in Kürze",
    emptyBody: "Die Struktur ist bereit: Projekt, Ort, Leistung, Dauer, Fotos, Herausforderung, Lösung und Ergebnis. Keine erfundenen Referenzen.",
    cmsNote: "Wir veröffentlichen erst, wenn Fotos und Kundenfreigaben vollständig sind.",
    cta: "Projekt anfragen",
    published: "Veröffentlicht",
    qualityChecks: "Checks",
    modelTitle: "So wird jede Referenz aufgebaut",
    modelBody: "Jede Karte bekommt dieselbe klare Logik, damit Besucher schnell verstehen, was gemacht wurde und warum das Ergebnis vertrauenswürdig ist.",
    qualityTitle: "Veröffentlichungsregeln",
    noProjectBadge: "Keine Fake-Referenzen",
  },
  en: {
    title: "Projects",
    sub: "Real work, real photos, real permissions. Portfolio content appears only after image rights and client data are properly cleared.",
    filters: "Categories",
    emptyTitle: "Real projects are coming soon",
    emptyBody: "The structure is ready: project, location, service, duration, photos, challenge, solution and result. No invented references.",
    cmsNote: "We publish only once photos and client approvals are fully in place.",
    cta: "Request a project",
    published: "Published",
    qualityChecks: "Checks",
    modelTitle: "How every reference is structured",
    modelBody: "Every card follows the same clear logic so visitors quickly understand what was done and why the result can be trusted.",
    qualityTitle: "Publishing rules",
    noProjectBadge: "No fake references",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    alternates: {
      canonical: `/${locale}/projekte`,
      languages: { de: "/de/projekte", en: "/en/projekte", "x-default": "/de/projekte" },
    },
  };
}

export default async function ProjektePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];
  const groups = await listGroupedApprovedServices();
  const approvedServices = await listApprovedServices();
  const projects = await listPublishedProjects();

  return (
    <main>
      <section className="bg-(--color-bg-primary) py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              Grandmont Group — Chemnitz
            </p>
            <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-8 max-w-3xl text-base text-(--color-text-muted) lg:text-xl">{copy.sub}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <h2 className="text-2xl font-light">{copy.filters}</h2>
                <p className="mt-4 max-w-md text-sm leading-6 text-black/55">
                  {locale === "de"
                    ? "Die Kategorien folgen exakt den freigegebenen Leistungen. Sobald echte Projekte im CMS stehen, werden die Filter aktiv genutzt."
                    : "Categories follow the approved services exactly. Once real projects are in the CMS, these filters become active."}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-3xl font-light text-black">{projects.length}</p>
                  <p className="mt-2 text-xs font-medium tracking-[0.08em] text-black/45 uppercase">
                    {copy.published}
                  </p>
                </div>
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-3xl font-light text-black">{projectQualityGates[locale].length}</p>
                  <p className="mt-2 text-xs font-medium tracking-[0.08em] text-black/45 uppercase">
                    {copy.qualityChecks}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-2">
              {groups.map((group) => (
                <span key={group.id} className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-black/60">
                  {group.label[locale]}
                </span>
              ))}
              {approvedServices.map((service) => (
                <span key={service.slug} className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm text-black/60">
                  {service.title[locale]}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            {projects.length > 0 ? (
              <div className="mt-16 grid gap-6 lg:grid-cols-3">
                {projects.map((project) => (
                  <ProjectCard key={project.slug} project={project} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="mt-16 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
                <div className="min-h-96 rounded-2xl bg-(--color-bg-primary) p-8 text-(--color-text-primary) lg:p-10">
                  <span className="rounded-full bg-white/8 px-4 py-2 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                    {copy.noProjectBadge}
                  </span>
                  <h2 className="mt-8 max-w-md text-4xl font-light">{copy.emptyTitle}</h2>
                  <p className="mt-6 max-w-xl text-sm leading-6 text-(--color-text-muted)">{copy.emptyBody}</p>
                  <div className="mt-10 grid gap-3 sm:grid-cols-2">
                    {projectContentFields[locale].map((field) => (
                      <div key={field} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-white/70">
                        {field}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-black/10 bg-white p-8 lg:p-10">
                  <p className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                    {locale === "de" ? "Unser Standard" : "Our standard"}
                  </p>
                  <h2 className="mt-5 text-3xl font-light text-black">{copy.modelTitle}</h2>
                  <p className="mt-5 text-sm leading-6 text-black/60">{copy.modelBody}</p>

                  <h3 className="mt-10 text-sm font-medium text-black">{copy.qualityTitle}</h3>
                  <ul className="mt-4 space-y-3">
                    {projectQualityGates[locale].map((rule) => (
                      <li key={rule} className="flex gap-3 text-sm leading-6 text-black/60">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-(--color-accent)" />
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>

                  <p className="mt-10 text-sm text-black/60">{copy.cmsNote}</p>
                  <Link
                    href={`/${locale}/kontakt`}
                    className="mt-6 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
                  >
                    {copy.cta}
                  </Link>
                </div>
              </div>
            )}
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
