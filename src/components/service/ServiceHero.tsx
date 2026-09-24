"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";
import { Container } from "@/components/layout/Container";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/**
 * Aker top-of-page pattern [REQ, DESIGN_SYSTEM.md §5] — mandatory for every service page.
 * Block 1: dark full-bleed hero, tagline top-left, service name bottom-left (screen-edge crop),
 * floating card right. Block 2: hard cut to light canvas, one large value-statement paragraph.
 */
export function ServiceHero({
  eyebrow,
  title,
  statement,
}: {
  eyebrow: string;
  title: string;
  statement: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <>
      {/* Block 1 — dark hero */}
      <section className="relative flex min-h-[80vh] items-end overflow-hidden bg-(--color-bg-primary)">
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-br from-(--color-bg-surface) via-(--color-bg-primary) to-black"
        />
        <Container className="relative z-10 pb-16 pt-32">
          <motion.p
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.6, ease: EASE }}
            className="mb-6 text-xs font-medium tracking-[0.08em] text-(--color-accent) uppercase"
          >
            {eyebrow}
          </motion.p>

          <h1 className="-ml-1 text-4xl font-light leading-[0.95] tracking-tight text-(--color-text-primary) sm:text-6xl md:text-7xl lg:text-9xl">
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
