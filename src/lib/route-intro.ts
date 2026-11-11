// Unique route intro paragraphs (change C1 of route-content-upgrade-plan).
// The data file's `description` uses one sentence pattern on 304/368 routes,
// which is exactly what Google's "discovered – not indexed" verdicts punish.
// Instead of hand-editing 368 rows in a 47K-line data file, we compose the
// intro at render time from data that genuinely differs per route:
// distance, price, flight time, airline mix, frequency, season, delay stats.
// Class = route character; shape = slug-stable variant, so output never flips
// between builds. Voice: plain, specific, no marketing filler.

import type { FlightRoute } from "@/data/flight-routes";

type Class = "shortBudget" | "shortBusy" | "mid" | "long";

function kmOf(route: FlightRoute): number {
  const m = /([\d,]+)\s*km/.exec(route.distanceKm ?? "");
  if (m) return parseInt(m[1].replace(/,/g, ""), 10);
  const mi = /([\d,]+)\s*mi/.exec(route.distance ?? "");
  if (mi) return parseInt(mi[1].replace(/,/g, ""), 10) * 1.6;
  return 1500;
}

function routeClass(route: FlightRoute): Class {
  const km = kmOf(route);
  if (km < 900) return route.price >= 150 ? "shortBusy" : "shortBudget";
  if (km < 3000) return "mid";
  return "long";
}

function idx(slug: string, mod: number): number {
  let h = 7;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % mod;
}

/**
 * A→B and B→A share identical facts. Offset the pattern choice by direction
 * (deterministically) so mirror routes never land on the same lead/fact shape.
 */
function dirOffset(slug: string): number {
  const parts = slug.split("-to-");
  if (parts.length !== 2) return 0;
  const rev = parts[1] + "-to-" + parts[0];
  return slug > rev ? 2 : 0;
}

function airlinePhrase(route: FlightRoute): string {
  const n = route.airlineCount;
  if (n <= 1) return "a single nonstop carrier";
  if (n === 2) return "two nonstop airlines";
  if (n <= 4) return `${n} nonstop airlines`;
  return `${n} carriers nonstop`;
}

const NUMBER_WORDS: Record<number, string> = {
  1: "One", 2: "Two", 3: "Three", 4: "Four", 5: "Five",
  6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten",
};

/** Lead-safe variant: no bare numeral at sentence start. */
function airlineLead(route: FlightRoute): string {
  const n = route.airlineCount;
  if (n <= 1) return "A single nonstop carrier";
  const w = NUMBER_WORDS[n];
  const noun = n <= 4 ? "nonstop airlines" : "carriers nonstop";
  return w ? `${w} ${noun}` : `${n} ${noun}`;
}

/** Second sentence: a route-specific planning fact, varied by class + slug. */
function factSentence(route: FlightRoute, cls: Class): string {
  const { cheapestDay, bestMonth, bookAhead, frequency, delayRate, bestPerformanceTime, flightTime } = route;
  const pool: string[] =
    cls === "long"
      ? [
          `Fares dip in ${bestMonth}, and ${bookAhead} out usually beats last-minute pricing.`,
          `On a ${flightTime} hop, ${bestPerformanceTime.toLowerCase()} tend to run closest to schedule, and only about ${delayRate} of flights slip.`,
          `${frequency} service means you can usually shift a day for a better price without wrecking plans.`,
        ]
      : cls === "shortBudget"
        ? [
            `Booking ${bookAhead} ahead keeps budget fares near their floor, and ${cheapestDay} departures are the cheapest of the week.`,
            `Delays exist on any runway, but at ${delayRate} this short ${flightTime} sector rarely wrecks a connection.`,
            `Service runs ${frequency.toLowerCase()}, so pricing stays competitive. ${cheapestDay} is usually the cheapest day.`,
          ]
        : cls === "shortBusy"
          ? [
              `It runs ${frequency.toLowerCase()} like an air shuttle; booking ${bookAhead} out still saves real money versus same-day tickets.`,
              `Peak demand pushes prices up in ${bestMonth}; fly ${cheapestDay} outside the season and fares soften.`,
              `${delayRate} of flights run late at some point, but ${bestPerformanceTime} historically beat that rate.`,
            ]
          : [
              `Cheapest seats surface ${bookAhead} before departure, with ${cheapestDay} the consistent low day.`,
              `${bestMonth} brings the softest fares; ${bestPerformanceTime} the most punctual flying.`,
              `Around ${delayRate} of departures see delays, so give tight connections margin outside ${bestPerformanceTime.toLowerCase()}.`,
            ];
  return pool[(idx(route.slug + "-f" + cls, pool.length) + dirOffset(route.slug)) % pool.length];
}

const LEADS: Record<Class, ((r: FlightRoute) => string)[]> = {
  shortBudget: [
    (r) => `${r.originCity} to ${r.destinationCity} is a ${r.flightTime.split("–")[0]} hop covered nonstop by ${airlinePhrase(r)}, with return fares starting at $${r.price}.`,
    (r) => `Just ${r.flightTime.split("–")[0]} in the air for ${r.distance}: ${r.originCity} to ${r.destinationCity} is served nonstop by ${airlinePhrase(r)} from $${r.price} round trip.`,
    (r) => `${airlineLead(r)} fly ${r.originCity} to ${r.destinationCity} nonstop in ${r.flightTime.split("–")[0]}. The distance is ${r.distance}, with returns from $${r.price}.`,
    (r) => `Skipping the drive on this ${r.distance} leg costs from $${r.price}: ${r.originCity} to ${r.destinationCity} takes ${r.flightTime.split("–")[0]} nonstop with ${airlinePhrase(r)}.`,
  ],
  shortBusy: [
    (r) => `${r.originCity} and ${r.destinationCity} sit only ${r.distance} apart, yet this is a busy ${r.flightTime.split("–")[0]} corridor with ${airlinePhrase(r)} competing nonstop.`,
    (r) => `Returns on ${r.originCity}–${r.destinationCity} start at $${r.price} for a ${r.flightTime.split("–")[0]} nonstop run ${r.frequency.toLowerCase()} by ${airlinePhrase(r)}.`,
    (r) => `This ${r.distance} city pair moves ${r.frequency.toLowerCase()} of traffic: ${r.originCity} to ${r.destinationCity} nonstop, ${r.flightTime.split("–")[0]}, from $${r.price}.`,
    (r) => `Between ${r.originAirportCode || r.originCity} and ${r.destinationAirportCode || r.destinationCity}, ${airlinePhrase(r)} keep prices down on this ${r.flightTime.split("–")[0]} shuttle run, from $${r.price} return.`,
  ],
  mid: [
    (r) => `${r.originCity} to ${r.destinationCity} spans ${r.distance} and lands in ${r.flightTime.split("–")[0]}, flown by ${airlinePhrase(r)} with returns from $${r.price}.`,
    (r) => `A ${r.flightTime.split("–")[0]} nonstop and ${r.distance} of sky: ${r.originCity}–${r.destinationCity} opens at $${r.price} round trip on ${airlinePhrase(r)}.`,
    (r) => `${airlineLead(r)} link ${r.originCity} and ${r.destinationCity} in ${r.flightTime.split("–")[0]}, with entry fares around $${r.price} return.`,
    (r) => `The ${r.distance} run from ${r.originCity} to ${r.destinationCity} takes under ${r.flightTime.split("–").pop()?.trim() || r.flightTime} nonstop, from $${r.price} with ${airlinePhrase(r)}.`,
  ],
  long: [
    (r) => `${r.originCity} to ${r.destinationCity} is a long-haul ${r.flightTime.split("–")[0]} nonstop across ${r.distance}, with ${airlinePhrase(r)} selling returns from $${r.price}.`,
    (r) => `${r.originCity} to ${r.destinationCity} crosses ${r.distance} in ${r.flightTime.split("–")[0]}. ${airlinePhrase(r)} sell returns from $${r.price}, and ${airlinePhrase(r)} rarely discount last-minute seats.`,
    (r) => `This one is big: ${r.distance}, ${r.flightTime.split("–")[0]} in the air, ${airlinePhrase(r)} nonstop. Returns from ${r.originCity} to ${r.destinationCity} start at $${r.price}.`,
    (r) => `${r.destinationCity} is ${r.flightTime.split("–")[0]} from ${r.originCity} nonstop, a ${r.distance} trunk route shared by ${airlinePhrase(r)}. Returns open at $${r.price}.`,
  ],
};

/**
 * Stable, unique-by-construction intro for a route page.
 * `description` from the data file remains as a hard fallback.
 */
export function getRouteIntro(route: FlightRoute, fallback?: string): string {
  try {
    const cls = routeClass(route);
    const leads = LEADS[cls];
    const lead = leads[(idx(route.slug + "-l", leads.length) + dirOffset(route.slug)) % leads.length];
    return `${lead(route)} ${factSentence(route, cls)}`;
  } catch {
    return fallback ?? "";
  }
}
