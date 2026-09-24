"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    title: string;
    body: string;
    retry: string;
    contact: string;
    home: string;
  }
> = {
  de: {
    eyebrow: "Fehler",
    title: "Diese Seite konnte gerade nicht geladen werden.",
    body: "Bitte versuchen Sie es noch einmal. Wenn der Fehler bleibt, senden Sie uns eine kurze Anfrage.",
    retry: "Erneut versuchen",
    contact: "Kontakt öffnen",
    home: "Zur Startseite",
  },
  en: {
    eyebrow: "Error",
    title: "This page could not be loaded right now.",
    body: "Please try again. If the error remains, send us a short request.",
    retry: "Try again",
    contact: "Open contact",
    home: "Back to homepage",
  },
};

function currentLocale(value: string | string[] | undefined): Locale {
  const first = Array.isArray(value) ? value[0] : value;
  return first && isLocale(first) ? first : defaultLocale;
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const params = useParams();
  const locale = currentLocale(params?.locale);
  const copy = COPY[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-[70vh] bg-(--color-bg-primary) py-28 text-(--color-text-primary) lg:py-40">
      <Container>
        <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">{copy.eyebrow}</p>
        <h1 className="max-w-3xl text-5xl font-light leading-[1.02] lg:text-7xl">{copy.title}</h1>
        <p className="mt-8 max-w-xl text-base text-(--color-text-muted) lg:text-lg">{copy.body}</p>

        <div className="mt-10 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={reset}
            className="rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary)"
          >
            {copy.retry}
          </button>
          <Link
            href={`/${locale}/kontakt`}
            className="rounded-full border border-white/15 px-8 py-4 text-sm font-medium transition-colors hover:border-white/40"
          >
            {copy.contact}
          </Link>
          <Link
            href={`/${locale}`}
            className="rounded-full border border-white/15 px-8 py-4 text-sm font-medium transition-colors hover:border-white/40"
          >
            {copy.home}
          </Link>
        </div>
      </Container>
    </main>
  );
}
