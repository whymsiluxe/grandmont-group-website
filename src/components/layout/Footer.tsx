import type { Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<
  Locale,
  { tagline: string; serviceAreaLabel: string; legal: { impressum: string; datenschutz: string } }
> = {
  de: {
    tagline: "Montage & Handwerksleistungen in Chemnitz und Umgebung.",
    serviceAreaLabel: "Einsatzgebiet",
    legal: { impressum: "Impressum", datenschutz: "Datenschutz" },
  },
  en: {
    tagline: "Assembly & craft services in Chemnitz and the surrounding region.",
    serviceAreaLabel: "Service area",
    legal: { impressum: "Legal notice", datenschutz: "Privacy policy" },
  },
};

export function Footer({ locale }: { locale: Locale }) {
  const copy = COPY[locale];

  return (
    <footer className="border-t border-white/10 bg-(--color-bg-surface)">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-(--color-text-primary)">Grandmont Group</p>
            <p className="mt-3 max-w-sm text-sm text-(--color-text-muted)">{copy.tagline}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-(--color-text-primary)">
              {copy.serviceAreaLabel}
            </p>
            <ul className="mt-3 space-y-1 text-sm text-(--color-text-muted)">
              {siteConfig.serviceArea.map((city) => (
                <li key={city}>{city}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 text-sm text-(--color-text-muted)">
            <a href="#" className="transition-colors hover:text-(--color-text-primary)">
              {copy.legal.impressum}
            </a>
            <a href="#" className="transition-colors hover:text-(--color-text-primary)">
              {copy.legal.datenschutz}
            </a>
          </div>
        </div>

        <p className="mt-16 text-xs text-(--color-text-muted)">
          © {new Date().getFullYear()} {siteConfig.legalName}
        </p>
      </div>
    </footer>
  );
}
