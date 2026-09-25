import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/project/ProjectCard";
import { listPublishedProjects } from "@/lib/cms/content-source";

const HEADING: Record<Locale, { title: string; sub: string }> = {
  de: {
    title: "Ausgewählte Projekte",
    sub: "Einblicke in ausgeführte Arbeiten und fertiggestellte Projekte.",
  },
  en: {
    title: "Selected projects",
    sub: "A look at completed work and finished projects.",
  },
};

export async function Work({ locale }: { locale: Locale }) {
  const copy = HEADING[locale];
  const projects = (await listPublishedProjects()).slice(0, 3);
  if (projects.length === 0) return null;

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-3 text-3xl font-light text-(--color-text-primary) lg:text-5xl">
            {copy.title}
          </h2>
          <p className="mb-16 max-w-md text-sm text-(--color-text-muted)">{copy.sub}</p>
        </FadeIn>

        <div className="grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} locale={locale} />
          ))}
        </div>
      </Container>
    </section>
  );
}
