export default function BlogSection() {
  const posts = [
    {
      title: "50 Flight Hacks That Still Work in 2026",
      desc: "Booking strategies, fare tricks, and insider knowledge for smarter travel.",
      href: "/blog/flight-hacks-2026",
      gradient: "linear-gradient(135deg,#1a1a2e,#16213e)",
    },
    {
      title: "Best VPNs for Flight Booking in 2026",
      desc: "Which VPNs actually help you find cheaper flights without getting blocked.",
      href: "/blog/best-vpns-flight-booking-2026",
      gradient: "linear-gradient(135deg,#0f3460,#1a1a2e)",
    },
    {
      title: "Travel Rewards Programs Ranked for 2026",
      desc: "Which airline loyalty programs actually deliver value this year.",
      href: "/blog/travel-rewards-programs-2026",
      gradient: "linear-gradient(135deg,#16213e,#1a1a2e)",
    },
    {
      title: "Error Fares Guide: Mistake Fares up to 90% Off",
      desc: "How to find and safely book airline mistake fares before they disappear.",
      href: "/blog/business-class-error-fares-routes-2026",
      gradient: "linear-gradient(135deg,#1a1a2e,#0f3460)",
    },
  ];
  return (
    <section className="section section-border">
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>
        <div className="section-header reveal">
          <div>
            <span className="tag">Blog</span>
            <h2>Latest from the Blog</h2>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, overflow: "hidden" }}>
          {posts.map((post) => (
            <a
              key={post.href}
              href={post.href}
              className="blog-card reveal"
              style={{ background: post.gradient, padding: 24, borderRadius: 16, color: "#fff", textDecoration: "none" }}
            >
              <h3 style={{ fontSize: 18, margin: "0 0 8px" }}>{post.title}</h3>
              <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>{post.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}