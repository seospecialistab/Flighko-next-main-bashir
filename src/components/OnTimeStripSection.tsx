import Link from "next/link";

export default function OnTimeStripSection() {
  return (
    <section
      style={{
        background: "#F8FAFC",
        borderTop: "1px solid #E2E8F0",
        borderBottom: "1px solid #E2E8F0",
        padding: "40px 1.5rem",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          gap: 28,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <h2
          className="reveal section-title section-title--sm"
        >
          Fly the Most Reliable Airlines
        </h2>
        <p
          className="reveal"
          style={{ color: "#475569", flex: "2 1 420px", lineHeight: 1.65, margin: 0 }}
        >
          We analyzed official DOT data: Alaska tops on-time arrivals at 80.5%, while pre-9 AM
          flights are on-time 89.7% vs just 69% in the evening. Pick smarter with the full rankings.
        </p>

      </div>
    </section>
  );
}
