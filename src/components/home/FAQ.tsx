import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const HEADING: Record<Locale, string> = {
  de: "Häufige Fragen",
  en: "Frequently asked questions",
};

// Starter set per CONTENT_MODEL.md — real FAQ content moves into Payload (faq collection) in Phase 3.
const QUESTIONS: Record<Locale, { q: string; a: string }[]> = {
  de: [
    {
      q: "Wie schnell bekomme ich einen Termin?",
      a: "In der Regel innerhalb weniger Tage — je nach Auftragslage auch kurzfristig.",
    },
    { q: "Arbeiten Sie auch kurzfristig?", a: "Ja, sprechen Sie uns bei dringendem Bedarf direkt an." },
    {
      q: "Kann ich Fotos meiner Möbel senden?",
      a: "Ja, per Foto-Anfrage können Sie Bilder und eine kurze Beschreibung direkt hochladen.",
    },
    {
      q: "Wie wird der Preis berechnet?",
      a: "Nach Aufwand, Umfang und Material — die genauen Faktoren erläutern wir auf jeder Leistungsseite.",
    },
    { q: "Arbeiten Sie auch für Unternehmen?", a: "Ja, siehe unseren Bereich „Für Unternehmen“." },
    { q: "Erstellen Sie Rechnungen?", a: "Ja, für jeden Auftrag." },
    { q: "Welche Regionen bedienen Sie?", a: "Chemnitz und die umliegende Region — siehe Einsatzgebiet." },
    {
      q: "Kann ich mehrere Leistungen gleichzeitig buchen?",
      a: "Ja, beschreiben Sie einfach alle gewünschten Arbeiten in Ihrer Anfrage.",
    },
  ],
  en: [
    { q: "How quickly can I get an appointment?", a: "Usually within a few days — sooner if needed." },
    { q: "Do you also work on short notice?", a: "Yes, just reach out directly for urgent requests." },
    { q: "Can I send photos of my furniture?", a: "Yes, upload photos and a short description via our photo request." },
    { q: "How is the price calculated?", a: "Based on scope, effort and materials — factors are explained on each service page." },
    { q: "Do you also work with businesses?", a: "Yes, see our business section." },
    { q: "Do you issue invoices?", a: "Yes, for every job." },
    { q: "Which regions do you serve?", a: "Chemnitz and the surrounding region — see our service area." },
    { q: "Can I book multiple services at once?", a: "Yes, just describe everything you need in your request." },
  ],
};

export function FAQ({ locale }: { locale: Locale }) {
  const items = QUESTIONS[locale];

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-16 text-3xl font-light text-(--color-text-primary) lg:text-5xl">
            {HEADING[locale]}
          </h2>
        </FadeIn>

        <div className="grid gap-px overflow-hidden rounded-2xl bg-white/10 sm:grid-cols-2">
          {items.map((item, i) => (
            <FadeIn key={item.q} delay={i * 0.04} className="bg-(--color-bg-surface) p-6">
              <h3 className="mb-2 text-sm font-medium text-(--color-text-primary)">{item.q}</h3>
              <p className="text-sm text-(--color-text-muted)">{item.a}</p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
