export default function HowItWorksSection() {
  const steps = [
    {
      num: 1,
      title: "Enter Your Trip Details",
      desc: "Type your departure city and destination. Choose one-way, return, or multi-city. Pick your travel dates or select flexible dates to find the cheapest options.",
    },
    {
      num: 2,
      title: "Compare Across Multiple Airlines",
      desc: "Our engine scans prices from airlines and online travel agencies simultaneously. Results are sorted by price, duration, and number of stops so you can pick the best fit.",
    },
    {
      num: 3,
      title: "Book Directly or Set Alerts",
      desc: "Found a great deal? Click through to book flights directly with the airline or travel agent. Not ready to book? Set a price alert and we'll notify you when fares drop.",
    },
  ];
  return (
    <section style={{ padding: "48px 1.5rem", background: "#f8f9fa" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 40 }}>
          <span className="tag">How It Works</span>
          <h2 className="section-title">
            Search Flights in 3 Simple Steps
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {steps.map((step) => (
            <div key={step.num} className="reveal how-it-works-card" style={{ background: "white", padding: 32, borderRadius: 16, textAlign: "center", border: "1px solid #f0f0f0" }}>
              <div style={{ width: 48, height: 48, background: "#FF6B35", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", color: "white", fontSize: "1.25rem", fontWeight: 700 }}>
                {step.num}
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#141414", margin: "0 0 8px" }}>{step.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "#666", margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}