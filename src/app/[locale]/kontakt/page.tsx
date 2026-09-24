import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container } from "@/components/layout/Container";
import { ContactForm } from "@/components/lead/ContactForm";
import { FadeIn } from "@/components/motion/FadeIn";
import { isLocale, type Locale } from "@/i18n/config";
import { findApprovedService, listApprovedServices } from "@/lib/cms/content-source";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<
  Locale,
  {
    title: string;
    sub: string;
    formTitle: string;
    directTitle: string;
    areaTitle: string;
    back: string;
  }
> = {
  de: {
    title: "Kontakt",
    sub: "Beschreiben Sie kurz, was gemacht werden soll. Fotos helfen uns, Umfang und Aufwand schneller einzuschätzen.",
    formTitle: "Foto-Anfrage",
    directTitle: "Direktkontakt",
    areaTitle: "Einsatzgebiet",
    back: "Zu den Leistungen",
  },
  en: {
    title: "Contact",
    sub: "Briefly describe what needs to be done. Photos help us estimate scope and effort faster.",
    formTitle: "Photo request",
    directTitle: "Direct contact",
    areaTitle: "Service area",
    back: "Back to services",
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
      canonical: `/${locale}/kontakt`,
      languages: { de: "/de/kontakt", en: "/en/kontakt", "x-default": "/de/kontakt" },
    },
  };
}

export default async function KontaktPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams?: Promise<{ service?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = COPY[locale];
  const approvedServices = await listApprovedServices();
  const query = await searchParams;
  const serviceParam = Array.isArray(query?.service) ? query.service[0] : query?.service;
  const initialService = serviceParam && (await findApprovedService(serviceParam)) ? serviceParam : undefined;

  return (
    <main className="bg-(--color-bg-primary)">
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
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <FadeIn>
              <ContactForm locale={locale} services={approvedServices} initialService={initialService} />
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="space-y-8">
                <div className="border-t border-black/15 pt-8">
                  <h2 className="text-2xl font-light">{copy.directTitle}</h2>
                  <div className="mt-5 space-y-3 text-sm text-black/60">
                    {siteConfig.phone ? <p>{siteConfig.phone}</p> : null}
                    {siteConfig.email ? <p>{siteConfig.email}</p> : null}
                    {!siteConfig.phone && !siteConfig.email ? <p>Kontaktangaben werden vor Veröffentlichung final eingetragen.</p> : null}
                  </div>
                </div>

                <div className="border-t border-black/15 pt-8">
                  <h2 className="text-2xl font-light">{copy.areaTitle}</h2>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {siteConfig.serviceArea.map((city) => (
                      <span key={city} className="rounded-full border border-black/15 px-3 py-1 text-sm text-black/60">
                        {city}
                      </span>
                    ))}
                  </div>
                </div>

                <Link href={`/${locale}/leistungen`} className="inline-flex text-sm font-medium text-(--color-accent)">
                  {copy.back}
                </Link>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>
    </main>
  );
}
