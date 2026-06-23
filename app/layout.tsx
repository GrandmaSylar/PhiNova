import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "PhiNova - Architecting Digital Solutions",
  description:
    "PhiNova builds production-ready software for institutions. Clinical lab management, church operations, and bulk SMS - built for reliability.",
  openGraph: {
    title: "PhiNova - Architecting Digital Solutions",
    description: "Production-ready software for institutions that cannot afford downtime.",
    type: "website",
  },
};

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
