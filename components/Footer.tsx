import Link from "next/link";
import Image from "next/image";
import { PhiLogo } from "./PhiLogo";
import { GlassTiltCard } from "./GlassTiltCard";
import { type SanitySettings } from "@/lib/sanity/queries";

const PRODUCTS = [
  { href: "/products/invitro", label: "Invitro LIMS" },
  { href: "/products/cocm", label: "COCM" },
  { href: "/products/concord", label: "Concord SMS" },
];

const COMPANY = [
  { href: "/products", label: "Products" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

export default function Footer({ settings }: { settings?: SanitySettings | null }) {
  return (
    <footer className="relative mt-24 px-4 pb-8" style={{ zIndex: "var(--z-content)" }}>
      <GlassTiltCard className="max-w-6xl mx-auto px-8 py-10" maxTilt={1}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand column */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
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
              <span className="text-[15px] font-semibold tracking-tight text-ink dark:text-canvas">
                {settings?.siteName || "PhiNova"}
              </span>
            </div>
            <p className="text-sm text-ink/60 dark:text-canvas/60 leading-relaxed max-w-[280px]">
              Systems development for institutions that cannot afford downtime.
              Architecting Digital Solutions since 2022.
            </p>
            <p className="mt-4 text-xs text-ink/40 dark:text-canvas/40">
              &copy; {new Date().getFullYear()} PhiNova. All rights reserved.
            </p>
          </div>

          {/* Products */}
          <div>
            <p className="text-xs font-semibold text-ink/40 dark:text-canvas/40 uppercase tracking-[0.14em] mb-4">
              Products
            </p>
            <ul className="flex flex-col gap-2.5">
              {PRODUCTS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink/70 dark:text-canvas/70 hover:text-ink dark:hover:text-canvas transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-ink/40 dark:text-canvas/40 uppercase tracking-[0.14em] mb-4">
              Company
            </p>
            <ul className="flex flex-col gap-2.5">
              {COMPANY.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-ink/70 dark:text-canvas/70 hover:text-ink dark:hover:text-canvas transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-xs font-semibold text-ink/40 dark:text-canvas/40 uppercase tracking-[0.14em] mb-3">
                Contact
              </p>
              <a
                href={`mailto:${settings?.contactEmail || "info@phinova.dev"}`}
                className="text-sm text-steel-dark dark:text-steel hover:underline transition-all duration-200"
              >
                {settings?.contactEmail || "info@phinova.dev"}
              </a>
            </div>
          </div>
        </div>
      </GlassTiltCard>
    </footer>
  );
}
