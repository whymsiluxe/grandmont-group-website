import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const COPY: Record<Locale, { eyebrow: string; heading: string }> = {
  de: { eyebrow: "Warum Grandmont Group", heading: "Verlässlich von der ersten Anfrage bis zur Übergabe." },
  en: { eyebrow: "Why Grandmont Group", heading: "Reliable from the first request to the handover." },
};

const ITEMS: Record<Locale, { title: string; body: string }[]> = {
  de: [
    { title: "Schnelle Terminvergabe", body: "Kurze Reaktionszeiten, auch bei kurzfristigem Bedarf." },
    { title: "Transparente Kalkulation", body: "Klare Preisprinzipien, keine versteckten Kosten." },
    { title: "Saubere Ausführung", body: "Professionelle Werkzeuge, ordentliche Übergabe." },
    { title: "Zuverlässige Kommunikation", body: "Ein Ansprechpartner, klare Absprachen." },
  ],
  en: [
    { title: "Fast scheduling", body: "Short response times, even for short-notice requests." },
    { title: "Transparent pricing", body: "Clear pricing principles, no hidden costs." },
    { title: "Clean execution", body: "Professional tools, tidy handover." },
    { title: "Reliable communication", body: "One point of contact, clear agreements." },
  ],
};

export function Advantages({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const items = ITEMS[locale];

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <FadeIn>
            <p className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
              {copy.eyebrow}
            </p>
            <h2 className="max-w-md text-3xl font-light leading-[1.1] lg:text-5xl">{copy.heading}</h2>
          </FadeIn>

          <div className="grid gap-8 sm:grid-cols-2">
            {items.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.06}>
                <div className="border-t border-black/15 pt-5">
                  <h3 className="text-lg font-medium">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-black/60">{item.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
