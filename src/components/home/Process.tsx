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

// Compact connected progression instead of six equal tiles wrapping across
// rows — one continuous line through the steps, horizontal on desktop,
// vertical on mobile, so it reads as a single process rather than another
// full chapter of identical cards.
export function Process({ locale }: { locale: Locale }) {
  const steps = STEPS[locale];

  return (
    <section className="bg-(--color-bg-light) py-20 text-(--color-text-on-light) lg:py-24">
      <Container>
        <FadeIn>
          <h2 className="mb-12 text-2xl font-light lg:mb-16 lg:text-4xl">{HEADING[locale]}</h2>
        </FadeIn>

        {/* Desktop: horizontal, connected by a line running through the dots. */}
        <div className="hidden lg:flex">
          {steps.map((step, i) => (
            <FadeIn key={step} delay={i * 0.05} className="flex flex-1 items-start last:flex-none">
              <div className="flex flex-col gap-3">
                <span className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base whitespace-nowrap">{step}</span>
              </div>
              {i < steps.length - 1 ? <div aria-hidden className="mx-5 mt-2 h-px flex-1 bg-black/15" /> : null}
            </FadeIn>
          ))}
        </div>

        {/* Mobile/tablet: vertical, connected by a line running through the dots. */}
        <div className="flex flex-col lg:hidden">
          {steps.map((step, i) => (
            <FadeIn key={step} delay={i * 0.04} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span aria-hidden className="size-2 shrink-0 rounded-full bg-(--color-accent)" />
                {i < steps.length - 1 ? <div aria-hidden className="my-1 w-px flex-1 bg-black/15" /> : null}
              </div>
              <div className={i < steps.length - 1 ? "pb-8" : ""}>
                <span className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-1 text-base">{step}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
