"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useTheme } from "./ThemeProvider";

const DEFAULT_DAY_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-a-mountain-landscape-5070-large.mp4";
const DEFAULT_NIGHT_VIDEO =
  "https://assets.mixkit.co/videos/preview/mixkit-stars-in-night-sky-1341-large.mp4";

const DEFAULT_DAY_POSTER = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=1080&fit=crop&q=80";
const DEFAULT_NIGHT_POSTER = "https://images.unsplash.com/photo-1475274047050-1d0c0975864c?w=1920&h=1080&fit=crop&q=80";

interface BackgroundMediaProps {
  dayVideoUrl?: string | null;
  nightVideoUrl?: string | null;
  dayImageUrl?: string | null;
  nightImageUrl?: string | null;
}

export default function BackgroundMedia({
  dayVideoUrl,
  nightVideoUrl,
  dayImageUrl,
  nightImageUrl,
}: BackgroundMediaProps) {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const dayRef = useRef<HTMLVideoElement>(null);
  const nightRef = useRef<HTMLVideoElement>(null);

  const dayVideo = dayVideoUrl ?? DEFAULT_DAY_VIDEO;
  const nightVideo = nightVideoUrl ?? DEFAULT_NIGHT_VIDEO;
  const dayPoster = dayImageUrl ?? DEFAULT_DAY_POSTER;
  const nightPoster = nightImageUrl ?? DEFAULT_NIGHT_POSTER;

  useEffect(() => {
    if (reduce) return;
    dayRef.current?.play().catch(() => {});
    nightRef.current?.play().catch(() => {});
  }, [reduce]);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: "var(--z-bg)" }}
      aria-hidden="true"
    >
      {/* Day layer */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: theme === "day" ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.32, 0.72, 0, 1] }}
      >
        {reduce ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dayPoster} alt="" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={dayRef}
            src={dayVideo}
            poster={dayPoster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-white/12" />
      </motion.div>

      {/* Night layer */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: theme === "night" ? 1 : 0 }}
        transition={{ duration: 1.6, ease: [0.32, 0.72, 0, 1] }}
      >
        {reduce ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={nightPoster} alt="" className="w-full h-full object-cover" />
        ) : (
          <video
            ref={nightRef}
            src={nightVideo}
            poster={nightPoster}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[#020a18]/55" />
      </motion.div>
    </div>
  );
}
