"use client";

import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ServiceScene } from "@/components/home/ServiceScene";
import type { Locale } from "@/i18n/config";
import type { ApprovedService } from "@/lib/services/approved-services";

const HEADING: Record<Locale, { eyebrow: string; title: string }> = {
  de: { eyebrow: "Leistungen", title: "Was wir übernehmen" },
  en: { eyebrow: "Services", title: "What we take off your hands" },
};

const VIEW_ALL: Record<Locale, string> = {
  de: "Alle Leistungen",
  en: "All services",
};

// Asymmetric tile pattern, cycling per index so it still holds up if the
// CMS ever serves fewer/more than 6 services. Two "large" tiles first
// (image-style, caption overlaid on a gradient scrim), then a row of
// portrait tiles (caption stacked below), then one wide tile — this is the
// variation the flat 3/4-col identical-card grid didn't have.
const TILE_LAYOUT = [
  { span: "lg:col-span-7", aspect: "aspect-[4/3] lg:aspect-[16/10]", overlay: true },
  { span: "lg:col-span-5", aspect: "aspect-[4/3] lg:aspect-[16/10]", overlay: true },
  { span: "lg:col-span-4", aspect: "aspect-[4/3] lg:aspect-[3/4]", overlay: false },
  { span: "lg:col-span-4", aspect: "aspect-[4/3] lg:aspect-[3/4]", overlay: false },
  { span: "lg:col-span-4", aspect: "aspect-[4/3] lg:aspect-[3/4]", overlay: false },
  { span: "lg:col-span-12", aspect: "aspect-[4/3] lg:aspect-[21/9]", overlay: true },
] as const;

export function ServicesGrid({ locale, services }: { locale: Locale; services: ApprovedService[] }) {
  const copy = HEADING[locale];
  const tiles = services.slice(0, TILE_LAYOUT.length);
  if (tiles.length === 0) return null;

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16">
          <div>
            <p className="mb-4 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-lg text-3xl font-light text-(--color-text-primary) lg:text-5xl">{copy.title}</h2>
          </div>
          <Link
            href={`/${locale}/leistungen`}
            className="hidden shrink-0 items-center gap-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) sm:inline-flex"
          >
            {VIEW_ALL[locale]} →
          </Link>
        </FadeIn>

        <div className="grid gap-4 lg:grid-cols-12">
          {tiles.map((service, i) => (
            <ServiceTile key={service.slug} service={service} locale={locale} layout={TILE_LAYOUT[i]} index={i} />
          ))}
        </div>

        <Link
          href={`/${locale}/leistungen`}
          className="mt-10 inline-flex items-center gap-2 text-sm font-medium text-(--color-text-muted) transition-colors hover:text-(--color-text-primary) sm:hidden"
        >
          {VIEW_ALL[locale]} →
        </Link>
      </Container>
    </section>
  );
}

function ServiceTile({
  service,
  locale,
  layout,
  index,
}: {
  service: ApprovedService;
  locale: Locale;
  layout: (typeof TILE_LAYOUT)[number];
  index: number;
}) {
  return (
    <FadeIn delay={Math.min(index, 3) * 0.05} className={layout.span}>
      <Link
        href={`/${locale}/leistungen/${service.slug}`}
        className="group relative block overflow-hidden border border-white/10 bg-(--color-bg-surface)"
      >
        <div className={`relative w-full overflow-hidden ${layout.aspect}`}>
          <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-[1.03]">
            <ServiceScene slug={service.slug} active />
          </div>
          {layout.overlay ? (
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0)_45%,rgba(10,9,8,0.85)_100%)]"
            />
          ) : null}

          {layout.overlay ? (
            <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
              <TileCopy service={service} locale={locale} />
            </div>
          ) : null}
        </div>

        {layout.overlay ? null : (
          <div className="p-6">
            <TileCopy service={service} locale={locale} />
          </div>
        )}
      </Link>
    </FadeIn>
  );
}

function TileCopy({ service, locale }: { service: ApprovedService; locale: Locale }) {
  return (
    <>
      <h3 className="text-xl font-light text-(--color-text-primary) lg:text-2xl">{service.title[locale]}</h3>
      <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-(--color-text-muted)">
        {service.statement[locale]}
      </p>
      <span className="mt-3 inline-flex items-center gap-2 text-xs font-medium tracking-[0.06em] text-(--color-accent) uppercase transition-transform group-hover:translate-x-1">
        {locale === "de" ? "Mehr erfahren" : "Learn more"} →
      </span>
    </>
  );
}
