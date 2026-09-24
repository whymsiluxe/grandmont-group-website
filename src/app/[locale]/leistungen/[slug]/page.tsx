import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Ablauf } from "@/components/service/Ablauf";
import { ServiceHero } from "@/components/service/ServiceHero";
import { BulletList, ProseBlock, ServiceSection } from "@/components/service/ServiceSections";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/seo/structured-data";
import { approvedServices, getApprovedService } from "@/lib/services/approved-services";

const COPY: Record<Locale, { included: string; forWhom: string; outcomes: string; process: string; reference: string; referenceBody: string; pricing: string; faq: string; cta: string; allServices: string }> = {
  de: {
    included: "Was ist enthalten",
    forWhom: "Für wen",
    outcomes: "Was Sie bekommen",
    process: "So läuft es ab",
    reference: "Projektbeispiele",
    referenceBody: "Echte Referenzen und Fotos werden nach Freigabe über das CMS gepflegt. Bis dahin zeigen wir keine erfundenen Projekte oder Zahlen.",
    pricing: "Preis & Kalkulationsprinzip",
    faq: "Häufige Fragen",
    cta: "Kostenloses Angebot anfragen",
    allServices: "Alle Leistungen",
  },
  en: {
    included: "What's included",
    forWhom: "Who it's for",
    outcomes: "What you get",
    process: "How it works",
    reference: "Project examples",
    referenceBody: "Real references and photos will be maintained via the CMS after approval. Until then, we do not show invented projects or numbers.",
    pricing: "Pricing principle",
    faq: "FAQ",
    cta: "Request a free quote",
    allServices: "All services",
  },
};

export function generateStaticParams() {
  return locales.flatMap((locale) => approvedServices.map((service) => ({ locale, slug: service.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = getApprovedService(slug);
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
  const service = getApprovedService(slug);
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

      <ServiceHero eyebrow={service.eyebrow[locale]} title={service.title[locale]} statement={service.statement[locale]} />

      <ServiceSection title={copy.included} light>
        <BulletList items={service.included[locale]} light />
        <p className="mt-6 max-w-2xl text-sm italic text-black/50">{service.scopeNote[locale]}</p>
      </ServiceSection>

      <ServiceSection title={copy.forWhom}>
        <BulletList items={service.forWhom[locale]} />
      </ServiceSection>

      <ServiceSection title={copy.outcomes} light>
        <BulletList items={service.outcomes[locale]} light />
      </ServiceSection>

      <ServiceSection title={copy.process}>
        <Ablauf locale={locale} />
      </ServiceSection>

      <ServiceSection title={copy.reference} light>
        <ProseBlock light>{copy.referenceBody}</ProseBlock>
      </ServiceSection>

      <ServiceSection title={copy.pricing}>
        <ProseBlock>{service.pricing[locale]}</ProseBlock>
      </ServiceSection>

      <ServiceSection title={copy.faq} light>
        <div className="grid gap-6 sm:grid-cols-2">
          {service.faq[locale].map((item) => (
            <div key={item.question}>
              <h3 className="mb-2 text-sm font-medium text-(--color-text-on-light)">{item.question}</h3>
              <p className="text-sm text-black/60">{item.answer}</p>
            </div>
          ))}
        </div>
      </ServiceSection>

      <ServiceSection title={copy.cta}>
        <div className="flex flex-wrap gap-4">
          <Link
            href={`/${locale}#kontakt`}
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
