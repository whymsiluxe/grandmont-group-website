import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { listPublishedArticles, listPublishedProjects } from "@/lib/cms/content-source";
import { Container } from "./Container";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";

const CONTACT_LABEL: Record<Locale, string> = {
  de: "Angebot anfragen",
  en: "Request a quote",
};

const NAV_LABEL: Record<Locale, string> = {
  de: "Hauptnavigation",
  en: "Main navigation",
};

const MENU_LABEL: Record<Locale, string> = {
  de: "Menü öffnen",
  en: "Open menu",
};

const NAV_LINKS: Record<Locale, { label: string; href: string }[]> = {
  de: [
    { label: "Leistungen", href: "/leistungen" },
    { label: "Projekte", href: "/projekte" },
    { label: "Ratgeber", href: "/ratgeber" },
    { label: "Für Unternehmen", href: "/unternehmen" },
    { label: "FAQ", href: "/faq" },
    { label: "Über uns", href: "/ueber-uns" },
    { label: "Kontakt", href: "/kontakt" },
  ],
  en: [
    { label: "Services", href: "/leistungen" },
    { label: "Projects", href: "/projekte" },
    { label: "Guides", href: "/ratgeber" },
    { label: "For businesses", href: "/unternehmen" },
    { label: "FAQ", href: "/faq" },
    { label: "About us", href: "/ueber-uns" },
    { label: "Contact", href: "/kontakt" },
  ],
};

export async function Header({ locale }: { locale: Locale }) {
  const [projects, articles] = await Promise.all([listPublishedProjects(), listPublishedArticles()]);
  const navLinks = NAV_LINKS[locale].filter((item) => {
    if (item.href === "/projekte") return projects.length > 0;
    if (item.href === "/ratgeber") return articles.length > 0;
    return true;
  });

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-(--color-bg-primary)/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold text-(--color-text-primary)"
        >
          Grandmont Group
        </Link>

        <nav aria-label={NAV_LABEL[locale]} className="hidden items-center gap-6 lg:flex">
          {navLinks.filter((item) => item.href !== "/kontakt").map((item) => (
            <Link
              key={item.href}
              href={`/${locale}${item.href}`}
              className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          data-event="cta_offer_click"
          data-event-location="header"
          href={`/${locale}/kontakt`}
          className="hidden rounded-full border border-(--color-accent) px-5 py-2 text-sm text-(--color-text-primary) transition-colors hover:bg-(--color-accent) lg:inline-block"
        >
          {CONTACT_LABEL[locale]}
        </Link>

        <LocaleSwitcher
          locale={locale}
          className="hidden items-center gap-2 text-xs font-medium tracking-[0.08em] text-(--color-text-muted) uppercase lg:flex"
        />

        <MobileNav
          locale={locale}
          navLinks={navLinks}
          menuLabel={MENU_LABEL[locale]}
          navLabel={NAV_LABEL[locale]}
        />
      </Container>
    </header>
  );
}
