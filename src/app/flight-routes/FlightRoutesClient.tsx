"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { flightRoutes } from "@/data/flight-routes";
import routeRegions from "@/data/route-regions.json";
import { RouteLinkCard } from "@/components/templates/routeBlocks";


const allRoutes = Object.values(flightRoutes);

const C = {
  primary: "#0F172A",
  accent: "#FF6B35",
  bg: "#FFFFFF",
  text: "#1E293B",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  surface: "#F8FAFC",
  border: "#E2E8F0",
};

// Popular routes (top routes by price/demand)
const popularSlugs = [
  "cairo-to-dubai",
  "singapore-to-bangkok",
  "london-to-amsterdam",
  "bangkok-to-seoul",
  "bangkok-to-taipei",
  "kuala-lumpur-to-bangkok",
  "dubai-to-paris",
  "dubai-to-abu-dhabi",
  "new-york-to-nashville",
  "cairo-to-istanbul",
  "cairo-to-london",
  "los-angeles-to-las-vegas",
];

export default function FlightRoutesClient() {
  const [query, setQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!query.trim()) return allRoutes;
    const q = query.toLowerCase();
    return allRoutes.filter(
      (r) =>
        r.originCity.toLowerCase().includes(q) ||
        r.destinationCity.toLowerCase().includes(q) ||
        r.slug.includes(q)
    );
  }, [query]);

  // Group filtered routes by region
  const grouped = useMemo(() => {
    const regionMap: Record<string, typeof allRoutes> = {};
    const inRegion = new Set<string>();

    for (const [region, slugs] of Object.entries(routeRegions)) {
      const matches = filtered.filter((r) => slugs.includes(r.slug));
      if (matches.length > 0) {
        regionMap[region] = matches;
        matches.forEach((r) => inRegion.add(r.slug));
      }
    }

    // Uncategorised routes
    const uncategorized = filtered.filter((r) => !inRegion.has(r.slug));
    if (uncategorized.length > 0) {
      regionMap["Other Routes"] = uncategorized;
    }

    return regionMap;
  }, [filtered]);

  const regionNames = Object.keys(grouped);

  // Popular routes from filtered results
  const popularRoutes = useMemo(() => {
    if (query.trim()) return [];
    return popularSlugs
      .map((slug) => allRoutes.find((r) => r.slug === slug))
      .filter((r): r is typeof allRoutes[number] => Boolean(r))
      .slice(0, 8);
  }, [query]);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
      <Navbar />

      {/* ============================================ */}
      {/* FULL-WIDTH HERO                              */}
      {/* ============================================ */}
      <section
        style={{
          position: "relative",
          width: "100%",
          minHeight: "420px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "linear-gradient(135deg, #071d2d 0%, #0a2a3f 40%, #0d3550 70%, #0F2A4A 100%)",
        }}
      >
        {/* Subtle pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(255,107,53,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 50%)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: "100%",
            padding: "3rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 700,
              color: "#fff",
              margin: 0,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textShadow: "0 2px 20px rgba(0,0,0,0.3)",
            }}
          >
            Flight <span style={{ color: C.accent }}>Routes</span> Worldwide
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.75)",
              fontSize: "clamp(1rem, 2vw, 1.15rem)",
              marginTop: "0.75rem",
              lineHeight: 1.6,
              maxWidth: 600,
            }}
          >
            Browse {allRoutes.length}+ flight routes. Compare prices from 200+ airlines and find the cheapest fares.
          </p>

          {/* Search Input */}
          <div style={{ marginTop: "1.5rem", maxWidth: 520 }}>
            <input
              type="text"
              placeholder="Search routes (e.g., Cairo to Dubai)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "1rem 1.25rem",
                borderRadius: 16,
                border: "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.08)",
                color: "#fff",
                fontSize: "1rem",
                outline: "none",
                backdropFilter: "blur(8px)",
                transition: "border-color 0.2s, background 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.background = "rgba(255,255,255,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              }}
            />
          </div>
        </div>
      </section>

      {/* ============================================ */}
      {/* STATS BAR                                    */}
      {/* ============================================ */}
      <section style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: "1.25rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            justifyContent: "center",
            gap: "3rem",
            flexWrap: "wrap",
          }}
        >
          {[
            [`${allRoutes.length}+`, "Flight Routes"],
            ["200+", "Airlines"],
            ["350+", "Destinations"],
            ["24/7", "Price Updates"],
          ].map(([val, label], i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: C.accent,
                }}
              >
                {val}
              </div>
              <div style={{ fontSize: "0.8rem", color: C.muted }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* POPULAR ROUTES                               */}
      {/* ============================================ */}
      {popularRoutes.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 4rem) 0" }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.5rem",
              fontWeight: 700,
              color: C.primary,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Popular <span style={{ color: C.accent }}>Routes</span>
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {popularRoutes.map((r) => (
              <RouteLinkCard key={r.slug} slug={r.slug} originCity={r.originCity} destinationCity={r.destinationCity} flightTime={r.flightTime} price={r.price} colors={C} large />
            ))}
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* REGION TABS                                  */}
      {/* ============================================ */}
      {!query.trim() && regionNames.length > 1 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem clamp(1.5rem, 5vw, 4rem) 0" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveRegion(null)}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 9999,
                border: `1px solid ${activeRegion === null ? C.accent : C.border}`,
                background: activeRegion === null ? C.accent : "transparent",
                color: activeRegion === null ? "#fff" : C.muted,
                fontSize: "0.85rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              All Regions
            </button>
            {regionNames.map((region) => (
              <button
                key={region}
                onClick={() => setActiveRegion(activeRegion === region ? null : region)}
                style={{
                  padding: "0.5rem 1.25rem",
                  borderRadius: 9999,
                  border: `1px solid ${activeRegion === region ? C.accent : C.border}`,
                  background: activeRegion === region ? C.accent : "transparent",
                  color: activeRegion === region ? "#fff" : C.muted,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {region} ({grouped[region].length})
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ============================================ */}
      {/* ROUTES BY REGION                             */}
      {/* ============================================ */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem clamp(1.5rem, 5vw, 4rem) 3rem" }}>
        {Object.entries(grouped)
          .filter(([region]) => !activeRegion || activeRegion === region)
          .map(([region, routes]) => (
            <div key={region} style={{ marginBottom: "3rem" }}>
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: C.primary,
                  marginBottom: "1.25rem",
                  paddingBottom: "0.75rem",
                  borderBottom: `2px solid ${C.accent}`,
                  display: "inline-block",
                }}
              >
                {region}
                <span style={{ fontSize: "0.8rem", color: C.muted, fontWeight: 500, marginLeft: "0.5rem" }}>
                  ({routes.length} routes)
                </span>
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 12,
                }}
              >
                {routes.map((r) => (
                  <RouteLinkCard key={r.slug} slug={r.slug} originCity={r.originCity} destinationCity={r.destinationCity} flightTime={r.flightTime} price={r.price} colors={C} />
                ))}
              </div>
            </div>
          ))}

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 0", color: C.mutedLight }}>
            <p style={{ fontSize: "1.125rem" }}>
              No routes found matching &ldquo;{query}&rdquo;
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
