import type { MetadataRoute } from "next";
import { locales } from "@/i18n/config";
import {
  listApprovedServices,
  listPublishedArticles,
  listPublishedProjects,
} from "@/lib/cms/content-source";
import { siteConfig } from "@/lib/seo/site-config";

/**
 * Base sitemap — только статичные/foundation-роуты на этом этапе (Phase 1).
 * Service-страницы добавятся динамически в Phase 3, только для
 * SERVICE_MATRIX.md услуг с Owner approved=yes.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const approvedServices = await listApprovedServices();
  const publishedArticles = await listPublishedArticles();
  const publishedProjects = await listPublishedProjects();
  // Overview pages with nothing published yet have no SEO value indexed
  // (see their own noindex generateMetadata) — keep them out of the
  // sitemap too rather than submitting a page Google shouldn't index.
  const staticPaths = ["ueber-uns", "unternehmen", "faq"];
  if (publishedProjects.length > 0) staticPaths.push("projekte");
  if (publishedArticles.length > 0) staticPaths.push("ratgeber");

  return locales.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}`])),
      },
    },
    {
      url: `${siteConfig.url}/${locale}/leistungen`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/leistungen`])),
      },
    },
    {
      url: `${siteConfig.url}/${locale}/kontakt`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/kontakt`])),
      },
    },
    ...staticPaths.map((path) => ({
      url: `${siteConfig.url}/${locale}/${path}`,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/${path}`])),
      },
    })),
    ...approvedServices.map((service) => ({
      url: `${siteConfig.url}/${locale}/leistungen/${service.slug}`,
      ...(service.updatedAt ? { lastModified: new Date(service.updatedAt) } : {}),
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}/leistungen/${service.slug}`]),
        ),
      },
    })),
    ...publishedProjects.map((project) => ({
      url: `${siteConfig.url}/${locale}/projekte/${project.slug}`,
      lastModified: new Date(project.updatedAt),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/projekte/${project.slug}`])),
      },
    })),
    ...publishedArticles.map((article) => ({
      url: `${siteConfig.url}/${locale}/ratgeber/${article.slug}`,
      lastModified: new Date(article.updatedAt),
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/ratgeber/${article.slug}`])),
      },
    })),
  ]);
}
