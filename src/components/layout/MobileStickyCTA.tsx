import Link from "next/link";
import type { Locale } from "@/i18n/config";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<Locale, { call: string; whatsapp: string; offer: string }> = {
  de: { call: "Anrufen", whatsapp: "WhatsApp", offer: "Angebot" },
  en: { call: "Call", whatsapp: "WhatsApp", offer: "Quote" },
};

export function MobileStickyCTA({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const hasPhone = siteConfig.phone.length > 0;
  const hasWhatsApp = siteConfig.whatsapp.length > 0;
  const ctaLabel = locale === "de" ? "Schnellkontakt" : "Quick contact";
  const columns = 1 + (hasPhone ? 1 : 0) + (hasWhatsApp ? 1 : 0);

  return (
    <nav
      aria-label={ctaLabel}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-(--color-bg-light)/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-lg backdrop-blur md:hidden"
    >
      <div
        className="mx-auto grid max-w-sm gap-2"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {hasPhone ? (
          <a
            aria-label={locale === "de" ? "Grandmont Group anrufen" : "Call Grandmont Group"}
            data-event="phone_click"
            data-event-location="mobile_sticky_cta"
            href={`tel:${siteConfig.phone}`}
            className="rounded-full border border-black/15 px-3 py-3 text-center text-xs font-medium text-(--color-text-on-light)"
          >
            {copy.call}
          </a>
        ) : null}

        {hasWhatsApp ? (
          <a
            aria-label={locale === "de" ? "Grandmont Group auf WhatsApp öffnen" : "Open Grandmont Group on WhatsApp"}
            data-event="whatsapp_click"
            data-event-location="mobile_sticky_cta"
            href={`https://wa.me/${siteConfig.whatsapp}`}
            className="rounded-full border border-black/15 px-3 py-3 text-center text-xs font-medium text-(--color-text-on-light)"
          >
            {copy.whatsapp}
          </a>
        ) : null}

        <Link
          aria-label={locale === "de" ? "Angebot anfragen" : "Request a quote"}
          data-event="cta_offer_click"
          data-event-location="mobile_sticky_cta"
          href={`/${locale}/kontakt`}
          className="rounded-full bg-(--color-accent) px-3 py-3 text-center text-xs font-medium text-(--color-bg-primary)"
        >
          {copy.offer}
        </Link>
      </div>
    </nav>
  );
}
