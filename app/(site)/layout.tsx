import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackgroundMedia from "@/components/BackgroundMedia";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { safeFetch } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY, type SanitySettings } from "@/lib/sanity/queries";
import Script from "next/script";
import CookieConsent from "@/components/CookieConsent";
import { Suspense } from "react";
import InteractionTracker from "@/components/InteractionTracker";

export const revalidate = 60;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);

  return (
    <ThemeProvider>
      <Suspense fallback={null}>
        <InteractionTracker />
      </Suspense>
      {settings?.gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${settings.gaId}');
            `}
          </Script>
        </>
      )}
      <BackgroundMedia
        dayVideoUrl={settings?.dayVideoUrl}
        nightVideoUrl={settings?.nightVideoUrl}
        dayImageUrl={settings?.dayImage?.asset?.url}
        nightImageUrl={settings?.nightImage?.asset?.url}
      />
      <CursorSpotlight />
      <Navbar settings={settings} />
      <main className="flex-1 relative" style={{ zIndex: "var(--z-content)" }}>
        {children}
      </main>
      <Footer settings={settings} />
      <CookieConsent />
    </ThemeProvider>
  );
}
