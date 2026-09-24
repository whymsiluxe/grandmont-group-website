import type { Locale } from "@/i18n/config";
import { getApprovedService } from "@/lib/services/approved-services";

export type ProjectStatus = "draft" | "approved" | "published";

export type ProjectMedia = {
  src: string;
  width: number;
  height: number;
  alt: Record<Locale, string>;
  kind: "cover" | "before" | "after" | "gallery";
};

export type Project = {
  slug: string;
  status: ProjectStatus;
  clientApproved: boolean;
  imageRightsCleared: boolean;
  title: Record<Locale, string>;
  location: string;
  serviceSlug: string;
  duration: Record<Locale, string>;
  summary: Record<Locale, string>;
  challenge: Record<Locale, string>;
  solution: Record<Locale, string>;
  result: Record<Locale, string>;
  media: ProjectMedia[];
  updatedAt: string;
};

export const projectContentFields: Record<Locale, string[]> = {
  de: ["Projekt", "Ort", "Leistung", "Dauer", "Fotos", "Ausgangslage", "Lösung", "Ergebnis"],
  en: ["Project", "Location", "Service", "Duration", "Photos", "Challenge", "Solution", "Result"],
};

export const projectQualityGates: Record<Locale, string[]> = {
  de: [
    "Schriftliche Freigabe für Fotos und Referenztext",
    "Keine Kundendaten ohne Zustimmung",
    "Optimierte WebP/AVIF-Bilder statt Originaldateien",
    "Before/After nur, wenn beide Bilder eindeutig zugeordnet sind",
  ],
  en: [
    "Written approval for photos and reference text",
    "No client data without consent",
    "Optimized WebP/AVIF images instead of original files",
    "Before/after only when both images are clearly matched",
  ],
};

// Real projects only. This array stays empty until approved client cases
// are available from the CMS or have been explicitly cleared for publication.
export const projects: Project[] = [];

export function getPublishedProjects() {
  return projects.filter(
    (project) => project.status === "published" && project.clientApproved && project.imageRightsCleared,
  );
}

export function getPublishedProject(slug: string) {
  return getPublishedProjects().find((project) => project.slug === slug);
}

export function getPublishedProjectsByService(serviceSlug: string) {
  return getPublishedProjects().filter((project) => project.serviceSlug === serviceSlug);
}

export function getProjectService(project: Project) {
  return getApprovedService(project.serviceSlug);
}
