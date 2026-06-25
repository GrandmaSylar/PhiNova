import { NextRequest, NextResponse } from "next/server";

// Simple in-memory IP rate limiter (limits to 3 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_COUNT = 3;
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const now = Date.now();
    const limitInfo = rateLimitMap.get(ip);

    if (limitInfo) {
      if (now < limitInfo.resetTime) {
        if (limitInfo.count >= RATE_LIMIT_COUNT) {
          return NextResponse.json(
            { error: "Too many requests. Please try again in a minute." },
            { status: 429 }
          );
        }
        limitInfo.count++;
      } else {
        rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    }

    // 2. Body validation
    const body = await req.json();
    const { name, email, product, message } = body as Record<string, string>;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
    }

    const doc = {
      _type: "contactSubmission",
      name: name.trim().slice(0, 200),
      email: email.trim().toLowerCase().slice(0, 254),
      product: (product ?? "").trim().slice(0, 100),
      message: message.trim().slice(0, 5000),
      submittedAt: new Date().toISOString(),
      read: false,
    };

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const token = process.env.SANITY_API_TOKEN;
    let writeClient: any = null;

    if (projectId && token) {
      const { createClient } = await import("next-sanity");
      writeClient = createClient({
        projectId,
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
        apiVersion: "2024-06-01",
        useCdn: false,
        token,
      });
      await writeClient.create(doc);
    } else {
      console.log("[contact] Submission (Sanity not configured):", doc);
    }

    // 3. Resend Email Notification
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);

      let targetEmail = "info@phinova.dev"; // default fallback
      if (writeClient) {
        try {
          const { SITE_SETTINGS_QUERY } = await import("@/lib/sanity/queries");
          const settings = await writeClient.fetch(SITE_SETTINGS_QUERY);
          if (settings?.contactEmail) {
            targetEmail = settings.contactEmail;
          }
        } catch (queryErr) {
          console.error("[contact] Querying settings failed:", queryErr);
        }
      }

      await resend.emails.send({
        from: "no-reply@send.phinova.dev",
        to: targetEmail,
        subject: `New enquiry from ${name} (${product || "General"})`,
        text: `You have received a new enquiry:\n\nName: ${name}\nEmail: ${email}\nProduct: ${product || "General"}\nMessage:\n${message}`,
      }).catch((resendErr) => {
        console.error("[contact] Resend email send failed:", resendErr);
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
