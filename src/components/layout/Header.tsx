import Link from "next/link";
import type { Locale } from "@/i18n/config";

const NAV_GROUPS: Record<Locale, { label: string; href: string }[]> = {
  de: [
    { label: "Montage", href: "#" },
    { label: "Ausbau & Renovierung", href: "#" },
    { label: "Objektservice", href: "#" },
  ],
  en: [
    { label: "Assembly", href: "#" },
    { label: "Renovation & Fit-Out", href: "#" },
    { label: "Property Services", href: "#" },
  ],
};

const CONTACT_LABEL: Record<Locale, string> = {
  de: "Angebot anfragen",
  en: "Request a quote",
};

export function Header({ locale }: { locale: Locale }) {
  const groups = NAV_GROUPS[locale];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-(--color-bg-primary)/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <Link
          href={`/${locale}`}
          className="text-lg font-semibold tracking-tight text-(--color-text-primary)"
        >
          Grandmont Group
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {groups.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm text-(--color-text-muted) transition-colors hover:text-(--color-text-primary)"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="#"
          className="hidden rounded-full border border-(--color-accent) px-5 py-2 text-sm text-(--color-text-primary) transition-colors hover:bg-(--color-accent) lg:inline-block"
        >
          {CONTACT_LABEL[locale]}
        </Link>

        {/* mobile menu toggle — placeholder, interactive menu is a Phase 2 motion primitive */}
        <button
          type="button"
          aria-label="Menu"
          className="inline-flex h-10 w-10 items-center justify-center text-(--color-text-primary) lg:hidden"
        >
          <span className="block h-px w-5 bg-current" />
        </button>
      </div>
    </header>
  );
}
