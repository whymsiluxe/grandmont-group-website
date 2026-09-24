import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { MaskedReveal } from "@/components/motion/MaskedReveal";

const HEADING: Record<Locale, { title: string; sub: string }> = {
  de: {
    title: "Reale Arbeit, reale Ergebnisse",
    sub: "Echte Projekte folgen — Fotos und Referenzen werden über das CMS gepflegt (Phase 3).",
  },
  en: {
    title: "Real work, real results",
    sub: "Real projects to follow — photos and references are managed via the CMS (Phase 3).",
  },
};

export function Work({ locale }: { locale: Locale }) {
  const copy = HEADING[locale];

  return (
    <section className="bg-(--color-bg-primary) py-24 lg:py-32">
      <Container>
        <FadeIn>
          <h2 className="mb-3 text-3xl font-light text-(--color-text-primary) lg:text-5xl">
            {copy.title}
          </h2>
          <p className="mb-16 max-w-md text-sm text-(--color-text-muted)">{copy.sub}</p>
        </FadeIn>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <MaskedReveal key={i} className="aspect-[4/5] overflow-hidden rounded-xl bg-(--color-bg-surface)">
              <div
                aria-hidden
                className="h-full w-full"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, rgba(181,118,63,0.12), rgba(255,255,255,0.03))",
                }}
              />
            </MaskedReveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
