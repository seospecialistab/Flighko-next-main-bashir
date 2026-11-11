import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BeachDestination from "@/components/destinations/BeachDestination";
import CityDestination from "@/components/destinations/CityDestination";
import CultureDestination from "@/components/destinations/CultureDestination";
import AdventureDestination from "@/components/destinations/AdventureDestination";
import EntertainmentDestination from "@/components/destinations/EntertainmentDestination";
import { destination as destinations } from "@/data/destinations";
import { flightRoutes } from "@/data/flight-routes";
import { cities, cityToSlug, destinationRelatedPosts } from "@/data/route-graph";

type Props = { params: Promise<{ slug: string }> };

// P6: destination slug -> flight-routes city key. Prefer exact slug match,
// then title-derived name, then loose alphanumeric match ("cape-town" ~ "capetown").
function matchCityForDest(slug: string, title: string): keyof typeof cities | null {
  if (cities[slug]) return slug;
  const fromTitle = title.replace(/^Cheap Flights to\s+/i, "").trim();
  const ts = cityToSlug(fromTitle);
  if (cities[ts]) return ts;
  const norm = slug.replace(/-/g, "");
  const hit = Object.values(cities).find(
    (c) => c.slug.replace(/-/g, "") === norm || c.name.toLowerCase().replace(/[^a-z]/g, "") === fromTitle.toLowerCase().replace(/[^a-z]/g, ""),
  );
  return hit ? (hit.slug as keyof typeof cities) : null;
}

export async function generateStaticParams() {
  return Object.keys(destinations).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const dest = destinations[slug];
  if (!dest) return {};
  return {
    title: dest.title ? `${dest.title} | Flighko` : "Destination | Flighko",
    description: dest.description,
    alternates: { canonical: `https://www.flighko.com/destinations/${slug}` },
    openGraph: {
      title: dest.title,
      description: dest.description,
      url: `https://www.flighko.com/destinations/${slug}`,
      siteName: "Flighko",
      type: "article",
      ...(dest.heroImage ? { images: [{ url: dest.heroImage }] } : {}),
    },
  };
}

/** Pick the category-specific layout component */
function getCategoryComponent(category: string) {
  switch (category) {
    case "beach":
      return BeachDestination;
    case "city":
      return CityDestination;
    case "culture":
      return CultureDestination;
    case "adventure":
      return AdventureDestination;
    case "entertainment":
      return EntertainmentDestination;
    default:
      return CityDestination; // fallback
  }
}

/** T044: extract FAQ Q/A pairs from destination content HTML (uniform pattern across all destinations). */
function extractFaqs(content: string): { question: string; answer: string }[] {
  const out: { question: string; answer: string }[] = [];
  const re = /<span class="tag">FAQs<\/span><h2>(.*?)<\/h2>[\s\S]*?<div class="ct"><p>(.*?)<\/p>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const q = m[1].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;/g, '"').trim();
    const a = m[2].replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&#39;|&rsquo;|&lsquo;/g, "'").replace(/&quot;/g, '"').trim();
    if (q && a) out.push({ question: q, answer: a });
  }
  return out;
}

export default async function DestinationPage({ params }: Props) {
  const { slug } = await params;
  const dest = destinations[slug];
  if (!dest) notFound();

  const CategoryLayout = getCategoryComponent(dest.category);

  // P6: complete flight table for this destination (both directions).
  const cityKey = matchCityForDest(slug, dest.title ?? "");
  const cityInfo = cityKey ? cities[cityKey] : null;
  const routesIn = cityInfo ? cityInfo.asDestinationSlugs.map((s) => flightRoutes[s]).filter(Boolean) : [];
  const routesOut = cityInfo ? cityInfo.asOriginSlugs.map((s) => flightRoutes[s]).filter(Boolean) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: dest.title,
    description: dest.description,
    url: `https://www.flighko.com/destinations/${slug}`,
    image: "https://www.flighko.com/assets/og-default.png",
    touristType: dest.category,
  };

  // T044: build FAQPage schema from destination FAQ content (site-wide)
  const faqLd = extractFaqs(dest.content).map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })).length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: extractFaqs(dest.content).map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
      <Navbar />
      <CategoryLayout dest={dest} />

      {/* P6: complete flight table — every route touching this destination */}
      {cityInfo && (routesIn.length > 0 || routesOut.length > 0) && (
        <section className="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.6rem", color: "#0F172A", marginBottom: 6 }}>
            All Flights to {cityInfo.name} ({routesIn.length + routesOut.length} routes)
          </h2>
          <p style={{ color: "#64748B", marginBottom: 20, fontSize: "0.95rem" }}>
            Every route we track arriving and departing {cityInfo.name} — sample fares, flight times and cheapest days.
          </p>
          {routesIn.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: "1.05rem", color: "#0F2A4A", marginBottom: 8 }}>Flights to {cityInfo.name}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, columns: "2 300px", columnGap: 24 }}>
                {routesIn.map((rt) => (
                  <li key={rt.slug} style={{ marginBottom: 6, breakInside: "avoid" }}>
                    <a href={`/flight-routes/${rt.slug}`} style={{ color: "#1E293B", textDecoration: "none", fontSize: "0.92rem" }}>
                      {rt.originCity} → {rt.destinationCity}
                      <span style={{ color: "#FF6B35", fontWeight: 700 }}> · ${rt.price}</span>
                      <span style={{ color: "#94A3B8" }}> · {rt.flightTime}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {routesOut.length > 0 && (
            <div>
              <h3 style={{ fontSize: "1.05rem", color: "#0F2A4A", marginBottom: 8 }}>Flights from {cityInfo.name}</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, columns: "2 300px", columnGap: 24 }}>
                {routesOut.map((rt) => (
                  <li key={rt.slug} style={{ marginBottom: 6, breakInside: "avoid" }}>
                    <a href={`/flight-routes/${rt.slug}`} style={{ color: "#1E293B", textDecoration: "none", fontSize: "0.92rem" }}>
                      {rt.originCity} → {rt.destinationCity}
                      <span style={{ color: "#FF6B35", fontWeight: 700 }}> · ${rt.price}</span>
                      <span style={{ color: "#94A3B8" }}> · {rt.flightTime}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {/* P9 GAP 1: guides about this destination (derived, no data edits) */}
      {(() => {
        const guides = destinationRelatedPosts(slug, 3);
        if (guides.length === 0) return null;
        const destName = (dest.title ?? "").replace(/^Cheap Flights to\s+/i, "").replace(/\s*\d{4}.*$/, "").trim() || "this destination";
        return (
          <section className="section" style={{ maxWidth: 1100, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.6rem", color: "#0F172A", marginBottom: 6 }}>
              Guides about {destName}
            </h2>
            <p style={{ color: "#64748B", marginBottom: 20, fontSize: "0.95rem" }}>
              Travel tips from our blog that cover {destName} and how to book it cheap.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1.5rem" }}>
              {guides.map((g) => (
                <a
                  key={g.slug}
                  href={`/blog/${g.slug}`}
                  style={{
                    display: "block",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: "1px solid #E2E8F0",
                    background: "#fff",
                    textDecoration: "none",
                    boxShadow: "0 2px 8px rgba(15,23,42,.06)",
                  }}
                >
                  {g.heroImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={g.heroImage} alt={g.title} style={{ width: "100%", height: 140, objectFit: "cover" }} />
                  )}
                  <div style={{ padding: "1rem 1.1rem" }}>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0F2A4A", marginBottom: 6 }}>
                      {g.title}
                    </h3>
                    <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: 0 }}>{g.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })()}

      <Footer />

      {/* Route the destination-page search widget to the white-label */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.TPWL_CONFIGURATION = {
            ...window.TPWL_CONFIGURATION,
            resultsURL: "https://search.flighko.com",
            showHotels: true
          };`,
        }}
      />
    </>
  );
}
