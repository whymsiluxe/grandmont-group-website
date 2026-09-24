import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { siteConfig } from "@/lib/seo/site-config";

const HEADING: Record<Locale, string> = {
  de: "Unser Einsatzgebiet",
  en: "Where we work",
};

export function ServiceArea({ locale }: { locale: Locale }) {
  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-12 text-3xl font-light text-(--color-text-primary) lg:text-5xl">
            {HEADING[locale]}
          </h2>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-3">
            {siteConfig.serviceArea.map((city) => (
              <span
                key={city}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-(--color-text-muted)"
              >
                {city}
              </span>
            ))}
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
