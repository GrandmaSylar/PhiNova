import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/lib/env";
import { safeFetch } from "@/lib/sanity/client";
import { SITE_SETTINGS_QUERY, type SanitySettings } from "@/lib/sanity/queries";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safeFetch<SanitySettings>(SITE_SETTINGS_QUERY);
  const logoUrl = settings?.logo?.asset?.url;

  return {
    title: "PhiNova - Architecting Digital Solutions",
    description:
      "PhiNova builds production-ready software for institutions. Clinical lab management, church operations, and bulk SMS - built for reliability.",
    icons: {
      icon: logoUrl || "/favicon.ico",
      shortcut: logoUrl || "/favicon.ico",
      apple: logoUrl || "/favicon.ico",
    },
    openGraph: {
      title: "PhiNova - Architecting Digital Solutions",
      description: "Production-ready software for institutions that cannot afford downtime.",
      type: "website",
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/* Instant theme application before React hydrates — prevents FOUC */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('phinova-theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'night':'day');document.documentElement.setAttribute('data-theme',t);}catch(e){}})()`,
          }}
        />
      </head>
      <body className="min-h-[100dvh] flex flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
