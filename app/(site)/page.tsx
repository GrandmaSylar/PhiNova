import Link from "next/link";
import { HeroMotion, HeroItem } from "@/components/HeroMotion";
import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { MagneticLink } from "@/components/MagneticButton";
import { IMAGES } from "@/lib/images";
import {
  Flask,
  Church,
  ChatText,
  ArrowRight,
  CheckCircle,
  ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";

export const revalidate = 60;

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="min-h-[100dvh] flex items-center justify-center px-4 pt-24 pb-16">
        <HeroMotion className="w-full max-w-2xl p-[6px] rounded-[calc(var(--radius-panel)+6px)] bg-white/8 border border-white/12">
          <GlassTiltCard
            className="w-full px-8 py-12 md:px-12 md:py-16 text-center"
            maxTilt={5}
          >
            <HeroItem delay={0}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.08] text-ink dark:text-canvas">
                Software built for institutions that cannot afford downtime
              </h1>
            </HeroItem>
            <HeroItem delay={0.08}>
              <p className="mt-5 text-base text-ink/70 dark:text-canvas/70 leading-relaxed max-w-[46ch] mx-auto">
                PhiNova ships production-ready systems for labs, congregations, and organisations
                that need reliability above all else.
              </p>
            </HeroItem>
            <HeroItem delay={0.16}>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <MagneticLink
                  href="/products"
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-ink transition-colors duration-300 active:scale-[0.96]"
                >
                  Explore software
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
                    <ArrowRight size={10} weight="bold" />
                  </span>
                </MagneticLink>
                <MagneticLink
                  href="/about"
                  className="inline-flex items-center px-6 py-3 rounded-full border border-navy/25 dark:border-canvas/25 text-ink dark:text-canvas text-sm font-medium hover:bg-navy/6 dark:hover:bg-canvas/10 transition-colors duration-300"
                >
                  About PhiNova
                </MagneticLink>
              </div>
            </HeroItem>
          </GlassTiltCard>
        </HeroMotion>
      </section>

      {/* ── What we do ──────────────────────────────────────────────── */}
      <section className="px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <GlassTiltCard className="px-8 py-12 md:px-14 max-w-3xl" maxTilt={3}>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink dark:text-canvas leading-snug">
                Systems-first thinking, from day one
              </h2>
              <p className="mt-4 text-base text-ink/70 dark:text-canvas/70 leading-relaxed max-w-[52ch]">
                We build software for institutions that run on data they cannot lose, for people
                who do not have time for downtime. Every product ships with offline resilience,
                structured audit trails, and real support.
              </p>
            </GlassTiltCard>
          </Reveal>
        </div>
      </section>

      {/* ── Featured products — asymmetric bento (2+1) ──────────────── */}
      <section className="px-4 py-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-8 pl-1">
            <h2 className="text-xl font-semibold tracking-tight text-ink dark:text-canvas">
              Three products, one standard
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 lg:grid-cols-[1.45fr_1fr] gap-5">
            <Reveal delay={0.05}>
              <ProductCardLarge
                icon={<Flask size={28} weight="duotone" className="text-steel" />}
                name="Invitro LIMS"
                tagline="Clinical-grade lab management, built to run even when the internet does not."
                href="/products/invitro"
                /* Lab test tubes — contextual to clinical diagnostics */
                imageSrc={IMAGES.labEquipment}
                imageAlt="Laboratory test tubes and clinical equipment"
              />
            </Reveal>

            <div className="flex flex-col gap-5">
              <Reveal delay={0.1}>
                <ProductCardSmall
                  icon={<Church size={24} weight="duotone" className="text-steel" />}
                  name="COCM"
                  tagline="Offline-first church management for members, attendance, giving, and expenses."
                  href="/products/cocm"
                  /* Church interior — contextual to congregation management */
                  imageSrc={IMAGES.churchCongre}
                  imageAlt="Church congregation gathered for worship"
                />
              </Reveal>
              <Reveal delay={0.15}>
                <ProductCardSmall
                  icon={<ChatText size={24} weight="duotone" className="text-steel" />}
                  name="Concord SMS"
                  tagline="Bulk messaging with merge tags, scheduling, and delivery reporting."
                  href="/products/concord"
                  /* Person using smartphone — contextual to SMS/messaging */
                  imageSrc={IMAGES.smsCampaign}
                  imageAlt="Person using mobile messaging app"
                />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why institutions choose us ───────────────────────────────── */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <Reveal>
            <GlassTiltCard className="px-8 py-12 md:px-14" maxTilt={2}>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight text-ink dark:text-canvas mb-10">
                Built different, on purpose
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Offline resilience",
                    body: "Every product operates when connectivity drops. Data syncs cleanly the moment it returns.",
                  },
                  {
                    title: "Audit trails",
                    body: "Every action is logged. Every change is traceable. No blind spots for compliance or management.",
                  },
                  {
                    title: "Real support",
                    body: "You get a contact who knows the product, not a ticket queue. Priority response included.",
                  },
                ].map(({ title, body }) => (
                  <div key={title} className="flex flex-col gap-3">
                    <CheckCircle size={22} weight="fill" className="text-steel shrink-0" />
                    <h3 className="text-base font-semibold text-ink dark:text-canvas">{title}</h3>
                    <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
            </GlassTiltCard>
          </Reveal>
        </div>
      </section>

      {/* ── Closing CTA band ─────────────────────────────────────────── */}
      <section className="px-4 pb-8">
        <Reveal>
          <GlassTiltCard
            className="max-w-6xl mx-auto px-8 py-12 md:px-14 flex flex-col md:flex-row items-center justify-between gap-6"
            maxTilt={2}
            bezel
          >
            <div>
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight text-ink dark:text-canvas">
                Ready to evaluate?
              </h2>
              <p className="mt-1.5 text-sm text-ink/65 dark:text-canvas/65">
                Talk to us about your institution&apos;s needs and we will find the right fit.
              </p>
            </div>
            <MagneticLink
              href="/contact"
              className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-navy text-white text-sm font-semibold hover:bg-ink transition-colors active:scale-[0.96]"
            >
              Get in touch
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-white/15">
                <ArrowUpRight size={10} weight="bold" />
              </span>
            </MagneticLink>
          </GlassTiltCard>
        </Reveal>
      </section>
    </>
  );
}

/* ── Product card sub-components ────────────────────────────────────── */

function ProductCardLarge({
  icon, name, tagline, href, imageSrc, imageAlt,
}: {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <GlassTiltCard className="group overflow-hidden h-full" maxTilt={6} bezel>
      <Link href={href} className="flex flex-col h-full">
        <div className="relative h-52 overflow-hidden rounded-t-[calc(var(--radius-panel)-5px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            width={800}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/55 to-transparent" />
        </div>
        <div className="flex flex-col flex-1 p-6 gap-3">
          <div className="flex items-center gap-2.5">
            {icon}
            <span className="text-base font-semibold text-ink dark:text-canvas">{name}</span>
          </div>
          <p className="text-sm text-ink/70 dark:text-canvas/70 leading-relaxed flex-1">{tagline}</p>
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-steel-dark dark:text-steel group-hover:gap-3 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
            Learn more <ArrowRight size={14} weight="bold" />
          </span>
        </div>
      </Link>
    </GlassTiltCard>
  );
}

function ProductCardSmall({
  icon, name, tagline, href, imageSrc, imageAlt,
}: {
  icon: React.ReactNode;
  name: string;
  tagline: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <GlassTiltCard className="group overflow-hidden flex-1" maxTilt={7}>
      <Link href={href} className="flex flex-col h-full">
        <div className="relative h-28 overflow-hidden rounded-t-[calc(var(--radius-panel)-1px)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)]"
            width={600}
            height={280}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
        </div>
        <div className="flex flex-col flex-1 p-5 gap-2.5">
          <div className="flex items-center gap-2">
            {icon}
            <span className="text-sm font-semibold text-ink dark:text-canvas">{name}</span>
          </div>
          <p className="text-xs text-ink/70 dark:text-canvas/70 leading-relaxed flex-1">{tagline}</p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-steel-dark dark:text-steel group-hover:gap-2.5 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]">
            Learn more <ArrowRight size={12} weight="bold" />
          </span>
        </div>
      </Link>
    </GlassTiltCard>
  );
}
