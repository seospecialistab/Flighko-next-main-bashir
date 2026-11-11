import Link from "next/link";

const REGIONS: [string, { slug: string; name: string }[]][] = [
  [
    "Europe", [
      { slug: "amsterdam", name: "Amsterdam" },
      { slug: "athens", name: "Athens" },
      { slug: "barcelona", name: "Barcelona" },
      { slug: "berlin", name: "Berlin" },
      { slug: "budapest", name: "Budapest" },
      { slug: "copenhagen", name: "Copenhagen" },
      { slug: "dublin", name: "Dublin" },
      { slug: "istanbul", name: "Istanbul" },
      { slug: "lisbon", name: "Lisbon" },
      { slug: "london", name: "London" },
      { slug: "paris", name: "Paris" },
      { slug: "prague", name: "Prague" },
      { slug: "reykjavik", name: "Reykjavik" },
      { slug: "rome", name: "Rome" },
      { slug: "stockholm", name: "Stockholm" },
      { slug: "vienna", name: "Vienna" },
      { slug: "marrakech", name: "Marrakech" },
      { slug: "casablanca", name: "Casablanca" },
      { slug: "cape-town", name: "Cape Town" },
      { slug: "cairo", name: "Cairo" },
    ],
  ],
  [
    "Asia", [
      { slug: "bali", name: "Bali" },
      { slug: "bangkok", name: "Bangkok" },
      { slug: "hanoi", name: "Hanoi" },
      { slug: "hong-kong", name: "Hong Kong" },
      { slug: "kuala-lumpur", name: "Kuala Lumpur" },
      { slug: "manila", name: "Manila" },
      { slug: "mumbai", name: "Mumbai" },
      { slug: "seoul", name: "Seoul" },
      { slug: "singapore", name: "Singapore" },
      { slug: "tokyo", name: "Tokyo" },
    ],
  ],
  [
    "Americas", [
      { slug: "buenos-aires", name: "Buenos Aires" },
      { slug: "cancun", name: "Cancun" },
      { slug: "denver", name: "Denver" },
      { slug: "las-vegas", name: "Las Vegas" },
      { slug: "lima", name: "Lima" },
      { slug: "los-angeles", name: "Los Angeles" },
      { slug: "mexico-city", name: "Mexico City" },
      { slug: "miami", name: "Miami" },
      { slug: "montego-bay", name: "Montego Bay" },
      { slug: "new-york", name: "New York" },
      { slug: "orlando", name: "Orlando — Best Deals from $50 Round Trip" },
      { slug: "punta-cana", name: "Punta Cana" },
      { slug: "rio-de-janeiro", name: "Rio de Janeiro" },
      { slug: "san-francisco", name: "San Francisco" },
      { slug: "san-juan", name: "San Juan" },
      { slug: "santiago", name: "Santiago" },
      { slug: "toronto", name: "Toronto" },
    ],
  ],
  [
    "Middle East & Oceania", [
      { slug: "auckland", name: "Auckland" },
      { slug: "doha", name: "Doha" },
      { slug: "dubai", name: "Dubai" },
      { slug: "fiji", name: "Fiji" },
      { slug: "melbourne", name: "Melbourne" },
      { slug: "sydney", name: "Sydney" },
    ],
  ],
];

export default function DestinationsSection() {
  return (
    <section style={{ padding: "48px 1.5rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="tag">Destinations</span>
          <h2 className="section-title">
            Browse All 53 Destination Guides
          </h2>
          <p style={{ fontSize: "1rem", color: "#475569", margin: "8px 0 0" }}>
            What to see, when to fly, and which airlines get you there - grouped by region.
          </p>
        </div>

        {REGIONS.map(([region, dests]) => (
          <div key={region} className="reveal" style={{ marginBottom: 28 }}>
            <h3
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "#0F172A",
                margin: "0 0 12px",
              }}
            >
              {region}
              <span style={{ color: "#94A3B8", fontWeight: 400, fontSize: "0.9rem" }}>
                {" "}· {dests.length}
              </span>
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                gap: 10,
              }}
            >
              {dests.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  aria-label={`Browse ${d.name} destination guide`}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 10,
                    padding: "10px 14px",
                    textDecoration: "none",
                    color: "#0F172A",
                    background: "#F8FAFC",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    transition: "border-color .15s, background .15s",
                    display: "block",
                  }}
                >
                  {d.name}
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: 8 }}>
          <Link
            href="/destinations"
            className="section-header__link"
            aria-label="View all destination guides"
          >
            View all destinations →
          </Link>
        </div>
      </div>
    </section>
  );
}
