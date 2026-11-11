import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flighko Blog — Flight Hacks, Route Guides & Airline Reviews",
  description:
    "Practical flight guides from Flighko: booking windows, error fares, airline comparisons and route data for the corridors we track.",
  alternates: { canonical: "https://www.flighko.com/blog" },
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}