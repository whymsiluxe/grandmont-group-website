import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { ContactForm } from "@/components/lead/ContactForm";
import type { ApprovedService } from "@/lib/services/approved-services";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<Locale, { eyebrow: string; title: string; sub: string; directTitle: string }> = {
  de: {
    eyebrow: "Kontakt",
    title: "Bereit für Ihr Projekt?",
    sub: "Beschreiben Sie kurz, was gemacht werden soll — Fotos helfen uns, Umfang und Aufwand schneller einzuschätzen. Kostenlos und unverbindlich.",
    directTitle: "Direktkontakt",
  },
  en: {
    eyebrow: "Contact",
    title: "Ready for your project?",
    sub: "Briefly describe what needs to be done — photos help us estimate scope and effort faster. Free and no obligation.",
    directTitle: "Direct contact",
  },
};

// The page's conclusion: the actual lead form, not another link pointing
// at it. Same ContactForm component/behavior as /kontakt, unchanged.
export function ContactCTA({ locale, services }: { locale: Locale; services: ApprovedService[] }) {
  const copy = COPY[locale];
  const hasPhone = siteConfig.phone.length > 0;
  const hasWhatsApp = siteConfig.whatsapp.length > 0;
  const hasEmail = siteConfig.email.length > 0;

  return (
    <section id="kontakt" className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <FadeIn className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <p className="mb-4 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-md text-3xl font-light leading-[1.1] lg:text-5xl">{copy.title}</h2>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-black/60">{copy.sub}</p>

            {hasPhone || hasWhatsApp || hasEmail ? (
              <div className="mt-10 border-t border-black/15 pt-8">
                <h3 className="text-sm font-medium">{copy.directTitle}</h3>
                <div className="mt-4 space-y-2 text-sm text-black/60">
                  {hasPhone ? (
                    <p>
                      <a
                        data-event="phone_click"
                        data-event-location="home_final_cta"
                        href={`tel:${siteConfig.phone}`}
                      >
                        {siteConfig.phone}
                      </a>
                    </p>
                  ) : null}
                  {hasWhatsApp ? (
                    <p>
                      <a
                        data-event="whatsapp_click"
                        data-event-location="home_final_cta"
                        href={`https://wa.me/${siteConfig.whatsapp}`}
                      >
                        WhatsApp
                      </a>
                    </p>
                  ) : null}
                  {hasEmail ? (
                    <p>
                      <a
                        data-event="email_click"
                        data-event-location="home_final_cta"
                        href={`mailto:${siteConfig.email}`}
                      >
                        {siteConfig.email}
                      </a>
                    </p>
                  ) : null}
                </div>
              </div>
            ) : null}
          </FadeIn>

          <FadeIn delay={0.1} className="min-w-0">
            <ContactForm locale={locale} services={services} />
          </FadeIn>
        </div>
      </Container>
    </section>
  );
}
