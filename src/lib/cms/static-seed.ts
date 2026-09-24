import { articles, plannedArticleTopics } from "@/lib/articles/articles";
import { projects } from "@/lib/projects/projects";
import { approvedServices, serviceGroups } from "@/lib/services/approved-services";

export function createStaticCmsSeed() {
  return {
    source: "static-approved-content",
    serviceGroups,
    services: approvedServices.map((service) => ({
      ...service,
      status: "published" as const,
      ownerApproved: true,
      legalApproved: true,
    })),
    projects,
    articles,
    plannedArticleTopics,
  };
}
