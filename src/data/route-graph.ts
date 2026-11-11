// src/data/route-graph.ts
// Derived route-linking layer for the whole-site structure rebuild (blueprint
// v2-brain/coding-team/site-structure-blueprint.md, P1).
//
// READ-ONLY over flight-routes.ts and route-regions.json — never mutates them.
// Used server-side only (generateStaticParams / SSG render). Tree-shaken from
// client bundles when imported by server components.

import { flightRoutes } from "@/data/flight-routes";
import regionsJson from "@/data/route-regions.json";
import { blogpost as blogPosts } from "@/data/blog-posts";
import { destination as destinationsMap } from "@/data/destinations";
import type { BlogPost } from "@/types";

/* ------------------------------------------------------------------ */
// Slugification helpers (single source of truth — mirrors the city slugs
// already used by /destinations: "New York" -> "new-york").
/* ------------------------------------------------------------------ */

export function cityToSlug(city: string): string {
  // Strip diacritics before slugifying so "Malé" -> "male", not "mal".
  // Without this, the accented char is deleted rather than transliterated and
  // the hub lands at a nonsense slug (/flight-routes/from/mal).
  // Note: from-city hub pages removed 2026-10-06 — cities data retained for route grouping.
  const ascii = city
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // combining diacritical marks
  return ascii
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function regionToSlug(region: string): string {
  return cityToSlug(region); // same rule: "Middle East" -> "middle-east"
}

/* ------------------------------------------------------------------ */
// Derived structures
/* ------------------------------------------------------------------ */

export interface CityInfo {
  name: string; // display name, e.g. "New York"
  slug: string; // "new-york"
  airportCodes: string[]; // distinct airport codes seen for this city
  asOriginSlugs: string[]; // routes departing this city
  asDestinationSlugs: string[]; // routes arriving this city
  routeSlugs: string[]; // both directions, deduped, sorted
}

/** slug -> region name ("Middle East") for every route in regions json */
export const regionOf: Record<string, string> = {};
for (const [region, slugs] of Object.entries(regionsJson as Record<string, string[]>)) {
  for (const s of slugs) {
    if (!(s in regionOf)) regionOf[s] = region; // first wins (routes may appear in 2 regions)
  }
}

/** region name -> { slug, routes } */
export interface RegionInfo {
  name: string;
  slug: string;
  routeSlugs: string[]; // sorted
}

export const regions: RegionInfo[] = Object.entries(
  regionsJson as Record<string, string[]>,
)
  .map(([name, slugs]) => ({
    name,
    slug: regionToSlug(name),
    routeSlugs: [...new Set(slugs)].filter((s) => s in flightRoutes).sort(),
  }))
  .filter((r) => r.routeSlugs.length > 0)
  .sort((a, b) => b.routeSlugs.length - a.routeSlugs.length);

/** city slug -> CityInfo, covering BOTH origin and destination cities */
export const cities: Record<string, CityInfo> = {};

function ensureCity(name: string): CityInfo {
  const slug = cityToSlug(name);
  if (!cities[slug]) {
    cities[slug] = {
      name,
      slug,
      airportCodes: [],
      asOriginSlugs: [],
      asDestinationSlugs: [],
      routeSlugs: [],
    };
  }
  return cities[slug];
}

for (const route of Object.values(flightRoutes)) {
  const o = ensureCity(route.originCity);
  const d = ensureCity(route.destinationCity);
  if (route.originAirportCode && !o.airportCodes.includes(route.originAirportCode))
    o.airportCodes.push(route.originAirportCode);
  if (route.destinationAirportCode && !d.airportCodes.includes(route.destinationAirportCode))
    d.airportCodes.push(route.destinationAirportCode);
  o.asOriginSlugs.push(route.slug);
  d.asDestinationSlugs.push(route.slug);
}

for (const c of Object.values(cities)) {
  c.asOriginSlugs.sort();
  c.asDestinationSlugs.sort();
  c.routeSlugs = [...new Set([...c.asOriginSlugs, ...c.asDestinationSlugs])].sort();
}

/** Sorted by route count desc — for hub indexes / generateStaticParams */
export const cityList: CityInfo[] = Object.values(cities).sort(
  (a, b) => b.routeSlugs.length - a.routeSlugs.length,
);

/* ------------------------------------------------------------------ */
// Related-route suggestions for a route page (P5 uses this)
/* ------------------------------------------------------------------ */

export interface RelatedRoutes {
  reverse: string | null; // b-to-a
  sameOrigin: string[]; // up to n, excluding reverse/self
  sameDestination: string[];
  sameRegion: string[];
}

export function relatedRoutes(slug: string, perGroup = 4): RelatedRoutes {
  const route = flightRoutes[slug];
  const out: RelatedRoutes = { reverse: null, sameOrigin: [], sameDestination: [], sameRegion: [] };
  if (!route) return out;

  const rev = `${cityToSlug(route.destinationCity)}-to-${cityToSlug(route.originCity)}`;
  // flightRoutes keys are "origin-to-destination" in their own slug form
  const reverseKey = Object.keys(flightRoutes).find(
    (k) =>
      flightRoutes[k].originCity === route.destinationCity &&
      flightRoutes[k].destinationCity === route.originCity,
  );
  out.reverse = reverseKey ?? null;
  void rev;

  const originCity = cities[cityToSlug(route.originCity)];
  const destCity = cities[cityToSlug(route.destinationCity)];
  out.sameOrigin = (originCity?.asOriginSlugs ?? []).filter((s) => s !== slug).slice(0, perGroup);
  out.sameDestination = (destCity?.asDestinationSlugs ?? [])
    .filter((s) => s !== slug)
    .slice(0, perGroup);

  const region = regionOf[slug];
  if (region) {
    const r = regions.find((x) => x.name === region);
    const pool = (r?.routeSlugs ?? []).filter(
      (s) =>
        s !== slug &&
        s !== out.reverse &&
        !out.sameOrigin.includes(s) &&
        !out.sameDestination.includes(s),
    );
    out.sameRegion = pool.slice(0, perGroup);
  }
  return out;
}

/* ------------------------------------------------------------------ */
// Complete route list touching a city (both directions) — used by /from/[city]
/* ------------------------------------------------------------------ */

export function routesForCity(citySlug: string) {
  const c = cities[citySlug];
  if (!c) return [];
  return c.routeSlugs.map((s) => flightRoutes[s]).filter(Boolean);
}

/** Routes arriving at a city — used by destination pages (P6) */
export function routesToCity(cityName: string) {
  const slug = cityToSlug(cityName);
  return (cities[slug]?.asDestinationSlugs ?? [])
    .map((s) => flightRoutes[s])
    .filter(Boolean);
}

/** Routes departing a city — destination pages may show both directions */
export function routesFromCity(cityName: string) {
  const slug = cityToSlug(cityName);
  return (cities[slug]?.asOriginSlugs ?? [])
    .map((s) => flightRoutes[s])
    .filter(Boolean);
}

/* ─── Blog → hub contextual links (structure rebuild, blog backfill) ───
 * Maps blog slugs to the region/city hubs their topic supports. Validated
 * at render time against regions/cities — a bad slug simply disappears.
 * Posts not listed fall back to DEFAULT_BLOG_HUBS (index + top regions).
 */
export interface BlogHubLinks {
  regions: { slug: string; name: string }[];
  cities: { slug: string; name: string }[];
}

const BLOG_HUB_MAP: Record<string, { regions?: string[]; cities?: string[] }> = {
  "business-class-error-fares-routes-2026": { regions: ["europe", "middle-east", "asia", "transatlantic"], cities: ["dubai", "london", "singapore", "paris"] },
  "error-fares-guide-2026": { regions: ["europe", "asia", "transatlantic", "usa-domestic"] },
  "cheapest-flights-from-new-york-2026": { regions: ["usa-domestic", "transatlantic", "south-america"], cities: ["new-york", "orlando", "las-vegas"] },
  "cheap-flights-nyc-to-orlando-2026": { cities: ["new-york", "orlando"], regions: ["usa-domestic"] },
  "best-time-book-orlando-flights-2026": { cities: ["orlando"], regions: ["usa-domestic"] },
  "orlando-vs-las-vegas-cost-2026": { cities: ["orlando", "las-vegas"], regions: ["usa-domestic"] },
  "budget-travel-latin-america-2026": { regions: ["south-america"] },
  "cheapest-asian-destinations-2026": { regions: ["asia", "south-asia"], cities: ["bangkok", "singapore", "tokyo", "dubai"] },
  "best-time-to-visit-hawaii-2026": { cities: ["honolulu"], regions: ["usa-domestic", "asia"] },
  "best-vpns-flight-booking-2026": { regions: ["europe", "asia", "transatlantic"] },
  "best-budget-airlines-2026": { regions: ["europe", "asia", "middle-east", "usa-domestic"] },
  "flight-hacks-2026": { regions: ["europe", "asia", "usa-domestic", "middle-east"] },
  "last-minute-flight-deals-2026": { regions: ["europe", "middle-east", "usa-domestic"], cities: ["dubai", "istanbul", "london"] },
  "google-flights-price-alerts-guide-2026": { regions: ["europe", "asia", "transatlantic"] },
  "best-esim-for-travel-2026": { regions: ["europe", "asia", "middle-east"], cities: ["bali", "bangkok", "tokyo", "istanbul"] },
  "travel-rewards-programs-2026": { regions: ["europe", "asia", "middle-east", "transatlantic"], cities: ["dubai", "singapore", "paris"] },
  "credit-card-points-for-flights-2026": { regions: ["europe", "transatlantic", "middle-east"], cities: ["dubai", "london"] },
  "best-time-book-flights-2026": { regions: ["europe", "asia", "usa-domestic"] },
  "cheapest-month-fly-2026": { regions: ["europe", "asia", "usa-domestic", "south-america"] },
};

// Generic fallback for any future post not in the map
const DEFAULT_BLOG_HUBS = { regions: ["europe", "asia", "usa-domestic"], cities: ["london", "dubai", "new-york"] };

export function blogHubLinks(postSlug: string): BlogHubLinks {
  const m = BLOG_HUB_MAP[postSlug] ?? DEFAULT_BLOG_HUBS;
  return {
    regions: (m.regions ?? [])
      .filter((s) => regions.some((r) => r.slug === s))
      .map((s) => ({ slug: s, name: regions.find((r) => r.slug === s)!.name })),
    cities: (m.cities ?? [])
      .filter((s) => cities[s])
      .map((s) => ({ slug: s, name: cities[s].name })),
  };
}

/* ------------------------------------------------------------------ */
// P9 GAP 1 (blueprint v2-brain/seo-team/content-interlinking-blueprint.md):
// destinations -> blog. Derives "Guides about X" per destination by inverting
// BLOG_HUB_MAP (city/region coverage) and matching the destination's name in
// the post body. READ-ONLY — no data files mutated.
/* ------------------------------------------------------------------ */

export interface DestinationRelatedPost {
  slug: string;
  title: string;
  description: string;
  heroImage?: string;
  reason: "city" | "region" | "mention"; // why this post matches
}

const MENTION_SCAN_FIELDS = ["description", "content"] as const;

/** All posts related to a destination slug, best matches first, capped. */
export function destinationRelatedPosts(destSlug: string, cap = 6): DestinationRelatedPost[] {
  const dest = destinationsMap[destSlug];
  if (!dest) return [];

  // Resolve the destination to a flight-routes city key the SAME way the
  // destination page does (P6 matchCityForDest): exact slug, then
  // title-derived, then loose alphanumeric — no duplicated guessing here.
  const fromTitle = dest.title.replace(/^Cheap Flights to\s+/i, "").trim();
  let citySlug: string | null = null;
  if (cities[destSlug]) citySlug = destSlug;
  else if (cities[cityToSlug(fromTitle)]) citySlug = cityToSlug(fromTitle);
  else {
    const norm = destSlug.replace(/-/g, "");
    const hit = Object.values(cities).find(
      (c) => c.slug.replace(/-/g, "") === norm || c.name.toLowerCase().replace(/[^a-z]/g, "") === fromTitle.toLowerCase().replace(/[^a-z]/g, ""),
    );
    citySlug = hit ? hit.slug : null;
  }

  const destRegionSlugs = new Set<string>();
  if (citySlug && cities[citySlug]) {
    for (const rs of cities[citySlug].routeSlugs) {
      const r = regionOf[rs];
      if (r) destRegionSlugs.add(regionToSlug(r));
    }
  }

  const scored: { p: DestinationRelatedPost; score: number }[] = [];
  for (const post of Object.values(blogPosts) as BlogPost[]) {
    let score = 0;
    let reason: DestinationRelatedPost["reason"] = "mention";

    // 1) BLOG_HUB_MAP city hit (strongest signal) — direct OR the destination's
    //    own city slug (e.g. hawaii -> honolulu hub entry matches)
    const m = BLOG_HUB_MAP[post.slug];
    if (citySlug && m?.cities?.includes(citySlug)) {
      score += 10;
      reason = "city";
    }
    // 2) region overlap (post's regions ∩ destination's regions)
    if (m?.regions?.some((r) => destRegionSlugs.has(r))) {
      score += 4;
      if (reason === "mention") reason = "region";
    }
    // 3) destination name mentioned in the post description — strip the
    //    " 2026 — From $298" suffix from the title before matching
    const destName = fromTitle.replace(/\s*\d{4}.*$/, "").trim();
    const hay = MENTION_SCAN_FIELDS.map((f) => String((post as unknown as Record<string, string>)[f] ?? "")).join(" ").toLowerCase();
    if (destName && hay.includes(destName.toLowerCase())) {
      score += 3;
    }
    if (score > 0) {
      scored.push({
        p: {
          slug: post.slug,
          title: post.title,
          description: post.description,
          heroImage: (post as unknown as Record<string, string>).heroImage,
          reason,
        },
        score,
      });
    }
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, cap).map((s) => s.p);
}
