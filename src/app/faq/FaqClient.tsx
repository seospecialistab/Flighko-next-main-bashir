"use client";

import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* P9 GAP 2 (blueprint v2-brain/seo-team/content-interlinking-blueprint.md):
 * contextual internal links inside FAQ answers. Answers are JSX nodes so
 * anchors carry real keywords; links verified against live slugs.
 * Rendered as native <details>/<summary> so every answer is in the served
 * HTML (crawlable + works without JS) while staying collapsible. */

type Faq = { q: string; a: ReactNode };

const link = (href: string, text: string) => (
  <a href={href} style={{ color: "#FF6B35", fontWeight: 600, textDecoration: "none" }}>
    {text}
  </a>
);

const faqs: Faq[] = [
  {
    q: "Is Flighko really free to use?",
    a: (
      <>
        Yes, absolutely. Flighko is free to use. We earn a small affiliate commission when you book
        through our partner links, at no extra cost to you. Start with a search on the{" "}
        {link("/flight-routes", "flight routes and destinations we track")}, or jump straight into{" "}
        {link("/search", "flight search")}.
      </>
    ),
  },
  {
    q: "How does Flighko find deals that other sites miss?",
    a: (
      <>
        We aggregate results from over 200 airlines and OTAs, including budget carriers that don't
        always show up on major search engines — see our{" "}
        {link("/blog/best-budget-airlines-2026", "budget airlines comparison for 2026")}. Our blog
        also monitors for {link("/blog/business-class-error-fares-routes-2026", "error fares")} in real time, and
        we track {link("/flight-routes", "all routes")} route by route.
      </>
    ),
  },
  {
    q: 'What is an "error fare"?',
    a: (
      <>
        An error fare is a pricing mistake by an airline or OTA — a flight listed at a fraction of
        its normal price. These are rare but real. When we spot one, we publish it immediately.
        Read the full {link("/blog/business-class-error-fares-routes-2026", "error fares guide")} and the{" "}
        {link("/blog/business-class-error-fares-routes-2026", "business class error fare routes")}
        , or browse the full route list where
        mistakes tend to surface.
      </>
    ),
  },
  {
    q: "What is skiplagging?",
    a: (
      <>
        Skiplagging (or hidden city ticketing) is a technique where you book a connecting flight
        with your real destination as the layover, then skip the final leg. It can save money but
        has risks — read our full guide on the blog, including the{" "}
        {link("/blog/flight-hacks-2026", "2026 flight hacks guide")}.
      </>
    ),
  },
  {
    q: "Is it safe to book through Flighko?",
    a: (
      <>
        Flighko is a search engine, not a booking platform. When you find a flight, we redirect you
        to book directly with the airline or a trusted OTA partner. Your payment details never
        touch our servers. See our {link("/terms", "terms of service")} and{" "}
        {link("/privacy", "privacy policy")}.
      </>
    ),
  },
  {
    q: "How does Flighko make money?",
    a: (
      <>
        We earn a small affiliate commission from airlines and OTAs when you complete a booking
        through our links. This doesn't increase the price you pay. If you want to pay even less,
        see how{" "}
        {link("/blog/credit-card-points-for-flights-2026", "credit card points can pay for flights")}{" "}
        and our {link("/blog/travel-rewards-programs-2026", "travel rewards programs comparison")}.
      </>
    ),
  },
  {
    q: "Who runs Flighko?",
    a: (
      <>
        Flighko is built by a small team of travel enthusiasts and technologists who got tired of
        overpaying for flights. We're committed to sharing what we know, for free. Learn more on
        the {link("/about", "about page")}.
      </>
    ),
  },
  {
    q: "Can I use Flighko on my phone?",
    a: (
      <>
        Yes. Flighko is fully responsive and works great on mobile browsers. No app download
        required. An {link("/blog/best-esim-for-travel-2026", "eSIM for travel")} keeps you online
        abroad without a local SIM.
      </>
    ),
  },
  {
    q: "I found a cheaper price elsewhere. Will Flighko match it?",
    a: (
      <>
        Flighko is a comparison tool — we show you prices from many sources. If you find a cheaper
        price elsewhere, we recommend booking directly there. Our goal is to help you find the
        best deal, wherever it is. Set up{" "}
        {link("/blog/google-flights-price-alerts-guide-2026", "Google Flights price alerts")}, check
        the {link("/blog/best-time-book-orlando-flights-2026", "best time to book flights in 2026")}, or
        see the {link("/blog/flight-hacks-2026", "cheapest months to fly")} before you commit.
      </>
    ),
  },
];

export default function FaqClient() {
  return (
    <>
      <Navbar />
      <section
        style={{
          background: "linear-gradient(135deg,#0F2A4A,#0b1f38,#0F2A4A)",
          paddingTop: "8rem",
          paddingBottom: "5rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 1.5rem" }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 700,
              marginBottom: "1.5rem",
              letterSpacing: "-0.025em",
            }}
          >
            Frequently Asked Questions
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.125rem",
              lineHeight: 1.7,
            }}
          >
            Everything you need to know about Flighko.
          </p>
        </div>
      </section>

      <main style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          {faqs.map((faq) => (
            <details
              key={faq.q}
              style={{
                borderBottom: "1px solid #f0f0f0",
                padding: "1.25rem 0",
              }}
            >
              <summary
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                  listStyle: "none",
                  gap: "1rem",
                }}
              >
                <h2
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "1.125rem",
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                    paddingRight: "1rem",
                  }}
                >
                  {faq.q}
                </h2>
                <span
                  style={{
                    fontSize: "1.5rem",
                    color: "#FF6B35",
                    flexShrink: 0,
                  }}
                >
                  ▼
                </span>
              </summary>
              <p
                style={{
                  color: "#4b5563",
                  fontSize: "0.95rem",
                  lineHeight: 1.7,
                  marginTop: "1rem",
                  marginBottom: 0,
                }}
              >
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
