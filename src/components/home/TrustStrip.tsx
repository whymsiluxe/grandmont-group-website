import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { siteConfig } from "@/lib/seo/site-config";

// Continuous factual band, not another full-height chapter. Every item here
// is an already-approved, verifiable proposition (service area from
// siteConfig, the three service categories, the two Advantages claims that
// read well standalone) — nothing new is asserted, nothing is a stat/count/
// rating, per the no-fabrication constraint.
const ITEMS: Record<Locale, string[]> = {
  de: [
    `${siteConfig.city} & Region`,
    "Montage · Innenausbau · Objektservice",
    "Klare Kommunikation",
    "Verlässliche Ausführung",
  ],
  en: [
    `${siteConfig.city} & region`,
    "Assembly · Interior fit-out · Property services",
    "Clear communication",
    "Reliable execution",
  ],
};

export function TrustStrip({ locale }: { locale: Locale }) {
  const items = ITEMS[locale];

  return (
    <div className="border-y border-white/10 bg-(--color-bg-surface)">
      <Container>
        <ul className="flex flex-wrap items-center justify-center gap-y-3 divide-x divide-white/10 py-5 text-center text-xs font-medium tracking-[0.04em] text-(--color-text-muted)">
          {items.map((item) => (
            <li key={item} className="whitespace-nowrap px-5 first:pl-0 last:pr-0">
              {item}
            </li>
          ))}
        </ul>
      </Container>
    </div>
  );
}
