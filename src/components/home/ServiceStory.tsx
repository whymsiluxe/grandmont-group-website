"use client";

import { useRef, useState } from "react";
import { Container } from "@/components/layout/Container";
import type { Locale } from "@/i18n/config";
import type { ApprovedService } from "@/lib/services/approved-services";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, type Transition } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

const HEADING: Record<Locale, string> = {
  de: "Was wir übernehmen",
  en: "What we take off your hands",
};

/**
 * Hyper Tria sticky-image + scroll-through-text pattern
 * [REQ, docs/REFERENCE_ANALYSIS.md §8]: one sticky visual column, one
 * scrolling text column; scroll progress drives an active index that
 * swaps BOTH the visual and the text as a single synchronized state
 * change — not two independently-scrolling carousels, not a timed
 * slideshow, not an unsynchronized fade.
 *
 * Per DESIGN_SYSTEM.md §4.1: Homepage is abstract motion + typography by
 * design, not a photo showcase — real photography stays reserved for
 * /projekte. The sticky visual renders the service's own display
 * typography (large number + title) as the actual design, not a
 * placeholder standing in for a future photo.
 */
export function ServiceStory({ locale, services }: { locale: Locale; services: ApprovedService[] }) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const index = Math.min(services.length - 1, Math.floor(value * services.length));
    setActive(Math.max(0, index));
  });

  if (services.length === 0) return null;

  // Reduced-motion / no-JS fallback: stacked static pairs, no sticky/scroll
  // dependency — every state must be understandable without animation.
  if (reduceMotion) {
    return (
      <section className="bg-(--color-bg-primary) py-24 lg:py-32">
        <Container>
          <h2 className="mb-16 text-3xl font-light text-(--color-display) lg:text-5xl">{HEADING[locale]}</h2>
          <div className="space-y-16">
            {services.map((service, i) => (
              <div key={service.slug} className="grid gap-8 border-t border-white/10 pt-10 lg:grid-cols-2">
                <StoryPanel service={service} locale={locale} index={i} />
                <StoryText service={service} locale={locale} />
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={containerRef} className="relative bg-(--color-bg-primary)" style={{ height: `${services.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <Container className="grid w-full gap-8 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-4/3 w-full lg:aspect-square">
            {services.map((service, i) => (
              <motion.div
                key={service.slug}
                className="absolute inset-0"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, scale: active === i ? 1 : 1.04 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <StoryPanel service={service} locale={locale} index={i} />
              </motion.div>
            ))}
          </div>

          <div className="relative h-40">
            {services.map((service, i) => (
              <motion.div
                key={service.slug}
                className="absolute inset-0 flex flex-col justify-center"
                initial={false}
                animate={{ opacity: active === i ? 1 : 0, y: active === i ? 0 : 16 }}
                transition={{ duration: 0.5, ease: EASE }}
              >
                <StoryText service={service} locale={locale} />
              </motion.div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}

function StoryPanel({ service, locale, index }: { service: ApprovedService; locale: Locale; index: number }) {
  return (
    <div className="flex size-full flex-col justify-between border border-white/10 bg-(--color-bg-surface) p-8 lg:p-10">
      <span className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="text-4xl font-light leading-[0.95] text-(--color-display) lg:text-5xl">
        {service.title[locale]}
      </span>
    </div>
  );
}

function StoryText({ service, locale }: { service: ApprovedService; locale: Locale }) {
  return (
    <div>
      <p className="mb-4 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
        {service.eyebrow[locale]}
      </p>
      <p className="max-w-md text-lg leading-relaxed text-(--color-text-muted) lg:text-xl">
        {service.statement[locale]}
      </p>
    </div>
  );
}
