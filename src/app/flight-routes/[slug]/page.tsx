import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import FlightRoutePage from "@/components/FlightRoutePage";
import { flightRoutes } from "@/data/flight-routes";
import { getCategoryForRoute } from "@/lib/route-category";
import { getSeoTitle, getSeoDescription } from "@/lib/seo-titles";
import { cityToSlug, regionOf, regionToSlug } from "@/data/route-graph";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(flightRoutes).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const route = flightRoutes[slug];
  if (!route) return {};

  // SEO title/meta: hand-tuned overrides win, else deterministic pattern rotation
  const metaInput = {
    slug,
    originCity: route.originCity,
    destinationCity: route.destinationCity,
    originCode: route.originAirportCode,
    destCode: route.destinationAirportCode,
    price: route.price,
    flightTime: route.flightTime,
    distance: route.distance,
    airlineCount: route.airlineCount,
    routeMetaDescription: route.metaDescription,
  };
  const title = getSeoTitle(metaInput);
  const description = getSeoDescription(metaInput);
  const url = `https://www.flighko.com/flight-routes/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Flighko",
      type: "website",
      images: [
        {
          url: "https://www.flighko.com/assets/og-default.png",
          width: 1200,
          height: 630,
          alt: `${route.originCity} to ${route.destinationCity} Flights`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function FlightRoute({ params }: Props) {
  const { slug } = await params;
  const route = flightRoutes[slug];
  if (!route) notFound();

  const category = getCategoryForRoute(slug);
  const url = `https://www.flighko.com/flight-routes/${slug}`;

  // Structure rebuild P5: outbound links from every route page back to its
  // city hubs + region hub (bidirectional crawl paths). Computed server-side
  // so flightRoutes stays out of the client bundle.
  const hubLinks = {
    originCitySlug: cityToSlug(route.originCity),
    destCitySlug: cityToSlug(route.destinationCity),
    regionName: regionOf[slug] ?? null,
    regionSlug: regionOf[slug] ? regionToSlug(regionOf[slug]) : null,
  };

  return (
    <>
      {/* JSON-LD: BreadcrumbList (raw script = server-rendered, crawlable) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://www.flighko.com/" },
              { "@type": "ListItem", position: 2, name: "Flight Routes", item: "https://www.flighko.com/flight-routes/" },
              { "@type": "ListItem", position: 3, name: `${route.originCity} to ${route.destinationCity}`, item: url },
            ],
          }),
        }}
      />

      {/* JSON-LD: FAQPage (raw script = server-rendered, crawlable) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: route.faq.map((item: { question: string; answer: string }) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        }}
      />

      {/* JSON-LD: WebPage (raw script = server-rendered, crawlable) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: `${route.originCity} to ${route.destinationCity} Flights — ${route.flightTime.split("–")[0]}, from $${route.price} | Flighko`,
            description: `${route.originCity}${route.originAirportCode ? ` (${route.originAirportCode})` : ""} to ${route.destinationCity}${route.destinationAirportCode ? ` (${route.destinationAirportCode})` : ""}: ${route.distance || `${route.flightTime} flight`}, fares from $${route.price} ${route.priceSuffix || "round trip"}. ${route.airlineCount} nonstop airlines, ${route.frequency.toLowerCase()} departures, cheapest day ${route.cheapestDay}.`,
            url,
          }),
        }}
      />

      {/* Travelpayouts main script */}
      <Script
        id="tpwl-main"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(){var s=document.createElement("script");s.async=1;s.type="module";s.src="https://tpemd.com/wl_web/main.js?wl_id=17416";document.head.appendChild(s);})();`,
        }}
      />

      <FlightRoutePage route={route} category={category} slug={slug} hubLinks={hubLinks} />
    </>
  );
}
