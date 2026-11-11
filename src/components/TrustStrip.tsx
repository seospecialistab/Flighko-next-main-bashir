import Link from "next/link";

const TRUST_ITEMS = [
  { label: "35 routes tracked" },
  { label: "200+ airlines & agencies" },
  { label: "100% free to search" },
  { label: "No hidden fees" },
  { label: "Secure booking" },
];

export default function TrustStrip() {
  return (
    <section
      aria-label="Flighko trust signals"
      style={{
        background: "#F8FAFC",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        padding: "20px 0",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px 28px",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {TRUST_ITEMS.map((item) => (
          <span
            key={item.label}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontWeight: 600,
              color: "#0F172A",
              fontSize: ".95rem",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#FF6B35",
                flex: "none",
              }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </section>
  );
}
