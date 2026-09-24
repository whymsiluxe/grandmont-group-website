import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";

const HEADING: Record<Locale, string> = {
  de: "So läuft es ab",
  en: "How it works",
};

const STEPS: Record<Locale, string[]> = {
  de: ["Anfrage", "Einschätzung", "Angebot", "Termin", "Ausführung", "Abnahme"],
  en: ["Request", "Assessment", "Quote", "Appointment", "Execution", "Handover"],
};

export function Process({ locale }: { locale: Locale }) {
  const steps = STEPS[locale];

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-16 text-3xl font-light lg:text-5xl">{HEADING[locale]}</h2>
        </FadeIn>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {steps.map((step, i) => (
            <FadeIn key={step} delay={i * 0.06}>
              <p className="mb-3 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                {String(i + 1).padStart(2, "0")}
              </p>
              <p className="text-base">{step}</p>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
