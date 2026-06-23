import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
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

    if (projectId && token) {
      const { createClient } = await import("next-sanity");
      const writeClient = createClient({
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

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
