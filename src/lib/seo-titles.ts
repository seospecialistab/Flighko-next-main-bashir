// SEO titles + meta descriptions for route pages.
// Hand-tuned overrides win; otherwise a deterministic pattern rotation (by slug)
// keeps SERP snippets diverse using data that genuinely varies per route
// (price, flight time, distance) — see v2-brain/seo-team/seo-secrets/strategy/
// route-content-upgrade-plan.md (change C6).

const SEO_TITLES: Record<string, string> = {
  "tokyo-to-seoul": "Tokyo → Seoul Flight Time & Duration | Flighko | Book Now",
  "new-york-to-dallas": "New York → Dallas Flight Duration | Flighko | Book Now",
  "orlando-to-denver": "Orlando → Denver Flight Duration | Flighko | Book Now",
  "atlanta-to-new-orleans": "Atlanta → New Orleans Flight Duration | Flighko | Book Now",
  "london-to-amsterdam": "London → Amsterdam Nonstop 1h 05m from $75 | Flighko",
  "chicago-to-houston": "Chicago → Houston Flight Duration | Flighko | Book Now",
  // 2026-09-20: price-led rewrites for GSC golden signals (10 of 17 zero-click
  // impressions). Intent-matched "Flights from $X" instead of "Flight Distance".
  // See v2-brain/seo-team/seo-secrets/strategy/next-cycle-strategy-20260920.md
  "singapore-to-bangkok": "SIN to BKK Flights from $120, 2h 20m Nonstop | Flighko",
  "chicago-to-las-vegas": "Chicago → Las Vegas Nonstop 3h 25m from $120 | Flighko",
  "miami-to-dallas": "Miami → Dallas Flight Duration | Flighko | Compare Airlines",
  "phx-to-orlando": "PHX to MCO Flights — Phoenix to Orlando, from $160 | Flighko",
  "chicago-to-atlanta": "Chicago → Atlanta Flight Time 1h 40m from $85 | Flighko",
  "orlando-to-boston": "Orlando → Boston Flight Duration | Flighko | Book Now",
  "orlando-to-san-francisco": "Orlando → San Francisco Flight Duration | Flighko | Book Now",
  "dubai-to-paris": "Dubai → Paris Flight Time | Flighko | Compare Airlines",
  "dubai-to-london": "Dubai → London Flight Time | Flighko | Compare Airlines",
  "cairo-to-paris": "Cairo → Paris Flight Duration | Flighko | Compare Airlines",
  "cairo-to-london": "Cairo to London Flights from $450 | Compare & Book | Flighko",
  "cairo-to-amman": "Cairo → Amman Flight Duration | Flighko | Compare Airlines",
  "cairo-to-jeddah": "Cairo to Jeddah Flights from $190 | Compare & Book | Flighko",
  "cairo-to-dubai": "Cairo to Dubai Flights from $250 | Compare & Book | Flighko",
  // 2026-09-24: fixes the malformed auto shape-3 title ("from $110 2h 15m",
  // no separator). QC gate: reviewer PASS_WITH_CHANGES — 65-char title.
  "new-york-to-nashville": "New York → Nashville Nonstop 2h 15m from $110 | Flighko",
  // 2026-09-27: LA→SD computes to 67 chars via the shape-3 template (over
  // the 65-char budget), so we provide a manually tuned override.
  "los-angeles-to-san-diego": "LAX to San Diego Flights from $40, Nonstop 45m | Flighko",
};

// 2026-09-20: hand-tuned descriptions for golden-signal routes whose auto
// description leads with duration/distance instead of the booking hook.
const SEO_DESCRIPTIONS: Record<string, string> = {
  "cairo-to-jeddah":
    "Cairo to Jeddah flights from $190 round trip. 4 airlines, daily nonstops in 2h 10m. Schedules, baggage rules & Umrah-season fares.",
  "cairo-to-dubai":
    "Cairo to Dubai flights from $250 round trip. 5 airlines, daily nonstops in 3h 15m. Compare Emirates, flydubai & EgyptAir fares.",
};

export type RouteMetaInput = {
  slug: string;
  originCity: string;
  destinationCity: string;
  originCode: string;
  destCode: string;
  price: number;
  flightTime: string;
  distance?: string;
  airlineCount?: number;
  routeMetaDescription?: string;
};

/** Deterministic small-int hash so each route keeps a stable pattern. */
function slugIndex(slug: string, mod: number): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) >>> 0;
  return h % mod;
}

/** Flight time may be a range like "2h 10m–2h 20m" — lead with the lower bound. */
function shortestFlightTime(flightTime: string): string {
  return flightTime.split(/[–-]/)[0].trim();
}

/**
 * SERP title, rotated over 5 shapes. City-pair keyword stays front-loaded in
 * every shape; the differentiator (price / time / distance / airports) rotates.
 */
export function getSeoTitle(input: RouteMetaInput): string {
  const { slug, originCity, destinationCity, originCode, destCode, price, flightTime, distance, airlineCount } = input;
  if (SEO_TITLES[slug]) return SEO_TITLES[slug];
  const pair = `${originCity} to ${destinationCity}`;
  const t = shortestFlightTime(flightTime);
  const hasCodes = Boolean(originCode && destCode);
  const shape = hasCodes ? slugIndex(slug, 5) : slugIndex(slug, 4);
  switch (shape) {
    case 0:
      return `${pair} Flights — ${t}, from $${price} | Flighko`;
    case 1:
      return hasCodes
        ? `${originCode} to ${destCode} Flights — ${pair} from $${price} | Flighko`
        : `${pair} Flights from $${price} ${t} | Flighko`;
    case 2:
      return distance
        ? `${pair} — ${distance}, ${t} flight | Flighko`
        : `${pair} — ${t} flight, ${airlineCount ?? "multiple"} airlines | Flighko`;
    case 3:
          return `${pair} Flights from $${price}, Nonstop ${t} | Flighko`;
    default:
      return hasCodes
        ? `${pair} (${originCode}–${destCode}): Times, Prices, Airlines | Flighko`
        : `${pair}: Flight Times, Prices, Airlines | Flighko`;
  }
}

/** Meta description, rotated over 4 shapes using data that varies per route. */
export function getSeoDescription(input: RouteMetaInput): string {
  const { slug, originCity, destinationCity, price, flightTime, distance, airlineCount, routeMetaDescription } = input;
  if (SEO_DESCRIPTIONS[slug]) return SEO_DESCRIPTIONS[slug];
  if (routeMetaDescription) return routeMetaDescription;
  const pair = `${originCity} to ${destinationCity}`;
  const t = shortestFlightTime(flightTime);
  switch (slugIndex(slug + "-d", 4)) {
    case 0:
      return `${pair} flights start at $${price} round trip. ${t} nonstop, live prices, airline comparison, and cheapest days to fly — 2026 deals on Flighko.`;
    case 1:
      return `Fly ${pair} from $${price}. ${t} in the air${airlineCount ? `, ${airlineCount} nonstop airlines` : ""} — compare schedules, fares, and flight times free on Flighko.`;
    case 2:
      return distance
        ? `${distance} between ${originCity} and ${destinationCity} in ${t}. See current fares from $${price}, airline schedules, and price trends on Flighko.`
        : `${pair}: ${t} flight, fares from $${price}. Compare airlines and find the cheapest booking window on Flighko.`;
    default:
      return `Cheap ${pair} flights — from $${price} round trip, about ${t} nonstop. Search 200+ airlines, compare fares, and book at Flighko.`;
  }
}
