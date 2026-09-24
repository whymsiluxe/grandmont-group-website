import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";
import { locales } from "@/i18n/config";

/**
 * Base sitemap — только статичные/foundation-роуты на этом этапе (Phase 1).
 * Service-страницы добавятся динамически в Phase 3, только для
 * SERVICE_MATRIX.md услуг с Owner approved=yes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `${siteConfig.url}/${l}`])),
    },
  }));
}
