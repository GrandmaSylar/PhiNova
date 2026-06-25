"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { GlassTiltCard } from "./GlassTiltCard";
import { Monitor, CaretLeft, CaretRight } from "@phosphor-icons/react";

export interface Screenshot {
  /**
   * Path relative to /public (e.g. "/screenshots/invitro-dashboard.png")
   * or an absolute URL. Leave as empty string ("") to show a placeholder.
   */
  src: string;
  /** Shown as the placeholder label and image alt text */
  alt: string;
  /** Short caption displayed below the image */
  caption?: string;
}

interface ScreenshotGalleryProps {
  screenshots: Screenshot[];
  heading?: string;
}

/**
 * Hero screenshot + scrollable strip of secondary screenshots.
 * Replace empty src strings with real image paths to activate each slot.
 */
export function ScreenshotGallery({
  screenshots,
  heading = "Product overview",
}: ScreenshotGalleryProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const [activeOverlay, setActiveOverlay] = useState<{ src: string; alt: string; caption?: string } | null>(null);
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);

  function scrollStrip(dir: "left" | "right") {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  }

  const startLongPress = (src: string, alt: string, caption?: string) => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    longPressTimeout.current = setTimeout(() => {
      setActiveOverlay({ src, alt, caption });
    }, 350); // 350ms long press activation
  };

  const endLongPress = () => {
    if (longPressTimeout.current) clearTimeout(longPressTimeout.current);
    setActiveOverlay(null);
  };

  const handlePointerEnter = (e: React.PointerEvent, src: string, alt: string, caption?: string) => {
    if (e.pointerType === "mouse") {
      setActiveOverlay({ src, alt, caption });
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") {
      setActiveOverlay(null);
    }
  };

  const handleTouchStart = (src: string, alt: string, caption?: string) => {
    startLongPress(src, alt, caption);
  };

  const handleTouchEnd = () => {
    endLongPress();
  };

  const [hero, ...rest] = screenshots;
  if (!hero) return null;

  return (
    <section className="flex flex-col gap-5 relative">
      <div className="pl-1 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas">
          {heading}
        </h2>
        {rest.length > 0 && (
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              onClick={() => scrollStrip("left")}
              aria-label="Scroll screenshots left"
              className="flex items-center justify-center w-8 h-8 rounded-full glass glass-interactive text-ink dark:text-canvas transition-transform hover:scale-105 active:scale-95"
            >
              <CaretLeft size={14} weight="bold" />
            </button>
            <button
              onClick={() => scrollStrip("right")}
              aria-label="Scroll screenshots right"
              className="flex items-center justify-center w-8 h-8 rounded-full glass glass-interactive text-ink dark:text-canvas transition-transform hover:scale-105 active:scale-95"
            >
              <CaretRight size={14} weight="bold" />
            </button>
          </div>
        )}
      </div>

      {/* Hero — large primary screenshot */}
      <GlassTiltCard className="overflow-hidden" maxTilt={2}>
        <ScreenshotSlot
          src={hero.src}
          alt={hero.alt}
          caption={hero.caption}
          aspect="aspect-[16/9]"
          onPointerEnter={(e) => handlePointerEnter(e, hero.src, hero.alt, hero.caption)}
          onPointerLeave={handlePointerLeave}
          onTouchStart={() => handleTouchStart(hero.src, hero.alt, hero.caption)}
          onTouchEnd={handleTouchEnd}
        />
      </GlassTiltCard>

      {/* Secondary screenshots — horizontal scroll strip */}
      {rest.length > 0 && (
        <div
          ref={stripRef}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-1"
          style={{ scrollbarWidth: "none" }}
        >
          {rest.map((shot, i) => (
            <div key={i} className="snap-start shrink-0 w-[min(360px,82vw)]">
              <GlassTiltCard className="overflow-hidden" maxTilt={5}>
                <ScreenshotSlot
                  src={shot.src}
                  alt={shot.alt}
                  caption={shot.caption}
                  aspect="aspect-[4/3]"
                  onPointerEnter={(e) => handlePointerEnter(e, shot.src, shot.alt, shot.caption)}
                  onPointerLeave={handlePointerLeave}
                  onTouchStart={() => handleTouchStart(shot.src, shot.alt, shot.caption)}
                  onTouchEnd={handleTouchEnd}
                />
              </GlassTiltCard>
            </div>
          ))}
        </div>
      )}

      {/* Enlarged Premium Overlay */}
      {activeOverlay && activeOverlay.src && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none transition-all duration-300 animate-in fade-in"
          style={{ pointerEvents: "none" }}
        >
          <div className="relative w-[92vw] h-[75vh] flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-5xl transition-transform duration-300 scale-100 animate-in zoom-in-95">
              <Image
                src={activeOverlay.src}
                alt={activeOverlay.alt}
                className="object-contain"
                fill
                priority
              />
            </div>
          </div>
          {activeOverlay.caption && (
            <p className="mt-4 text-xs font-semibold text-white/90 px-5 py-2.5 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm shadow-xl animate-in slide-in-from-bottom-2">
              {activeOverlay.caption}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

/* ── Slot — real image or styled placeholder ─────────────────────────── */

function ScreenshotSlot({
  src,
  alt,
  caption,
  aspect,
  onPointerEnter,
  onPointerLeave,
  onTouchStart,
  onTouchEnd,
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect: string;
  onPointerEnter: (e: React.PointerEvent) => void;
  onPointerLeave: (e: React.PointerEvent) => void;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}) {
  return (
    <div
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      className="cursor-zoom-in"
    >
      <div className={`relative w-full ${aspect} overflow-hidden bg-navy/5 dark:bg-white/5`}>
        {src ? (
          <Image
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-500 hover:scale-[1.02]"
            fill
            sizes="(max-w-768px) 100vw, (max-w-1200px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder — visible until a real src is supplied */
          <div className="absolute inset-3 rounded-[calc(var(--radius-panel)-10px)] border-2 border-dashed border-steel/25 flex flex-col items-center justify-center gap-3 p-4">
            <Monitor size={30} weight="duotone" className="text-steel/40 shrink-0" />
            <p className="text-xs text-center text-ink/40 dark:text-canvas/40 font-medium leading-snug max-w-[22ch]">
              {alt}
            </p>
          </div>
        )}
      </div>
      {caption && (
        <div className="px-4 py-2.5 border-t border-ink/8 dark:border-canvas/8 bg-white/5">
          <p className="text-xs text-ink/55 dark:text-canvas/55">{caption}</p>
        </div>
      )}
    </div>
  );
}
