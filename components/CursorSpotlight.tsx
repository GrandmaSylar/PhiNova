"use client";

import { useEffect } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

/**
 * Full-page ambient glow that lazily follows the cursor.
 * Sits at z-index -1 (above background video, below glass panels) so the
 * spotlight is blurred by each panel's backdrop-filter — the glass itself
 * glows wherever the cursor rests.
 */
export function CursorSpotlight() {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(-800);
  const rawY = useMotionValue(-800);

  const x = useSpring(rawX, { stiffness: 55, damping: 22, mass: 1.2 });
  const y = useSpring(rawY, { stiffness: 55, damping: 22, mass: 1.2 });

  const spotX = useTransform(x, (v) => v - 400);
  const spotY = useTransform(y, (v) => v - 400);

  useEffect(() => {
    if (reduce) return;
    function onMove(e: MouseEvent) {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, reduce]);

  if (reduce) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0"
      style={{
        width: 800,
        height: 800,
        borderRadius: "50%",
        x: spotX,
        y: spotY,
        zIndex: -1,
        background:
          "radial-gradient(circle, var(--spotlight-color) 0%, transparent 65%)",
      }}
    />
  );
}
