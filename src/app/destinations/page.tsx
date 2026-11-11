import type { Metadata } from "next";
import DestinationsClient from "./DestinationsClient";

const url = "https://www.flighko.com/destinations";
const title = "Popular Destinations – Flighko Travel Guides";
const description =
  "Explore travel guides for popular destinations worldwide. Discover the best time to visit, top attractions, and cheap flights to each city with Flighko.";

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

export default function DestinationsIndex() {
  return <DestinationsClient />;
}
