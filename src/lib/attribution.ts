/**
 * Attribution capture — UTM parameters + referrer.
 *
 * WHY THIS FILE EXISTS (2026-10-06):
 * A booking came in but there was no way to know how the customer found us.
 * The newsletter signup email only says "newsletter" — it doesn't tell us
 * what search query, social post, or referral brought them to the site.
 *
 * WHAT IT DOES:
 * - On first visit, captures UTM parameters (utm_source, utm_medium, utm_campaign,
 *   utm_term, utm_content) from the URL and stores them in localStorage.
 * - Also captures document.referrer (the page that sent the visitor here).
 * - On subsequent visits, the stored attribution persists (so we know the
 *   original source even if they come back via a different channel later).
 * - Provides getAttribution() to retrieve the stored data for tracking events.
 *
 * STORAGE:
 * - localStorage key: "flighko_attribution"
 * - Falls back to sessionStorage if localStorage is unavailable.
 * - Data persists across sessions (no expiry) so we always know the original source.
 */

export interface AttributionData {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  referrer: string;
  landing_page: string;
  captured_at: string; // ISO timestamp
}

const STORAGE_KEY = "flighko_attribution";

function getStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    try {
      return window.sessionStorage;
    } catch {
      return null;
    }
  }
}

/**
 * Capture attribution data from the current URL and referrer.
 * Only captures on first visit (no existing data).
 * Returns the stored attribution data (existing or newly captured).
 */
export function captureAttribution(): AttributionData | null {
  const storage = getStorage();
  if (!storage) return null;

  // Check if we already have attribution data
  const existing = storage.getItem(STORAGE_KEY);
  if (existing) {
    try {
      return JSON.parse(existing) as AttributionData;
    } catch {
      // Corrupted data — overwrite
    }
  }

  // Parse UTM parameters from URL
  const params = new URLSearchParams(window.location.search);
  const utm_source = params.get("utm_source") || "";
  const utm_medium = params.get("utm_medium") || "";
  const utm_campaign = params.get("utm_campaign") || "";
  const utm_term = params.get("utm_term") || "";
  const utm_content = params.get("utm_content") || "";

  // Get referrer (the page that linked here)
  const referrer = document.referrer || "(direct)";

  // Get landing page (the first page they visited)
  const landing_page = window.location.pathname + window.location.search;

  const data: AttributionData = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer,
    landing_page,
    captured_at: new Date().toISOString(),
  };

  // Store for future visits
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Storage full or unavailable — ignore
  }

  return data;
}

/**
 * Retrieve stored attribution data without capturing.
 * Returns null if no data has been captured yet.
 */
export function getAttribution(): AttributionData | null {
  const storage = getStorage();
  if (!storage) return null;

  const existing = storage.getItem(STORAGE_KEY);
  if (!existing) return null;

  try {
    return JSON.parse(existing) as AttributionData;
  } catch {
    return null;
  }
}

/**
 * Clear stored attribution data (useful for testing).
 */
export function clearAttribution(): void {
  const storage = getStorage();
  if (!storage) return;
  storage.removeItem(STORAGE_KEY);
}

/**
 * Get a human-readable summary of the attribution data.
 * Returns "Direct / None" if no attribution data is available.
 */
export function getAttributionSummary(): string {
  const data = getAttribution();
  if (!data) return "Direct / None";

  const parts: string[] = [];

  if (data.utm_source) {
    parts.push(`${data.utm_source} / ${data.utm_medium || "unknown"}`);
  } else if (data.referrer && data.referrer !== "(direct)") {
    try {
      const refUrl = new URL(data.referrer);
      parts.push(`Referral: ${refUrl.hostname}`);
    } catch {
      parts.push(`Referral: ${data.referrer.slice(0, 50)}`);
    }
  } else {
    parts.push("Direct / None");
  }

  if (data.utm_campaign) {
    parts.push(`campaign: ${data.utm_campaign}`);
  }

  return parts.join(" · ");
}
