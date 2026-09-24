import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { SetHtmlLang } from "./set-html-lang";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  return {
    alternates: {
      canonical: `/${locale}`,
      languages: {
        de: "/de",
        en: "/en",
        "x-default": "/de",
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <>
      <SetHtmlLang locale={locale} />
      {children}
    </>
  );
}

export type { Locale };
