"use client";

import Link from "next/link";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { ArrowLeft, House, EnvelopeSimple, AppWindow } from "@phosphor-icons/react";
import { motion } from "motion/react";

export default function NotFound() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center p-4 relative bg-[#020a18]">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#1b2c4f_0%,transparent_50%)] opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,#0a1424_0%,transparent_60%)] opacity-80 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
        className="w-full max-w-lg"
      >
        <GlassTiltCard className="p-8 md:p-12 text-center flex flex-col items-center gap-6" bezel>
          {/* Animated 404 Indicator */}
          <div className="relative">
            <span className="text-[120px] font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-steel/60 to-steel/10 select-none leading-none">
              404
            </span>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-canvas">
              Lost in transit
            </h1>
            <p className="text-sm text-canvas/60 leading-relaxed max-w-[32ch] mx-auto">
              The page you are looking for does not exist, or has been moved to a new system coordinate.
            </p>
          </div>

          {/* Navigation options */}
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-steel/10 text-steel hover:bg-steel/15 text-sm font-semibold border border-steel/20 transition-all active:scale-[0.97]"
            >
              <House size={16} />
              Back Home
            </Link>

            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-canvas text-navy hover:bg-canvas/90 text-sm font-semibold transition-all active:scale-[0.97]"
            >
              <AppWindow size={16} />
              Our Systems
            </Link>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-xs text-canvas/45 hover:text-canvas/70 transition-colors mt-2"
          >
            <EnvelopeSimple size={14} />
            Report system malfunction
          </Link>
        </GlassTiltCard>
      </motion.div>
    </div>
  );
}
