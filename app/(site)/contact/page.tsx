import { Reveal } from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react/dist/ssr";
import { safeFetch } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY, type SanitySettings } from "@/lib/sanity/queries";

export const revalidate = 60;

export const metadata = {
  title: "Contact - PhiNova",
  description:
    "Get in touch with PhiNova to discuss your institution's software needs or request a product demo.",
};

export default async function ContactPage() {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);
  const email = settings?.contactEmail || "hello@phinova.dev";
  const phone = settings?.contactPhone || "+233 00 000 0000";
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <Reveal className="mb-10">
          <GlassTiltCard className="max-w-2xl px-8 py-10 md:px-12" maxTilt={4}>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-ink dark:text-canvas">
              Let us talk about your institution
            </h1>
            <p className="mt-4 text-base text-ink/65 dark:text-canvas/65 leading-relaxed max-w-[46ch]">
              Tell us about your organisation and what you are trying to solve. We will respond within
              one business day.
            </p>
          </GlassTiltCard>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Form */}
          <Reveal>
            <ContactForm />
          </Reveal>

          {/* Contact details */}
          <Reveal delay={0.1}>
            <GlassTiltCard className="px-7 py-8 flex flex-col gap-6 h-fit" maxTilt={5}>
              <h2 className="text-base font-semibold text-ink dark:text-canvas">Direct contact</h2>

              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <EnvelopeSimple size={18} weight="duotone" className="text-steel mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-ink/50 dark:text-canvas/50 mb-0.5">Email</p>
                    <a
                      href={`mailto:${email}`}
                      className="text-sm text-steel-dark dark:text-steel hover:underline transition-colors"
                    >
                      {email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone size={18} weight="duotone" className="text-steel mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-ink/50 dark:text-canvas/50 mb-0.5">Phone</p>
                    <a
                      href={phoneHref}
                      className="text-sm text-steel-dark dark:text-steel hover:underline transition-colors"
                    >
                      {phone}
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-ink/10 dark:border-canvas/10">
                <p className="text-xs text-ink/50 dark:text-canvas/50 leading-relaxed">
                  We typically respond within one business day. For urgent matters,
                  call directly.
                </p>
              </div>
            </GlassTiltCard>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
