import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";
import { locales } from "@/i18n/config";
import { approvedServices } from "@/lib/services/approved-services";

/**
 * Base sitemap — только статичные/foundation-роуты на этом этапе (Phase 1).
 * Service-страницы добавятся динамически в Phase 3, только для
 * SERVICE_MATRIX.md услуг с Owner approved=yes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return locales.flatMap((locale) => [
    {
      url: `${siteConfig.url}/${locale}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}`])),
      },
    },
    {
      url: `${siteConfig.url}/${locale}/leistungen`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/leistungen`])),
      },
    },
    {
      url: `${siteConfig.url}/${locale}/kontakt`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/kontakt`])),
      },
    },
    ...["ueber-uns", "unternehmen", "projekte", "ratgeber", "impressum", "datenschutz"].map((path) => ({
      url: `${siteConfig.url}/${locale}/${path}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}/${path}`])),
      },
    })),
    ...approvedServices.map((service) => ({
      url: `${siteConfig.url}/${locale}/leistungen/${service.slug}`,
      lastModified,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${siteConfig.url}/${l}/leistungen/${service.slug}`]),
        ),
      },
    })),
  ]);
}
