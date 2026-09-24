"use client";

import { Container } from "@/components/layout/Container";
import { HeroDepthScene } from "@/components/home/HeroDepthScene";
import type { Locale } from "@/i18n/config";
import { motion, useReducedMotion, useScroll, useTransform, type Transition } from "motion/react";
import { useRef } from "react";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    heading: string[];
    sub: string;
    cta: string;
  }
> = {
  de: {
    eyebrow: "Grandmont Group — Chemnitz",
    heading: ["Montage &", "Handwerk mit", "Anspruch."],
    sub: "Von der Möbelmontage bis zum Objektservice — saubere Ausführung, klare Kommunikation, verlässliche Termine.",
    cta: "Kostenloses Angebot anfragen",
  },
  en: {
    eyebrow: "Grandmont Group — Chemnitz",
    heading: ["Assembly &", "craftsmanship,", "done right."],
    sub: "From furniture assembly to facility services — clean execution, clear communication, reliable schedules.",
    cta: "Request a free quote",
  },
};

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

// Lusion depth-moment, per docs/REFERENCE_ANALYSIS.md §6: the original uses a
// scroll-controlled camera Z-position to make a 3D object approach the
// viewer. With no product photography yet, the same perceptual mechanic —
// scroll drives forward motion / scale toward the viewer — is applied to
// the display type itself instead of a fabricated 3D object. When real
// hero photography exists, this becomes foreground/background depth on the
// image; the scroll-driven structure underneath does not need to change.
export function Hero({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const headingScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.18]);
  const headingY = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -40]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, reduceMotion ? 1 : 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100vh] items-end overflow-hidden bg-(--color-bg-primary)"
    >
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(160deg,#14120f_0%,#1a1816_55%,#0c0b0a_100%)]"
      />

      {reduceMotion ? null : <HeroDepthScene scrollYProgress={scrollYProgress} />}

      <Container className="relative z-10 pb-20 pt-40 lg:pb-28">
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
          className="mb-10 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase"
        >
          {copy.eyebrow}
        </motion.p>

        <motion.h1
          style={{ scale: headingScale, y: headingY }}
          className="max-w-[22ch] text-[clamp(2.5rem,10vw,7rem)] font-light leading-[0.94] tracking-tight text-(--color-display)"
        >
          {copy.heading.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: reduceMotion ? 0 : "100%" }}
                animate={{ y: 0 }}
                transition={{
                  duration: reduceMotion ? 0.01 : 0.9,
                  delay: reduceMotion ? 0 : 0.1 + i * 0.1,
                  ease: EASE,
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.div
          style={{ opacity: fade }}
          initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.6, delay: reduceMotion ? 0 : 0.6, ease: EASE }}
          className="mt-12 flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-base text-(--color-text-muted)">{copy.sub}</p>
          <a
            data-event="cta_offer_click"
            data-event-location="home_hero"
            href="#kontakt"
            className="inline-flex items-center gap-2 rounded-full bg-(--color-accent) px-6 py-3 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
          >
            {copy.cta}
          </a>
        </motion.div>
      </Container>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-(--color-bg-primary) to-transparent"
      />
    </section>
  );
}
