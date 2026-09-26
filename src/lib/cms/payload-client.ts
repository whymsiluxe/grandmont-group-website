const CMS_URL = process.env.CMS_URL || "http://127.0.0.1:3010";
// Bounds how long a page/route waits on the CMS before treating it as
// unreachable — without this, a hung CMS (not down, just not responding)
// would hang every page/API route that reads services/portfolio/articles
// indefinitely instead of falling back.
const CMS_FETCH_TIMEOUT_MS = 5_000;

export class CmsUnavailableError extends Error {}

async function fetchCollection<T>(
  collection: string,
  locale: "de" | "en",
  params: Record<string, string> = {},
): Promise<T[]> {
  // depth=1 so relationships/uploads (portfolio.service, portfolio.images[].image)
  // come back as populated objects (with slug/url) instead of bare numeric ids.
  const query = new URLSearchParams({ locale, limit: "100", depth: "1", ...params });
  try {
    const res = await fetch(`${CMS_URL}/api/${collection}?${query}`, {
      // Content changes only via CMS edits, not per-request — safe to cache
      // and revalidate on a short interval rather than refetch every render.
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(CMS_FETCH_TIMEOUT_MS),
    });
    if (!res.ok) throw new CmsUnavailableError(`CMS ${collection} responded HTTP ${res.status}`);
    const json = await res.json();
    if (!json || !Array.isArray(json.docs)) throw new CmsUnavailableError(`CMS ${collection} returned malformed body`);
    return json.docs;
  } catch (error) {
    // CMS unreachable, timed out, or returned something malformed (down,
    // network error, CI with no CMS running) — this is distinct from the
    // CMS legitimately answering "zero rows", which returns normally above.
    // Callers that need a fallback (approved services) catch this specific
    // error type; callers that are fine degrading to empty (portfolio,
    // articles) don't need to change.
    if (error instanceof CmsUnavailableError) throw error;
    throw new CmsUnavailableError(
      `CMS ${collection} fetch failed: ${error instanceof Error ? error.message : String(error)}`,
    );
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
  updatedAt: string;
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

// A Payload "upload" relationship at depth=1 comes back populated; without
// enough depth (or if the referenced doc no longer exists) it can still be
// a bare id — keep both possibilities honest rather than assuming shape.
export type PayloadMedia = {
  id: number;
  url?: string;
  filename?: string;
  alt?: string;
  width?: number;
  height?: number;
  published: boolean;
};

export type PayloadServiceRef =
  | number
  | {
      id: number;
      slug: string;
    };

export type PayloadPortfolioItem = {
  id: number;
  slug: string;
  published: boolean;
  clientApproved: boolean;
  imageRightsCleared: boolean;
  title: string;
  city?: string;
  service?: PayloadServiceRef;
  duration?: string;
  images?: { image?: number | PayloadMedia }[];
  challenge?: string;
  solution?: string;
  result?: string;
  createdAt: string;
  updatedAt: string;
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
  // Lexical richText JSON (Payload's @payloadcms/richtext-lexical shape).
  // Typed loosely here — see lib/cms/lexical-to-html.ts for the shape this
  // is actually walked as.
  body?: unknown;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
};

export async function fetchArticlesBothLocales() {
  const [de, en] = await Promise.all([
    fetchCollection<PayloadArticle>("ratgeber", "de"),
    fetchCollection<PayloadArticle>("ratgeber", "en"),
  ]);
  return { de, en };
}

// Payload upload docs return a URL relative to the CMS origin
// (e.g. "/api/media/file/foo.jpg") — the frontend renders on a different
// origin, so it must be resolved against CMS_URL to be a usable <img src>.
export function resolveMediaUrl(url: string): string {
  if (/^https?:\/\//.test(url)) return url;
  return `${CMS_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}
