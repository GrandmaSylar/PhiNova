import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { MagneticLink } from "@/components/MagneticButton";
import { ScreenshotGallery, type Screenshot } from "@/components/ScreenshotGallery";
import { IMAGES } from "@/lib/images";
import { safeFetch } from "@/lib/sanity/client";
import { PRODUCT_QUERY, type SanityProduct } from "@/lib/sanity/queries";
import Image from "next/image";
import {
  GraduationCap,
  ArrowRight,
  ArrowUpRight,
  ClipboardText,
  CalendarCheck,
  Exam,
  CreditCard,
  ChatText,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 60;

export async function generateMetadata() {
  const cmsData = await safeFetch<SanityProduct>(PRODUCT_QUERY, { productId: "legion" });
  return {
    title: cmsData?.metaTitle || "Legion School System - PhiNova",
    description:
      cmsData?.metaDescription ||
      "Run your whole school from one system: online admissions, attendance, grades and report cards, fees with online payment, SMS to parents, and a parent portal.",
  };
}

/**
 * SCREENSHOTS — taken from a demo school with made-up pupils, staff and amounts (Sunrise Demo School).
 * Never use a real school's data here. To replace them, upload new ones in Sanity Studio
 * (Products > Legion > Screenshots) or swap the files in /public/screenshots/.
 */
const SCREENSHOTS: Screenshot[] = [
  { src: "/screenshots/legion-overview.png", alt: "Overview — pupils present today, fees recorded and recent activity at a glance", caption: "Overview" },
  { src: "/screenshots/legion-student-record.png", alt: "Student record — personal details, home address, health and attendance in one place", caption: "Student record" },
  { src: "/screenshots/legion-attendance.png", alt: "Attendance — one tap per pupil, saved even without internet", caption: "Attendance" },
  { src: "/screenshots/legion-fees.png", alt: "Fees — billed, collected and outstanding, with receipts for every payment", caption: "Fees" },
  { src: "/screenshots/legion-admissions.png", alt: "Online admissions — applications from parents, from new to offered", caption: "Admissions" },
];

const FEATURES = [
  {
    icon: ClipboardText,
    title: "Online admissions",
    body: "Parents apply from their phone, upload documents and track the result. You review, offer a place and enrol in a few taps.",
  },
  {
    icon: CalendarCheck,
    title: "Attendance that works offline",
    body: "Teachers mark the register in seconds. If the internet drops, it is saved on the device and syncs when it returns.",
  },
  {
    icon: Exam,
    title: "Grades and report cards",
    body: "Class tasks, mid-terms and exams in one place. Totals, positions and report cards are worked out for you, including BECE analysis.",
  },
  {
    icon: CreditCard,
    title: "Fees and online payment",
    body: "Invoices, receipts and balances for every pupil. Parents pay by mobile money or card, and the payment is recorded automatically.",
  },
  {
    icon: ChatText,
    title: "SMS to parents and staff",
    body: "Fee reminders, notices and results by SMS, to one class or the whole school, with a record of every message sent.",
  },
  {
    icon: UsersThree,
    title: "Parent and student portal",
    body: "Parents see attendance, results and fees for their children. Each person sees only what they should, and staff roles limit what each can change.",
  },
];

const PRICING = [
  {
    tier: "Core",
    price: "GH₵10",
    period: "/student/term",
    note: "The daily running of the school",
    use: "For schools starting out with records, attendance and results.",
    popular: false,
    features: [
      "Student records and classes",
      "Daily attendance",
      "Grades and report cards",
      "Notices to staff and parents",
      "Parent and student portal",
    ],
  },
  {
    tier: "Standard",
    price: "GH₵15",
    period: "/student/term",
    note: "Adds fees, messaging and a school website",
    use: "For schools that also collect fees, message parents and want a website of their own.",
    popular: false,
    features: [
      "Everything in Core",
      "Your school website: news, calendar and a photo gallery of up to 300 photos",
      "Fee invoices, receipts and balances",
      "Expense records",
      "SMS to parents and staff",
      "School calendar",
      "Complaints and feedback",
    ],
  },
  {
    tier: "Complete",
    price: "GH₵20",
    period: "/student/term",
    note: "The whole school, online",
    use: "For schools that want payments, admissions and staff tools online.",
    popular: true,
    features: [
      "Everything in Standard",
      "A web address of your own for your website",
      "A bigger photo gallery, up to 1,000 photos",
      "Online fee payment",
      "Online admissions",
      "Staff payroll and clock-in",
      "Lessons, tasks and timetable",
      "Analytics",
    ],
  },
];

export default async function LegionPage() {
  const cmsData = await safeFetch<SanityProduct>(PRODUCT_QUERY, { productId: "legion" });

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
          note: p.subtext ?? "",
          use: p.description ?? "",
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
                <GraduationCap size={28} weight="duotone" className="text-steel" />
                <span className="text-sm font-semibold text-steel-dark dark:text-steel">Legion School System</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-ink dark:text-canvas">
                {cmsData?.heroTitle || "Run your whole school from one system"}
              </h1>
              <p className="mt-5 text-base text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[48ch]">
                {cmsData?.heroSubtitle || "Admissions, attendance, grades, fees and parent messaging, built for Ghanaian basic schools. Your own web address, your own records, backed up every hour."}
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
              <Image
                src={cmsData?.heroImage?.asset?.url || IMAGES.schoolHero}
                alt="An empty classroom with desks and a board"
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
              {cmsData?.problemTitle || "Registers in one book, fees in another, results in a spreadsheet"}
            </h2>
            <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[52ch]">
              {cmsData?.problemDescription || "Most schools keep records in notebooks, spreadsheets and WhatsApp groups. Parents ask about balances, the office searches for files, and report cards take days. Legion puts every record in one place, so the office, the teachers and the parents all see the same facts."}
            </p>
          </GlassTiltCard>
        </Reveal>

        {/* Screenshots */}
        <Reveal>
          <ScreenshotGallery screenshots={screenshots} heading="See Legion in action" />
        </Reveal>

        {/* Features */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-12" maxTilt={2}>
            <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas mb-10">
              Everything the school office needs
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
            <div className="mb-8 p-4 rounded-lg bg-navy/5 dark:bg-white/5 border border-navy/10 dark:border-white/10 text-xs text-ink/75 dark:text-canvas/75 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="font-semibold text-steel-dark dark:text-steel block sm:inline mr-1">One price per enrolled student, per term.</span>
                Billed each term in advance, with a minimum of 200 students. A one-off setup fee covers moving your records and training your staff.
              </div>
              <div className="shrink-0 text-ink/50 dark:text-canvas/50">
                SMS credits are bought separately, at GH₵0.05 per SMS.
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {pricing.map(({ tier, price, period, note, use, popular, features }) => (
                <LegionPricingCard
                  key={tier}
                  tier={tier}
                  price={price}
                  period={period}
                  note={note}
                  use={use}
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
              <h2 className="text-xl font-semibold text-ink dark:text-canvas">See it with your own school in mind</h2>
              <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">
                We will walk you through it, then help you move your records and train your staff.
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

function LegionPricingCard({
  tier,
  price,
  period,
  note,
  use,
  popular,
  features,
}: {
  tier: string;
  price: string;
  period: string;
  note: string;
  use: string;
  popular: boolean;
  features: string[];
}) {
  const custom = price === "Custom";
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
          Most complete
        </span>
      )}
      <div>
        <p className="text-sm font-semibold text-ink/50 dark:text-canvas/50">{tier}</p>
        <div className="flex items-baseline gap-1 mt-1 flex-wrap">
          <span className="text-2xl font-bold tracking-tight text-ink dark:text-canvas">{price}</span>
          {!custom && period && <span className="text-sm text-ink/50 dark:text-canvas/50">{period}</span>}
        </div>
        {note && <p className="text-xs font-semibold text-steel-dark dark:text-steel mt-1">{note}</p>}
      </div>

      {use && <p className="text-xs text-ink/65 dark:text-canvas/65 leading-relaxed">{use}</p>}

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
        {custom ? "Contact us" : "Get started"}
      </Link>
    </div>
  );
}
