"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { Container } from "@/components/layout/Container";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/**
 * Aker top-of-page pattern [REQ, DESIGN_SYSTEM.md §5] — mandatory for every
 * service page. Block 1: dark full-bleed photo hero, tagline top-left,
 * service name bottom-left (screen-edge crop), floating card right.
 * Block 2: hard cut to light canvas, one large value-statement paragraph.
 *
 * No real photography exists yet (asset audit, Phase 2 design-proof) — the
 * `photo` prop is optional so the structure is ready to take a real image
 * without changing this component when one is approved. Until then this
 * renders an honest dark surface, not a gradient standing in for a photo.
 */
export function ServiceHero({
  eyebrow,
  title,
  statement,
  locale,
  serviceSlug,
  photoSrc,
  photoAlt,
}: {
  eyebrow: string;
  title: string;
  statement: string;
  locale: string;
  serviceSlug: string;
  photoSrc?: string;
  photoAlt?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* Block 1 — dark hero */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden bg-(--color-bg-primary)">
        {photoSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- CMS media, not a build-time asset */}
            <img
              src={photoSrc}
              alt={photoAlt ?? ""}
              className="absolute inset-0 size-full object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-black/55" />
          </>
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 bg-[linear-gradient(160deg,#14120f_0%,#1a1816_55%,#0c0b0a_100%)]"
          />
        )}

        <Container className="relative z-10 pb-16 pt-36">
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
            className="mb-6 max-w-xs text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase"
          >
            {eyebrow}
          </motion.p>

          <h1 className="-ml-1 max-w-[20ch] text-[clamp(2.25rem,11vw,9rem)] font-light leading-[0.92] tracking-tight text-(--color-display)">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: reduceMotion ? 0 : "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: reduceMotion ? 0.01 : 0.8, delay: reduceMotion ? 0 : 0.1, ease: EASE }}
              >
                {title}
              </motion.span>
            </span>
          </h1>
        </Container>

        {/* Floating card — Aker Block 1 right-side CTA element */}
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.01 : 0.7, delay: reduceMotion ? 0 : 0.5, ease: EASE }}
          className="absolute right-6 top-28 z-10 hidden w-56 border border-white/15 bg-black/40 p-5 backdrop-blur-sm lg:right-10 lg:block"
        >
          <p className="text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase">
            Direktanfrage
          </p>
          <p className="mt-3 text-sm leading-5 text-(--color-text-body-dark)">
            Fotos senden, in zwei Sätzen beschreiben — wir melden uns mit einem Angebot.
          </p>
          <a
            href={`/${locale}/kontakt?service=${serviceSlug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-(--color-display)"
          >
            Anfragen <span aria-hidden>→</span>
          </a>
        </motion.div>
      </section>

      {/* Block 2 — hard cut to light canvas, single value statement */}
      <section className="scroll-mt-20 bg-(--color-bg-light) py-24 text-(--color-text-on-light) lg:py-40">
        <Container>
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
            className="max-w-3xl text-2xl font-light leading-relaxed lg:text-4xl"
          >
            {statement}
          </motion.p>
        </Container>
      </section>
    </>
  );
}
