"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { destination as destinations } from "@/data/destinations";
import { type Destination } from "@/types";

const allDests = (Object.values(destinations) as Destination[]).sort((a: Destination, b: Destination) =>
  a.title.localeCompare(b.title)
);

export default function DestinationsClient() {
  return (
    <>
      <Navbar />
      <section
        style={{
          background: "linear-gradient(135deg,#0F2A4A,#0b1f38,#0F2A4A)",
          paddingTop: "8rem",
          paddingBottom: "4rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 1.5rem" }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(2rem,5vw,3rem)",
              fontWeight: 700,
              marginBottom: "1rem",
              letterSpacing: "-0.025em",
            }}
          >
            Popular Destinations
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.125rem",
              lineHeight: 1.7,
            }}
          >
            Explore travel guides for {allDests.length}+ destinations worldwide.
          </p>
        </div>
      </section>

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "3rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {allDests.map((dest) => (
            <Link
              key={dest.slug}
              href={`/destinations/${dest.slug}`}
              style={{
                background: "#fff",
                borderRadius: 16,
                overflow: "hidden",
                border: "1px solid #f0f0f0",
                textDecoration: "none",
                color: "#141414",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 8px 32px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              {dest.heroImage && (
                <img
                  src={dest.heroImage}
                  alt={dest.title}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                  }}
                />
              )}
              <div style={{ padding: "1.25rem" }}>
                <h2
                  style={{
                    fontFamily: "'Space Grotesk',sans-serif",
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    marginBottom: "0.375rem",
                  }}
                >
                  {dest.title}
                </h2>
                {dest.description && (
                  <p
                    style={{
                      color: "#6b7280",
                      fontSize: "0.85rem",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.55rem",
                    }}
                  >
                    {dest.description}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
