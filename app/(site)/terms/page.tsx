import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { safeFetch } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY, type SanitySettings } from "@/lib/sanity/queries";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);
  return {
    title: `Terms of Service - ${settings?.siteName || "PhiNova"}`,
    description: "Terms of service and use policies.",
  };
}

export default async function TermsPage() {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);
  const siteName = settings?.siteName || "PhiNova";
  const contactEmail = settings?.contactEmail || "info@phinova.dev";

  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <Reveal>
          <GlassTiltCard className="px-8 py-10 md:px-12" maxTilt={3}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-canvas">
              Terms of Service
            </h1>
            <p className="mt-2 text-xs text-ink/40 dark:text-canvas/40">
              Last Updated: June 24, 2026
            </p>
          </GlassTiltCard>
        </Reveal>

        <Reveal delay={0.05}>
          <GlassTiltCard className="px-8 py-10 md:px-12 flex flex-col gap-6" maxTilt={1}>
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">1. Acceptable Use</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                By using our systems and website, you agree to comply with all laws. You may not use our forms, endpoints, or software details for spamming, brute-force exploits, rate-limiting violations, or attempts to disrupt operations.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">2. Intellectual Property</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                The visual layout, design system assets, source configurations, product taglines, logos, and custom graphics displayed on this website are the property of {siteName} unless otherwise noted. These resources are protected by domestic and international copyright laws.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">3. Limitation of Liability</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                The content on this website is provided as-is for information and marketing purposes. While we strive to maintain complete uptime and security, we make no guarantees about error-free site access. {siteName} is not responsible for any indirect damages resulting from your use of this site.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">4. Contact Details</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                If you have queries regarding these terms, please contact us at{" "}
                <a href={`mailto:${contactEmail}`} className="text-steel underline hover:text-steel-dark transition-colors">
                  {contactEmail}
                </a>.
              </p>
            </section>
          </GlassTiltCard>
        </Reveal>
      </div>
    </div>
  );
}
