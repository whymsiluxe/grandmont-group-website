"use client";

import type { Locale } from "@/i18n/config";
import { Container } from "@/components/layout/Container";
import { FadeIn } from "@/components/motion/FadeIn";
import { motion, useReducedMotion, type Transition } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const COPY: Record<Locale, { eyebrow: string; heading: string }> = {
  de: { eyebrow: "Warum Grandmont Group", heading: "Verlässlich von der ersten Anfrage bis zur Übergabe." },
  en: { eyebrow: "Why Grandmont Group", heading: "Reliable from the first request to the handover." },
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

// Recomposed from four equal marketing cards into one visual area + a
// tight proof-point list — the cards read as generic SaaS-landing filler
// at this point in the page; a single considered visual plus a scannable
// list reads as one statement instead of four repeated ones.
export function Advantages({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const items = ITEMS[locale];

  return (
    <section className="bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <FadeIn className="lg:sticky lg:top-24 lg:self-start">
            <div className="aspect-square w-full overflow-hidden border border-black/10 bg-(--color-bg-primary)">
              <QualityScene />
            </div>
          </FadeIn>

          <div>
            <FadeIn>
              <p className="mb-4 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
                {copy.eyebrow}
              </p>
              <h2 className="max-w-lg text-3xl font-light leading-[1.1] lg:text-5xl">{copy.heading}</h2>
            </FadeIn>

            <ul className="mt-12 divide-y divide-black/10 border-t border-black/10">
              {items.map((item, i) => (
                <li key={item.title}>
                  <FadeIn delay={i * 0.05}>
                    <div className="flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:gap-8">
                      <span className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase sm:w-40 sm:shrink-0">
                        {String(i + 1).padStart(2, "0")} — {item.title}
                      </span>
                      <p className="text-sm leading-6 text-black/60">{item.body}</p>
                    </div>
                  </FadeIn>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

// Restrained abstract motif (thin strokes + accent highlight, same grammar
// as ServiceScene/HeroDepthScene) standing in for a "quality/precision"
// idea that isn't tied to any one service or real photo — never presented
// as a photo, always the site's existing abstract-line visual language.
function QualityScene() {
  const reduceMotion = useReducedMotion();
  const nodes = [
    { x: 60, y: 340 },
    { x: 150, y: 260 },
    { x: 240, y: 300 },
    { x: 340, y: 140 },
  ];

  return (
    <svg viewBox="0 0 400 400" className="size-full" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
      <motion.polyline
        points={nodes.map((n) => `${n.x},${n.y}`).join(" ")}
        fill="none"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth={1}
        initial={false}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        style={{ pathLength: reduceMotion ? 1 : 0, opacity: reduceMotion ? 1 : 0 }}
        transition={{ duration: reduceMotion ? 0.01 : 1.1, ease: EASE }}
      />
      {nodes.map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === nodes.length - 1 ? 6 : 4}
          fill={i === nodes.length - 1 ? "var(--color-accent)" : "rgba(255,255,255,0.4)"}
          initial={false}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          style={{ opacity: reduceMotion ? 1 : 0, scale: reduceMotion ? 1 : 0.4, transformOrigin: `${n.x}px ${n.y}px` }}
          transition={{ duration: reduceMotion ? 0.01 : 0.5, delay: reduceMotion ? 0 : 0.3 + i * 0.15, ease: EASE }}
        />
      ))}
    </svg>
  );
}
