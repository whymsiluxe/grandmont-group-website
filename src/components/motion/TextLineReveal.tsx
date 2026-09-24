"use client";

import { motion, useReducedMotion, type Transition } from "motion/react";

const EASE: Transition["ease"] = [0.16, 1, 0.3, 1];

/**
 * Headline reveal — each line masked and slid up on scroll-into-view.
 * Split by caller into an array of lines (not auto-split from a string,
 * to keep control over line breaks across DE/EN copy of different length).
 */
export function TextLineReveal({
  lines,
  className,
  lineClassName,
}: {
  lines: string[];
  className?: string;
  lineClassName?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={line} className="block overflow-hidden">
          <motion.span
            className={lineClassName}
            style={{ display: "block" }}
            initial={{ y: reduceMotion ? 0 : "100%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.7,
              delay: reduceMotion ? 0 : i * 0.08,
              ease: EASE,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
