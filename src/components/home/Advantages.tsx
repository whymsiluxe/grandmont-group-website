import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const HEADING: Record<Locale, string> = {
  de: "Warum Grandmont Group",
  en: "Why Grandmont Group",
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
  const items = ITEMS[locale];

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-16 text-3xl font-light lg:text-5xl">{HEADING[locale]}</h2>
        </FadeIn>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08}>
              <p className="mb-3 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-black/60">{item.body}</p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
