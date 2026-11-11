import Link from "next/link";

// All slugs below exist in src/data/flight-routes.ts. Prices mirror that file's
// own `price` field — update both together, never one alone.
const ROUTES12 = [
  { slug: "singapore-to-bangkok", from: "Singapore (SIN)", to: "Bangkok (BKK)", price: 120 },
  { slug: "new-york-to-nashville", from: "New York (JFK)", to: "Nashville (BNA)", price: 110 },
  { slug: "cairo-to-jeddah", from: "Cairo (CAI)", to: "Jeddah (JED)", price: 180 },
  { slug: "bangkok-to-seoul", from: "Bangkok (BKK)", to: "Seoul (ICN)", price: 350 },
  { slug: "cairo-to-kuwait", from: "Cairo (CAI)", to: "Kuwait (KWI)", price: 150 },
  { slug: "london-to-amsterdam", from: "London (LHR)", to: "Amsterdam (AMS)", price: 75 },
  { slug: "bangkok-to-taipei", from: "Bangkok (BKK)", to: "Taipei (TPE)", price: 250 },
  { slug: "cairo-to-istanbul", from: "Cairo (CAI)", to: "Istanbul (IST)", price: 220 },
  { slug: "new-york-to-dallas", from: "New York (JFK)", to: "Dallas (DFW)", price: 140 },
  { slug: "cairo-to-dubai", from: "Cairo (CAI)", to: "Dubai (DXB)", price: 250 },
  { slug: "cairo-to-beirut", from: "Cairo (CAI)", to: "Beirut (BEY)", price: 170 },
  { slug: "dubai-to-abu-dhabi", from: "Dubai (DXB)", to: "Abu Dhabi (AUH)", price: 100 },
];

export default function PopularRoutesSection() {
  return (
    <section style={{ padding: "48px 1.5rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="tag">Routes</span>
          <h2 className="section-title">
            Popular Flight Routes
          </h2>
          <p style={{ fontSize: "1rem", color: "#475569", margin: "8px 0 0" }}>
            The routes our travelers search most - sample fares from our tracked route data
          </p>
        </div>
        <div className="popular-routes-grid">
          {ROUTES12.map((r) => (
            <Link key={r.slug} href={`/flight-routes/${r.slug}`} className="popular-route-card">
              <span className="popular-route-card__route">
                {r.from} → {r.to}
                <span className="popular-route-card__note">Cheapest day: Tuesday</span>
              </span>
              <span className="popular-route-card__price">from ${r.price}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
