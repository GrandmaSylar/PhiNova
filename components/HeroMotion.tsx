"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

interface HeroMotionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Hero glass panel entry — scales + fades + blur clears on load.
 * Custom cubic-bezier matches the high-end-visual-design skill's fluid dynamics.
 */
export function HeroMotion({ children, className = "" }: HeroMotionProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={
        reduce
          ? false
          : { opacity: 0, y: 32, scale: 0.978, filter: "blur(12px)" }
      }
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{
        duration: 1.0,
        ease: [0.32, 0.72, 0, 1],
        delay: 0.08,
      }}
    >
      {children}
    </motion.div>
  );
}

interface HeroItemProps {
  children: ReactNode;
  delay?: number;
}

/** Individual hero text element with staggered entry */
export function HeroItem({ children, delay = 0 }: HeroItemProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 18, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{
        duration: 0.7,
        delay: 0.22 + delay,
        ease: [0.32, 0.72, 0, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
