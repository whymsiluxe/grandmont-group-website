import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { getProjectService, type Project } from "@/lib/projects/projects";

const HEADING: Record<Locale, { eyebrow: string; title: string; viewAll: string }> = {
  de: { eyebrow: "Portfolio", title: "Ausgeführte Projekte", viewAll: "Alle Projekte" },
  en: { eyebrow: "Portfolio", title: "Completed work", viewAll: "All projects" },
};

// Editorial/asymmetric — deliberately not ProjectCard's white product-card
// treatment (that pattern is kept for the /projekte listing page). Images
// dominate; title/meta is a small caption, not a headline. Cycles a
// landscape/portrait pattern so it still reads as a considered layout
// regardless of how many published projects exist.
const TILE_LAYOUT = [
  { span: "lg:col-span-6", aspect: "aspect-[4/3]" },
  { span: "lg:col-span-6", aspect: "aspect-[4/3]" },
  { span: "lg:col-span-4", aspect: "aspect-[3/4]" },
  { span: "lg:col-span-4", aspect: "aspect-[3/4]" },
  { span: "lg:col-span-4", aspect: "aspect-[3/4]" },
] as const;

export function ProjectGallery({ locale, projects }: { locale: Locale; projects: Project[] }) {
  const copy = HEADING[locale];
  const tiles = projects.filter((p) => p.media.length > 0).slice(0, TILE_LAYOUT.length);
  if (tiles.length === 0) return null;

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <FadeIn className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <div>
            <p className="mb-4 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="text-3xl font-light lg:text-5xl">{copy.title}</h2>
          </div>
          <Link
            href={`/${locale}/projekte`}
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black sm:inline-flex"
          >
            {copy.viewAll} →
          </Link>
        </FadeIn>

        <div className="grid gap-4 lg:grid-cols-12">
          {tiles.map((project, i) => (
            <GalleryTile key={project.slug} project={project} locale={locale} layout={TILE_LAYOUT[i]} index={i} />
          ))}
        </div>

        <Link
          href={`/${locale}/projekte`}
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-black/60 transition-colors hover:text-black sm:hidden"
        >
          {copy.viewAll} →
        </Link>
      </Container>
    </section>
  );
}

function GalleryTile({
  project,
  locale,
  layout,
  index,
}: {
  project: Project;
  locale: Locale;
  layout: (typeof TILE_LAYOUT)[number];
  index: number;
}) {
  const cover = project.media.find((item) => item.kind === "cover") ?? project.media[0];
  const service = getProjectService(project);

  return (
    <FadeIn delay={Math.min(index, 3) * 0.05} className={layout.span}>
      <Link
        href={`/${locale}/projekte/${project.slug}`}
        className={`group relative block overflow-hidden bg-black/5 ${layout.aspect}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={cover.src}
          alt={cover.alt[locale]}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]"
        />
        {/* Caption stays visible (not hover-only) so it reaches touch and
            keyboard-focus users, not just mouse hover. */}
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-sm font-medium text-white">{project.title[locale]}</p>
          <p className="mt-1 text-xs text-white/70">
            {[project.location, service?.title[locale]].filter(Boolean).join(" · ")}
          </p>
        </div>
      </Link>
    </FadeIn>
  );
}
