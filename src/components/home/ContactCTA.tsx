import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { siteConfig } from "@/lib/seo/site-config";

const COPY: Record<
  Locale,
  { title: string; sub: string; cta: string; phoneLabel: string; emailLabel: string }
> = {
  de: {
    title: "Bereit für Ihr Projekt?",
    sub: "Kostenlos und unverbindlich anfragen — wir melden uns zeitnah.",
    cta: "Kostenloses Angebot anfragen",
    phoneLabel: "Telefon",
    emailLabel: "E-Mail",
  },
  en: {
    title: "Ready for your project?",
    sub: "Request a free, no-obligation quote — we'll get back to you shortly.",
    cta: "Request a free quote",
    phoneLabel: "Phone",
    emailLabel: "Email",
  },
};

export function ContactCTA({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const hasPhone = siteConfig.phone.length > 0;
  const hasEmail = siteConfig.email.length > 0;

  return (
    <section id="kontakt" className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <FadeIn className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-light lg:text-5xl">{copy.title}</h2>
          <p className="mb-10 text-sm text-black/60">{copy.sub}</p>

          <a
            href="#"
            className="mb-8 inline-flex items-center gap-2 rounded-full bg-(--color-accent) px-8 py-4 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
          >
            {copy.cta}
          </a>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-black/60">
            {hasPhone && (
              <span>
                {copy.phoneLabel}: <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
              </span>
            )}
            {hasEmail && (
              <span>
                {copy.emailLabel}: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
              </span>
            )}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
