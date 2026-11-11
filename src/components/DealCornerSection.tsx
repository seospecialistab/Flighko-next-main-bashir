import Link from "next/link";

// Prices mirror each route's own `price` field in src/data/flight-routes.ts.
// Update this list only when that data changes — see seo-foundation-plan-2026-10.md.
const DEALS = [
  { slug: "london-to-amsterdam", route: "London → Amsterdam", day: "Tuesday", price: 75 },
  { slug: "cairo-to-dubai", route: "Cairo → Dubai", day: "Tuesday", price: 250 },
  { slug: "new-york-to-nashville", route: "New York → Nashville", day: "Tuesday", price: 110 },
  { slug: "singapore-to-bangkok", route: "Singapore → Bangkok", day: "Tuesday", price: 120 },
  { slug: "cairo-to-jeddah", route: "Cairo → Jeddah", day: "Tuesday", price: 180 },
  { slug: "new-york-to-dallas", route: "New York → Dallas", day: "Tuesday", price: 140 },
];

export default function DealCornerSection() {
  return (
    <section
      style={{
        background: "#fff",
        padding: "52px 1.5rem",
        color: "#0F172A",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal">
          <h2 className="section-title">
            Deal Corner
          </h2>
          <p style={{ color: "#475569", margin: "8px 0 26px", maxWidth: 640 }}>
            Sample round-trip fares from our tracked route data - last reviewed August 2026. Check live prices before you book.
          </p>
        </div>

        <div className="reveal" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 14 }}>
          {DEALS.map((d) => (
            <Link
              key={d.slug}
              href={`/flight-routes/${d.slug}`}
              style={{
                background: "#F8FAFC",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "20px",
                textDecoration: "none",
                color: "#0F172A",
                display: "block",
                transition: "transform .15s, border-color .15s",
              }}
            >
              <span style={{ display: "block", fontWeight: 700, marginBottom: 4 }}>{d.route}</span>
              <span style={{ display: "block", fontSize: ".85rem", color: "#64748B", marginBottom: 10 }}>
                Cheapest day: {d.day}
              </span>
              <span style={{ fontSize: "1.4rem", fontWeight: 700, color: "#FF6B35" }}>${d.price}</span>
            </Link>
          ))}
        </div>

        <div
          className="reveal"
          style={{
            marginTop: 22,
            background: "#FFF7F2", border: "1px solid #E2E8F0",
            borderRadius: 12,
            padding: "16px 20px",
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <p style={{ flex: "1 1 300px", fontSize: ".95rem", margin: 0 }}>
            <b>Never miss a drop.</b> Get error fares and price alerts for your routes - free.
          </p>
          <input
            type="email"
            placeholder="you@flighko.com"
            aria-label="Email for price alerts"
            form="newsletter-form"
            style={{
              background: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 14px",
              minWidth: 240,
              fontFamily: "inherit",
              fontSize: ".9rem",
            }}
          />
          <button
            type="submit"
            form="newsletter-form"
            className="btn-accent"
            style={{
              background: "#FF6B35",
              color: "#0F172A",
              fontWeight: 700,
              padding: "10px 18px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontFamily: "inherit",
              fontSize: ".9rem",
            }}
          >
            Get Price Alerts
          </button>
        </div>
      </div>
    </section>
  );
}
