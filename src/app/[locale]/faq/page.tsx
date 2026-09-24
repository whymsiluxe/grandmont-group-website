import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { homeFaqItems } from "@/components/home/FAQ";
import { isLocale, type Locale } from "@/i18n/config";
import { listApprovedServices } from "@/lib/cms/content-source";
import { faqSchema } from "@/lib/seo/structured-data";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    general: string;
    services: string;
    cta: string;
    ctaLink: string;
  }
> = {
  de: {
    title: "Häufige Fragen",
    sub: "Kurze Antworten zu Ablauf, Anfrage, Einsatzgebiet und den einzelnen Leistungen.",
    general: "Allgemein",
    services: "Fragen zu Leistungen",
    cta: "Nicht die passende Antwort gefunden?",
    ctaLink: "Anfrage senden",
  },
  en: {
    title: "Frequently asked questions",
    sub: "Short answers about process, requests, service area and individual services.",
    general: "General",
    services: "Service questions",
    cta: "Did not find the right answer?",
    ctaLink: "Send a request",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: COPY[locale].title,
    description: COPY[locale].sub,
    alternates: {
      canonical: `/${locale}/faq`,
      languages: { de: "/de/faq", en: "/en/faq", "x-default": "/de/faq" },
    },
  };
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const copy = COPY[locale];
  const services = await listApprovedServices();
  const generalItems = homeFaqItems[locale].map((item) => ({ question: item.q, answer: item.a }));
  const serviceItems = services.flatMap((service) =>
    service.faq[locale].map((item) => ({
      ...item,
      serviceTitle: service.title[locale],
      serviceSlug: service.slug,
    })),
  );

  return (
    <main className="bg-(--color-bg-primary)">
      <JsonLd data={faqSchema([...generalItems, ...serviceItems])} />

      <section className="py-28 lg:py-40">
        <Container>
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              Grandmont Group — Chemnitz
            </p>
            <h1 className="max-w-4xl text-5xl font-light leading-[1.02] text-(--color-text-primary) lg:text-8xl">
              {copy.title}
            </h1>
            <p className="mt-8 max-w-2xl text-base text-(--color-text-muted) lg:text-lg">{copy.sub}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-28">
        <Container>
          <div className="grid gap-16">
            <FadeIn>
              <h2 className="mb-8 text-3xl font-light">{copy.general}</h2>
              <div className="grid gap-px overflow-hidden rounded-2xl bg-black/10 sm:grid-cols-2">
                {generalItems.map((item) => (
                  <article key={item.question} className="bg-white p-6">
                    <h3 className="mb-2 text-sm font-medium">{item.question}</h3>
                    <p className="text-sm text-black/60">{item.answer}</p>
                  </article>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.08}>
              <h2 className="mb-8 text-3xl font-light">{copy.services}</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                {serviceItems.map((item) => (
                  <article key={`${item.serviceSlug}-${item.question}`} className="rounded-2xl bg-white p-6 shadow-sm">
                    <Link
                      href={`/${locale}/leistungen/${item.serviceSlug}`}
                      className="mb-4 inline-flex text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase"
                    >
                      {item.serviceTitle}
                    </Link>
                    <h3 className="mb-2 text-sm font-medium">{item.question}</h3>
                    <p className="text-sm text-black/60">{item.answer}</p>
                  </article>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.12}>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-black/15 pt-10">
                <p className="text-xl font-light">{copy.cta}</p>
                <Link
                  href={`/${locale}/kontakt`}
                  className="inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary)"
                >
                  {copy.ctaLink}
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}
