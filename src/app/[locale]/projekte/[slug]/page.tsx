import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { findPublishedProject, listPublishedProjects } from "@/lib/cms/content-source";
import { getProjectService } from "@/lib/projects/projects";

const COPY: Record<
  Locale,
  {
    back: string;
    service: string;
    duration: string;
    location: string;
    challenge: string;
    solution: string;
    result: string;
    ctaTitle: string;
    cta: string;
  }
> = {
  de: {
    back: "Alle Projekte",
    service: "Leistung",
    duration: "Dauer",
    location: "Ort",
    challenge: "Ausgangslage",
    solution: "Lösung",
    result: "Ergebnis",
    ctaTitle: "Ähnliches Projekt geplant?",
    cta: "Anfrage senden",
  },
  en: {
    back: "All projects",
    service: "Service",
    duration: "Duration",
    location: "Location",
    challenge: "Challenge",
    solution: "Solution",
    result: "Result",
    ctaTitle: "Planning something similar?",
    cta: "Send request",
  },
};

export async function generateStaticParams() {
  const projects = await listPublishedProjects();
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = await findPublishedProject(slug);
  if (!project) return {};

  return {
    title: project.title[locale],
    description: project.summary[locale],
    alternates: {
      canonical: `/${locale}/projekte/${project.slug}`,
      languages: {
        de: `/de/projekte/${project.slug}`,
        en: `/en/projekte/${project.slug}`,
        "x-default": `/de/projekte/${project.slug}`,
      },
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();

  const project = await findPublishedProject(slug);
  if (!project) notFound();

  const copy = COPY[locale];
  const service = getProjectService(project);
  const cover = project.media.find((item) => item.kind === "cover") ?? project.media[0];
  const gallery = project.media.filter((item) => item.kind !== "cover");

  return (
    <main>
      <section className="bg-(--color-bg-primary) py-24 text-(--color-text-primary) lg:py-36">
        <Container>
          <FadeIn>
            <Link href={`/${locale}/projekte`} className="text-sm font-medium text-(--color-accent)">
              ← {copy.back}
            </Link>
            <h1 className="mt-8 max-w-5xl text-5xl font-light leading-[1.02] lg:text-8xl">
              {project.title[locale]}
            </h1>
            <p className="mt-8 max-w-3xl text-base leading-7 text-(--color-text-muted) lg:text-xl">
              {project.summary[locale]}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <FadeIn>
            <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover.src}
                    width={cover.width}
                    height={cover.height}
                    alt={cover.alt[locale]}
                    className="aspect-[16/10] w-full object-cover"
                    loading="eager"
                  />
                ) : null}
              </div>
              <dl className="grid gap-3 rounded-2xl border border-black/10 bg-white p-6">
                {[
                  [copy.service, service?.title[locale] ?? project.serviceSlug],
                  [copy.location, project.location],
                  [copy.duration, project.duration[locale]],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-black/[0.03] p-4">
                    <dt className="text-xs font-medium tracking-[0.08em] text-black/40 uppercase">{label}</dt>
                    <dd className="mt-2 text-lg text-black">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="mt-16 grid gap-6 lg:grid-cols-3">
              {[
                [copy.challenge, project.challenge[locale]],
                [copy.solution, project.solution[locale]],
                [copy.result, project.result[locale]],
              ].map(([title, body]) => (
                <article key={title} className="rounded-2xl border border-black/10 bg-white p-8">
                  <h2 className="text-2xl font-light text-black">{title}</h2>
                  <p className="mt-5 text-sm leading-6 text-black/60">{body}</p>
                </article>
              ))}
            </div>
          </FadeIn>

          {gallery.length > 0 ? (
            <FadeIn delay={0.15}>
              <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gallery.map((item) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={item.src}
                    src={item.src}
                    width={item.width}
                    height={item.height}
                    alt={item.alt[locale]}
                    loading="lazy"
                    className="aspect-[4/3] rounded-2xl object-cover"
                  />
                ))}
              </div>
            </FadeIn>
          ) : null}

          <FadeIn delay={0.2}>
            <div className="mt-16 rounded-2xl bg-(--color-bg-primary) p-8 text-(--color-text-primary) lg:p-10">
              <h2 className="text-3xl font-light">{copy.ctaTitle}</h2>
              <Link
                href={`/${locale}/kontakt?service=${project.serviceSlug}`}
                className="mt-8 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
              >
                {copy.cta}
              </Link>
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
