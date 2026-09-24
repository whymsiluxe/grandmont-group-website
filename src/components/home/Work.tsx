import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/project/ProjectCard";
import { getPublishedProjects, projectQualityGates } from "@/lib/projects/projects";

const HEADING: Record<Locale, { title: string; sub: string; emptyTitle: string; cta: string }> = {
  de: {
    title: "Reale Arbeit, reale Ergebnisse",
    sub: "Referenzen werden nur mit echten Fotos, sauberer Freigabe und klarer Projektbeschreibung veröffentlicht.",
    emptyTitle: "Portfolio wird mit echten Freigaben aufgebaut",
    cta: "Projekte ansehen",
  },
  en: {
    title: "Real work, real results",
    sub: "References are published only with real photos, proper approval and clear project context.",
    emptyTitle: "Portfolio is being built with real approvals",
    cta: "View projects",
  },
};

export function Work({ locale }: { locale: Locale }) {
  const copy = HEADING[locale];
  const projects = getPublishedProjects().slice(0, 3);

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-3 text-3xl font-light text-(--color-text-primary) lg:text-5xl">
            {copy.title}
          </h2>
          <p className="mb-16 max-w-md text-sm text-(--color-text-muted)">{copy.sub}</p>
        </FadeIn>

        {projects.length > 0 ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} locale={locale} />
            ))}
          </div>
        ) : (
          <FadeIn delay={0.1}>
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-2xl border border-white/10 bg-(--color-bg-surface) p-8 lg:p-10">
                <p className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                  CMS ready
                </p>
                <h3 className="mt-6 max-w-lg text-4xl font-light text-(--color-text-primary)">
                  {copy.emptyTitle}
                </h3>
                <p className="mt-6 max-w-xl text-sm leading-6 text-(--color-text-muted)">{copy.sub}</p>
                <Link
                  href={`/${locale}/projekte`}
                  className="mt-8 inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
                >
                  {copy.cta}
                </Link>
              </div>

              <div className="rounded-2xl border border-white/10 p-8 lg:p-10">
                <ul className="space-y-4">
                  {projectQualityGates[locale].map((rule) => (
                    <li key={rule} className="flex gap-3 text-sm leading-6 text-(--color-text-muted)">
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-(--color-accent)" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </FadeIn>
        )}
      </Container>
    </section>
  );
}
