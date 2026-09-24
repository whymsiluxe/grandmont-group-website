import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { approvedServices, getGroupedApprovedServices } from "@/lib/services/approved-services";

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
  }
> = {
  de: {
    title: "Projekte",
    sub: "Echte Arbeiten, echte Fotos, echte Freigaben. Portfolio-Inhalte werden erst veröffentlicht, wenn Bildrechte und Kundendaten sauber geklärt sind.",
    filters: "Kategorien",
    emptyTitle: "Portfolio wird vorbereitet",
    emptyBody: "Die Struktur ist bereit: Projekt, Ort, Leistung, Dauer, Fotos, Herausforderung, Lösung und Ergebnis. Keine erfundenen Referenzen.",
    cmsNote: "Projektkarten werden später aus Payload CMS geladen.",
    cta: "Projekt anfragen",
  },
  en: {
    title: "Projects",
    sub: "Real work, real photos, real permissions. Portfolio content appears only after image rights and client data are properly cleared.",
    filters: "Categories",
    emptyTitle: "Portfolio is being prepared",
    emptyBody: "The structure is ready: project, location, service, duration, photos, challenge, solution and result. No invented references.",
    cmsNote: "Project cards will later load from Payload CMS.",
    cta: "Request a project",
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
  const groups = getGroupedApprovedServices();

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
            <h2 className="mb-6 text-2xl font-light">{copy.filters}</h2>
            <div className="flex flex-wrap gap-2">
              {groups.map((group) => (
                <span key={group.id} className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/60">
                  {group.label[locale]}
                </span>
              ))}
              {approvedServices.map((service) => (
                <span key={service.slug} className="rounded-full border border-black/15 px-4 py-2 text-sm text-black/60">
                  {service.title[locale]}
                </span>
              ))}
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-16 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="min-h-96 rounded-2xl bg-(--color-bg-primary) p-8 text-(--color-text-primary)">
                <p className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                  CMS ready
                </p>
                <h2 className="mt-6 max-w-md text-4xl font-light">{copy.emptyTitle}</h2>
                <p className="mt-6 max-w-lg text-sm text-(--color-text-muted)">{copy.emptyBody}</p>
              </div>
              <div className="rounded-2xl border border-black/10 p-8">
                <p className="text-sm text-black/60">{copy.cmsNote}</p>
                <Link
                  href={`/${locale}/kontakt`}
                  className="mt-8 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary)"
                >
                  {copy.cta}
                </Link>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
