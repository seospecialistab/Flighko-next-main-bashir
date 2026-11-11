import { flightRoutes } from "@/data/flight-routes";
import { destination, type DestinationCategory } from "@/data/destinations";

/**
 * Look up the destination category for a given flight route slug.
 * Extracts the destination city from the route data, slugifies it,
 * and looks it up in the destinations database.
 * Falls back to 'city' if no match is found.
 */
export function getCategoryForRoute(routeSlug: string): DestinationCategory {
  const route = flightRoutes[routeSlug];
  if (!route) return "city";
  const destSlug = route.destinationCity.toLowerCase().replace(/\s+/g, "-");
  return destination[destSlug]?.category ?? "city";
}
