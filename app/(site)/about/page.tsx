import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { MagneticLink } from "@/components/MagneticButton";
import { IMAGES } from "@/lib/images";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";

export const metadata = {
  title: "About - PhiNova",
  description:
    "PhiNova is a systems development company building production-ready software for institutions across Ghana.",
};

export default function AboutPage() {
  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">

        {/* Header */}
        <Reveal>
          <GlassTiltCard className="max-w-3xl px-8 py-12 md:px-14" maxTilt={4}>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-ink dark:text-canvas">
              We build systems that institutions can trust
            </h1>
            <p className="mt-5 text-base text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[50ch]">
              PhiNova is a systems development company based in Ghana. We build production-ready
              software for the kinds of organisations that cannot afford data loss, downtime, or
              tools that need a data scientist to operate.
            </p>
          </GlassTiltCard>
        </Reveal>

        {/* Story */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-14 flex flex-col md:flex-row gap-12" maxTilt={3}>
            <div className="flex-1 flex flex-col gap-5 max-w-[52ch]">
              <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas">
                How we started
              </h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                PhiNova grew from a recurring observation: the organisations most in need of
                good software are often the least served by it. Clinical laboratories running on
                spreadsheets. Churches with no reliable record of their membership. NGOs sending
                bulk SMS through consumer tools with no reporting.
              </p>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                We started by solving one problem at a time. Invitro LIMS came first, built to
                help diagnostic labs operate without depending on an internet connection that Ghana&apos;s
                infrastructure could not guarantee. COCM came next, after watching church administrators
                manage five-hundred-member congregations in notebooks. Concord followed, because
                the organisations we worked with needed a way to communicate with their people
                that did not require a developer to set up.
              </p>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                Three products, three different sectors, one approach: understand the institution
                first, then build software that fits the way it actually works.
              </p>
            </div>
            <div className="md:w-72 shrink-0 rounded-[calc(var(--radius-panel)-4px)] overflow-hidden self-start group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={IMAGES.teamMeeting}
                alt="Diverse team collaborating in a modern office"
                className="w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-[1.04]"
                width={600}
                height={500}
              />
            </div>
          </GlassTiltCard>
        </Reveal>

        {/* Mission */}
        <Reveal>
          <GlassTiltCard className="px-8 py-12 md:px-14 max-w-3xl" maxTilt={4}>
            <h2 className="text-2xl font-semibold tracking-tight text-ink dark:text-canvas mb-5">
              What makes us different
            </h2>
            <div className="flex flex-col gap-6">
              {[
                {
                  heading: "Systems thinking before features",
                  body: "We do not add features because they look good on a pricing table. We ask what the institution needs to operate reliably, and we build that. Nothing extra. Nothing missing.",
                },
                {
                  heading: "Reliability is the first requirement",
                  body: "Our products are built to handle the conditions they will actually face: intermittent connectivity, varying hardware, mixed technical literacy among staff. They work in the real world, not just in a demo.",
                },
                {
                  heading: "We stay close to our customers",
                  body: "Every institution that subscribes to a PhiNova product has a direct contact. We do not route support requests through a generic queue. If something is wrong, we know about it before you do.",
                },
              ].map(({ heading, body }) => (
                <div
                  key={heading}
                  className="border-l-2 border-steel/40 pl-5 transition-all duration-300 hover:border-steel/80 hover:pl-6"
                >
                  <h3 className="text-sm font-semibold text-ink dark:text-canvas mb-2">{heading}</h3>
                  <p className="text-sm text-ink/60 dark:text-canvas/60 leading-relaxed">{body}</p>
                </div>
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
              <h2 className="text-xl font-semibold text-ink dark:text-canvas">Work with us</h2>
              <p className="mt-1 text-sm text-ink/60 dark:text-canvas/60">
                If your institution has a problem that fits our approach, we want to hear about it.
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
