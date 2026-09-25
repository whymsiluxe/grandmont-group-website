import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { MaskedReveal } from "@/components/motion/MaskedReveal";
import { getProjectService, type Project } from "@/lib/projects/projects";

const COPY: Record<Locale, { eyebrow: string; cta: string }> = {
  de: { eyebrow: "Ausgewähltes Projekt", cta: "Projekt ansehen" },
  en: { eyebrow: "Featured project", cta: "View project" },
};

// The visual centre of the homepage when a real, published project exists
// (clientApproved + imageRightsCleared, already gated upstream by
// listPublishedProjects). Renders nothing when there is none — no
// placeholder project is ever invented.
export function FeaturedProject({ locale, project }: { locale: Locale; project: Project }) {
  const copy = COPY[locale];
  const service = getProjectService(project);
  const cover = project.media.find((item) => item.kind === "cover") ?? project.media[0];
  const secondary = project.media.find((item) => item !== cover);

  if (!cover) return null;

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <p className="mb-10 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase lg:mb-14">
          {copy.eyebrow}
        </p>

        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <MaskedReveal className={secondary ? "lg:col-span-8" : "lg:col-span-12"}>
            <div className="aspect-[4/3] w-full overflow-hidden bg-(--color-bg-surface) lg:aspect-[16/10]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover.src}
                width={cover.width || undefined}
                height={cover.height || undefined}
                alt={cover.alt[locale]}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          </MaskedReveal>

          {secondary ? (
            <MaskedReveal className="lg:col-span-4">
              <div className="aspect-[4/3] w-full overflow-hidden bg-(--color-bg-surface) lg:aspect-[16/10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={secondary.src}
                  width={secondary.width || undefined}
                  height={secondary.height || undefined}
                  alt={secondary.alt[locale]}
                  loading="lazy"
                  className="size-full object-cover"
                />
              </div>
            </MaskedReveal>
          ) : null}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.4fr] lg:items-end lg:gap-16">
          <div>
            <h2 className="text-3xl font-light text-(--color-text-primary) lg:text-5xl">{project.title[locale]}</h2>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-(--color-text-muted)">
              {project.location ? <span>{project.location}</span> : null}
              {service ? <span>{service.title[locale]}</span> : null}
              {project.duration[locale] ? <span>{project.duration[locale]}</span> : null}
            </div>
          </div>

          <div>
            {project.result[locale] ? (
              <p className="text-lg leading-relaxed text-(--color-text-muted)">{project.result[locale]}</p>
            ) : null}
            <Link
              href={`/${locale}/projekte/${project.slug}`}
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-(--color-accent)"
            >
              {copy.cta} →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
