import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "About Flighko – Our Mission to Make Flying Affordable",
  description:
    "Learn about Flighko — the free flight comparison tool built by travelers who were tired of overpaying. Compare 200+ airlines, find error fares, and fly smarter.",
  alternates: { canonical: "https://www.flighko.com/about" },
};

const principles = [
  {
    title: "No hidden fees, ever",
    text: "The price you see in search results is what you should expect. We clearly flag when baggage, seat selection, or changes cost extra.",
  },
  {
    title: "Editorial independence",
    text: "Our blog recommendations are based on actual value, not affiliate commission rates. Sponsored content is always clearly labeled.",
  },
  {
    title: "Transparency over dark patterns",
    text: "No countdown timers, fake scarcity, or manipulated search results. We believe trust is built through honesty, not pressure tactics.",
  },
];

export default function AboutPage() {
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
            About Flighko
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.125rem",
              lineHeight: 1.7,
              maxWidth: 672,
              margin: "0 auto",
            }}
          >
            We built Flighko because we were tired of overpaying for flights.
            Now we&apos;re helping others do the same.
          </p>
        </div>
      </section>

      <main style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          {/* Problem */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#0f172a",
              }}
            >
              The Problem We Set Out to Solve
            </h2>
            <p
              style={{
                color: "#4b5563",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}
            >
              Flight pricing is broken. Airlines use complex algorithmic systems
              that fluctuate by the minute. Most travelers see only the first
              layer of pricing — the advertised fare — without understanding why
              they paid $800 for a flight their neighbor got for $400.
            </p>
            <p
              style={{
                color: "#4b5563",
                fontSize: "0.95rem",
                lineHeight: 1.7,
              }}
            >
              The travel industry is designed to extract maximum revenue from each
              passenger. Hidden city ticketing, error fares, positioning flights,
              and strategic booking windows are techniques that experienced
              travelers use to consistently beat the system. But this knowledge
              was scattered across forums, paid newsletters, and opaque
              communities.
            </p>
          </div>

          {/* How We Help */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#0f172a",
              }}
            >
              How We Help
            </h2>
            <p
              style={{
                color: "#4b5563",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}
            >
              Flighko aggregates search results from over 200 airlines and online
              travel agencies, giving you a clear view of the market in one
              place. Our blog goes further — sharing strategies the pros use,
              monitoring for error fares as they appear, and publishing
              data-driven timing guides so you know exactly when to book.
            </p>
            <p
              style={{
                color: "#4b5563",
                fontSize: "0.95rem",
                lineHeight: 1.7,
              }}
            >
              We&apos;re not a booking platform. When you find a flight you like, we
              redirect you to book directly with the airline or through trusted
              OTA partners. This is how we stay free — we earn a small affiliate
              commission when you complete a booking, at absolutely no extra cost
              to you.
            </p>
          </div>

          {/* Principles */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1.5rem",
                color: "#0f172a",
              }}
            >
              Our Principles
            </h2>
            {principles.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "1rem",
                  alignItems: "flex-start",
                  marginBottom: i < principles.length - 1 ? "1.5rem" : 0,
                }}
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    background: "#ffedd5",
                    color: "#f97316",
                    borderRadius: 8,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    marginTop: 2,
                  }}
                >
                  ✓
                </div>
                <div>
                  <h4
                    style={{
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      marginBottom: 4,
                      color: "#0f172a",
                    }}
                  >
                    {p.title}
                  </h4>
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "0.9rem",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {p.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Who We Are */}
          <div
            style={{
              background: "#f8f9fa",
              borderRadius: 16,
              padding: "2rem",
              marginBottom: "3rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                marginBottom: "1rem",
                color: "#0f172a",
              }}
            >
              Who We Are
            </h2>
            <p
              style={{
                color: "#4b5563",
                fontSize: "0.95rem",
                lineHeight: 1.7,
                marginBottom: "1rem",
              }}
            >
              Flighko is a small team of travel enthusiasts, technologists, and
              bargain hunters. We&apos;ve combined our collective experience in travel
              deal hunting, affiliate marketing, and web development to build
              something we&apos;d actually use ourselves.
            </p>
            <p
              style={{
                color: "#4b5563",
                fontSize: "0.95rem",
                lineHeight: 1.7,
              }}
            >
              We travel. We overpay sometimes (even we can&apos;t catch every error
              fare). And we believe that better information leads to better
              decisions — which is why we&apos;re committed to sharing what we know,
              for free, with anyone who wants to fly smarter.
            </p>
          </div>

          {/* CTA */}
          <div
            style={{
              background: "#0f172a",
              borderRadius: 24,
              padding: "2.5rem",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h2
              style={{
                fontFamily: "'Space Grotesk',sans-serif",
                fontSize: "1.875rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              Ready to fly smarter?
            </h2>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.95rem",
                marginBottom: "2rem",
                maxWidth: 672,
                margin: "0 auto 2rem",
              }}
            >
              Browse our travel guides or search flights to your next
              destination.
            </p>
            <div
              style={{
                display: "flex",
                gap: "1rem",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/blog/"
                style={{
                  background: "#fff",
                  color: "#0f172a",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Read the Blog
              </Link>
              <Link
                href="/"
                style={{
                  background: "#FF6B35",
                  color: "#fff",
                  padding: "0.75rem 1.5rem",
                  borderRadius: 9999,
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  textDecoration: "none",
                }}
              >
                Search Flights
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
