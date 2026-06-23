import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import BackgroundMedia from "@/components/BackgroundMedia";
import { CursorSpotlight } from "@/components/CursorSpotlight";
import { safeFetch } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY, type SanitySettings } from "@/lib/sanity/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);

  return (
    <ThemeProvider>
      <BackgroundMedia
        dayVideoUrl={settings?.dayVideoUrl}
        nightVideoUrl={settings?.nightVideoUrl}
        dayImageUrl={settings?.dayImage?.asset?.url}
        nightImageUrl={settings?.nightImage?.asset?.url}
      />
      <CursorSpotlight />
      <Navbar />
      <main className="flex-1 relative" style={{ zIndex: "var(--z-content)" }}>
        {children}
      </main>
      <Footer />
    </ThemeProvider>
  );
}
