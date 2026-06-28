import { defineField, defineType } from "sanity";

export const interactionSession = defineType({
  name: "interactionSession",
  title: "Visitor Session Log",
  type: "document",
  fields: [
    defineField({ 
      name: "sessionId", 
      title: "Session Reference ID", 
      type: "string", 
      readOnly: true,
      description: "A unique identifier generated for this specific visit."
    }),
    defineField({ 
      name: "userId", 
      title: "Visitor Profile Identifier", 
      type: "string", 
      readOnly: true,
      description: "A persistent key used to link returning visits from the same device."
    }),
    defineField({ 
      name: "startedAt", 
      title: "Arrival Time (Session Started)", 
      type: "datetime", 
      readOnly: true 
    }),
    defineField({ 
      name: "lastActiveAt", 
      title: "Last Activity Recorded", 
      type: "datetime", 
      readOnly: true 
    }),
    defineField({ 
      name: "duration", 
      title: "Total Engagement Duration", 
      type: "number", 
      readOnly: true,
      description: "Total active time (screentime) the visitor spent looking at or interacting with the site, excluding idle time."
    }),
    defineField({ 
      name: "device", 
      title: "Device Category", 
      type: "string", 
      readOnly: true,
      description: "Whether the visitor used a Desktop, Mobile, or Tablet device."
    }),
    defineField({ 
      name: "browser", 
      title: "Web Browser", 
      type: "string", 
      readOnly: true 
    }),
    defineField({ 
      name: "os", 
      title: "Operating System", 
      type: "string", 
      readOnly: true 
    }),
    defineField({ 
      name: "country", 
      title: "Visitor Location (Country)", 
      type: "string", 
      readOnly: true,
      description: "Estimated country where the connection originated."
    }),
    defineField({ 
      name: "ipAddress", 
      title: "Network Address (IP)", 
      type: "string", 
      readOnly: true 
    }),
    defineField({ 
      name: "referrer", 
      title: "Traffic Source (Where they came from)", 
      type: "string", 
      readOnly: true,
      description: "The webpage URL that referred the visitor to this website."
    }),
    defineField({
      name: "cookieConsent",
      title: "Cookie Consent Status",
      type: "string",
      readOnly: true,
      options: {
        list: [
          { title: "Accepted", value: "accepted" },
          { title: "Declined", value: "declined" },
          { title: "Anonymous", value: "anonymous" },
        ],
      },
      description: "Whether the user accepted cookies, declined, or was tracked anonymously by default."
    }),
    defineField({
      name: "pages",
      title: "Visited Pages",
      type: "array",
      readOnly: true,
      description: "List of pages viewed during this session, including engagement time and scroll behavior on each page.",
      of: [
        {
          type: "object",
          name: "pageView",
          fields: [
            { name: "path", type: "string", title: "Page URL (Address)", readOnly: true },
            { name: "title", type: "string", title: "Page Name", readOnly: true },
            { name: "enteredAt", type: "datetime", title: "Opened At", readOnly: true },
            { name: "exitedAt", type: "datetime", title: "Closed/Left At", readOnly: true },
            { name: "timeSpent", type: "number", title: "Active Time Spent (Seconds)", readOnly: true },
            { name: "maxScrollDepth", type: "number", title: "Maximum Scroll Percentage (%)", readOnly: true },
          ],
          preview: {
            select: {
              path: "path",
              title: "title",
              timeSpent: "timeSpent",
              maxScrollDepth: "maxScrollDepth",
            },
            prepare({ path, title, timeSpent, maxScrollDepth }) {
              const minutes = Math.floor((timeSpent || 0) / 60);
              const seconds = Math.round((timeSpent || 0) % 60);
              const timeStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
              const pageLabel = title ? `${title} (${path})` : path || "/";

              return {
                title: pageLabel,
                subtitle: `Viewed for ${timeStr} | Scrolled through ${maxScrollDepth ?? 0}% of the page`,
              };
            },
          },
        },
      ],
    }),
    defineField({
      name: "events",
      title: "Visitor Activity Timeline",
      type: "array",
      readOnly: true,
      description: "A chronological timeline of actions performed by the visitor during this session.",
      of: [
        {
          type: "object",
          name: "interactionEvent",
          fields: [
            { name: "timestamp", type: "datetime", title: "Activity Time", readOnly: true },
            { name: "type", type: "string", title: "Action Type", readOnly: true },
            { name: "path", type: "string", title: "Page URL", readOnly: true },
            { name: "target", type: "string", title: "Element Interacted With", readOnly: true },
            { name: "details", type: "string", title: "Details", readOnly: true },
          ],
          preview: {
            select: {
              type: "type",
              timestamp: "timestamp",
              path: "path",
              target: "target",
              details: "details",
            },
            prepare({ type, timestamp, path, target, details }) {
              const timeStr = timestamp ? new Date(timestamp).toLocaleTimeString() : "";
              let title = type ? type.toUpperCase() : "ACTIVITY";
              let subtitle = `On page: ${path || "/"} @ ${timeStr}`;

              if (type === "click") {
                title = `🖱️ Clicked: ${target || "element"}`;
              } else if (type === "scroll") {
                title = `📜 Scrolled past ${details || "0"}% of page`;
              } else if (type === "session_start") {
                title = `🚀 Visitor Arrived on Site`;
              } else if (type === "visibility") {
                if (details === "tab_hidden") {
                  title = `👁️ Switched Tabs (Backgrounded)`;
                } else if (details === "tab_visible") {
                  title = `👁️ Returned to Tab (Foregrounded)`;
                } else if (details === "idle") {
                  title = `💤 Became Idle (No Activity)`;
                } else if (details === "active") {
                  title = `⚡ Resumed Activity`;
                } else {
                  title = `👁️ Tab Status: ${details}`;
                }
              }

              return {
                title,
                subtitle,
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {
      device: "device",
      browser: "browser",
      os: "os",
      country: "country",
      startedAt: "startedAt",
      duration: "duration",
    },
    prepare({ device, browser, os, country, startedAt, duration }) {
      const dateStr = startedAt ? new Date(startedAt).toLocaleString() : "Unknown date";
      
      const minutes = Math.floor((duration || 0) / 60);
      const seconds = Math.round((duration || 0) % 60);
      const durStr = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      
      const geoStr = country ? ` from ${country}` : "";
      
      let icon = "💻";
      const devLower = (device || "").toLowerCase();
      if (devLower === "mobile") icon = "📱";
      if (devLower === "tablet") icon = "📟";

      return {
        title: `${icon} ${device || "Desktop"} Visitor (${browser || "Unknown"} on ${os || "Unknown"})`,
        subtitle: `${dateStr} | Active Session: ${durStr}${geoStr}`,
      };
    },
  },
  orderings: [
    { title: "Most Recent Visits", name: "recent", by: [{ field: "lastActiveAt", direction: "desc" }] },
    { title: "Longest Engagement Visits", name: "durationDesc", by: [{ field: "duration", direction: "desc" }] },
  ],
});
