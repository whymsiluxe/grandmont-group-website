import type { Locale } from "@/i18n/config";
import type { Article } from "@/lib/articles/articles";
import type { Project, ProjectMedia } from "@/lib/projects/projects";
import { serviceGroups, type ApprovedService, type ServiceGroupId } from "@/lib/services/approved-services";
import {
  fetchArticlesBothLocales,
  fetchPortfolioBothLocales,
  fetchServicesBothLocales,
  resolveMediaUrl,
  type PayloadArticle,
  type PayloadMedia,
  type PayloadPortfolioItem,
  type PayloadService,
  type PayloadServiceRef,
} from "@/lib/cms/payload-client";
import { lexicalToParagraphs } from "@/lib/cms/lexical-to-paragraphs";

export const contentSource = {
  mode: "payload-cms",
} as const;

function toApprovedService(deRow: PayloadService, enRow: PayloadService | undefined): ApprovedService {
  const en = enRow ?? deRow;
  const pick = <T,>(deVal: T, enVal: T): Record<Locale, T> => ({ de: deVal, en: enVal });
  return {
    slug: deRow.slug,
    updatedAt: deRow.updatedAt,
    group: deRow.group,
    eyebrow: pick(deRow.eyebrow, en.eyebrow),
    title: pick(deRow.title, en.title),
    statement: pick(deRow.statement, en.statement),
    included: pick(deRow.included.map((i) => i.value), en.included.map((i) => i.value)),
    scopeNote: pick(deRow.scopeNote, en.scopeNote),
    forWhom: pick(deRow.forWhom.map((i) => i.value), en.forWhom.map((i) => i.value)),
    outcomes: pick(deRow.outcomes.map((i) => i.value), en.outcomes.map((i) => i.value)),
    pricing: pick(deRow.pricing, en.pricing),
    faq: pick(deRow.faq, en.faq),
  };
}

async function loadApprovedServices(): Promise<ApprovedService[]> {
  const { de, en } = await fetchServicesBothLocales();
  const enBySlug = new Map(en.map((row) => [row.slug, row]));
  return de
    .filter((row) => row.status === "published" && row.ownerApproved && row.legalApproved)
    .map((row) => toApprovedService(row, enBySlug.get(row.slug)));
}

export async function listApprovedServices() {
  return loadApprovedServices();
}

export async function findApprovedService(slug: string) {
  const services = await loadApprovedServices();
  return services.find((service) => service.slug === slug);
}

export async function listGroupedApprovedServices() {
  const services = await loadApprovedServices();
  return (Object.keys(serviceGroups) as ServiceGroupId[])
    .map((groupId) => ({
      id: groupId,
      ...serviceGroups[groupId],
      services: services.filter((service) => service.group === groupId),
    }))
    .filter((group) => group.services.length > 0);
}

function resolveServiceSlug(service: PayloadServiceRef | undefined): string {
  if (!service) return "";
  // depth=1 populates the relationship as an object; without enough depth
  // (or a dangling reference) it stays a bare numeric id — fall back to the
  // stringified id rather than crashing, since an unresolved relationship
  // is still meaningful data (just not a usable slug for routing yet).
  return typeof service === "object" ? service.slug : String(service);
}

function resolveImage(
  image: number | PayloadMedia | undefined,
): { src: string; width: number; height: number; alt: string } | undefined {
  if (!image || typeof image !== "object") return undefined;
  // The `media` collection's own access control hides unpublished files
  // from anonymous requests, but a populated relationship can still come
  // back without a usable `url` (e.g. file removed from disk) — skip it
  // rather than rendering a broken <img>.
  if (!image.url) return undefined;
  return {
    src: resolveMediaUrl(image.url),
    // Payload's upload collection auto-tracks width/height for every file,
    // but a doc that predates that (or was never derived via sharp) can
    // still lack them — 0 keeps the type honest without guessing a size.
    width: image.width ?? 0,
    height: image.height ?? 0,
    alt: image.alt ?? "",
  };
}

// Payload's `portfolio.images` array has no before/after/gallery
// distinction — every entry is just an { image } upload reference. Rather
// than guessing which photos are "before" vs "after" (constraint: do not
// fabricate that distinction), every image maps to "gallery" except the
// first, which becomes "cover" so list/detail pages have a lead image.
function toProjectMedia(
  images: PayloadPortfolioItem["images"],
  altFallback: Record<Locale, string>,
): ProjectMedia[] {
  if (!images) return [];
  const media: ProjectMedia[] = [];
  images.forEach((entry, index) => {
    const resolved = resolveImage(entry.image);
    if (!resolved) return;
    media.push({
      src: resolved.src,
      width: resolved.width,
      height: resolved.height,
      alt: {
        de: resolved.alt || altFallback.de,
        en: resolved.alt || altFallback.en,
      },
      kind: index === 0 ? "cover" : "gallery",
    });
  });
  return media;
}

function toProject(deRow: PayloadPortfolioItem, enRow: PayloadPortfolioItem | undefined): Project {
  const en = enRow ?? deRow;
  const pick = (deVal: string | undefined, enVal: string | undefined): Record<Locale, string> => ({
    de: deVal ?? "",
    en: enVal ?? deVal ?? "",
  });
  const title = pick(deRow.title, en.title);
  return {
    slug: deRow.slug,
    // Payload's portfolio schema has no draft/approved/published enum —
    // only the single `published` boolean plus the two approval
    // checkboxes. "published" maps 1:1; everything else (including a doc
    // that's approved but not yet flagged published) is honestly "draft"
    // rather than invented as "approved".
    status: deRow.published ? "published" : "draft",
    clientApproved: deRow.clientApproved,
    imageRightsCleared: deRow.imageRightsCleared,
    title,
    // Payload field is `city`; the frontend type's `location` is the
    // closest existing concept — used as-is, not embellished.
    location: deRow.city ?? "",
    serviceSlug: resolveServiceSlug(deRow.service),
    duration: pick(deRow.duration, en.duration),
    challenge: pick(deRow.challenge, en.challenge),
    solution: pick(deRow.solution, en.solution),
    result: pick(deRow.result, en.result),
    media: toProjectMedia(deRow.images, title),
    updatedAt: deRow.updatedAt,
  };
}

async function loadPublishedProjects(): Promise<Project[]> {
  const { de, en } = await fetchPortfolioBothLocales();
  const enBySlug = new Map(en.map((row) => [row.slug, row]));
  return de
    // The CMS's own access control (clearedPortfolioRead) already filters
    // this server-side for anonymous requests, but filtering again here
    // keeps this function correct even if that ever changes, matching the
    // defensive pattern services already uses.
    .filter((row) => row.published && row.clientApproved && row.imageRightsCleared)
    .map((row) => toProject(row, enBySlug.get(row.slug)));
}

export async function listPublishedProjects() {
  return loadPublishedProjects();
}

export async function findPublishedProject(slug: string) {
  const projects = await loadPublishedProjects();
  return projects.find((project) => project.slug === slug);
}

function toArticle(deRow: PayloadArticle, enRow: PayloadArticle | undefined): Article {
  const en = enRow ?? deRow;
  const pick = (deVal: string | undefined, enVal: string | undefined): Record<Locale, string> => ({
    de: deVal ?? "",
    en: enVal ?? deVal ?? "",
  });
  return {
    slug: deRow.slug,
    status: deRow.published ? "published" : "draft",
    title: pick(deRow.title, en.title),
    description: pick(deRow.seoDescription, en.seoDescription),
    serviceSlug: undefined,
    // Payload doesn't track a separate "published at" timestamp — createdAt
    // is auto-tracked on every collection and is the more honest analog of
    // "went live" than updatedAt (which moves on every subsequent edit).
    publishedAt: deRow.createdAt,
    updatedAt: deRow.updatedAt,
    paragraphs: {
      de: lexicalToParagraphs(deRow.body),
      en: lexicalToParagraphs(en.body),
    },
  };
}

async function loadPublishedArticles(): Promise<Article[]> {
  const { de, en } = await fetchArticlesBothLocales();
  const enBySlug = new Map(en.map((row) => [row.slug, row]));
  return de
    // Same note as projects: publishedFlagRead already gates this
    // server-side for anonymous requests; filtering again keeps the
    // function correct on its own.
    .filter((row) => row.published)
    .map((row) => toArticle(row, enBySlug.get(row.slug)));
}

export async function listPublishedArticles() {
  return loadPublishedArticles();
}

export async function findPublishedArticle(slug: string) {
  const articles = await loadPublishedArticles();
  return articles.find((article) => article.slug === slug);
}
