import type { Metadata } from "next";
import FlightRoutesClient from "./FlightRoutesClient";
import { cities } from "@/data/route-graph";

const url = "https://www.flighko.com/flight-routes";
const title = "Flight Routes Worldwide | Flighko – Compare Cheap Flights";
const description =
  "Browse flight routes worldwide. Compare prices from 200+ airlines, see flight times, and find the cheapest fares on every route with Flighko.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    type: "website",
  },
};

export default function FlightRoutesIndex() {
  return <FlightRoutesClient />;
}
