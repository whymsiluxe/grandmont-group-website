import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/project/ProjectCard";
import { isLocale, type Locale } from "@/i18n/config";
import { listPublishedProjects } from "@/lib/cms/content-source";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    emptyTitle: string;
    emptyBody: string;
    cta: string;
  }
> = {
  de: {
    title: "Projekte",
    sub: "Reale Arbeiten aus Chemnitz und Umgebung.",
    emptyTitle: "Projekte",
    emptyBody: "Unsere Referenzen werden derzeit vorbereitet.",
    cta: "Angebot anfragen",
  },
  en: {
    title: "Projects",
    sub: "Real work from Chemnitz and the surrounding region.",
    emptyTitle: "Projects",
    emptyBody: "Our references are currently being prepared.",
    cta: "Request a quote",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const projects = await listPublishedProjects();
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    // No SEO value in indexing an empty overview page — noindex until at
    // least one real project is published, then it re-indexes
    // automatically (no manual flag to remember to flip back).
    robots: projects.length > 0 ? { index: true, follow: true } : { index: false, follow: true },
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
  const projects = await listPublishedProjects();

  if (projects.length === 0) {
    return (
      <main className="bg-(--color-bg-primary)">
        <section className="flex min-h-[70vh] items-center py-28">
          <Container>
            <FadeIn>
              <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                Grandmont Group — Chemnitz
              </p>
              <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-7xl">
                {copy.emptyTitle}
              </h1>
              <p className="mt-8 max-w-xl text-base text-(--color-text-muted) lg:text-lg">{copy.emptyBody}</p>
              <Link
                href={`/${locale}/kontakt`}
                className="mt-10 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
              >
                {copy.cta}
              </Link>
            </FadeIn>
          </Container>
        </section>
      </main>
    );
  }

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
            <div className="grid gap-6 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} locale={locale} />
              ))}
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
