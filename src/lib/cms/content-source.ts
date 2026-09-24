import { getPublishedArticles, getPublishedArticle } from "@/lib/articles/articles";
import { getPublishedProject, getPublishedProjects } from "@/lib/projects/projects";
import { approvedServices, getApprovedService, getGroupedApprovedServices } from "@/lib/services/approved-services";

export const contentSource = {
  mode: "static-approved-content",
  cms: "payload-cms-pending",
} as const;

export async function listApprovedServices() {
  return approvedServices;
}

export async function findApprovedService(slug: string) {
  return getApprovedService(slug);
}

export async function listGroupedApprovedServices() {
  return getGroupedApprovedServices();
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
