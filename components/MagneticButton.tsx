"use client";

import Link from "next/link";
import { useRef, type ReactNode, type PointerEvent as ReactPointerEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from "motion/react";

const MotionLink = motion(Link);

const SPRING = { stiffness: 220, damping: 18, mass: 0.5 };

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

interface MagneticLinkProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  href: string;
}

export function MagneticButton({
  children,
  className = "",
  strength = 6,
  onClick,
  type = "button",
  disabled = false,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || disabled || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left - r.width / 2) / r.width) * strength * 2);
    rawY.set(((e.clientY - r.top - r.height / 2) / r.height) * strength * 2);
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={reduce ? {} : { x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="inline-flex"
    >
      <motion.button
        type={type}
        onClick={onClick}
        disabled={disabled}
        whileTap={reduce || disabled ? {} : { scale: 0.95 }}
        className={className}
      >
        {children}
      </motion.button>
    </motion.div>
  );
}

export function MagneticLink({
  children,
  className = "",
  strength = 6,
  href,
}: MagneticLinkProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left - r.width / 2) / r.width) * strength * 2);
    rawY.set(((e.clientY - r.top - r.height / 2) / r.height) * strength * 2);
  }

  function handlePointerLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.div
      ref={ref}
      style={reduce ? {} : { x, y }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="inline-flex"
    >
      <MotionLink
        href={href}
        whileTap={reduce ? {} : { scale: 0.95 }}
        className={className}
      >
        {children}
      </MotionLink>
    </motion.div>
  );
}
