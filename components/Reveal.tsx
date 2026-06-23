"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  blur?: boolean;
}

/**
 * Scroll-triggered reveal with blur-fade-up entry (high-end-visual-design pattern).
 * Uses Motion whileInView — no window.scroll listeners.
 * blur=true adds `filter: blur(8px)` to the initial state for premium glass-reveal feel.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 22,
  blur = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" }
      }
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{
        duration: 0.75,
        delay,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
