"use client";

import {
  useRef,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";

interface GlassTiltCardProps {
  children: ReactNode;
  className?: string;
  /** Max tilt degrees (default 7) */
  maxTilt?: number;
  /** Whether to show the Double-Bezel outer shell */
  bezel?: boolean;
}

const SPRING = { stiffness: 280, damping: 28, mass: 0.6 };

/**
 * Glass panel with:
 * - 3D cursor-tracking tilt (spring physics, Motion useMotionValue)
 * - Cursor-following radial refraction highlight
 * - Shimmer sweep on hover
 * - Double-Bezel architecture from high-end-visual-design skill
 *
 * Uses Motion useMotionValue — never setState for continuous pointer values.
 */
export function GlassTiltCard({
  children,
  className = "",
  maxTilt = 7,
  bezel = false,
}: GlassTiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  /* Raw normalised mouse position (-0.5 → 0.5) */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  /* Cursor position for highlight (0 → 100%) */
  const hlX = useTransform(rawX, [-0.5, 0.5], [0, 100]);
  const hlY = useTransform(rawY, [-0.5, 0.5], [0, 100]);

  /* Sprung rotation */
  const rotX = useSpring(
    useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    SPRING
  );
  const rotY = useSpring(
    useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    SPRING
  );

  /* Refraction gradient that follows cursor */
  const gradient = useTransform(
    [hlX, hlY],
    ([x, y]: number[]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.20) 0%, transparent 55%)`
  );

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set((e.clientX - r.left) / r.width - 0.5);
    rawY.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  const card = (
    <motion.div
      ref={ref}
      className={`glass glass-interactive relative overflow-hidden ${className}`}
      style={
        reduce
          ? {}
          : {
              rotateX: rotX,
              rotateY: rotY,
              transformStyle: "preserve-3d",
              transformPerspective: 900,
            }
      }
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      whileHover={reduce ? {} : { scale: 1.012 }}
      whileTap={reduce ? {} : { scale: 0.985 }}
      transition={{ type: "spring", stiffness: 340, damping: 32 }}
    >
      {/* Cursor refraction highlight overlay */}
      {!reduce && (
        <motion.div
          className="absolute inset-0 pointer-events-none z-10"
          style={{ background: gradient, borderRadius: "inherit" }}
        />
      )}
      {children}
    </motion.div>
  );

  if (!bezel) return card;

  /* Double-Bezel outer shell — from high-end-visual-design skill */
  return (
    <div className="p-[5px] rounded-[calc(var(--radius-panel)+5px)] bg-white/8 border border-white/10 shadow-[0_2px_8px_rgba(27,44,79,0.08)]">
      {card}
    </div>
  );
}
