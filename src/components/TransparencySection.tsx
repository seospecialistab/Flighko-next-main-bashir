import Link from "next/link";

const PILLARS = [
  {
    icon: "🔍",
    title: "We compare, you choose",
    text: "Our search scans 200+ airlines and agencies for your route. Prices shown on our guides are sample fares from our tracked route data - always check live prices before booking.",
  },
  {
    icon: "💸",
    title: "How we make money",
    text: "When you book through our partners, they pay us a small commission. This costs you nothing - the price is the same as booking direct.",
  },
  {
    icon: "📊",
    title: "Data-backed guides",
    text: "Our route guides use real data: 35 tracked routes, DOT delay statistics, and price analysis - the same datasets behind our studies.",
  },
];

export default function TransparencySection() {
  return (
    <section style={{ background: "#FFF7F2", padding: "52px 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal">
          <h2 className="section-title">
            How Flighko Works
          </h2>
          <p style={{ color: "#475569", margin: "8px 0 0", maxWidth: 640 }}>
            No dark patterns, no fake countdowns. Here&apos;s exactly what we do and how we make money.
          </p>
        </div>

        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
            marginTop: 24,
          }}
        >
          {PILLARS.map((p) => (
            <div
              key={p.title}
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: 22,
              }}
            >
              <div aria-hidden="true" style={{ fontSize: "1.6rem", marginBottom: 10 }}>
                {p.icon}
              </div>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.05rem",
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: "0 0 8px",
                }}
              >
                {p.title}
              </h3>
              <p style={{ color: "#475569", fontSize: ".93rem", lineHeight: 1.6, margin: 0 }}>{p.text}</p>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ marginTop: 22, textAlign: "center" }}>
          <Link href="/about" style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none", fontSize: ".92rem" }}>
            Learn more about Flighko →
          </Link>
        </div>
      </div>
    </section>
  );
}
