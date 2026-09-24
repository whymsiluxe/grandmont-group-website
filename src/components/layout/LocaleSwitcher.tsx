"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/i18n/config";

function localizedHref(pathname: string, targetLocale: Locale) {
  const segments = pathname.split("/");
  if (locales.includes(segments[1] as Locale)) {
    segments[1] = targetLocale;
    return segments.join("/") || `/${targetLocale}`;
  }
  return `/${targetLocale}`;
}

export function LocaleSwitcher({ locale, className = "" }: { locale: Locale; className?: string }) {
  const pathname = usePathname();

  return (
    <div className={className}>
      {locales.map((item) => (
        <Link
          key={item}
          href={localizedHref(pathname, item)}
          className={item === locale ? "text-(--color-text-primary)" : "transition-colors hover:text-(--color-text-primary)"}
        >
          {item}
        </Link>
      ))}
    </div>
  );
}
