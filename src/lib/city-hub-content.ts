// src/lib/city-hub-content.ts
//
// WHY THIS EXISTS (2026-10-01):
// The 2026-10-01 GSC URL Inspection audit found EVERY from-city hub unindexed —
// 0 of 43. Google's verdict was "URL is unknown to Google", which means it never
// crawled them at all. The cause is thin content: the hub template rendered a
// title, one boilerplate sentence, and link tables. Google does not index
// aggregator pages that add no unique text.
//
// This module composes genuinely unique, per-city prose from the route data that
// already exists in flight-routes.ts — distances, prices, flight times, airline
// counts, frequency, cheapest day, best booking month, delay rates.
//
// RULES (binding, from the SEO method):
//   1. Every sentence must be traceable to a structured field. No invented facts.
//   2. No claim about "live" prices — these are tracked sample fares.
//   3. Output must be stable across builds (deterministic, no Date.now()).
//   4. If a city has too little data, say less rather than pad.

import { flightRoutes } from "@/data/flight-routes";
import type { CityInfo } from "@/data/route-graph";

export interface CityHubContent {
  intro: string;
  corridorNote: string | null;
  cheapest: { slug: string; label: string; price: number }[];
  bestMonths: { month: string; routes: string[] }[];
  stats: { routes: number; minPrice: number; maxPrice: number; avgPrice: number; airlines: number };
  faqs: { q: string; a: string }[];
}

const MONTH_ORDER = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** Sum the distinct airline counts across a city's routes (lower bound — a
 *  route's airlineCount is how many carriers serve it, not their names). */
function airlineFloor(slugs: string[]): number {
  let max = 0;
  for (const s of slugs) {
    const n = parseInt(String(flightRoutes[s]?.airlineCount ?? "0"), 10);
    if (!isNaN(n) && n > max) max = n;
  }
  return max;
}

export function buildCityHubContent(c: CityInfo): CityHubContent | null {
  const all = c.routeSlugs.filter((s) => flightRoutes[s]);
  if (!all.length) return null;

  const prices = all.map((s) => flightRoutes[s].price).filter((p) => typeof p === "number" && p > 0);
  if (!prices.length) return null;

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  const airlines = airlineFloor(all);

  // ---- Intro: built from real aggregates ---------------------------------
  const outbound = c.asOriginSlugs.length;
  const inbound = c.asDestinationSlugs.length;
  const parts: string[] = [];

  parts.push(
    `Flighko currently tracks ${all.length} ${all.length === 1 ? "route" : "routes"} touching ${c.name}` +
      (outbound && inbound
        ? ` — ${outbound} departing and ${inbound} arriving.`
        : outbound
          ? `, all departing ${c.name}.`
          : `, all arriving ${c.name}.`),
  );

  if (minPrice === maxPrice) {
    parts.push(`Round-trip sample fares on ${all.length === 1 ? "this route" : "these routes"} sit around $${minPrice}.`);
  } else {
    parts.push(
      `Sample round-trip fares range from $${minPrice} to $${maxPrice}, averaging $${avgPrice}.`,
    );
  }

  if (airlines > 1) {
    parts.push(`The busiest route on this hub is served by ${airlines} airlines.`);
  }

  const intro = parts.join(" ");

  // ---- Corridor note: only when ME is a genuine SUBSET of the hub --------
  // If every route on the hub is already ME, saying so adds nothing (and the
  // earlier "11 of these 11 routes" read as a bug). Also: no fare claim here —
  // the data does not support "ME fares are cheaper" (Cairo→London is $450).
  const middleEast = [
    "jeddah", "dubai", "riyadh", "kuwait", "doha", "bahrain", "abu-dhabi",
    "amman", "beirut", "istanbul", "cairo",
  ];
  const meCount = all.filter((s) =>
    middleEast.some((m) => s.startsWith(m + "-to-") || s.endsWith("-to-" + m)),
  ).length;

  let corridorNote: string | null = null;
  if (meCount >= 3 && meCount < all.length) {
    corridorNote = `${meCount} of these ${all.length} routes are Middle East / North Africa corridor services.`;
  }

  // ---- Cheapest routes ----------------------------------------------------
  const cheapest = [...all]
    .sort((a, b) => flightRoutes[a].price - flightRoutes[b].price)
    .slice(0, 8)
    .map((s) => {
      const rt = flightRoutes[s];
      const other = rt.originCity === c.name ? rt.destinationCity : rt.originCity;
      return { slug: s, label: `${c.name} → ${other}`, price: rt.price };
    });

  // ---- Best booking month, grouped from real bestMonth fields -------------
  const byMonth: Record<string, string[]> = {};
  for (const s of all) {
    const m = flightRoutes[s].bestMonth;
    if (!m) continue;
    (byMonth[m] ||= []).push(s);
  }
  const bestMonths = Object.entries(byMonth)
    .sort((a, b) => MONTH_ORDER.indexOf(a[0]) - MONTH_ORDER.indexOf(b[0]))
    .map(([month, routes]) => ({ month, routes }));

  // ---- FAQs: only answerable from real fields -----------------------------
  const faqs: { q: string; a: string }[] = [];

  const days = [...new Set(all.map((s) => flightRoutes[s].cheapestDay).filter(Boolean))];
  // Phrase by direction: a hub with no departing routes must not say "from X".
  const dir = c.asOriginSlugs.length ? `from ${c.name}` : `to ${c.name}`;
  if (days.length === 1) {
    faqs.push({
      q: `What is the cheapest day to fly ${dir}?`,
      a:
        all.length === 1
          ? `${days[0]} is the cheapest departure day on this route.`
          : `${days[0]} is the cheapest departure day on all ${all.length} routes we track ${dir}.`,
    });
  } else if (days.length > 1) {
    const counts: Record<string, number> = {};
    for (const s of all) {
      const d = flightRoutes[s].cheapestDay;
      if (d) counts[d] = (counts[d] || 0) + 1;
    }
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    faqs.push({
      q: `What is the cheapest day to fly from ${c.name}?`,
      a:
        `${top[0][0]} is cheapest on ${top[0][1]} of the ${all.length} routes we track` +
        (top[1] ? `, with ${top[1][0]} cheapest on ${top[1][1]}.` : "."),
    });
  }

  if (bestMonths.length) {
    const top = bestMonths.sort((a, b) => b.routes.length - a.routes.length)[0];
    faqs.push({
      q: `What is the best month to book flights from ${c.name}?`,
      a:
        top.routes.length === all.length
          ? `Our data points to ${top.month} as the best booking month across every route on this hub.`
          : `Our data points to ${top.month} for ${top.routes.length} of the ${all.length} routes on this hub.`,
    });
  }

  if (minPrice !== maxPrice) {
    faqs.push({
      q: `How much do flights from ${c.name} cost?`,
      a: `Sample round-trip fares across the routes we track run from $${minPrice} to $${maxPrice}, averaging $${avgPrice}. Always confirm the live fare before booking.`,
    });
  }

  return {
    intro,
    corridorNote,
    cheapest,
    bestMonths,
    stats: { routes: all.length, minPrice, maxPrice, avgPrice, airlines },
    faqs,
  };
}
