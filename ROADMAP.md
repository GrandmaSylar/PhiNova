# PhiNova — Production Roadmap

> Build status: **Core complete, pre-launch hardening required.**
> All pages build clean. Sanity CMS wired. Animations, dark mode, screenshot galleries done.

---

## Phase 1 — Sanity CMS Setup (Day 1)

These steps unlock the admin panel and contact form storage before anything else.

- [ ] **Create Sanity project** at https://sanity.io/manage → New Project → name it `phinova`
- [ ] **Copy env file** — `cp .env.local.example .env.local` then fill in:
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` — from the Sanity dashboard
  - `NEXT_PUBLIC_SANITY_DATASET` — `production`
  - `SANITY_API_TOKEN` — create a token with **Editor** role at Manage → API → Tokens
  - `NEXT_PUBLIC_SITE_URL` — your live domain (e.g. `https://phinova.co.za`)
- [ ] **Start dev server** — `npm run dev` then visit `http://localhost:3000/studio`
- [ ] **Create the Site Settings document** inside Studio (it will be empty by default):
  - Upload day background video or image
  - Upload night background video or image
  - Fill in site name, tagline, contact email, brand colors
- [ ] **Create Product documents** for `invitro`, `cocm`, `concord` — set `productId` to match exactly

---

## Phase 2 — Content & Screenshots (Day 1–2)

- [ ] **Collect product screenshots** — export PNGs from each product (min 1280×800, ideally 1920×1080)
- [ ] **Upload screenshots per product** in Studio → Products → select product → Screenshots gallery
- [ ] **Write real hero copy** per product if different from current placeholder text (heroTitle, heroSubtitle)
- [ ] **Fill SEO meta** per product — metaTitle and metaDescription fields in each product document
- [ ] **Update contact page** — confirm email address, phone, physical address in `app/(site)/contact/page.tsx`
- [ ] **Update About page** — team members, founding story, actual mission statement
- [ ] **Replace Unsplash images** with proprietary photography if available (`lib/images.ts`)

---

## Phase 3 — Domain & Hosting (Day 2–3)

### Recommended: Vercel (zero-config for Next.js)

- [ ] **Push to GitHub** — create a private repo, `git init && git add . && git commit -m "init" && git remote add origin <url> && git push`
- [ ] **Import project in Vercel** — https://vercel.com/new → Import Git Repository
- [ ] **Add environment variables** in Vercel Dashboard → Settings → Environment Variables (same as `.env.local`)
- [ ] **Connect custom domain** — Vercel Dashboard → Domains → Add `phinova.co.za`
- [ ] **Configure DNS at your registrar** — add Vercel's A record and CNAME
- [ ] **Enable automatic HTTPS** — Vercel handles Let's Encrypt automatically once DNS propagates

### Alternative: Any Node-capable VPS (DigitalOcean, Hetzner)
- Run `npm run build && npm start` — or use `pm2 start npm -- start`
- Add Nginx reverse proxy + Certbot for HTTPS

---

## Phase 4 — Email & Notifications (Day 3)

Contact form submissions go to Sanity. Add email alerts so you don't miss enquiries.

- [ ] **Option A — Resend** (recommended, generous free tier):
  - `npm install resend`
  - Sign up at https://resend.com → get API key → add `RESEND_API_KEY` to env
  - In `app/api/contact/route.ts`, after saving to Sanity add:
    ```ts
    import { Resend } from "resend";
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "no-reply@phinova.co.za",
      to: "your@email.com",
      subject: `New enquiry from ${name}`,
      text: `From: ${name} <${email}>\nProduct: ${product}\n\n${message}`,
    });
    ```
- [ ] **Option B — SendGrid / Mailgun** — same approach, different SDK
- [ ] **Verify sender domain** in your chosen email provider (add DKIM/SPF DNS records)
- [ ] **Test contact form end-to-end** — submit, confirm it appears in Studio and you receive email

---

## Phase 5 — Analytics & Monitoring (Day 3–4)

- [ ] **Google Analytics 4**:
  - Create property at https://analytics.google.com
  - Add Measurement ID to Sanity Site Settings (`gaId` field)
  - Add to `app/(site)/layout.tsx`:
    ```tsx
    {settings?.gaId && (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${settings.gaId}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">{`
          window.dataLayer=window.dataLayer||[];
          function gtag(){dataLayer.push(arguments);}
          gtag('js',new Date());gtag('config','${settings.gaId}');
        `}</Script>
      </>
    )}
    ```
- [ ] **Vercel Analytics** (if on Vercel) — `npm install @vercel/analytics` — one-line addition to root layout
- [ ] **Uptime monitor** — free options: UptimeRobot, Better Uptime — point at `https://phinova.co.za/api/health`
- [ ] **Error monitoring** — Sentry free tier: `npm install @sentry/nextjs && npx @sentry/wizard@latest -i nextjs`

---

## Phase 6 — Performance & SEO (Day 4–5)

- [ ] **Lighthouse audit** — run in Chrome DevTools on production URL, target 90+ on all metrics
- [ ] **Open Graph images** — create per-page OG images (1200×630) and add to metadata:
  - Option A: Static files in `/public/og/`
  - Option B: Dynamic via `app/opengraph-image.tsx` using `next/og` ImageResponse
- [ ] **Favicon set** — replace the Next.js default. Tools: https://realfavicongenerator.net
  - Place in `/public/`: `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`
  - Add `<link rel="icon">` tags to root layout
- [ ] **next/image for all `<img>` tags** — convert Unsplash `<img>` usages to `<Image>` from `next/image` for automatic resizing + WebP
- [ ] **Add `rel="noopener noreferrer"` to all external links** (already present in most components — verify)
- [ ] **Submit sitemap** to Google Search Console: https://search.google.com/search-console
  - Add property → verify via DNS TXT record → Sitemaps → `https://phinova.co.za/sitemap.xml`
- [ ] **Check robots.txt** at `https://phinova.co.za/robots.txt` — confirm `/studio/` is disallowed

---

## Phase 7 — Security Hardening (Day 5)

- [ ] **Security headers** — add to `next.config.ts`:
  ```ts
  const securityHeaders = [
    { key: "X-DNS-Prefetch-Control", value: "on" },
    { key: "X-Frame-Options", value: "SAMEORIGIN" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    {
      key: "Content-Security-Policy",
      value: [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: https://images.unsplash.com https://cdn.sanity.io",
        "media-src 'self' https://assets.mixkit.co https://cdn.sanity.io",
        "connect-src 'self' https://*.sanity.io https://www.google-analytics.com",
        "font-src 'self' https://fonts.gstatic.com",
      ].join("; "),
    },
  ];
  // In next.config.ts headers() function
  ```
- [ ] **Rate-limit `/api/contact`** — add basic IP throttle to prevent spam:
  - `npm install @upstash/ratelimit @upstash/redis` (free tier available)
  - Or simple in-memory map for low-traffic launch
- [ ] **Protect `/studio` route** — Sanity Studio has its own auth but consider IP-allow-listing if on Vercel Pro
- [ ] **Validate all env vars at startup** — add a `lib/env.ts` check that throws clearly if critical vars are missing in production

---

## Phase 8 — Polish & QA (Day 5–6)

- [ ] **Mobile QA** — test all pages on real devices: iPhone Safari, Android Chrome (minimum)
- [ ] **Reduced-motion audit** — confirm all Motion animations respect `useReducedMotion()` (already implemented in BackgroundMedia — verify on other animated components)
- [ ] **Keyboard navigation** — tab through all interactive elements, confirm focus rings are visible
- [ ] **Screen reader pass** — use macOS VoiceOver or NVDA (Windows) on home, contact, product pages
- [ ] **Form validation UX** — confirm error states show clearly for missing/invalid fields
- [ ] **Cross-browser** — test in Firefox and Safari (backdrop-filter and CSS vars)
- [ ] **404 page** — create `app/not-found.tsx` with branded design and link home
- [ ] **Loading states** — add `app/loading.tsx` global skeleton if pages feel slow on first load
- [ ] **Print stylesheet** — not critical but useful for contact page (`@media print`)

---

## Phase 9 — Legal & Compliance (Before Public Launch)

- [ ] **Privacy Policy page** — required for GDPR/POPIA compliance (you collect contact form data)
  - Create `app/(site)/privacy/page.tsx`
  - Minimum: what data is collected, how stored (Sanity), how long retained, contact for deletion requests
- [ ] **Cookie notice** — if using GA4 (sets cookies), a consent banner is required for EU/SA visitors
  - Simple option: `npm install react-cookie-consent`
- [ ] **Terms of Service** — standard for a SaaS product website
- [ ] **Add footer links** to Privacy Policy and Terms in `components/Footer.tsx`
- [ ] **POPIA compliance** — South Africa's data protection law. Contact form submissions stored in Sanity = personal data. Ensure Sanity dataset is in an appropriate region (EU or US — Sanity has no SA region currently; document this in your privacy policy)

---

## Phase 10 — Launch

- [ ] **Final production build** — `npm run build` on the live server, confirm zero errors and warnings
- [ ] **Smoke test all routes** — `/`, `/about`, `/contact`, `/products`, `/products/invitro`, `/products/cocm`, `/products/concord`, `/api/health`, `/sitemap.xml`, `/robots.txt`
- [ ] **Submit to Google** — Search Console → URL Inspection → Request Indexing for the homepage
- [ ] **Announce** — LinkedIn, WhatsApp groups, email contacts

---

## Optional Future Enhancements

These are not required for launch but add value post-launch.

| Feature | Effort | Value |
|---|---|---|
| Blog / Articles section (Sanity `article` schema + `/blog` route) | Medium | SEO, thought leadership |
| Live chat widget (Crisp, Tawk.to — free tier) | Low | Lead conversion |
| Demo booking (Calendly embed) | Low | Lead conversion |
| PWA manifest + service worker | Medium | Mobile installability |
| i18n — French, Twi, Hausa | High | West Africa market reach |
| Product demo videos (embedded Loom/Vimeo) | Low | Conversion |
| Customer testimonials section | Low | Trust signal |
| Automated Sanity backups | Low | Data safety |
| CI/CD pipeline (GitHub Actions → Vercel auto-deploy) | Low | Vercel handles this automatically on push |
| E2E tests (Playwright) | High | Regression safety |

---

## Current File Structure (for reference)

```
PhiNova_Web_New/
├── app/
│   ├── layout.tsx              ✅ Root layout (fonts, FOUC script)
│   ├── (site)/
│   │   ├── layout.tsx          ✅ Marketing chrome + Sanity fetch
│   │   ├── page.tsx            ✅ Home
│   │   ├── about/page.tsx      ✅
│   │   ├── contact/page.tsx    ✅
│   │   └── products/
│   │       ├── page.tsx        ✅ Products listing
│   │       ├── invitro/page.tsx ✅ + Sanity screenshots
│   │       ├── cocm/page.tsx   ✅ + Sanity screenshots
│   │       └── concord/page.tsx ✅ + Sanity screenshots
│   ├── studio/
│   │   ├── layout.tsx          ✅ Pass-through (no marketing chrome)
│   │   └── [[...tool]]/page.tsx ✅ Embedded Sanity Studio
│   ├── api/
│   │   ├── contact/route.ts    ✅ POST → saves to Sanity
│   │   └── health/route.ts     ✅ GET health check
│   ├── sitemap.ts              ✅
│   └── robots.ts               ✅
├── components/
│   ├── BackgroundMedia.tsx     ✅ Accepts Sanity video/image URLs
│   ├── ContactForm.tsx         ✅ POSTs to /api/contact
│   ├── CursorSpotlight.tsx     ✅
│   ├── Footer.tsx              ✅
│   ├── GlassTiltCard.tsx       ✅
│   ├── MagneticButton.tsx      ✅
│   ├── Navbar.tsx              ✅
│   ├── Reveal.tsx              ✅
│   ├── ScreenshotGallery.tsx   ✅
│   └── ThemeProvider.tsx       ✅
├── lib/
│   ├── images.ts               ✅ Unsplash registry
│   └── sanity/
│       ├── client.ts           ✅ safeFetch with graceful null
│       ├── image.ts            ✅ urlFor() helper
│       └── queries.ts          ✅ GROQ + TypeScript interfaces
├── sanity/
│   └── schemas/
│       ├── index.ts            ✅
│       ├── siteSettings.ts     ✅
│       ├── product.ts          ✅
│       └── contactSubmission.ts ✅
├── sanity.config.ts            ✅
├── .env.local.example          ✅
└── ROADMAP.md                  ✅ This file
```
