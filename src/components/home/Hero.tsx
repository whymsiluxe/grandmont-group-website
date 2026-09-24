"use client";

import { Container } from "@/components/layout/Container";
import type { Locale } from "@/i18n/config";
import { motion, useReducedMotion, type Transition } from "motion/react";

const COPY: Record<
  Locale,
  {
    eyebrow: string;
    heading: string[];
    sub: string;
    cta: string;
    visual: {
      stages: string[];
      surface: string;
      proof: string;
    };
  }
> = {
  de: {
    eyebrow: "Grandmont Group — Chemnitz",
    heading: ["Montage &", "Handwerk mit", "Anspruch."],
    sub: "Von der Möbelmontage bis zum Innenausbau — saubere Ausführung, klare Kommunikation, verlässliche Termine.",
    cta: "Kostenloses Angebot anfragen",
    visual: {
      stages: ["Anfrage", "Angebot", "Termin"],
      surface: "Saubere Übergabe",
      proof: "Fotos · Ablauf · Rechnung",
    },
  },
  en: {
    eyebrow: "Grandmont Group — Chemnitz",
    heading: ["Assembly &", "craftsmanship,", "done right."],
    sub: "From furniture assembly to full interior fit-out — clean execution, clear communication, reliable schedules.",
    cta: "Request a free quote",
    visual: {
      stages: ["Request", "Quote", "Date"],
      surface: "Clean handover",
      proof: "Photos · Process · Invoice",
    },
  },
};

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

export function Hero({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-(--color-bg-primary)">
      <HeroMaterialScene locale={locale} reduceMotion={Boolean(reduceMotion)} />

      <Container className="relative z-10 pb-16 pt-32 lg:pb-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:items-end">
          <div>
            <motion.p
              initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
              className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase"
            >
              {copy.eyebrow}
            </motion.p>

            <h1 className="max-w-5xl text-5xl font-light leading-[1.05] text-(--color-text-primary) sm:text-6xl lg:text-8xl">
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
            className="max-w-sm lg:pb-2"
          >
            <p className="mb-6 text-base text-(--color-text-muted)">{copy.sub}</p>
            <a
              data-event="cta_offer_click"
              data-event-location="home_hero"
              href="#kontakt"
              className="inline-flex items-center gap-2 rounded-full bg-(--color-accent) px-6 py-3 text-sm font-medium text-(--color-bg-primary) transition-transform hover:scale-[1.03]"
            >
              {copy.cta}
            </a>
          </motion.div>
        </div>
      </Container>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-(--color-bg-primary) to-transparent" />
    </section>
  );
}

function HeroMaterialScene({
  locale,
  reduceMotion,
}: {
  locale: Locale;
  reduceMotion: boolean;
}) {
  const visual = COPY[locale].visual;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(140deg,#14120f_0%,#1a1816_46%,#0c0b0a_100%)]" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(247,245,243,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(247,245,243,0.10) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 18%, black 70%, transparent 100%)",
        }}
      />

      <motion.div
        className="absolute right-[-6rem] top-20 hidden h-[42rem] w-[42rem] lg:block"
        initial={{ opacity: 0, rotateX: reduceMotion ? 0 : 58, rotateZ: reduceMotion ? -16 : -24, y: 24 }}
        animate={{ opacity: 1, rotateX: 58, rotateZ: -24, y: reduceMotion ? 0 : [0, -12, 0] }}
        transition={{
          duration: reduceMotion ? 0.01 : 1.2,
          ease: EASE,
          y: { duration: 8, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-8 rounded-[2rem] border border-white/10 bg-white/[0.035] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-md" />
        <div className="absolute inset-20 rounded-[1.5rem] border border-[#b5763f]/35 bg-[#b5763f]/[0.08]" />
        <div className="absolute left-20 right-20 top-44 h-px bg-[#b5763f]/50" />
        <div className="absolute bottom-32 left-16 right-28 h-24 rounded-2xl border border-white/10 bg-black/25" />
        <div className="absolute bottom-40 left-24 h-2 w-44 rounded-full bg-[#f7f5f3]/35" />
        <div className="absolute bottom-52 left-24 h-2 w-28 rounded-full bg-[#b5763f]/60" />

        {visual.stages.map((stage, index) => (
          <div
            key={stage}
            className="absolute left-24 flex h-14 items-center gap-3 rounded-full border border-white/10 bg-[#14120f]/85 px-5 text-xs font-medium text-[#f6f1e7]/80 shadow-[0_20px_60px_rgba(0,0,0,0.28)]"
            style={{
              top: `${120 + index * 72}px`,
              transform: `translateZ(${24 + index * 18}px) translateX(${index * 34}px)`,
            }}
          >
            <span className="size-2 rounded-full bg-[#b5763f]" />
            <span>{stage}</span>
          </div>
        ))}

        <div
          className="absolute right-20 top-28 w-48 rounded-2xl border border-white/10 bg-[#f7f5f3]/95 p-5 text-[#14120f] shadow-[0_30px_70px_rgba(0,0,0,0.35)]"
          style={{ transform: "translateZ(82px)" }}
        >
          <p className="text-xs font-medium tracking-[0.08em] text-[#b5763f] uppercase">{visual.surface}</p>
          <p className="mt-3 text-sm leading-5 text-black/55">{visual.proof}</p>
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,18,15,0.10),rgba(20,18,15,0.40)_55%,rgba(20,18,15,0.72))]" />
    </div>
  );
}
