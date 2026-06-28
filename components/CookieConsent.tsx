"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { GlassTiltCard } from "./GlassTiltCard";
import { Cookie } from "@phosphor-icons/react";

export default function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if consent has already been given
    const consent = localStorage.getItem("phinova-cookie-consent");
    if (!consent) {
      // Delay showing it for visual entry elegance
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("phinova-cookie-consent", "accepted");
    window.dispatchEvent(new Event("phinova-consent-change"));
    setIsOpen(false);
  };

  const handleDecline = () => {
    localStorage.setItem("phinova-cookie-consent", "declined");
    window.dispatchEvent(new Event("phinova-consent-change"));
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 30, scale: 0.95 }}
          transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[380px] z-[999]"
        >
          <GlassTiltCard className="p-5 md:p-6 flex flex-col gap-4 shadow-2xl" maxTilt={3} bezel>
            <div className="flex gap-3 items-start">
              <span className="flex items-center justify-center p-2 rounded-lg bg-steel/15 text-steel shrink-0 mt-0.5">
                <Cookie size={20} weight="duotone" />
              </span>
              <div className="flex flex-col gap-1">
                <h3 className="text-sm font-semibold text-ink dark:text-canvas">
                  Cookie Preferences
                </h3>
                <p className="text-xs text-ink/60 dark:text-canvas/60 leading-relaxed">
                  We use cookies to analyze web traffic and optimize system performance. Learn more in our{" "}
                  <Link href="/privacy" className="text-steel underline hover:text-steel-dark transition-colors">
                    Privacy Policy
                  </Link>.
                </p>
              </div>
            </div>

            <div className="flex gap-2 justify-end mt-1">
              <button
                onClick={handleDecline}
                className="px-4 py-2 rounded-full hover:bg-ink/5 dark:hover:bg-white/5 text-xs font-medium text-ink/50 dark:text-canvas/50 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 rounded-full bg-navy dark:bg-canvas text-white dark:text-navy hover:bg-ink dark:hover:bg-canvas/90 text-xs font-semibold shadow-md active:scale-[0.97] transition-all"
              >
                Accept All
              </button>
            </div>
          </GlassTiltCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
