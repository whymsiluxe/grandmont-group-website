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

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/10 bg-(--color-bg-light)/95 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] shadow-2xl backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-sm grid-cols-3 gap-2">
        {hasPhone ? (
          <a
            href={`tel:${siteConfig.phone}`}
            className="rounded-full border border-black/15 px-3 py-3 text-center text-xs font-medium text-(--color-text-on-light)"
          >
            {copy.call}
          </a>
        ) : (
          <span className="rounded-full border border-black/10 px-3 py-3 text-center text-xs font-medium text-black/30">
            {copy.call}
          </span>
        )}

        {hasWhatsApp ? (
          <a
            href={`https://wa.me/${siteConfig.whatsapp}`}
            className="rounded-full border border-black/15 px-3 py-3 text-center text-xs font-medium text-(--color-text-on-light)"
          >
            {copy.whatsapp}
          </a>
        ) : (
          <span className="rounded-full border border-black/10 px-3 py-3 text-center text-xs font-medium text-black/30">
            {copy.whatsapp}
          </span>
        )}

        <Link
          href={`/${locale}/kontakt`}
          className="rounded-full bg-(--color-accent) px-3 py-3 text-center text-xs font-medium text-(--color-bg-primary)"
        >
          {copy.offer}
        </Link>
      </div>
    </div>
  );
}
