export default function PopularDestinationsSection() {
  const destinations = [
    { code: "IST", name: "Istanbul", flag: "🇹🇷" },
    { code: "DXB", name: "Dubai", flag: "🇦🇪" },
    { code: "MOW", name: "Moscow", flag: "🇷🇺" },
    { code: "LAS", name: "Las Vegas", flag: "🇺🇸" },
    { code: "NYC", name: "New York", flag: "🇺🇸" },
    { code: "LON", name: "London", flag: "🇬🇧" },
  ];
  return (
    <section style={{ padding: "48px 1.5rem", background: "white" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <span className="tag">Destinations</span>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2rem", fontWeight: 700, color: "#0F2A4A", margin: "8px 0 0" }}>
            Popular Destinations
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {destinations.map((dest) => (
            <div key={dest.code} className="destination-card reveal" style={{ background: "#f8f9fa", borderRadius: 12, padding: 24, textAlign: "center" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>{dest.flag}</div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F2A4A", marginBottom: 4 }}>{dest.name}</div>
              <div style={{ fontSize: "0.85rem", color: "#666" }}>{dest.code}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}