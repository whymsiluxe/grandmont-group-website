"use client";

import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { motion, useReducedMotion, type Transition } from "motion/react";

const COPY: Record<Locale, { eyebrow: string; heading: string[]; sub: string; cta: string }> = {
  de: {
    eyebrow: "Grandmont Group — Chemnitz",
    heading: ["Montage &", "Handwerk mit", "Anspruch."],
    sub: "Von der Möbelmontage bis zum Innenausbau — saubere Ausführung, klare Kommunikation, verlässliche Termine.",
    cta: "Kostenloses Angebot anfragen",
  },
  en: {
    eyebrow: "Grandmont Group — Chemnitz",
    heading: ["Assembly &", "craftsmanship,", "done right."],
    sub: "From furniture assembly to full interior fit-out — clean execution, clear communication, reliable schedules.",
    cta: "Request a free quote",
  },
};

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

export function Hero({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[90vh] items-end overflow-hidden bg-(--color-bg-primary)">
      {/* placeholder full-bleed background — real project photography replaces this in Phase 3 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-br from-(--color-bg-surface) via-(--color-bg-primary) to-black"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(181,118,63,0.15), transparent 45%), radial-gradient(circle at 80% 70%, rgba(181,118,63,0.08), transparent 40%)",
        }}
      />

      <Container className="relative z-10 pb-16 pt-32 lg:pb-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
              className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase"
            >
              {copy.eyebrow}
            </motion.p>

            <h1 className="text-5xl font-light leading-[1.05] tracking-tight text-(--color-text-primary) sm:text-6xl lg:text-8xl">
              {copy.heading.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: reduceMotion ? 0 : "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: reduceMotion ? 0.01 : 0.8,
                      delay: reduceMotion ? 0 : 0.1 + i * 0.1,
                      ease: EASE,
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.6, delay: reduceMotion ? 0 : 0.5, ease: EASE }}
            className="max-w-xs"
          >
            <p className="mb-6 text-base text-(--color-text-muted)">{copy.sub}</p>
            <a
              href="#kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-(--color-accent) px-6 py-3 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
            >
              {copy.cta}
            </a>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
