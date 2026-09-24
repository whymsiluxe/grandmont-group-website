import type { Locale } from "@/i18n/config";
import { getPublishedArticles, getPublishedArticle } from "@/lib/articles/articles";
import { getPublishedProject, getPublishedProjects } from "@/lib/projects/projects";
import { serviceGroups, type ApprovedService, type ServiceGroupId } from "@/lib/services/approved-services";
import { fetchServicesBothLocales, type PayloadService } from "@/lib/cms/payload-client";

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

export async function listPublishedProjects() {
  return getPublishedProjects();
}

export async function findPublishedProject(slug: string) {
  return getPublishedProject(slug);
}

export async function listPublishedArticles() {
  return getPublishedArticles();
}

export async function findPublishedArticle(slug: string) {
  return getPublishedArticle(slug);
}
