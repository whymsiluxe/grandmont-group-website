import { siteConfig } from "./site-config";

/**
 * LocalBusiness schema [REQ, план блок 19.4] — используется на главной.
 * Phone/email placeholders — не заполнять до canonical-номера (SEO_PLAN.md FINDING).
 */
export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: siteConfig.name,
    url: siteConfig.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: siteConfig.city,
      addressRegion: siteConfig.region,
      addressCountry: siteConfig.country,
    },
    areaServed: siteConfig.serviceArea,
  };
}

/**
 * Organization schema [REC-дополнение, план блок 19.4].
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  };
}

/**
 * Breadcrumb schema [REQ, план блок 19.4].
 */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Service schema [REQ, план блок 19.4] — только для услуг с Owner approved=yes в SERVICE_MATRIX.
 */
export function serviceSchema(params: { name: string; description: string; url: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: params.url,
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.name,
    },
    areaServed: siteConfig.serviceArea,
  };
}

/**
 * FAQPage schema [REQ, план блок 19.4] — только где реально есть FAQ-контент,
 * без искусственного добавления ради rich snippets [REC-примечание, план].
 */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function articleSchema(params: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: params.url,
    datePublished: params.datePublished,
    dateModified: params.dateModified,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  };
}
