"use client";
import { useState } from "react";

const faqs = [
  { q: "Is Flighko free to use?", a: "Yes. Flighko is completely free. You can search and compare flights from hundreds of airlines without any fees or hidden charges." },
  { q: "How does Flighko find cheap flights?", a: "We search across 200+ airlines and travel agencies simultaneously to find the lowest fares available for your route and dates." },
  { q: "Can I book directly through Flighko?", a: "Flighko is a flight comparison tool. Once you find the best deal, we redirect you to the airline or travel provider to complete your booking." },
  { q: "How far in advance should I book?", a: "For domestic flights, 1-3 months ahead is usually optimal. For international flights, 2-8 months ahead typically yields the best prices." },
  { q: "Does Flighko charge booking fees?", a: "No. Flighko is free for users. We may earn a small commission from partner airlines when you book through our links, but this never affects the price you pay." },
  { q: "What airlines does Flighko search?", a: "We search over 200 airlines including major carriers like United, Delta, American, British Airways, Emirates, and many budget airlines worldwide." },
];

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="section section-border">
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="section-header">
          <div>
            <span className="tag">FAQ</span>
            <h2>Frequently Asked Questions</h2>
          </div>
        </div>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
        <div className="faq-list">
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item reveal" style={{ transitionDelay: `${i * 60}ms` }}>
              <h3
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                style={{ cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                {faq.q}
                <span style={{ fontSize: "1.2rem", color: "var(--orange)", transition: "transform .2s", transform: openIdx === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </h3>
              <div style={{ display: "grid", gridTemplateRows: openIdx === i ? "1fr" : "0fr", transition: "grid-template-rows .3s cubic-bezier(.16,1,.3,1), opacity .3s", opacity: openIdx === i ? 1 : 0 }}>
                <div style={{ overflow: "hidden", minWidth: 0 }}>
                  <p style={{ paddingTop: 8 }}>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
