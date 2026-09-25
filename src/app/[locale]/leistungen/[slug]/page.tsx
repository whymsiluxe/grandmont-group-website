import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Ablauf } from "@/components/service/Ablauf";
import { ServiceHero } from "@/components/service/ServiceHero";
import { BulletList, ProseBlock, ServiceSection } from "@/components/service/ServiceSections";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { findApprovedService, listApprovedServices } from "@/lib/cms/content-source";
import { siteConfig } from "@/lib/seo/site-config";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo/structured-data";

const COPY: Record<Locale, { overview: string; included: string; forWhom: string; outcomes: string; process: string; pricing: string; faq: string; cta: string; allServices: string }> = {
  de: {
    overview: "Leistung im Überblick",
    included: "Enthalten",
    forWhom: "Für wen",
    outcomes: "Was Sie bekommen",
    process: "So läuft es ab",
    pricing: "Preis & Kalkulationsprinzip",
    faq: "Häufige Fragen",
    cta: "Kostenloses Angebot anfragen",
    allServices: "Alle Leistungen",
  },
  en: {
    overview: "Service at a glance",
    included: "Included",
    forWhom: "Who it's for",
    outcomes: "What you get",
    process: "How it works",
    pricing: "Pricing principle",
    faq: "FAQ",
    cta: "Request a free quote",
    allServices: "All services",
  },
};

export async function generateStaticParams() {
  const approvedServices = await listApprovedServices();
  return locales.flatMap((locale) => approvedServices.map((service) => ({ locale, slug: service.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = await findApprovedService(slug);
  if (!service) return {};
  return {
    title: service.title[locale],
    description: service.statement[locale],
    alternates: {
      canonical: `/${locale}/leistungen/${service.slug}`,
      languages: {
        de: `/de/leistungen/${service.slug}`,
        en: `/en/leistungen/${service.slug}`,
        "x-default": `/de/leistungen/${service.slug}`,
      },
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = await findApprovedService(slug);
  if (!service) notFound();

  const copy = COPY[locale];
  const url = `${siteConfig.url}/${locale}/leistungen/${service.slug}`;

  return (
    <main>
      <JsonLd data={serviceSchema({ name: service.title[locale], description: service.statement[locale], url })} />
      <JsonLd
        data={breadcrumbSchema([
          { name: siteConfig.name, url: siteConfig.url },
          { name: copy.allServices, url: `${siteConfig.url}/${locale}/leistungen` },
          { name: service.title[locale], url },
        ])}
      />
      <JsonLd data={faqSchema(service.faq[locale])} />

      <ServiceHero
        eyebrow={service.eyebrow[locale]}
        title={service.title[locale]}
        statement={service.statement[locale]}
        locale={locale}
        serviceSlug={service.slug}
      />

      <ServiceSection title={copy.overview} light>
        <div className="grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="mb-5 text-lg font-medium">{copy.included}</h3>
            <BulletList items={service.included[locale]} light />
            <p className="mt-6 text-sm italic text-black/50">{service.scopeNote[locale]}</p>
          </div>
          <div>
            <h3 className="mb-5 text-lg font-medium">{copy.forWhom}</h3>
            <BulletList items={service.forWhom[locale]} light />
          </div>
          <div>
            <h3 className="mb-5 text-lg font-medium">{copy.outcomes}</h3>
            <BulletList items={service.outcomes[locale]} light />
          </div>
        </div>
      </ServiceSection>

      <ServiceSection title={copy.process}>
        <Ablauf locale={locale} />
      </ServiceSection>

      <ServiceSection title={copy.pricing} light>
        <ProseBlock light>{service.pricing[locale]}</ProseBlock>
      </ServiceSection>

      <ServiceSection title={copy.faq}>
        <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
          {service.faq[locale].map((item) => (
            <div key={item.question} className="border-t border-white/10 pt-5">
              <h3 className="mb-2 text-base font-medium text-(--color-text-primary)">{item.question}</h3>
              <p className="text-sm leading-6 text-(--color-text-muted)">{item.answer}</p>
            </div>
          ))}
        </div>
      </ServiceSection>

      <ServiceSection title={copy.cta}>
        <div className="flex flex-wrap gap-4">
          <Link
            data-event="cta_offer_click"
            data-event-location="service_detail"
            data-event-service={service.slug}
            href={`/${locale}/kontakt?service=${service.slug}`}
            className="inline-flex rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
          >
            {copy.cta}
          </Link>
          <Link
            href={`/${locale}/leistungen`}
            className="inline-flex rounded-full border border-white/15 px-8 py-4 text-sm font-medium text-(--color-text-primary) transition-colors hover:border-white/40"
          >
            {copy.allServices}
          </Link>
        </div>
      </ServiceSection>
    </main>
  );
}
