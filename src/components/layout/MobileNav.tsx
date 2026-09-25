"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Locale } from "@/i18n/config";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function MobileNav({
  locale,
  navLinks,
  menuLabel,
  navLabel,
}: {
  locale: Locale;
  navLinks: { label: string; href: string }[];
  menuLabel: string;
  navLabel: string;
}) {
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const pathname = usePathname();

  // Header stays mounted across client-side navigations (it's outside
  // {children} in the locale layout), so the native <details> element is
  // never recreated — without this, tapping a link left the menu open,
  // covering the page it just navigated to.
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = false;
  }, [pathname]);

  return (
    <details ref={detailsRef} className="group relative lg:hidden">
      <summary
        aria-label={menuLabel}
        className="flex h-10 w-10 list-none cursor-pointer items-center justify-center text-(--color-text-primary) marker:hidden"
      >
        <span className="block h-px w-5 bg-current transition-transform group-open:rotate-45" />
        <span className="absolute block h-px w-5 translate-y-2 bg-current transition-transform group-open:-translate-y-0 group-open:-rotate-45" />
      </summary>
      <nav
        aria-label={navLabel}
        className="absolute right-0 top-12 min-w-64 rounded-lg border border-white/10 bg-(--color-bg-surface) p-3 shadow-lg"
      >
        {navLinks.map((item) => (
          <Link
            key={item.href}
            href={`/${locale}${item.href}`}
            className="block rounded-lg px-4 py-3 text-sm text-(--color-text-muted) transition-colors hover:bg-white/5 hover:text-(--color-text-primary)"
          >
            {item.label}
          </Link>
        ))}
        <LocaleSwitcher
          locale={locale}
          className="mt-2 flex gap-2 border-t border-white/10 px-4 pt-3 text-xs font-medium tracking-[0.08em] text-(--color-text-muted) uppercase"
        />
      </nav>
    </details>
  );
}
