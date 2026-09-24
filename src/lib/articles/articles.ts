import type { Locale } from "@/i18n/config";
import { getApprovedService } from "@/lib/services/approved-services";

export type ArticleStatus = "draft" | "review" | "published";

export type Article = {
  slug: string;
  status: ArticleStatus;
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  // No `category` or `readingMinutes` field exists in the Payload
  // `ratgeber` collection — removed rather than fabricated (see
  // ArticleCard.tsx and the article detail page, both purely decorative
  // uses that were dropped along with the fields).
  serviceSlug?: string;
  // Payload doesn't track a separate "published at" date — only the
  // standard `createdAt`/`updatedAt` every collection gets automatically.
  // `publishedAt` uses `createdAt` as the more honest analog of "when this
  // went live" (updatedAt changes on every edit, including typo fixes).
  publishedAt: string;
  updatedAt: string;
  // Payload's `ratgeber.body` is a single Lexical richText blob, not a
  // heading/body array — `sections` now holds the body flattened into
  // plain-text paragraphs (see lib/cms/lexical-to-paragraphs.ts) rather
  // than the structured heading+body pairs the old static shape implied.
  paragraphs: Record<Locale, string[]>;
};

export type PlannedArticleTopic = {
  id: string;
  title: Record<Locale, string>;
  serviceSlug?: string;
  intent: Record<Locale, string>;
};

export const plannedArticleTopics: PlannedArticleTopic[] = [
  {
    id: "moebelmontage-kosten-chemnitz",
    title: {
      de: "Wie viel kostet eine Möbelmontage in Chemnitz?",
      en: "How much does furniture assembly cost in Chemnitz?",
    },
    serviceSlug: "moebelmontage",
    intent: {
      de: "Preisfaktoren erklären, ohne erfundene Pauschalen zu nennen.",
      en: "Explain pricing factors without inventing flat rates.",
    },
  },
  {
    id: "kuechenmontage-kosten",
    title: {
      de: "Was kostet eine Küchenmontage?",
      en: "What does kitchen assembly cost?",
    },
    serviceSlug: "kuechenmontage",
    intent: {
      de: "Leistungsgrenzen klar erklären: Möbelmontage ja, Elektro/Wasser/Gas nein.",
      en: "Clarify scope limits: furniture assembly yes, electrical/water/gas no.",
    },
  },
  {
    id: "moebelmontage-vorbereiten",
    title: {
      de: "Was muss ich vor einer Möbelmontage vorbereiten?",
      en: "What should I prepare before furniture assembly?",
    },
    serviceSlug: "moebelmontage",
    intent: {
      de: "Checkliste für Fotos, Maße, Zugang, Verpackung und Terminfenster.",
      en: "Checklist for photos, measurements, access, packaging and time window.",
    },
  },
  {
    id: "wohnung-uebergabe-vorbereiten",
    title: {
      de: "Wohnung für Räumung und Reinigung vorbereiten",
      en: "Prepare an apartment for clearance and cleaning",
    },
    serviceSlug: "entruempelung",
    intent: {
      de: "Praktische Übergabe- und Foto-Checkliste für Kunden.",
      en: "Practical handover and photo checklist for clients.",
    },
  },
];

export const articleQualityGates: Record<Locale, string[]> = {
  de: [
    "Fachlich geprüft, keine falschen Handwerksversprechen",
    "Keine erfundenen Preise, Garantien oder Zertifikate",
    "DE/EN Texte separat geprüft, nicht roh übersetzt",
    "Interne Links zu passenden Leistungen und Kontaktformular",
  ],
  en: [
    "Professionally reviewed, no false trade promises",
    "No invented prices, warranties or certificates",
    "DE/EN copy reviewed separately, not raw translation",
    "Internal links to matching services and contact form",
  ],
};

// Real articles only. Draft topic ideas live in plannedArticleTopics and do not
// become public routes or sitemap entries until approved and published.
export const articles: Article[] = [];

export function getPublishedArticles() {
  return articles.filter((article) => article.status === "published");
}

export function getPublishedArticle(slug: string) {
  return getPublishedArticles().find((article) => article.slug === slug);
}

export function getArticleService(article: Article | PlannedArticleTopic) {
  return article.serviceSlug ? getApprovedService(article.serviceSlug) : undefined;
}
