import { Reveal } from "@/components/Reveal";
import { GlassTiltCard } from "@/components/GlassTiltCard";
import { safeFetch } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY, type SanitySettings } from "@/lib/sanity/queries";

export const revalidate = 60;

export async function generateMetadata() {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);
  return {
    title: `Privacy Policy - ${settings?.siteName || "PhiNova"}`,
    description: "Privacy policy and POPIA/GDPR compliance details.",
  };
}

export default async function PrivacyPage() {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);
  const siteName = settings?.siteName || "PhiNova";
  const contactEmail = settings?.contactEmail || "info@phinova.dev";

  return (
    <div className="min-h-[100dvh] pt-28 px-4 pb-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-8">
        <Reveal>
          <GlassTiltCard className="px-8 py-10 md:px-12" maxTilt={3}>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-ink dark:text-canvas">
              Privacy Policy
            </h1>
            <p className="mt-2 text-xs text-ink/40 dark:text-canvas/40">
              Last Updated: June 24, 2026
            </p>
          </GlassTiltCard>
        </Reveal>

        <Reveal delay={0.05}>
          <GlassTiltCard className="px-8 py-10 md:px-12 flex flex-col gap-6" maxTilt={1}>
            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">1. Overview</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                At {siteName}, we take your data privacy seriously. This privacy policy describes how we collect, store, use, and protect your personal information in compliance with South Africa&apos;s Protection of Personal Information Act (POPIA) and other applicable international data frameworks like GDPR.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">2. Information We Collect</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                When you interact with our website or submit enquiries through our contact form, we collect the following personal details:
              </p>
              <ul className="list-disc pl-5 text-sm text-ink/65 dark:text-canvas/65 flex flex-col gap-1.5 mt-1">
                <li>Full Name</li>
                <li>Email Address</li>
                <li>Product or Service interest details</li>
                <li>Message context details</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">3. Storing and Securing Personal Data</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                Your enquiries are processed and stored securely inside our Content Management System (Sanity CMS) servers, housed in global data centers (predominantly in EU or US zones). We ensure proper access keys and tokens are restricted to administrators only. We do not retain data longer than necessary for the context it was submitted for.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold text-ink dark:text-canvas">4. Your Rights</h2>
              <p className="text-sm text-ink/65 dark:text-canvas/65 leading-relaxed">
                You have the right to request access to the personal information we hold about you, request corrections, or request deletion of your data from our database. To file a query, please email our support point at{" "}
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
