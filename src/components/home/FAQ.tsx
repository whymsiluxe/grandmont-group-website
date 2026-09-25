import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const HEADING: Record<Locale, string> = {
  de: "Häufige Fragen",
  en: "Frequently asked questions",
};

// Starter set per CONTENT_MODEL.md — real FAQ content moves into Payload (faq collection) in Phase 3.
export const homeFaqItems: Record<Locale, { q: string; a: string }[]> = {
  de: [
    {
      q: "Wie schnell bekomme ich einen Termin?",
      a: "In der Regel innerhalb weniger Tage — je nach Auftragslage auch kurzfristig.",
    },
    {
      q: "Kann ich Fotos meiner Möbel senden?",
      a: "Ja, per Foto-Anfrage können Sie Bilder und eine kurze Beschreibung direkt hochladen.",
    },
    {
      q: "Wie wird der Preis berechnet?",
      a: "Nach Aufwand, Umfang und Material — die genauen Faktoren erläutern wir auf jeder Leistungsseite.",
    },
    { q: "Welche Regionen bedienen Sie?", a: "Chemnitz und die umliegende Region — siehe Einsatzgebiet." },
    { q: "Arbeiten Sie auch kurzfristig?", a: "Ja, sprechen Sie uns bei dringendem Bedarf direkt an." },
    { q: "Arbeiten Sie auch für Unternehmen?", a: "Ja, siehe unseren Bereich „Für Unternehmen“." },
    { q: "Erstellen Sie Rechnungen?", a: "Ja, für jeden Auftrag." },
    {
      q: "Kann ich mehrere Leistungen gleichzeitig buchen?",
      a: "Ja, beschreiben Sie einfach alle gewünschten Arbeiten in Ihrer Anfrage.",
    },
  ],
  en: [
    { q: "How quickly can I get an appointment?", a: "Usually within a few days — sooner if needed." },
    { q: "Can I send photos of my furniture?", a: "Yes, upload photos and a short description via our photo request." },
    { q: "How is the price calculated?", a: "Based on scope, effort and materials — factors are explained on each service page." },
    { q: "Which regions do you serve?", a: "Chemnitz and the surrounding region — see our service area." },
    { q: "Do you also work on short notice?", a: "Yes, just reach out directly for urgent requests." },
    { q: "Do you also work with businesses?", a: "Yes, see our business section." },
    { q: "Do you issue invoices?", a: "Yes, for every job." },
    { q: "Can I book multiple services at once?", a: "Yes, just describe everything you need in your request." },
  ],
};

// Compact accordion list instead of a padded 2-col card grid — a different
// grammar (list, not tiles) from Advantages/ServicesGrid right before it,
// and native <details> keeps it accessible with no extra JS.
export function FAQ({ locale }: { locale: Locale }) {
  const items = homeFaqItems[locale].slice(0, 5);

  return (
    <section className="bg-(--color-bg-primary) py-20 lg:py-24">
      <Container>
        <FadeIn>
          <h2 className="mb-10 text-2xl font-light text-(--color-text-primary) lg:mb-12 lg:text-4xl">
            {HEADING[locale]}
          </h2>
        </FadeIn>

        <div className="divide-y divide-white/10 border-t border-white/10">
          {items.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.03}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-sm font-medium text-(--color-text-primary) marker:hidden">
                  {item.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-lg font-light text-(--color-accent) transition-transform duration-200 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-(--color-text-muted)">{item.a}</p>
              </details>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
