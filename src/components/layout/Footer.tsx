import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";
import { Container } from "./Container";

const COPY: Record<
  Locale,
  { tagline: string; serviceAreaLabel: string; contact: string; legal: { impressum: string; datenschutz: string } }
> = {
  de: {
    tagline: "Montage & Handwerksleistungen in Chemnitz und Umgebung.",
    serviceAreaLabel: "Einsatzgebiet",
    contact: "Kontakt",
    legal: { impressum: "Impressum", datenschutz: "Datenschutz" },
  },
  en: {
    tagline: "Assembly & craft services in Chemnitz and the surrounding region.",
    serviceAreaLabel: "Service area",
    contact: "Contact",
    legal: { impressum: "Legal notice", datenschutz: "Privacy policy" },
  },
};

export function Footer({ locale }: { locale: Locale }) {
  const copy = COPY[locale];

  return (
    <footer className="border-t border-white/10 bg-(--color-bg-surface)">
      <Container className="py-16">
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

          <nav
            aria-label={locale === "de" ? "Fußnavigation" : "Footer navigation"}
            className="flex flex-col gap-2 text-sm text-(--color-text-muted)"
          >
            <Link href={`/${locale}/ueber-uns`} className="transition-colors hover:text-(--color-text-primary)">
              {locale === "de" ? "Über uns" : "About us"}
            </Link>
            <Link href={`/${locale}/unternehmen`} className="transition-colors hover:text-(--color-text-primary)">
              {locale === "de" ? "Für Unternehmen" : "For businesses"}
            </Link>
            <Link href={`/${locale}/projekte`} className="transition-colors hover:text-(--color-text-primary)">
              {locale === "de" ? "Projekte" : "Projects"}
            </Link>
            <Link href={`/${locale}/ratgeber`} className="transition-colors hover:text-(--color-text-primary)">
              {locale === "de" ? "Ratgeber" : "Guides"}
            </Link>
            <Link href={`/${locale}/kontakt`} className="transition-colors hover:text-(--color-text-primary)">
              {copy.contact}
            </Link>
            <Link href={`/${locale}/impressum`} className="transition-colors hover:text-(--color-text-primary)">
              {copy.legal.impressum}
            </Link>
            <Link href={`/${locale}/datenschutz`} className="transition-colors hover:text-(--color-text-primary)">
              {copy.legal.datenschutz}
            </Link>
          </nav>
        </div>

        <p className="mt-16 text-xs text-(--color-text-muted)">
          © {new Date().getFullYear()} {siteConfig.legalName}
        </p>
      </Container>
    </footer>
  );
}
