import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Inter } from "next/font/google";
import { locales, isLocale, type Locale } from "@/i18n/config";
import { siteDescriptions, titleTemplates, siteConfig } from "@/lib/seo/site-config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCTA } from "@/components/layout/MobileStickyCTA";
import "../globals.css";

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-primary",
  display: "swap",
});

const SKIP_LABEL: Record<Locale, string> = {
  de: "Zum Inhalt springen",
  en: "Skip to content",
};

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

  const titles = titleTemplates[locale];
  const description = siteDescriptions[locale];

  return {
    metadataBase: new URL(siteConfig.url),
    title: titles,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        de: "/de",
        en: "/en",
        "x-default": "/de",
      },
    },
    openGraph: {
      siteName: siteConfig.name,
      title: titles.default,
      description,
      locale: locale === "de" ? "de_DE" : "en_US",
      type: "website",
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
    <html lang={locale} className={inter.variable}>
      <body className="min-h-full flex flex-col antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only fixed left-4 top-4 z-[100] rounded-full bg-(--color-accent) px-5 py-3 text-sm font-medium text-(--color-bg-primary) focus:not-sr-only"
        >
          {SKIP_LABEL[locale]}
        </a>
        <Header locale={locale} />
        <div id="main-content">{children}</div>
        <Footer locale={locale} />
        <MobileStickyCTA locale={locale} />
      </body>
    </html>
  );
}

export type { Locale };
