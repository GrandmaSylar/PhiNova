"use client";

import { useState, useEffect } from "react";
import { useClient } from "sanity";
import { 
  Users, 
  Fingerprint, 
  Cookie, 
  Clock, 
  Monitor, 
  Browsers, 
  Globe, 
  Circle,
  ChartBar
} from "@phosphor-icons/react";

interface PageView {
  path: string;
  title: string;
  timeSpent?: number;
  maxScrollDepth?: number;
}

interface InteractionEvent {
  type: string;
  timestamp: string;
  path: string;
}

interface Session {
  _id: string;
  startedAt: string;
  lastActiveAt: string;
  duration?: number;
  device?: string;
  browser?: string;
  os?: string;
  country?: string;
  cookieConsent?: string;
  userId?: string;
  pages?: PageView[];
  events?: InteractionEvent[];
}

export function AnalyticsDashboard() {
  const client = useClient({ apiVersion: "2024-06-01" });
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    client
      .fetch<Session[]>(
        `*[_type == "interactionSession"] | order(lastActiveAt desc) [0...1000] {
          _id,
          startedAt,
          lastActiveAt,
          duration,
          device,
          browser,
          os,
          country,
          cookieConsent,
          userId,
          pages,
          events
        }`
      )
      .then((data) => {
        setSessions(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch analytics:", err);
        setError("Failed to load analytics data. Check console for details.");
        setLoading(false);
      });
  }, [client]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-steel dark:text-white p-8">
        <div className="w-8 h-8 border-4 border-steel/20 border-t-steel rounded-full animate-spin"></div>
        <p className="text-sm font-medium animate-pulse">Analyzing visitor metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 max-w-lg mx-auto mt-10 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400">
        <h3 className="font-semibold mb-2">Error Loading Analytics</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  // ── Metrics Aggregations ──────────────────────────────────────────────────
  const totalSessions = sessions.length;
  
  // Unique Visitors (based on userId)
  const uniqueVisitors = new Set(
    sessions.map((s) => s.userId).filter((id) => id && id !== "anonymous_visitor")
  ).size + sessions.filter((s) => s.userId === "anonymous_visitor").length;

  // Cookie Consent Rate
  const consentAccepted = sessions.filter((s) => s.cookieConsent === "accepted").length;
  const consentDeclined = sessions.filter((s) => s.cookieConsent === "declined").length;
  const consentAnonymous = sessions.filter((s) => !s.cookieConsent || s.cookieConsent === "anonymous").length;
  const totalConsentedDecided = consentAccepted + consentDeclined;
  const consentOptInRate = totalConsentedDecided > 0 
    ? Math.round((consentAccepted / totalConsentedDecided) * 100) 
    : 0;

  // Average Duration
  const totalDuration = sessions.reduce((acc, s) => acc + (s.duration || 0), 0);
  const avgDurationSeconds = totalSessions > 0 ? totalDuration / totalSessions : 0;
  const avgMin = Math.floor(avgDurationSeconds / 60);
  const avgSec = Math.round(avgDurationSeconds % 60);
  const avgDurationStr = avgMin > 0 ? `${avgMin}m ${avgSec}s` : `${avgSec}s`;

  // Page Views counts
  const pageViewsMap: Record<string, { count: number; title: string }> = {};
  sessions.forEach((s) => {
    s.pages?.forEach((p) => {
      const key = p.path || "/";
      if (!pageViewsMap[key]) {
        pageViewsMap[key] = { count: 0, title: p.title || key };
      }
      pageViewsMap[key].count += 1;
    });
  });
  const sortedPages = Object.entries(pageViewsMap)
    .map(([path, data]) => ({ path, count: data.count, title: data.title }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const maxPageViews = sortedPages[0]?.count || 1;

  // Devices counts
  const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
  sessions.forEach((s) => {
    const dev = s.device || "Desktop";
    const normalized = dev.charAt(0).toUpperCase() + dev.slice(1).toLowerCase();
    if (normalized in deviceCounts) {
      deviceCounts[normalized] += 1;
    } else {
      deviceCounts["Desktop"] += 1; // Fallback
    }
  });

  const maxDeviceCount = Math.max(...Object.values(deviceCounts), 1);

  // Country counts
  const countryCounts: Record<string, number> = {};
  sessions.forEach((s) => {
    const geo = s.country || "Anonymous";
    countryCounts[geo] = (countryCounts[geo] || 0) + 1;
  });
  const sortedCountries = Object.entries(countryCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-6 md:gap-8 bg-gray-50 dark:bg-[#101112] min-h-screen text-slate-800 dark:text-slate-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ChartBar className="text-indigo-500" />
            Visitor Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time tracking metrics and cookie privacy opt-in choices.
          </p>
        </div>
        <div className="text-xs bg-slate-200 dark:bg-slate-800 px-3 py-1.5 rounded-full font-semibold text-slate-600 dark:text-slate-300">
          Showing latest {sessions.length} sessions
        </div>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* Metric 1: Total Sessions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Users size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sessions</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalSessions}</div>
          </div>
        </div>

        {/* Metric 2: Unique Visitors */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-teal-500/10 text-teal-500 rounded-xl">
            <Fingerprint size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Unique Visitors</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{uniqueVisitors}</div>
          </div>
        </div>

        {/* Metric 3: Cookie Acceptance Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Cookie size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cookie Opt-In Rate</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
              {consentOptInRate}%
              <span className="text-xs font-normal text-slate-400 ml-1.5">({consentAccepted} / {totalConsentedDecided})</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Average Duration */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="p-3 bg-rose-500/10 text-rose-500 rounded-xl">
            <Clock size={24} weight="duotone" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Avg. Engagement</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{avgDurationStr}</div>
          </div>
        </div>
      </div>

      {/* Grid: Columns of graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Left Column: Top Visited Pages */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Monitor size={18} />
              Top Visited Pages
            </h3>
            <span className="text-xs text-slate-400 font-medium">By views</span>
          </div>

          <div className="flex flex-col gap-4">
            {sortedPages.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No page data logged yet.</p>
            ) : (
              sortedPages.map((page, idx) => {
                const percentage = Math.round((page.count / maxPageViews) * 100);
                return (
                  <div key={page.path} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="truncate text-slate-700 dark:text-slate-300 max-w-[75%]" title={page.path}>
                        {idx + 1}. {page.title} <span className="text-[10px] text-slate-400 font-normal">({page.path})</span>
                      </span>
                      <span className="text-slate-900 dark:text-white font-bold">{page.count} views</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Cookie Consent Preferences */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-5">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Cookie size={18} />
              Cookie Consent Preferences
            </h3>
            <span className="text-xs text-slate-400 font-medium">Differentiated visitor choices</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 items-center justify-center py-2">
            
            {/* SVG Pie Chart */}
            <div className="relative w-32 h-32 shrink-0">
              {totalSessions === 0 ? (
                <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full">
                  No Data
                </div>
              ) : (
                <>
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                    {/* Background Circle */}
                    <circle cx="16" cy="16" r="14" fill="transparent" stroke="#e2e8f0" strokeWidth="4" className="dark:stroke-slate-800" />
                    
                    {/* Anonymous Segment */}
                    {consentAnonymous > 0 && (
                      <circle 
                        cx="16" cy="16" r="14" fill="transparent" 
                        stroke="#94a3b8" strokeWidth="4" 
                        strokeDasharray="87.96" 
                        strokeDashoffset={((totalSessions - consentAnonymous) / totalSessions) * 87.96} 
                      />
                    )}
                    
                    {/* Declined Segment */}
                    {consentDeclined > 0 && (
                      <circle 
                        cx="16" cy="16" r="14" fill="transparent" 
                        stroke="#f59e0b" strokeWidth="4" 
                        strokeDasharray="87.96" 
                        strokeDashoffset={((totalSessions - consentAnonymous - consentDeclined) / totalSessions) * 87.96} 
                      />
                    )}

                    {/* Accepted Segment */}
                    {consentAccepted > 0 && (
                      <circle 
                        cx="16" cy="16" r="14" fill="transparent" 
                        stroke="#6366f1" strokeWidth="4" 
                        strokeDasharray="87.96" 
                        strokeDashoffset="0" 
                        style={{
                          strokeDasharray: `${(consentAccepted / totalSessions) * 87.96} 87.96`
                        }}
                      />
                    )}
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-lg font-extrabold text-slate-900 dark:text-white">{consentOptInRate}%</span>
                    <span className="text-[9px] uppercase tracking-wider font-semibold text-slate-400">Opt-In</span>
                  </div>
                </>
              )}
            </div>

            {/* Labels Legend */}
            <div className="flex-1 flex flex-col gap-3.5 w-full">
              {/* Accepted */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-indigo-500 block"></span>
                  Accepted Cookies
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {consentAccepted} <span className="font-normal text-slate-400 text-[10px]">({totalSessions > 0 ? Math.round((consentAccepted / totalSessions) * 100) : 0}%)</span>
                </span>
              </div>

              {/* Declined */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-amber-500 block"></span>
                  Declined Cookies (Anonymous)
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {consentDeclined} <span className="font-normal text-slate-400 text-[10px]">({totalSessions > 0 ? Math.round((consentDeclined / totalSessions) * 100) : 0}%)</span>
                </span>
              </div>

              {/* Anonymous */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full bg-slate-400 block"></span>
                  No Choice Selected (Default Anonymous)
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {consentAnonymous} <span className="font-normal text-slate-400 text-[10px]">({totalSessions > 0 ? Math.round((consentAnonymous / totalSessions) * 100) : 0}%)</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Device Category & Geographic Origins */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        
        {/* Device Breakdown */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Browsers size={18} />
              Devices Used
            </h3>
          </div>

          <div className="flex flex-col gap-4 pt-1">
            {Object.entries(deviceCounts).map(([deviceType, count]) => {
              const percentage = totalSessions > 0 ? Math.round((count / totalSessions) * 100) : 0;
              const barPercentage = Math.round((count / maxDeviceCount) * 100);
              let barColor = "bg-indigo-500";
              if (deviceType === "Mobile") barColor = "bg-teal-500";
              if (deviceType === "Tablet") barColor = "bg-pink-500";

              return (
                <div key={deviceType} className="flex items-center gap-4">
                  <div className="w-20 text-xs font-bold text-slate-600 dark:text-slate-400">{deviceType}</div>
                  <div className="flex-1 w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div 
                      className={`${barColor} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${barPercentage}%` }}
                    ></div>
                  </div>
                  <div className="w-16 text-right text-xs font-bold text-slate-900 dark:text-white">
                    {count} <span className="font-normal text-slate-400 text-[10px]">({percentage}%)</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Geographic origins */}
        <div className="p-6 rounded-2xl bg-white dark:bg-[#18191a] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Globe size={18} />
              Geographic Location (Countries)
            </h3>
          </div>

          <div className="flex flex-col gap-3 pt-1">
            {sortedCountries.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No location logs available.</p>
            ) : (
              sortedCountries.map((item, idx) => {
                const pct = totalSessions > 0 ? Math.round((item.count / totalSessions) * 100) : 0;
                return (
                  <div key={item.name} className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">
                      {idx + 1}. {item.name === "US" ? "🇺🇸 United States (US)" : 
                                item.name === "GB" ? "🇬🇧 United Kingdom (GB)" :
                                item.name === "CA" ? "🇨🇦 Canada (CA)" :
                                item.name === "Anonymous" ? "🔒 Masked / Anonymous" : `🌍 ${item.name}`}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {item.count} sessions <span className="font-normal text-slate-400 ml-1">({pct}%)</span>
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
