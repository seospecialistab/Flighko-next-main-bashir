/**
 * Flighko Type Contracts
 * Single source of truth for all shared TypeScript interfaces.
 * A1 (Frontend) imports from here. A3 (Architect) owns changes.
 */

// ==========================================
// FLIGHT ROUTES
// ==========================================

export interface AirlineInfo {
  name: string;
  code: string;
  aircraft: string;
  frequency: string;
  alliance: string;
  notes: string;
}

export interface DestinationInfo {
  visa: string;
  transport?: string;
  airportTransport?: string;
  weather?: string | { month: string; temp: string; note: string }[];
  bestTimeToVisit?: string;
  localTips: string[];
  currency?: string;
  language?: string;
  timezone?: string;
}

export interface MonthlyPrice {
  month: string;
  price: number;
  note?: string;
}

export interface RouteComparison {
  slug: string;
  originCity: string;
  destinationCity: string;
  price: number;
  flightTime: string;
  pros: string;
  cons: string;
}

export interface FlightRoute {
  slug: string;
  originCity: string;
  originAirportCode: string;
  originAirportFull: string;
  destinationCity: string;
  destinationAirportCode: string;
  destinationAirportFull: string;
  destinationCountry?: string;
  price: number;
  priceSuffix?: string;
  flightTime: string;
    timezone?: string;
    distance: string;
    distanceKm: string;
  airlineCount: number;
  airlines: string;
  frequency: string;
  cheapestDay: string;
  bestMonth: string;
  bookAhead: string;
  delayRate: string;
  avgDelay: string;
  bestPerformanceTime: string;
  description: string;
  longDescription?: string;
  tips: { icon: string; title: string; text: string }[];
  faq: { question: string; answer: string }[];
  faqSchema?: { question: string; answer: string }[];
  relatedRoutes: { slug: string; originCity: string; destinationCity: string; price: number; flightTime: string }[];
  lastUpdated: string;
  airlines_detail?: AirlineInfo[];
  destination_info?: DestinationInfo;
  monthlyPrices?: MonthlyPrice[];
  routeComparisons?: RouteComparison[];
  travelTips?: string[];
  imageDir?: string;
  aircraftImages?: boolean;
  provider?: "flight" | "property";
  seoTitle?: string;
  seoDescription?: string;
  metaDescription?: string;
  h1?: string;
}

export type FlightRoutesMap = Record<string, FlightRoute>;


// ==========================================
// DESTINATIONS
// ==========================================

export type DestinationCategory = 'beach' | 'city' | 'culture' | 'adventure' | 'entertainment';

export interface Destination {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  content: string;
  category: DestinationCategory;
  faq?: { q: string; a: string }[];
}

export type DestinationsMap = Record<string, Destination>;


// ==========================================
// BLOG POSTS
// ==========================================

export interface VpnReview {
  name: string;
  rank: string;
  badge: string;
  why: string;
  servers: string;
  savings: string;
  bestServer: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  date: string;
  content: string;
  origin?: string;
  destination?: string;
  faq?: { q: string; a: string }[];
  keyTakeaways?: string[];
  vpnReviews?: VpnReview[];
  popularDestinations?: { slug: string; title: string }[];
  stats?: { value: string; label: string }[];
  priceTables?: {
    title: string;
    caption?: string;
    columns: string[];
    rows: { cells: string[]; highlight?: boolean }[];
  }[];
}

export type BlogPostsMap = Record<string, BlogPost>;


// ==========================================
// ROUTE REGIONS
// ==========================================

export interface RouteRegion {
  slug: string;
  region: string;
}

export type RouteRegionsMap = Record<string, string>;