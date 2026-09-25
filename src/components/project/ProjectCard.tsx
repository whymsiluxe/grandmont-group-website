import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { getProjectService, type Project } from "@/lib/projects/projects";

export function ProjectCard({ project, locale }: { project: Project; locale: Locale }) {
  const service = getProjectService(project);
  const cover = project.media.find((item) => item.kind === "cover") ?? project.media[0];

  return (
    <article className="overflow-hidden rounded-lg border border-black/10 bg-white">
      {cover ? (
        <div className="aspect-[4/3] bg-black/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={cover.src}
            width={cover.width}
            height={cover.height}
            alt={cover.alt[locale]}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-black/[0.04] text-xs font-medium tracking-[0.08em] text-black/35 uppercase">
          {locale === "de" ? "Foto folgt" : "Photo pending"}
        </div>
      )}

      <div className="p-6">
        <p className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
          {service?.title[locale] ?? project.serviceSlug}
        </p>
        <h2 className="mt-3 text-2xl font-light text-black">{project.title[locale]}</h2>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-black/55">
          <span className="rounded-full bg-black/[0.04] px-3 py-1">{project.location}</span>
          <span className="rounded-full bg-black/[0.04] px-3 py-1">{project.duration[locale]}</span>
        </div>
        <p className="mt-5 text-sm leading-6 text-black/60">{project.challenge[locale]}</p>
        <Link
          href={`/${locale}/projekte/${project.slug}`}
          className="mt-6 inline-flex text-sm font-medium text-(--color-accent)"
        >
          {locale === "de" ? "Projekt ansehen" : "View project"} →
        </Link>
      </div>
    </article>
  );
}
