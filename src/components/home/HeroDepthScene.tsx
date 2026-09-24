"use client";

import { motion, useTransform, type MotionValue } from "motion/react";

/**
 * Lusion depth-moment layer, per docs/REFERENCE_ANALYSIS.md §6: the
 * reference uses a scroll-controlled camera Z-position so a 3D object
 * appears to approach the viewer. No product photography exists yet
 * (DESIGN_SYSTEM.md §4.1 — Homepage stays abstract motion + typography by
 * design), so the same perceptual mechanic is built from layered abstract
 * geometry instead of a fabricated 3D object: several flat planes at
 * different implied depths, each scaling/translating at its own rate as
 * `scrollYProgress` advances — the classic multi-plane parallax approach
 * to simulated camera depth, done in 2D so it stays CSS/SVG only.
 *
 * GPU-only: every animated property here is transform (scale/translate)
 * or opacity, driven by useTransform off a single scrollYProgress
 * MotionValue already computed by the caller — no per-frame JS, no
 * layout properties, nothing that forces reflow. Reduced-motion callers
 * should pass a MotionValue pinned at 0 rather than rendering this at all
 * (see Hero.tsx).
 */
export function HeroDepthScene({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  // Three depth planes: the farthest moves least and stays faint, the
  // nearest moves most and grows most — the layer ordering (z-index via
  // DOM order) plus differential motion speed is what reads as depth,
  // not any single layer's animation on its own.
  const farScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const farOpacity = useTransform(scrollYProgress, [0, 1], [0.35, 0.15]);

  const midScale = useTransform(scrollYProgress, [0, 1], [1, 1.22]);
  const midY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const midOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 0.2]);

  const nearScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const nearY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const nearOpacity = useTransform(scrollYProgress, [0, 1], [0.65, 0]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Far plane — wide static-feeling grid, barely moves */}
      <motion.svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 size-full"
        style={{ scale: farScale, opacity: farOpacity, transformOrigin: "70% 40%" }}
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 6 }, (_, i) => (
          <line
            key={`v-${i}`}
            x1={240 + i * 180}
            y1={0}
            x2={240 + i * 180}
            y2={900}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 4 }, (_, i) => (
          <line
            key={`h-${i}`}
            x1={0}
            y1={180 + i * 180}
            x2={1440}
            y2={180 + i * 180}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={1}
          />
        ))}
      </motion.svg>

      {/* Mid plane — large offset ring, moderate motion */}
      <motion.svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 size-full"
        style={{ scale: midScale, y: midY, opacity: midOpacity, transformOrigin: "78% 45%" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <circle cx={1180} cy={360} r={260} fill="none" stroke="var(--color-accent)" strokeWidth={1} />
        <circle cx={1180} cy={360} r={340} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={1} />
      </motion.svg>

      {/* Near plane — closest, largest motion delta, reads as "approaching" */}
      <motion.svg
        viewBox="0 0 1440 900"
        className="absolute inset-0 size-full"
        style={{ scale: nearScale, y: nearY, opacity: nearOpacity, transformOrigin: "82% 50%" }}
        preserveAspectRatio="xMidYMid slice"
      >
        <line x1={950} y1={120} x2={1350} y2={520} stroke="var(--color-accent)" strokeWidth={1} />
        <line x1={1350} y1={120} x2={950} y2={520} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
      </motion.svg>
    </div>
  );
}
