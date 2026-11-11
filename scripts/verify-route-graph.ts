// P1 data-integrity verifier: run with `npx tsx scripts/verify-route-graph.ts`
import {
  flightRoutes,
} from "../src/data/flight-routes";
import {
  regions,
  cityList,
  cities,
  regionOf,
  relatedRoutes,
  routesForCity,
} from "../src/data/route-graph";

const slugs = Object.keys(flightRoutes);
let fails = 0;
const check = (label: string, ok: boolean, extra = "") => {
  console.log(`${ok ? "OK " : "FAIL"} ${label} ${extra}`);
  if (!ok) fails++;
};

check(`routes loaded`, slugs.length > 300, `(${slugs.length})`);
check(`regions > 0`, regions.length > 0, `(${regions.length}: ${regions.map(r => r.name).join(", ")})`);

// every route belongs to >=1 region
const unmapped = slugs.filter((s) => !regionOf[s]);
check(`every route mapped to a region`, unmapped.length === 0, unmapped.length ? `unmapped: ${unmapped.slice(0, 10)}` : "");

// every route's routeSlugs actually exist
const badRegionRefs = regions.flatMap((r) => r.routeSlugs).filter((s) => !(s in flightRoutes));
check(`region->route refs valid`, badRegionRefs.length === 0);

// cities: every route's origin+destination present as city hub
const missingCities = slugs.filter(
  (s) => !cities[slugify(flightRoutes[s].originCity)] || !cities[slugify(flightRoutes[s].destinationCity)],
);
function slugify(x: string) { return x.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); }
check(`every route city has a hub`, missingCities.length === 0);
check(`cities > 40`, cityList.length > 40, `(${cityList.length} cities, top: ${cityList[0]?.name} ${cityList[0]?.routeSlugs.length})`);

// city hub covers both directions
const sample = cityList[0];
const both = sample.routeSlugs.filter(s => flightRoutes[s].originCity === sample.name).length;
const inbound = sample.routeSlugs.filter(s => flightRoutes[s].destinationCity === sample.name).length;
check(`top city has both directions`, both > 0 && inbound > 0, `(${sample.name}: out=${both} in=${inbound})`);

// relatedRoutes sanity
const r = relatedRoutes("london-to-paris");
check(`relatedRoutes has reverse`, !!r.reverse, `(${r.reverse})`);
check(`relatedRoutes sameOrigin>0`, r.sameOrigin.length > 0, `(${r.sameOrigin.length})`);
check(`relatedRoutes sameDestination>0`, r.sameDestination.length > 0, `(${r.sameDestination.length})`);
check(`relatedRoutes sameRegion>0`, r.sameRegion.length > 0, `(${r.sameRegion.length})`);
check(`routesForCity works`, routesForCity("london").length > 20, `(${routesForCity("london").length} via city slug)`);

// duplicate-slug collision guard: no route slug contains "/from/" or "/region/"
const colliding = slugs.filter((s) => s.startsWith("from-") || s.startsWith("region-"));
check(`no slug collides with hub paths`, colliding.length === 0, colliding.join(","));

console.log(fails ? `\n${fails} CHECK(S) FAILED` : "\nALL P1 CHECKS PASSED");
process.exit(fails ? 1 : 0);
