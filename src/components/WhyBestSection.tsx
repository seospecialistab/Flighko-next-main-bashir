import Link from "next/link";

export default function WhyBestSection() {
  return (
    <section style={{ padding: "48px 1.5rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", maxWidth: 800, margin: "0 auto" }}>
          <h2 className="section-title">
            Why Flighko is the Best Flight Search Engine
          </h2>
          <p
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.8,
              color: "#555",
              margin: "0 0 20px",
            }}
          >
            Flighko is a free flight search engine that compares prices from 200+ airlines and travel agencies.
            Whether you&apos;re looking for the cheapest flights, tracking error fares, or searching for award flight deals,
            our award flight search tool helps you find the best options. Know when is the best time to search for flights
            and never overpay again.
          </p>
        </div>
        <div
          className="whybest-stats reveal"
        >
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#FF6B35", marginBottom: 8 }}>200+</div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>Airlines &amp; Agencies</div>
          </div>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#FF6B35", marginBottom: 8 }}>100%</div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>Free to Search</div>
          </div>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#FF6B35", marginBottom: 8 }}>No Fees</div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>No Hidden Charges</div>
          </div>
          <div className="stat-item" style={{ textAlign: "center" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#FF6B35", marginBottom: 8 }}>35</div>
            <div style={{ fontSize: "0.9rem", color: "#666" }}>Routes Compared</div>
          </div>
        </div>
        <p
          className="reveal"
          style={{
            fontSize: "1rem",
            lineHeight: 1.8,
            color: "#555",
            margin: "32px 0 0",
            textAlign: "center",
          }}
        >
          Check out our{" "}
          <Link href="/blog/flight-hacks-2026" style={{ color: "#FF6B35", textDecoration: "underline" }}>
            flight hacks guide
          </Link>{" "}
          for expert tips, or browse popular routes like{" "}
          <Link href="/flight-routes/cairo-to-dubai" style={{ color: "#FF6B35", textDecoration: "underline" }}>
            Cairo to Dubai flights
          </Link>
          ,{" "}
          <Link href="/flight-routes/cairo-to-istanbul" style={{ color: "#FF6B35", textDecoration: "underline" }}>
            Cairo to Istanbul flights
          </Link>
          ,{" "}
          <Link href="/flight-routes/cairo-to-jeddah" style={{ color: "#FF6B35", textDecoration: "underline" }}>
            Cairo to Jeddah flights
          </Link>
          ,{" "}
          <Link href="/flight-routes/cairo-to-london" style={{ color: "#FF6B35", textDecoration: "underline" }}>
            Cairo to London flights
          </Link>
          , and{" "}
          <Link href="/flight-routes/cairo-to-paris" style={{ color: "#FF6B35", textDecoration: "underline" }}>
            Cairo to Paris flights
          </Link>
          .
        </p>
      </div>
    </section>
  );
}