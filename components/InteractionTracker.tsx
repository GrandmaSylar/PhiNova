"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function InteractionTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Refs to hold mutable tracking state across renders
  const sessionIdRef = useRef<string>("");
  const userIdRef = useRef<string>("");
  const consentRef = useRef<string>("anonymous"); // "accepted" | "declined" | "anonymous"

  const pageKeyRef = useRef<string>("");
  const pagePathRef = useRef<string>("");
  const pageTitleRef = useRef<string>("");
  const pageActiveTimeRef = useRef<number>(0);

  const sessionActiveTimeRef = useRef<number>(0);
  const maxScrollDepthRef = useRef<number>(0);
  const firedCheckpointsRef = useRef<Set<number>>(new Set());
  
  const lastActivityRef = useRef<number>(Date.now());
  const isIdleRef = useRef<boolean>(false);

  // Helper function to transmit events to API
  const sendTracking = (action: string, payload?: Record<string, any>) => {
    if (!sessionIdRef.current) return;
    
    const url = "/api/track";
    const body = JSON.stringify({
      action,
      sessionId: sessionIdRef.current,
      userId: userIdRef.current,
      cookieConsent: consentRef.current,
      payload,
    });

    // Use keepalive for page unloading situations
    const useKeepAlive = action === "page_update" && typeof document !== "undefined" && document.visibilityState === "hidden";

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
      keepalive: useKeepAlive,
    }).catch((err) => {
      console.warn("[tracker] Send failed:", err);
    });
  };

  // Helper to initialize session and visitor IDs based on consent status
  const initializeIdentifiers = () => {
    const consent = localStorage.getItem("phinova-cookie-consent");
    consentRef.current = consent === "accepted" ? "accepted" : consent === "declined" ? "declined" : "anonymous";

    if (consentRef.current === "accepted") {
      let sid = sessionStorage.getItem("phinova_session_id");
      if (!sid) {
        sid = "session_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
        sessionStorage.setItem("phinova_session_id", sid);
      }
      sessionIdRef.current = sid;

      let uid = localStorage.getItem("phinova_user_id");
      if (!uid) {
        uid = "user_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
        localStorage.setItem("phinova_user_id", uid);
      }
      userIdRef.current = uid;
    } else {
      // Option B: Cookieless, in-memory transient IDs (no cookies/localStorage written)
      if (!sessionIdRef.current) {
        sessionIdRef.current = "temp_session_" + Math.random().toString(36).substring(2, 12) + "_" + Date.now();
      }
      if (!userIdRef.current) {
        userIdRef.current = "anonymous_visitor";
      }
    }
  };

  // 1. Initial configuration (session & user ID setup, global event listeners)
  useEffect(() => {
    initializeIdentifiers();

    // Send initial session started event
    sendTracking("start_session", {
      referrer: typeof document !== "undefined" ? document.referrer : "",
      path: window.location.pathname,
    });

    // Listen for consent preference changes dispatched from the CookieConsent component
    const handleConsentChange = () => {
      const prevConsent = consentRef.current;
      initializeIdentifiers();

      if (consentRef.current !== prevConsent) {
        // Upgrade current transient session if they accepted cookies
        if (consentRef.current === "accepted") {
          const currentSid = sessionIdRef.current;
          const currentUid = "user_" + Math.random().toString(36).substring(2, 15) + "_" + Date.now();
          
          sessionStorage.setItem("phinova_session_id", currentSid);
          localStorage.setItem("phinova_user_id", currentUid);
          userIdRef.current = currentUid;
        } else if (consentRef.current === "declined") {
          // Explicit opt-out: ensure no tracking identifiers remain in storage
          sessionStorage.removeItem("phinova_session_id");
          localStorage.removeItem("phinova_user_id");
        }

        // Notify server of the consent preference transition
        sendTracking("event", {
          type: "visibility",
          path: pagePathRef.current,
          details: `consent_changed_to_${consentRef.current}`,
          duration: sessionActiveTimeRef.current,
        });
      }
    };

    window.addEventListener("phinova-consent-change", handleConsentChange);

    // Click tracking handler
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactiveEl = target.closest("a, button, [role='button'], input, select, textarea");
      if (!interactiveEl) return;

      const tagName = interactiveEl.tagName.toLowerCase();
      let label = "";

      if (tagName === "a") {
        const href = interactiveEl.getAttribute("href") || "";
        const text = interactiveEl.textContent?.trim().slice(0, 50) || "";
        label = `Link: "${text}" -> ${href}`;
      } else if (tagName === "button") {
        const text = interactiveEl.textContent?.trim().slice(0, 50) || "";
        const id = interactiveEl.id ? `#${interactiveEl.id}` : "";
        label = `Button: "${text}"${id}`;
      } else if (tagName === "input") {
        const type = interactiveEl.getAttribute("type") || "text";
        const name = interactiveEl.getAttribute("name") || "";
        const placeholder = interactiveEl.getAttribute("placeholder") || "";
        label = `Input (${type}): name="${name}" placeholder="${placeholder}"`;
      } else {
        const text = interactiveEl.textContent?.trim().slice(0, 50) || "";
        label = `${interactiveEl.tagName.toUpperCase()}: "${text}"`;
      }

      sendTracking("event", {
        type: "click",
        path: pagePathRef.current,
        target: label,
        duration: sessionActiveTimeRef.current,
      });
    };

    // Scroll tracking handler (calculates scroll percentage and tracks checkpoints)
    const handleScroll = () => {
      lastActivityRef.current = Date.now();
      if (isIdleRef.current) {
        isIdleRef.current = false;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;

      if (scrollPercent > maxScrollDepthRef.current) {
        maxScrollDepthRef.current = Math.min(scrollPercent, 100);
      }

      // Checkpoints to trigger events for: 25%, 50%, 75%, 100%
      const checkpoints = [25, 50, 75, 100];
      for (const cp of checkpoints) {
        if (scrollPercent >= cp && !firedCheckpointsRef.current.has(cp)) {
          firedCheckpointsRef.current.add(cp);
          sendTracking("event", {
            type: "scroll",
            path: pagePathRef.current,
            details: String(cp),
            duration: sessionActiveTimeRef.current,
          });
        }
      }
    };

    // Activity tracking handler (resets idle status)
    const handleUserActivity = () => {
      lastActivityRef.current = Date.now();
      if (isIdleRef.current) {
        isIdleRef.current = false;
        sendTracking("event", {
          type: "visibility",
          path: pagePathRef.current,
          details: "active",
          duration: sessionActiveTimeRef.current,
        });
      }
    };

    // 1-second interval to accumulate active time (screentime)
    const activeTimeInterval = setInterval(() => {
      // Check idle status (60 seconds threshold)
      const timeSinceActivity = Date.now() - lastActivityRef.current;
      if (timeSinceActivity > 60000) {
        if (!isIdleRef.current) {
          isIdleRef.current = true;
          sendTracking("event", {
            type: "visibility",
            path: pagePathRef.current,
            details: "idle",
            duration: sessionActiveTimeRef.current,
          });
        }
        return;
      }

      // Skip active time aggregation if tab is hidden/backgrounded
      if (document.visibilityState === "hidden") return;

      pageActiveTimeRef.current += 1;
      sessionActiveTimeRef.current += 1;
    }, 1000);

    // 10-second periodic heartbeat to synchronize page engagement state to Sanity
    const heartbeatInterval = setInterval(() => {
      if (pageKeyRef.current) {
        sendTracking("page_update", {
          pageKey: pageKeyRef.current,
          timeSpent: pageActiveTimeRef.current,
          maxScrollDepth: maxScrollDepthRef.current,
          duration: sessionActiveTimeRef.current,
        });
      }
    }, 10000);

    // Event listeners
    document.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    
    // User activity listeners for idle detection
    window.addEventListener("mousemove", handleUserActivity, { passive: true });
    window.addEventListener("keydown", handleUserActivity, { passive: true });

    // Handle unload / tab hidden events to make final tracking saves
    const handleUnloadOrVisibility = () => {
      if (pageKeyRef.current) {
        sendTracking("page_update", {
          pageKey: pageKeyRef.current,
          timeSpent: pageActiveTimeRef.current,
          maxScrollDepth: maxScrollDepthRef.current,
          duration: sessionActiveTimeRef.current,
        });
      }
    };

    window.addEventListener("beforeunload", handleUnloadOrVisibility);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleUnloadOrVisibility();
        sendTracking("event", {
          type: "visibility",
          path: pagePathRef.current,
          details: "tab_hidden",
          duration: sessionActiveTimeRef.current,
        });
      } else {
        lastActivityRef.current = Date.now();
        sendTracking("event", {
          type: "visibility",
          path: pagePathRef.current,
          details: "tab_visible",
          duration: sessionActiveTimeRef.current,
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(activeTimeInterval);
      clearInterval(heartbeatInterval);
      window.removeEventListener("phinova-consent-change", handleConsentChange);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleUserActivity);
      window.removeEventListener("keydown", handleUserActivity);
      window.removeEventListener("beforeunload", handleUnloadOrVisibility);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // 2. Navigation Change Tracking (monitors pathname changes)
  useEffect(() => {
    if (!pathname || !sessionIdRef.current) return;

    // Send final update for the page we are leaving
    if (pageKeyRef.current) {
      sendTracking("page_update", {
        pageKey: pageKeyRef.current,
        timeSpent: pageActiveTimeRef.current,
        maxScrollDepth: maxScrollDepthRef.current,
        duration: sessionActiveTimeRef.current,
      });
    }

    // Set up state variables for the new page view
    const newPageKey = "page_" + Math.random().toString(36).substring(2, 9);
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : "");

    pageKeyRef.current = newPageKey;
    pagePathRef.current = fullPath;
    pageTitleRef.current = document.title;
    pageActiveTimeRef.current = 0;
    maxScrollDepthRef.current = 0;
    firedCheckpointsRef.current = new Set<number>();

    // Send the page enter tracking message
    sendTracking("page_enter", {
      pageKey: newPageKey,
      path: fullPath,
      title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}
