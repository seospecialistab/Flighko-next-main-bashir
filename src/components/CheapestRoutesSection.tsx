import Link from "next/link";

// Every slug below must exist in src/data/flight-routes.ts. Verify before adding.
const CHEAPEST = [
  { slug: "los-angeles-to-san-diego", route: "Los Angeles → San Diego", day: "Tuesday", price: 40 },
  { slug: "austin-to-houston", route: "Austin → Houston", day: "Tuesday", price: 45 },
  { slug: "austin-to-dallas", route: "Austin → Dallas", day: "Tuesday", price: 50 },
  { slug: "los-angeles-to-las-vegas", route: "Los Angeles → Las Vegas", day: "Tuesday", price: 50 },
  { slug: "atlanta-to-new-orleans", route: "Atlanta → New Orleans", day: "Tuesday", price: 70 },
  { slug: "london-to-amsterdam", route: "London → Amsterdam", day: "Tuesday", price: 75 },
  { slug: "sydney-to-brisbane", route: "Sydney → Brisbane", day: "Tuesday", price: 85 },
  { slug: "dubai-to-abu-dhabi", route: "Dubai → Abu Dhabi", day: "Tuesday", price: 100 },
  { slug: "miami-to-new-york", route: "Miami → New York", day: "Tuesday", price: 120 },
  { slug: "singapore-to-bangkok", route: "Singapore → Bangkok", day: "Tuesday", price: 120 },
];

export default function CheapestRoutesSection() {
  return (
    <section style={{ background: "#F8FAFC", padding: "48px 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal">
          <h2 className="section-title">
            The 10 Cheapest Routes This Month
          </h2>
          <p style={{ color: "#475569", margin: "8px 0 22px" }}>
            The 10 cheapest routes we currently track - sample fares from our route data, last reviewed August 2026.
          </p>
        </div>

        <div
          className="reveal"
          style={{ overflowX: "auto", border: "1px solid #E2E8F0", borderRadius: 12, maxWidth: "100%", width: "100%" }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: ".93rem",
              minWidth: 560,
            }}
          >
            <thead>
              <tr style={{ background: "#0F172A", color: "#fff" }}>
                <th style={{ padding: "11px 15px", textAlign: "left" }}>Route</th>
                <th style={{ padding: "11px 15px", textAlign: "left" }}>Cheapest Day</th>
                <th style={{ padding: "11px 15px", textAlign: "right" }}>Round Trip From</th>
                <th aria-label="Link to route page"></th>
              </tr>
            </thead>
            <tbody>
              {CHEAPEST.map((r) => (
                <tr key={r.slug} style={{ borderTop: "1px solid #E2E8F0" }}>
                  <td style={{ padding: "10px 15px" }}>{r.route}</td>
                  <td style={{ padding: "10px 15px" }}>{r.day}</td>
                  <td
                    style={{
                      padding: "10px 15px",
                      textAlign: "right",
                      fontWeight: 700,
                      color: "#0F172A",
                    }}
                  >
                    ${r.price}
                  </td>
                  <td style={{ padding: "10px 15px", textAlign: "right" }}>
                    <Link
                      href={`/flight-routes/${r.slug}`}
                      style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p style={{ fontSize: ".8rem", color: "#475569", marginTop: 10 }}>
          Source: Flighko tracked route data (35 routes), August 2026 ·{" "}
          <Link href="/flight-routes/london-to-amsterdam" style={{ color: "#FF6B35" }}>
            Download full CSV
          </Link>
        </p>
      </div>
    </section>
  );
}
