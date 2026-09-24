import type { Locale } from "@/i18n/config";
import { FadeIn } from "@/components/motion/FadeIn";

const STEPS: Record<Locale, string[]> = {
  de: ["Anfrage", "Einschätzung", "Angebot", "Termin", "Ausführung", "Abnahme"],
  en: ["Request", "Assessment", "Quote", "Appointment", "Execution", "Handover"],
};

export function Ablauf({ locale }: { locale: Locale }) {
  const steps = STEPS[locale];

  return (
    <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
      {steps.map((step, i) => (
        <FadeIn key={step} delay={i * 0.06}>
          <p className="mb-2 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
            {String(i + 1).padStart(2, "0")}
          </p>
          <p className="text-sm text-(--color-text-muted)">{step}</p>
        </FadeIn>
      ))}
    </div>
  );
}
