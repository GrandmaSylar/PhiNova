"use client";

import { motion, useReducedMotion } from "motion/react";
import { Sun, Moon } from "@phosphor-icons/react";
import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const reduce = useReducedMotion();
  const isNight = theme === "night";

  return (
    <button
      onClick={toggle}
      aria-label={isNight ? "Switch to day mode" : "Switch to night mode"}
      className="
        relative flex items-center gap-1.5 px-3 h-9 rounded-full
        bg-white/15 dark:bg-white/10 border border-white/25
        text-ink dark:text-canvas hover:bg-white/25
        transition-colors duration-300 cursor-pointer
      "
      style={{ minWidth: 72 }}
    >
      {/* Track */}
      <motion.span
        className="absolute inset-[3px] rounded-full bg-navy/80"
        animate={{ x: isNight ? "calc(100% - 2px)" : 0 }}
        style={{ width: "calc(50% - 3px)" }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 32 }}
      />

      {/* Sun icon */}
      <span className="relative z-10 flex items-center justify-center w-[28px]">
        <Sun
          size={14}
          weight="fill"
          className={`transition-colors duration-300 ${!isNight ? "text-white" : "text-ink/50 dark:text-canvas/40"}`}
        />
      </span>

      {/* Moon icon */}
      <span className="relative z-10 flex items-center justify-center w-[28px]">
        <Moon
          size={14}
          weight="fill"
          className={`transition-colors duration-300 ${isNight ? "text-white" : "text-ink/50 dark:text-canvas/40"}`}
        />
      </span>
    </button>
  );
}
