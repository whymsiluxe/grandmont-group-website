"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/**
 * Per-service abstract motion scenes for ServiceStory (Hyper Tria sticky
 * panel). One shared visual grammar — thin 1px strokes, accent-color
 * highlights on a near-black surface, restrained layered depth — with a
 * geometry per service that echoes what the work actually is without
 * illustrating it literally (no icons/photos, per DESIGN_SYSTEM.md §4.1).
 *
 * GPU-only animation: every motion.* here animates transform/opacity
 * exclusively, never layout properties (width/height/top/left), so scenes
 * stay off the main thread and don't affect CLS. `active` drives entrance
 * choreography; `reduceMotion` collapses every scene to its resting state.
 */
export function ServiceScene({ slug, active }: { slug: string; active: boolean }) {
  const reduceMotion = useReducedMotion();
  const scene = SCENES[slug] ?? SCENES.default;
  return (
    <svg
      viewBox="0 0 400 400"
      className="absolute inset-0 size-full"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id={`scene-fade-${slug}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
        </linearGradient>
      </defs>
      {scene({ active: reduceMotion ? true : active, reduceMotion: Boolean(reduceMotion) })}
    </svg>
  );
}

type SceneArgs = { active: boolean; reduceMotion: boolean };
type Scene = (args: SceneArgs) => React.ReactNode;

const STROKE = "rgba(255,255,255,0.16)";
const STROKE_ACCENT = "var(--color-accent)";

// Küchenmontage — modular grid of panels, assembling into alignment.
const kuechenmontage: Scene = ({ active }) => {
  const cells = [
    { x: 60, y: 60 }, { x: 160, y: 60 }, { x: 260, y: 60 },
    { x: 60, y: 160 }, { x: 160, y: 160 }, { x: 260, y: 160 },
    { x: 60, y: 260 }, { x: 160, y: 260 }, { x: 260, y: 260 },
  ];
  return (
    <>
      {cells.map((cell, i) => (
        <motion.rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={80}
          height={80}
          fill="none"
          stroke={i === 4 ? STROKE_ACCENT : STROKE}
          strokeWidth={1}
          initial={false}
          animate={{
            opacity: active ? 1 : 0,
            scale: active ? 1 : 0.85,
          }}
          style={{ transformOrigin: `${cell.x + 40}px ${cell.y + 40}px` }}
          transition={{ duration: 0.7, delay: active ? i * 0.035 : 0, ease: EASE }}
        />
      ))}
    </>
  );
};

// Möbelmontage — crossing assembly axes converging to one fixed point.
const moebelmontage: Scene = ({ active }) => {
  const lines = [
    { x1: 80, y1: 80, x2: 200, y2: 200 },
    { x1: 320, y1: 80, x2: 200, y2: 200 },
    { x1: 80, y1: 320, x2: 200, y2: 200 },
    { x1: 320, y1: 320, x2: 200, y2: 200 },
  ];
  return (
    <>
      {lines.map((l, i) => (
        <motion.line
          key={i}
          {...l}
          stroke={i === 0 ? STROKE_ACCENT : STROKE}
          strokeWidth={1}
          initial={false}
          animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
          style={{ transformOrigin: "200px 200px" }}
          transition={{ duration: 0.7, delay: active ? i * 0.06 : 0, ease: EASE }}
        />
      ))}
      <motion.circle
        cx={200}
        cy={200}
        r={5}
        fill={STROKE_ACCENT}
        initial={false}
        animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.5 }}
        style={{ transformOrigin: "200px 200px" }}
        transition={{ duration: 0.5, delay: active ? 0.3 : 0, ease: EASE }}
      />
    </>
  );
};

// Demontage — lines radiating outward from center, coming apart.
const demontage: Scene = ({ active }) => {
  const rays = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  return (
    <>
      {rays.map((angle, i) => {
        const x2 = 200 + Math.cos(angle) * 140;
        const y2 = 200 + Math.sin(angle) * 140;
        return (
          <motion.line
            key={i}
            x1={200}
            y1={200}
            x2={x2}
            y2={y2}
            stroke={i === 0 ? STROKE_ACCENT : STROKE}
            strokeWidth={1}
            initial={false}
            animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.4 }}
            style={{ transformOrigin: "200px 200px" }}
            transition={{ duration: 0.8, delay: active ? i * 0.03 : 0, ease: EASE }}
          />
        );
      })}
    </>
  );
};

// Umzug/Möbeltransport — parallel directional trajectory lines.
const umzugMoebeltransport: Scene = ({ active }) => {
  const rows = [90, 150, 210, 270, 330];
  return (
    <>
      {rows.map((y, i) => (
        <motion.line
          key={i}
          x1={40}
          y1={y}
          x2={360}
          y2={y}
          stroke={i === 2 ? STROKE_ACCENT : STROKE}
          strokeWidth={1}
          initial={false}
          animate={{ opacity: active ? 1 : 0, x: active ? 0 : -40 }}
          transition={{ duration: 0.8, delay: active ? i * 0.05 : 0, ease: EASE }}
        />
      ))}
    </>
  );
};

// Entrümpelung — dense grid of points clearing to sparse, left to right.
const entruempelung: Scene = ({ active }) => {
  const dots: { x: number; y: number }[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      dots.push({ x: 70 + col * 52, y: 70 + row * 52 });
    }
  }
  return (
    <>
      {dots.map((d, i) => {
        const col = i % 6;
        const survives = col < 2;
        return (
          <motion.circle
            key={i}
            cx={d.x}
            cy={d.y}
            r={survives ? 3 : 2}
            fill={survives ? STROKE_ACCENT : STROKE}
            initial={false}
            animate={{ opacity: active ? (survives ? 1 : 0.5) : 0, scale: active ? 1 : 0.3 }}
            style={{ transformOrigin: `${d.x}px ${d.y}px` }}
            transition={{ duration: 0.6, delay: active ? (col + Math.floor(i / 6)) * 0.02 : 0, ease: EASE }}
          />
        );
      })}
    </>
  );
};

// Reinigung — concentric clean radial rings.
const reinigung: Scene = ({ active }) => {
  const rings = [50, 90, 130, 170];
  return (
    <>
      {rings.map((r, i) => (
        <motion.circle
          key={i}
          cx={200}
          cy={200}
          r={r}
          fill="none"
          stroke={i === 1 ? STROKE_ACCENT : STROKE}
          strokeWidth={1}
          initial={false}
          animate={{ opacity: active ? 1 - i * 0.12 : 0, scale: active ? 1 : 0.6 }}
          style={{ transformOrigin: "200px 200px" }}
          transition={{ duration: 0.8, delay: active ? i * 0.08 : 0, ease: EASE }}
        />
      ))}
    </>
  );
};

const fallback: Scene = ({ active }) => (
  <motion.rect
    x={100}
    y={100}
    width={200}
    height={200}
    fill="none"
    stroke={STROKE_ACCENT}
    strokeWidth={1}
    initial={false}
    animate={{ opacity: active ? 1 : 0, scale: active ? 1 : 0.9 }}
    style={{ transformOrigin: "200px 200px" }}
    transition={{ duration: 0.6, ease: EASE }}
  />
);

const SCENES: Record<string, Scene> = {
  kuechenmontage,
  moebelmontage,
  demontage,
  "umzug-moebeltransport": umzugMoebeltransport,
  entruempelung,
  reinigung,
  default: fallback,
};
