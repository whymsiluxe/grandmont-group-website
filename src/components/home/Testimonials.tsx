import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const COPY: Record<Locale, { title: string; sub: string }> = {
  de: {
    title: "Erfahrungen unserer Kunden",
    sub: "Echte Bewertungen folgen — keine erfundenen Zitate oder Zahlen, siehe CONTENT_VERIFY.md.",
  },
  en: {
    title: "What our clients say",
    sub: "Real reviews to follow — no fabricated quotes or figures, see CONTENT_VERIFY.md.",
  },
};

export function Testimonials({ locale }: { locale: Locale }) {
  const copy = COPY[locale];

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-3 text-3xl font-light lg:text-5xl">{copy.title}</h2>
          <p className="max-w-md text-sm text-black/60">{copy.sub}</p>
        </FadeIn>
      </Container>
    </section>
  );
}
