import Link from "next/link";
import { locales, type Locale } from "@/i18n/config";
import { getGroupedApprovedServices } from "@/lib/services/approved-services";
import { Container } from "./Container";

const CONTACT_LABEL: Record<Locale, string> = {
  de: "Angebot anfragen",
  en: "Request a quote",
};

const MOBILE_LINKS: Record<Locale, { label: string; href: string }[]> = {
  de: [
    { label: "Leistungen", href: "/leistungen" },
    { label: "Projekte", href: "/projekte" },
    { label: "Für Unternehmen", href: "/unternehmen" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  en: [
    { label: "Services", href: "/leistungen" },
    { label: "Projects", href: "/projekte" },
    { label: "For businesses", href: "/unternehmen" },
    { label: "About us", href: "/ueber-uns" },
    { label: "Contact", href: "/kontakt" },
  ],
};

export function Header({ locale }: { locale: Locale }) {
  const groups = getGroupedApprovedServices();
  const mobileLinks = MOBILE_LINKS[locale];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-(--color-bg-primary)/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight text-(--color-text-primary)"
        >
          Grandmont Group
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {groups.map((item) => (
            <Link
              key={item.id}
              href={`/${locale}/leistungen#${item.id}`}
              className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
            >
              {item.label[locale]}
            </Link>
          ))}
        </nav>

        <Link
          href={`/${locale}/kontakt`}
          className="hidden rounded-full border border-(--color-accent) px-5 py-2 text-sm text-(--color-text-primary) transition-colors hover:bg-(--color-accent) lg:inline-block"
        >
          {CONTACT_LABEL[locale]}
        </Link>

        <div className="hidden items-center gap-2 text-xs font-medium tracking-[0.08em] text-(--color-text-muted) uppercase lg:flex">
          {locales.map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              className={item === locale ? "text-(--color-text-primary)" : "transition-colors hover:text-(--color-text-primary)"}
            >
              {item}
            </Link>
          ))}
        </div>

        <details className="group relative lg:hidden">
          <summary
            aria-label="Menu"
            className="flex h-10 w-10 list-none cursor-pointer items-center justify-center text-(--color-text-primary) marker:hidden"
          >
            <span className="block h-px w-5 bg-current transition-transform group-open:rotate-45" />
            <span className="absolute block h-px w-5 translate-y-2 bg-current transition-transform group-open:-translate-y-0 group-open:-rotate-45" />
          </summary>
          <nav className="absolute right-0 top-12 min-w-64 rounded-2xl border border-white/10 bg-(--color-bg-surface) p-3 shadow-2xl">
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={`/${locale}${item.href}`}
                className="block rounded-xl px-4 py-3 text-sm text-(--color-text-muted) transition-colors hover:bg-white/5 hover:text-(--color-text-primary)"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2 border-t border-white/10 px-4 pt-3 text-xs font-medium tracking-[0.08em] uppercase">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={`/${item}`}
                  className={item === locale ? "text-(--color-text-primary)" : "text-(--color-text-muted)"}
                >
                  {item}
                </Link>
              ))}
            </div>
          </nav>
        </details>
      </Container>
    </header>
  );
}
