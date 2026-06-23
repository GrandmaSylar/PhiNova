import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { MagneticLink } from "@/components/MagneticButton";
import { ScreenshotGallery, type Screenshot } from "@/components/ScreenshotGallery";
import { IMAGES } from "@/lib/images";
import { safeFetch } from "@/lib/sanity/client";
import { PRODUCT_QUERY, type SanityProduct } from "@/lib/sanity/queries";
import {
  ChatText,
  ArrowRight,
  ArrowUpRight,
  Tag,
  CalendarBlank,
  Funnel,
  ChartBar,
  FileCsv,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 60;

export async function generateMetadata() {
  const cmsData = await safeFetch<SanityProduct>(PRODUCT_QUERY, { productId: "concord" });
  return {
    title: cmsData?.metaTitle || "Concord SMS - PhiNova",
    description: cmsData?.metaDescription || "Bulk messaging platform with personalised merge tags, scheduling, contact segmentation, and delivery reporting.",
  };
}

/**
 * SCREENSHOTS — add your image paths here.
 * Place files in /public/screenshots/ and update src below.
 * Example: src: "/screenshots/concord-dashboard.png"
 * Leave src as "" to keep the labelled placeholder visible.
 */
const SCREENSHOTS: Screenshot[] = [
  {
    src: "",
    alt: "Campaign dashboard — all campaigns with status and delivery stats",
    caption: "Dashboard",
  },
  {
    src: "",
    alt: "Message composer — merge tag insertion and live recipient preview",
    caption: "Composer",
  },
  {
    src: "",
    alt: "Contact list — imported contacts with segment filters applied",
    caption: "Contacts",
  },
  {
    src: "",
    alt: "Delivery report — send, delivered, and failed counts per campaign",
    caption: "Delivery report",
  },
  {
    src: "",
    alt: "Schedule view — upcoming and recurring campaign calendar",
    caption: "Schedule",
  },
];

const FEATURES = [
  {
    icon: Tag,
    title: "Personalised merge tags",
    body: "Address every recipient by name. Insert any field from your contact list into the message body automatically.",
  },
  {
    icon: CalendarBlank,
    title: "Campaign scheduling",
    body: "Queue campaigns for any future date and time. Set recurring reminders for regular outreach cycles.",
  },
  {
    icon: Funnel,
    title: "Contact segmentation",
    body: "Filter your contact list by any combination of fields before sending. Reach the right people, not everyone.",
  },
  {
    icon: ChartBar,
    title: "Delivery reporting",
    body: "Track sends, deliveries, and failures per campaign. Identify unreachable numbers and keep your list clean.",
  },
  {
    icon: FileCsv,
    title: "Excel import",
    body: "Upload your contact list as a CSV or Excel file. The system normalises phone numbers and removes duplicates automatically.",
  },
  {
    icon: ShieldCheck,
    title: "Developer access",
    body: "Scale tier and above includes a developer portal with API access for building custom integrations and automation.",
  },
];

const PRICING = [
  {
    tier: "Starter",
    price: "GH₵149",
    sms: "5,000 SMS/mo",
    use: "Small organisations getting started",
    popular: false,
  },
  {
    tier: "Growth",
    price: "GH₵349",
    sms: "20,000 SMS/mo",
    use: "Active outreach at scale",
    popular: true,
  },
  {
    tier: "Scale",
    price: "GH₵799",
    sms: "100,000 SMS/mo",
    use: "Enterprises and large campaigns",
    popular: false,
  },
  {
    tier: "Enterprise",
    price: "Custom",
    sms: "Unlimited",
    use: "Custom infrastructure and SLA guarantees",
    popular: false,
  },
];

export default async function ConcordPage() {
  const cmsData = await safeFetch<SanityProduct>(PRODUCT_QUERY, { productId: "concord" });

  const screenshots: Screenshot[] =
    cmsData?.screenshots?.length
      ? cmsData.screenshots.map((s) => ({ src: s.asset.url, alt: s.alt ?? "", caption: s.caption }))
      : SCREENSHOTS;
  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Hero */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-14 md:py-16 flex flex-col md:flex-row gap-10 items-start" maxTilt={3}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-5">
                <ChatText size={28} weight="duotone" className="text-steel" />
                <span className="text-sm font-semibold text-steel-dark dark:text-steel">Concord SMS</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-ink dark:text-canvas">
                {cmsData?.heroTitle || "Reach your people, by name, at the right time"}
              </h1>
              <p className="mt-5 text-base text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[48ch]">
                {cmsData?.heroSubtitle || "Bulk messaging with personalised merge tags, scheduling, and delivery reporting for churches, schools, clinics, NGOs, and campaigns. Powered by Arkesel for reliable SMS delivery."}
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
                src={IMAGES.smsHero}
                alt="Person using smartphone for bulk messaging"
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
              Generic bulk SMS tools treat your contacts as a list, not people
            </h2>
            <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[52ch]">
              Concord was built for organisations that send regular, targeted communications:
              service reminders, appointment confirmations, event alerts, and campaign updates.
              Every message is personalised. Every delivery is tracked.
            </p>
          </GlassTiltCard>
        </Reveal>

        {/* Screenshots */}
        <Reveal>
          <ScreenshotGallery screenshots={screenshots} heading="See Concord SMS in action" />
        </Reveal>

        {/* Features */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-12" maxTilt={2}>
            <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas mb-10">
              Everything you need to send with confidence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {FEATURES.map(({ icon: Icon, title, body }) => (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
              {PRICING.map(({ tier, price, sms, use, popular }) => (
                <ConcordPricingCard
                  key={tier}
                  tier={tier}
                  price={price}
                  sms={sms}
                  use={use}
                  popular={popular}
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
              <h2 className="text-xl font-semibold text-ink dark:text-canvas">Start sending smarter</h2>
              <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">
                We will help you import your contacts and send your first campaign.
              </p>
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

function ConcordPricingCard({
  tier,
  price,
  sms,
  use,
  popular,
}: {
  tier: string;
  price: string;
  sms: string;
  use: string;
  popular: boolean;
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
          <span className="text-2xl font-bold tracking-tight text-ink dark:text-canvas">{price}</span>
          {price !== "Custom" && <span className="text-sm text-ink/50 dark:text-canvas/50">/mo</span>}
        </div>
        <p className="text-xs font-semibold text-steel-dark dark:text-steel mt-1">{sms}</p>
      </div>

      <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed flex-1">{use}</p>

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
