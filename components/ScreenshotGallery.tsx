"use client";

import { useRef } from "react";
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

  function scrollStrip(dir: "left" | "right") {
    if (!stripRef.current) return;
    stripRef.current.scrollBy({
      left: dir === "right" ? 340 : -340,
      behavior: "smooth",
    });
  }

  const [hero, ...rest] = screenshots;
  if (!hero) return null;

  return (
    <section className="flex flex-col gap-5">
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
        <ScreenshotSlot src={hero.src} alt={hero.alt} caption={hero.caption} aspect="aspect-[16/9]" />
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
                />
              </GlassTiltCard>
            </div>
          ))}
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
}: {
  src: string;
  alt: string;
  caption?: string;
  aspect: string;
}) {
  return (
    <div>
      <div className={`relative w-full ${aspect} overflow-hidden bg-navy/5 dark:bg-white/5`}>
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className="absolute inset-0 w-full h-full object-cover object-top"
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
        <div className="px-4 py-2.5 border-t border-ink/8 dark:border-canvas/8">
          <p className="text-xs text-ink/55 dark:text-canvas/55">{caption}</p>
        </div>
      )}
    </div>
  );
}
