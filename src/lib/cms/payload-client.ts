const CMS_URL = process.env.CMS_URL || "http://127.0.0.1:3010";

async function fetchCollection<T>(
  collection: string,
  locale: "de" | "en",
  params: Record<string, string> = {},
): Promise<T[]> {
  const query = new URLSearchParams({ locale, limit: "100", ...params });
  try {
    const res = await fetch(`${CMS_URL}/api/${collection}?${query}`, {
      // Content changes only via CMS edits, not per-request — safe to cache
      // and revalidate on a short interval rather than refetch every render.
      next: { revalidate: 60 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.docs ?? [];
  } catch {
    // CMS unreachable (down, network error, CI with no CMS running) —
    // degrade to empty rather than taking the whole build/page down.
    return [];
  }
}

export async function fetchServicesBothLocales() {
  const [de, en] = await Promise.all([
    fetchCollection<PayloadService>("services", "de"),
    fetchCollection<PayloadService>("services", "en"),
  ]);
  return { de, en };
}

export type PayloadService = {
  id: number;
  slug: string;
  group: "montage" | "objektservice";
  status: "draft" | "review" | "published";
  ownerApproved: boolean;
  legalApproved: boolean;
  eyebrow: string;
  title: string;
  statement: string;
  included: { value: string }[];
  scopeNote: string;
  forWhom: { value: string }[];
  outcomes: { value: string }[];
  pricing: string;
  faq: { question: string; answer: string }[];
};

export type PayloadPortfolioItem = {
  id: number;
  slug: string;
  published: boolean;
  title: string;
  city?: string;
  duration?: string;
  challenge?: string;
  solution?: string;
  result?: string;
};

export async function fetchPortfolioBothLocales() {
  const [de, en] = await Promise.all([
    fetchCollection<PayloadPortfolioItem>("portfolio", "de"),
    fetchCollection<PayloadPortfolioItem>("portfolio", "en"),
  ]);
  return { de, en };
}

export type PayloadArticle = {
  id: number;
  slug: string;
  published: boolean;
  title: string;
  seoDescription?: string;
};

export async function fetchArticlesBothLocales() {
  const [de, en] = await Promise.all([
    fetchCollection<PayloadArticle>("ratgeber", "de"),
    fetchCollection<PayloadArticle>("ratgeber", "en"),
  ]);
  return { de, en };
}
