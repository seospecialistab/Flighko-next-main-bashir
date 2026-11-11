export default function TrustSection() {
  const items = [
    { icon: "M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z", title: "200+ Airlines", desc: "Compare flights from over 200 trusted airlines worldwide." },
    { icon: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", title: "Fast Flight Comparison", desc: "We compare thousands of flights in seconds to find you the best deals." },
    { icon: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6", title: "No Hidden Fees", desc: "What you see is what you pay. No surprises, ever." },
    { icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z", title: "Free Search", desc: "Search flights for free without any charges or commitments." },
    { icon: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18", title: "Flexible Dates", desc: "Find the best prices across multiple dates with our flexible date search." },
  ];
  return (
    <section className="section section-border">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="section-header reveal">
          <div>
            <span className="tag">Proof</span>
            <h2>The Flighko Promise, in Numbers</h2>
          </div>
        </div>
        
        <div className="trust-grid">
          {items.map((item, i) => (
            <div key={i} className="trust-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
              <div className="trust-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d={item.icon} />
                </svg>
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}