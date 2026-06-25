"use client";

import { motion } from "motion/react";
import { PhiLogo } from "@/components/PhiLogo";

export default function Loading() {
  return (
    <div className="fixed inset-0 w-full h-[100dvh] flex flex-col items-center justify-center bg-[#020a18]/45 backdrop-blur-lg z-[9999] pointer-events-none">
      <div className="flex flex-col items-center gap-5">
        {/* Pulsing Monogram Logo */}
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 1.8,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="text-steel shrink-0"
        >
          <PhiLogo size={56} />
        </motion.div>

        {/* Dynamic Refraction Line Loader */}
        <div className="w-20 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
          <motion.div
            className="absolute top-0 bottom-0 left-0 w-1/2 bg-steel rounded-full"
            animate={{
              left: ["-50%", "100%"],
            }}
            transition={{
              duration: 1.2,
              ease: "easeInOut",
              repeat: Infinity,
            }}
          />
        </div>
      </div>
    </div>
  );
}
