"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useMotionValueEvent,
} from "motion/react";
import { PhiLogo } from "./PhiLogo";
import { type SanitySettings } from "@/lib/sanity/queries";
import ThemeToggle from "./ThemeToggle";

const NAV_LINKS = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar({ settings }: { settings?: SanitySettings | null }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  /* Motion useScroll — no window.addEventListener("scroll") */
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 16));

  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setMenuOpen(false);
  }

  /* Lock body scroll when menu open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header
      className="fixed top-0 inset-x-0 flex justify-center px-4 pt-4"
      style={{ zIndex: "var(--z-sticky)" }}
    >
      {/* Glass nav pill — single line ≤72px high */}
      <nav
        className={`
          glass w-full max-w-6xl flex items-center justify-between
          px-5 h-[68px] transition-all duration-500
          ${scrolled ? "shadow-[0_8px_32px_rgba(27,44,79,0.15)]" : ""}
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 group"
          aria-label="PhiNova home"
        >
          <motion.span
            className="block"
            whileHover={reduce ? {} : { scale: 1.06 }}
            whileTap={reduce ? {} : { scale: 0.95 }}
            transition={{ type: "spring", stiffness: 380, damping: 26 }}
          >
            {settings?.logo?.asset?.url ? (
              <Image
                src={settings.logo.asset.url}
                alt={settings.siteName || "PhiNova"}
                className="h-8 w-auto object-contain rounded-md"
                width={128}
                height={32}
              />
            ) : (
              <PhiLogo size={32} />
            )}
          </motion.span>
          <span className="text-[15px] font-semibold tracking-tight text-ink dark:text-canvas hidden sm:block">
            {settings?.siteName || "PhiNova"}
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`
                    relative px-4 py-2 rounded-full text-sm font-medium
                    transition-colors duration-250
                    ${
                      active
                        ? "text-navy [data-theme=night]:text-steel"
                        : "text-ink/65 dark:text-canvas/65 hover:text-ink dark:hover:text-canvas"
                    }
                  `}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-steel/15"
                      transition={{ type: "spring", stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          <Link
            href="/contact"
            className="
              hidden md:inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
              bg-navy text-white text-sm font-semibold
              hover:bg-ink transition-colors duration-250 active:scale-[0.96]
            "
          >
            Get in touch
            {/* Button-in-Button icon — high-end-visual-design skill pattern */}
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
              <svg width="9" height="9" viewBox="0 0 9 9" fill="none" aria-hidden="true">
                <path d="M1 8L8 1M8 1H2M8 1V7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </Link>

          {/* Hamburger — morphs to X */}
          <button
            className="md:hidden p-2.5 rounded-full glass-interactive glass text-ink dark:text-canvas"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative flex items-center justify-center w-5 h-5">
              <motion.span
                className="absolute block h-[1.5px] bg-current rounded-full"
                style={{ width: 18 }}
                animate={menuOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
              <motion.span
                className="absolute block h-[1.5px] bg-current rounded-full"
                style={{ width: 18 }}
                animate={menuOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                transition={reduce ? { duration: 0 } : { duration: 0.2 }}
              />
              <motion.span
                className="absolute block h-[1.5px] bg-current rounded-full"
                style={{ width: 18 }}
                animate={menuOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 3.5 }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen overlay — staggered reveal */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-full h-[100vh] flex flex-col pt-24 pb-10 px-6 md:hidden touch-none"
            style={{
              zIndex: "var(--z-sticky)",
              backdropFilter: "blur(32px) saturate(180%)",
              WebkitBackdropFilter: "blur(32px) saturate(180%)",
              background: "var(--glass-bg)",
            }}
            initial={reduce ? false : { opacity: 0, clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at calc(100% - 3rem) 3rem)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at calc(100% - 3rem) 3rem)" }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* Staggered links */}
            <ul className="flex flex-col gap-1 mt-4">
              {NAV_LINKS.map(({ href, label }, i) => (
                <motion.li
                  key={href}
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.08 + i * 0.06,
                    duration: 0.5,
                    ease: [0.32, 0.72, 0, 1],
                  }}
                >
                  <Link
                    href={href}
                    className="block py-4 text-2xl font-semibold tracking-tight text-ink dark:text-canvas border-b border-ink/8 dark:border-canvas/8"
                  >
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>

            <motion.div
              className="mt-8"
              initial={reduce ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            >
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-full bg-navy text-white font-semibold text-base hover:bg-ink transition-colors"
              >
                Get in touch
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
