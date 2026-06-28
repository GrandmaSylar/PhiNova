import { NextRequest, NextResponse } from "next/server";

function getDeviceType(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Opera Mini/i.test(ua)) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("chrome") && !ua.includes("chromium") && !ua.includes("edg") && !ua.includes("opr")) return "Chrome";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("edg")) return "Edge";
  if (ua.includes("opr") || ua.includes("opera")) return "Opera";
  return "Unknown Browser";
}

function getOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("win")) return "Windows";
  if (ua.includes("mac")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("iphone") || ua.includes("ipad")) return "iOS";
  return "Unknown OS";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, sessionId, userId, cookieConsent, payload } = body;

    if (!sessionId || !action) {
      return NextResponse.json({ error: "Missing sessionId or action" }, { status: 400 });
    }

    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    const token = process.env.SANITY_API_TOKEN;
    if (!projectId || !token) {
      console.warn("[track] Sanity project credentials not set");
      return NextResponse.json({ success: true, message: "Sanity not configured" });
    }

    const { createClient } = await import("next-sanity");
    const writeClient = createClient({
      projectId,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
      apiVersion: "2024-06-01",
      useCdn: false,
      token,
    });

    const now = new Date().toISOString();

    // Determine IP and country based on consent status (Privacy Option B compliance)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || req.headers.get("x-real-ip") || "127.0.0.1";
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";
    const consentVal = cookieConsent || "anonymous";

    const finalIp = (consentVal === "accepted") ? ip : "Masked / Anonymous";
    const finalCountry = (consentVal === "accepted") ? country : "Anonymous";

    // Ensure the document exists to avoid patch errors if events arrive out of order
    let docExists = false;
    try {
      const exists = await writeClient.fetch(`*[_id == $id][0]._id`, { id: sessionId });
      docExists = !!exists;
    } catch (e) {
      console.warn("[track] Check existence failed, assuming not exists:", e);
    }

    if (!docExists && action !== "start_session") {
      const userAgent = req.headers.get("user-agent") ?? "";
      const device = getDeviceType(userAgent);
      const browser = getBrowser(userAgent);
      const os = getOS(userAgent);

      await writeClient.createIfNotExists({
        _type: "interactionSession",
        _id: sessionId,
        sessionId,
        userId: userId || "anonymous_visitor",
        startedAt: now,
        lastActiveAt: now,
        duration: 0,
        device,
        browser,
        os,
        country: finalCountry,
        ipAddress: finalIp,
        cookieConsent: consentVal,
        referrer: "",
        pages: [],
        events: [],
      });
    }

    if (action === "start_session") {
      const userAgent = req.headers.get("user-agent") ?? "";
      const device = getDeviceType(userAgent);
      const browser = getBrowser(userAgent);
      const os = getOS(userAgent);

      const doc = {
        _type: "interactionSession",
        _id: sessionId,
        sessionId,
        userId: userId || "anonymous_visitor",
        startedAt: now,
        lastActiveAt: now,
        duration: 0,
        device,
        browser,
        os,
        country: finalCountry,
        ipAddress: finalIp,
        cookieConsent: consentVal,
        referrer: payload?.referrer || "",
        pages: [],
        events: [
          {
            _key: Math.random().toString(36).substring(2, 9),
            timestamp: now,
            type: "session_start",
            path: payload?.path || "/",
            target: "",
            details: `Device: ${device}, Browser: ${browser}, OS: ${os}`,
          },
        ],
      };

      await writeClient.createOrReplace(doc);
    } 
    else if (action === "page_enter") {
      const { pageKey, path, title } = payload || {};
      if (!pageKey || !path) {
        return NextResponse.json({ error: "Missing page_enter parameters" }, { status: 400 });
      }

      await writeClient.patch(sessionId)
        .setIfMissing({ pages: [] })
        .append("pages", [
          {
            _key: pageKey,
            path,
            title: title || "",
            enteredAt: now,
            timeSpent: 0,
            maxScrollDepth: 0,
          },
        ])
        .set({ 
          lastActiveAt: now,
          cookieConsent: consentVal,
          ipAddress: finalIp,
          country: finalCountry,
          userId: userId || "anonymous_visitor"
        })
        .commit();
    } 
    else if (action === "page_update") {
      const { pageKey, timeSpent, maxScrollDepth, duration } = payload || {};
      if (!pageKey) {
        return NextResponse.json({ error: "Missing page_update parameters" }, { status: 400 });
      }

      await writeClient.patch(sessionId)
        .set({
          [`pages[_key == "${pageKey}"].timeSpent`]: timeSpent ?? 0,
          [`pages[_key == "${pageKey}"].maxScrollDepth`]: maxScrollDepth ?? 0,
          [`pages[_key == "${pageKey}"].exitedAt`]: now,
          lastActiveAt: now,
          duration: duration ?? 0,
          cookieConsent: consentVal,
          ipAddress: finalIp,
          country: finalCountry,
          userId: userId || "anonymous_visitor"
        })
        .commit();
    } 
    else if (action === "event") {
      const { type, path, target, details, duration } = payload || {};
      if (!type) {
        return NextResponse.json({ error: "Missing event parameters" }, { status: 400 });
      }

      await writeClient.patch(sessionId)
        .setIfMissing({ events: [] })
        .append("events", [
          {
            _key: Math.random().toString(36).substring(2, 9),
            timestamp: now,
            type,
            path: path || "",
            target: target || "",
            details: details ? String(details) : "",
          },
        ])
        .set({
          lastActiveAt: now,
          duration: duration ?? 0,
          cookieConsent: consentVal,
          ipAddress: finalIp,
          country: finalCountry,
          userId: userId || "anonymous_visitor"
        })
        .commit();
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[track] POST error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
