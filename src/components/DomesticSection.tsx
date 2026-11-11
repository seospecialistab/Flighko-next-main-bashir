import Link from "next/link";

export default function DomesticSection() {
  // Route cards. `href` is explicit so we can point at an existing page even
  // when the exact direction isn't in the dataset (e.g. use the reverse route).
  const routes: { from: string; to: string; price: string; href: string }[] = [
    { from: "Cairo (CAI)", to: "Dubai (DXB)", price: "$250", href: "/flight-routes/cairo-to-dubai" },
    { from: "Cairo (CAI)", to: "Istanbul (IST)", price: "$220", href: "/flight-routes/cairo-to-istanbul" },
    { from: "Cairo (CAI)", to: "London (LHR)", price: "$450", href: "/flight-routes/cairo-to-london" },
    { from: "Cairo (CAI)", to: "Amman (AMM)", price: "$180", href: "/flight-routes/cairo-to-amman" },
    { from: "Cairo (CAI)", to: "Jeddah (JED)", price: "$190", href: "/flight-routes/cairo-to-jeddah" },
    { from: "Dubai (DXB)", to: "Paris (PAR)", price: "$460", href: "/flight-routes/dubai-to-paris" },
    { from: "Kuala Lumpur (KUL)", to: "Bangkok (BKK)", price: "$110", href: "/flight-routes/kuala-lumpur-to-bangkok" },
    { from: "Delhi (DEL)", to: "Malé (MLE)", price: "$280", href: "/flight-routes/delhi-to-male" },
  ];

  return (
    <section className="section section-border">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="section-header">
          <div>
            <span className="tag">Routes</span>
            <h2>Popular Routes from the Middle East &amp; Asia</h2>
          </div>
          <Link href="/flight-routes/" className="section-header__link">View all routes →</Link>
        </div>
        <div className="domestic-grid">
          {routes.map(({ from, to, price, href }, i) => (
            <a
              key={i}
              href={href}
              className="domestic-item reveal"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <span className="domestic-item__route">{from} → {to}</span>
              <span className="domestic-item__price">from {price}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
