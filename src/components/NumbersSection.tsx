import Link from "next/link";

const STATS = [
  { value: "35", label: "flight routes tracked" },
  { value: "$207", label: "average round-trip fare" },
  { value: "80.5%", label: "best airline on-time rate" },
  { value: "Tuesday", label: "cheapest day on 91% of our routes" },
];

export default function NumbersSection() {
  return (
    <section style={{ background: "#FFF7F2", padding: "52px 1.5rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="reveal">
          <h2 className="section-title">
            Flighko by the Numbers
          </h2>
          <p style={{ color: "#475569", margin: "8px 0 26px" }}>
            Real data from our route database and official DOT reports - not marketing claims.
          </p>
        </div>

        <div
          className="reveal"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
            gap: 14,
          }}
        >
          {STATS.map((s) => (
            <div
              key={s.label}
              style={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 14,
                padding: "24px 18px",
                textAlign: "center",
              }}
            >
              <b
                style={{
                  display: "block",
                  fontSize: "1.9rem",
                  color: "#0F172A",
                  marginBottom: 4,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {s.value}
              </b>
              <span style={{ fontSize: ".88rem", color: "#475569", display: "block" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
