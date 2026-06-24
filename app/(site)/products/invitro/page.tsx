import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { MagneticLink } from "@/components/MagneticButton";
import { ScreenshotGallery, type Screenshot } from "@/components/ScreenshotGallery";
import { IMAGES } from "@/lib/images";
import { safeFetch } from "@/lib/sanity/client";
import { PRODUCT_QUERY, type SanityProduct } from "@/lib/sanity/queries";
import {
  Flask,
  ArrowRight,
  ArrowUpRight,
  WifiX,
  Barcode,
  Printer,
  FileText,
  Key,
  HeadCircuit,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 60;

export async function generateMetadata() {
  const cmsData = await safeFetch<SanityProduct>(PRODUCT_QUERY, { productId: "invitro" });
  return {
    title: cmsData?.metaTitle || "Invitro LIMS - PhiNova",
    description: cmsData?.metaDescription || "Clinical-grade laboratory information management system. Built to operate online-first with local SQLite backup so your lab never halts.",
  };
}

/**
 * SCREENSHOTS — add your image paths here.
 * Place files in /public/screenshots/ and update src below.
 * Example: src: "/screenshots/invitro-dashboard.png"
 * Leave src as "" to keep the labelled placeholder visible.
 */
const SCREENSHOTS: Screenshot[] = [
  {
    src: "",
    alt: "Main dashboard — patient queue and daily test statistics",
    caption: "Dashboard",
  },
  {
    src: "",
    alt: "Sample intake — barcode scan and patient registration form",
    caption: "Sample intake",
  },
  {
    src: "",
    alt: "Result entry — structured test parameters and validation workflow",
    caption: "Result entry",
  },
  {
    src: "",
    alt: "Patient report — formatted result slip ready for printing",
    caption: "Patient report",
  },
  {
    src: "",
    alt: "Audit log — full timestamped action history per sample",
    caption: "Audit log",
  },
];

const FEATURES = [
  {
    icon: Barcode,
    title: "Sample intake and barcoding",
    body: "Register samples, assign barcodes, and track specimen chain-of-custody from the moment a patient arrives.",
  },
  {
    icon: FileText,
    title: "Result entry and release",
    body: "Enter, validate, and release results with a structured review workflow. Every result carries a complete audit trail.",
  },
  {
    icon: WifiX,
    title: "Offline-resilient by design",
    body: "A local SQLite database ensures the lab operates at full capacity regardless of internet availability. Sync is automatic on reconnection.",
  },
  {
    icon: Printer,
    title: "Thermal receipt printing",
    body: "Print result slips and patient receipts directly from the system with compatible thermal printers.",
  },
  {
    icon: Key,
    title: "Full audit log and export",
    body: "Every action is timestamped and attributed. Export audit logs for compliance, accreditation, or management review.",
  },
  {
    icon: HeadCircuit,
    title: "API access",
    body: "Professional tier and above includes API access for integration with billing systems, referral platforms, and hospital networks.",
  },
];

const PRICING = [
  {
    tier: "Basic",
    price: "GH₵499",
    period: "/mo",
    users: "Up to 3 users",
    popular: false,
    features: [
      "Sample intake and barcoding",
      "Result entry and release",
      "Basic audit log",
      "Offline-resilient SQLite",
      "Email support",
    ],
  },
  {
    tier: "Professional",
    price: "GH₵999",
    period: "/mo",
    users: "Up to 10 users",
    popular: true,
    features: [
      "Everything in Basic",
      "Custom test panels",
      "Advanced workflows",
      "Full audit log and export",
      "API access",
      "Priority support",
    ],
  },
  {
    tier: "Enterprise",
    price: "Custom",
    period: "",
    users: "Unlimited users",
    popular: false,
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Dedicated sync infrastructure",
      "SLA guarantee",
      "On-site training",
    ],
  },
];

export default async function InvitroPage() {
  const cmsData = await safeFetch<SanityProduct>(PRODUCT_QUERY, { productId: "invitro" });

  const screenshots: Screenshot[] =
    cmsData?.screenshots?.length
      ? cmsData.screenshots.map((s) => ({ src: s.asset.url, alt: s.alt ?? "", caption: s.caption }))
      : SCREENSHOTS;

  const features =
    cmsData?.featuresList?.length
      ? cmsData.featuresList.map((f, i) => ({
          icon: FEATURES[i]?.icon || FEATURES[0].icon,
          title: f.title,
          body: f.description,
        }))
      : FEATURES;

  const pricing =
    cmsData?.pricingPlans?.length
      ? cmsData.pricingPlans.map((p) => ({
          tier: p.tier,
          price: p.price,
          period: p.period ?? "",
          users: p.subtext ?? "",
          popular: p.popular ?? false,
          features: p.features ?? [],
        }))
      : PRICING;

  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Hero */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row gap-10 items-start" maxTilt={3}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <Flask size={28} weight="duotone" className="text-steel" />
                <span className="text-sm font-semibold text-steel-dark dark:text-steel">Invitro LIMS</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-ink dark:text-canvas">
                {cmsData?.heroTitle || "Your lab, working even when the internet is not"}
              </h1>
              <p className="mt-5 text-base text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[48ch]">
                {cmsData?.heroSubtitle || "Clinical-grade laboratory management system built to operate online-first with a local SQLite backup so your lab never halts. 223 clinical tests, 329 parameters, and a full audit trail from intake to release."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <MagneticLink
                  href="/contact"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-ink transition-colors active:scale-[0.97]"
                >
                  Request a demo
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
                    <ArrowRight size={10} weight="bold" />
                  </span>
                </MagneticLink>
              </div>
            </div>
            <div className="md:w-80 w-full rounded-[calc(var(--radius-panel)-4px)] overflow-hidden shrink-0 group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cmsData?.heroImage?.asset?.url || IMAGES.labHero}
                alt="Clinical laboratory equipment and test samples"
                className="w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                width={640}
                height={480}
              />
            </div>
          </GlassTiltCard>
        </Reveal>

        {/* Problem statement */}
        <Reveal>
          <GlassTiltCard className="px-8 py-10 md:px-12 max-w-3xl" maxTilt={4}>
            <h2 className="text-xl font-semibold tracking-tight text-ink dark:text-canvas mb-3">
              {cmsData?.problemTitle || "Labs in Ghana cannot rely on stable connectivity"}
            </h2>
            <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[52ch]">
              {cmsData?.problemDescription || "Power cuts, ISP outages, and unreliable mobile data mean a cloud-only lab system is a risk. Invitro LIMS stores everything locally first, syncs to the cloud as a secondary layer, and never forces your staff to stop working because the internet is down."}
            </p>
          </GlassTiltCard>
        </Reveal>

        {/* Screenshots */}
        <Reveal>
          <ScreenshotGallery screenshots={screenshots} heading="See Invitro LIMS in action" />
        </Reveal>

        {/* Features grid */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-12" maxTilt={2}>
            <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas mb-10">
              Built for every stage of the test cycle
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map(({ icon: Icon, title, body }) => (
                <div key={title} className="group flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 cursor-default">
                  <Icon size={24} weight="duotone" className="text-steel shrink-0 transition-transform duration-300 group-hover:scale-110" />
                  <h3 className="text-sm font-semibold text-ink dark:text-canvas">{title}</h3>
                  <p className="text-sm text-ink/60 dark:text-canvas/60 leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </GlassTiltCard>
        </Reveal>

        {/* Pricing */}
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas mb-6 pl-1">
            Pricing
          </h2>
          <GlassTiltCard className="px-6 py-8 md:px-8" maxTilt={1}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pricing.map(({ tier, price, period, users, popular, features }) => (
                <PricingCard
                  key={tier}
                  tier={tier}
                  price={price}
                  period={period}
                  users={users}
                  popular={popular}
                  features={features}
                />
              ))}
            </div>
          </GlassTiltCard>
        </Reveal>

        {/* CTA */}
        <Reveal>
          <GlassTiltCard
            className="px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-5"
            maxTilt={2}
            bezel
          >
            <div>
              <h2 className="text-xl font-semibold text-ink dark:text-canvas">Ready to start?</h2>
              <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">Contact us for a walkthrough or to get your lab onboarded.</p>
            </div>
            <MagneticLink
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-ink transition-colors active:scale-[0.97]"
            >
              Get in touch
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
                <ArrowUpRight size={10} weight="bold" />
              </span>
            </MagneticLink>
          </GlassTiltCard>
        </Reveal>
      </div>
    </div>
  );
}

function PricingCard({
  tier,
  price,
  period,
  users,
  popular,
  features,
}: {
  tier: string;
  price: string;
  period: string;
  users: string;
  popular: boolean;
  features: string[];
}) {
  return (
    <div
      className={`
        flex flex-col rounded-[calc(var(--radius-panel)-4px)] p-6 gap-5
        glass-interactive transition-transform duration-300 hover:scale-[1.015]
        ${popular
          ? "bg-navy/10 dark:bg-steel/10 border border-steel/40 shadow-[0_0_0_1px_rgba(110,151,192,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] scale-[1.02]"
          : "bg-white/20 dark:bg-white/5 border border-white/25 dark:border-white/10"
        }
      `}
    >
      {popular && (
        <span className="inline-flex self-start px-2.5 py-1 rounded-full bg-steel/20 text-steel-dark dark:text-steel text-xs font-semibold">
          Most popular
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-ink/50 dark:text-canvas/50">{tier}</p>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-3xl font-bold tracking-tight text-ink dark:text-canvas">{price}</span>
          {period && <span className="text-sm text-ink/50 dark:text-canvas/50">{period}</span>}
        </div>
        <p className="text-xs text-ink/50 dark:text-canvas/50 mt-1">{users}</p>
      </div>

      <ul className="flex flex-col gap-2 text-sm flex-1">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-ink/70 dark:text-canvas/70">
            <span className="text-steel mt-0.5 shrink-0">&#10003;</span>
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/contact"
        className={`
          inline-flex items-center justify-center py-2.5 px-4 rounded-full text-sm font-semibold transition-colors active:scale-[0.97]
          ${popular
            ? "bg-navy text-white hover:bg-ink"
            : "bg-navy/10 dark:bg-white/10 text-navy dark:text-canvas hover:bg-navy/20 dark:hover:bg-white/15"
          }
        `}
      >
        {price === "Custom" ? "Contact us" : "Get started"}
      </Link>
    </div>
  );
}
