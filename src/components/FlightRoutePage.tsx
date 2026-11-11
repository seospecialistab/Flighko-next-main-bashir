"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { FlightRoute } from "@/data/flight-routes";
import { flightRoutes } from "@/data/flight-routes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSeoH1 } from "@/lib/seo-h1s";
import { getRouteIntro } from "@/lib/route-intro";
import { RouteSection, SectionH2 } from "@/components/templates/routePageBlocks";
import RouteMap from "@/components/RouteMap";
import SeasonalityChart from "@/components/SeasonalityChart";

/* ── Category palettes ──────────────────────────────────────────────── */
const PALETTES: Record<string, { primary: string; accent: string; bg: string; text: string; muted: string; mutedLight: string; surface: string; border: string }> = {
  city:          { primary: "#1e3a5f", accent: "#facc15", bg: "#ffffff",  text: "#1e3a5f", muted: "#475569", mutedLight: "#64748b", surface: "#f8fafc", border: "#e2e8f0" },
  beach:         { primary: "#0891b2", accent: "#f97316", bg: "#fffdf6", text: "#164e63", muted: "#0e7490", mutedLight: "#64748b", surface: "#ffffff", border: "#bae6fd" },
  culture:       { primary: "#1d4ed8", accent: "#1d4ed8", bg: "#fdf8ee", text: "#451a03", muted: "#78350f", mutedLight: "#78716c", surface: "#ffffff", border: "#e7d7b8" },
  adventure:     { primary: "#ea580c", accent: "#ea580c", bg: "#f8faf7", text: "#14532d", muted: "#3f6212", mutedLight: "#5a7a3a", surface: "#ffffff", border: "#d9edd9" },
  entertainment: { primary: "#be185d", accent: "#db2777", bg: "#fffaff", text: "#4c1d95", muted: "#831843", mutedLight: "#6b7280", surface: "#ffffff", border: "#f3e8f2" },
};

/* ── Hex helpers ────────────────────────────────────────────────────── */
function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lightenHex(hex: string, amt: number): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + amt);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + amt);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + amt);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function darkenHex(hex: string, amt: number): string {
  const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amt);
  const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amt);
  const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amt);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

export default function FlightRoutePage({ route, category, slug, hubLinks }: { route: FlightRoute; category?: string; slug?: string; hubLinks?: { originCitySlug: string; destCitySlug: string; regionName: string | null; regionSlug: string | null } }) {
  const C = PALETTES[category ?? "city"] ?? PALETTES["city"];

  /* Derived accent helpers — replace all hardcoded rgba(255,107,53,...) */
  const accentShadow = (a: number) => hexToRgba(C.accent, a);
  const accentLight  = () => lightenHex(C.accent, 40);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Fix Travelpayouts widget: darken text labels
  useEffect(() => {
    const fixWidgetText = () => {
      const allEls = document.querySelectorAll("#tpwl-search span, #tpwl-search label, #tpwl-search div, #tpwl-search p");
      allEls.forEach((el) => {
        const text = el.textContent?.trim().toLowerCase() || "";
        if (text.includes("show hotels") || text.includes("show results") || text.includes("show prices") || text.includes("share results") || text.includes("create multi")) {
          (el as HTMLElement).style.color = "#1E293B";
          (el as HTMLElement).style.fontWeight = "500";
        }
      });
    };
    fixWidgetText();
    const t1 = setTimeout(fixWidgetText, 1000);
    const t2 = setTimeout(fixWidgetText, 3000);
    const t3 = setTimeout(fixWidgetText, 5000);
    const t4 = setTimeout(fixWidgetText, 8000);
    const container = document.getElementById("tpwl-search");
    let observer: MutationObserver | null = null;
    if (container) {
      observer = new MutationObserver(() => fixWidgetText());
      observer.observe(container, { childList: true, subtree: true });
    }
    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4);
      observer?.disconnect();
    };
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: C.bg, color: C.text, minHeight: "100vh" }}>
      <Navbar />

      {/* ============================================ */}
      {/* FULL-WIDTH HERO                              */}
      {/* ============================================ */}
      <header
        style={{
          position: "relative",
          width: "100%",
          minHeight: "480px",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: `linear-gradient(135deg, ${darkenHex(C.primary, 50)} 0%, ${darkenHex(C.primary, 30)} 40%, ${darkenHex(C.primary, 10)} 70%, ${C.primary} 100%)`,
        }}
      >
        {/* Hero background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: route.imageDir
            ? `url('/images/route/${route.imageDir}/hero-bg.webp')`
            : "none",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.25,
          zIndex: 0,
        }}
        aria-hidden="true"
      />
      {/* Darken overlay to keep text readable */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(15, 23, 42, 0.5)",
          zIndex: 1,
        }}
      />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 80%, " + accentShadow(0.08) + " 0%, transparent 50%), radial-gradient(circle at 80% 20%, " + accentShadow(0.06) + " 0%, transparent 50%)",
          }}
        />
        {/* Content overlay */}
        <div
          style={{
            position: "relative",
            width: "100%",
            padding: "3rem clamp(1.5rem, 5vw, 4rem) 2.5rem",
            maxWidth: 1200,
            margin: "0 auto",
          }}
        >
          {/* Breadcrumbs */}
          <div style={{ marginBottom: "1.5rem", fontSize: "0.8125rem", color: "rgba(255,255,255,0.5)" }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <Link href="/flight-routes/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}>Flight Routes</Link>
            <span style={{ margin: "0 0.5rem" }}>/</span>
            <span style={{ color: "rgba(255,255,255,0.8)" }}>{route.originCity} to {route.destinationCity}</span>
          </div>

          {/* Price badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              background: C.accent,
              color: "#0f172a",
              padding: "0.5rem 1.25rem",
              borderRadius: 50,
              fontWeight: 700,
              fontSize: "0.85rem",
              marginBottom: "1rem",
              boxShadow: `0 4px 12px ${accentShadow(0.3)}`,
            }}
          >
            ✈️ From ${route.price} {route.priceSuffix}
          </div>

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
            {route.h1 ? route.h1 : getSeoH1(slug || "", route.originCity, route.destinationCity)}
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
            Compare flight prices from {route.originCity} to {route.destinationCity}. Find the best deals, compare airlines, and book smarter.
          </p>

          {/* Trust badges */}
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "1.25rem", flexWrap: "wrap" }}>
            {["Compare 200+ airlines", "No hidden fees", "Price alerts"].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.4rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} style={{ width: 14, height: 14, color: C.accent }}>
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* QUICK FACTS BAR                              */}
      {/* ============================================ */}
      <section style={{ background: C.primary, padding: "0 clamp(1.5rem, 5vw, 4rem)" }}>
        <div
          className="route-stats"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            gap: 0,
          }}
        >
          {[
            { label: "Flight Time", value: route.flightTime },
            { label: "Distance", value: route.distance },
            { label: "Nonstop Airlines", value: String(route.airlineCount) },
            { label: "Frequency", value: route.frequency },
            { label: "Cheapest Day", value: route.cheapestDay },
          ].map((item, i, arr) => (
            <div
              key={i}
              style={{
                flex: "1 1 0",
                minWidth: 120,
                padding: "1.25rem 1.5rem",
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.12)" : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.25rem",
              }}
            >
              <div
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.75)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontWeight: 500,
                }}
              >
                {item.label}
              </div>
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Airport images */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {route.imageDir ? (
            <>
              <figure style={{ margin: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", height: "220px" }}>
                <img
                  src={`/images/route/${route.imageDir}/airport-origin-aerial.webp`}
                  alt={`Aerial view of ${route.originAirportFull} — main airport for ${route.originCity}`}
                  style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                  loading="lazy" width="1200" height="800" />
                <figcaption style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{route.originAirportFull}</span>
                </figcaption>
              </figure>
              <figure style={{ margin: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", height: "220px" }}>
                <img
                  src={`/images/route/${route.imageDir}/airport-destination-terminal.webp`}
                  alt={`${route.destinationAirportFull} terminal interior — main airport for ${route.destinationCity}`}
                  style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                  loading="lazy" width="1200" height="800" />
                <figcaption style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{route.destinationAirportFull}</span>
                </figcaption>
              </figure>
              <figure style={{ margin: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden", height: "220px" }}>
                <img
                  src={`/images/route/${route.imageDir}/airport-destination-feature.webp`}
                  alt={`Notable airport feature on the ${route.destinationCity} route`}
                  style={{ width: "100%", height: "160px", objectFit: "cover", display: "block" }}
                  loading="lazy" width="1200" height="800" />
                <figcaption style={{ padding: "0.5rem 1rem", fontSize: "0.8rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>Airport feature</span>
                </figcaption>
              </figure>
            </>
          ) : (
            <>
              <figure style={{ margin: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, height: "220px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5rem", padding: "0 1.25rem" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.2rem", fontWeight: 700, color: C.primary }}>{route.originAirportCode}</span>
                <span style={{ fontSize: "0.85rem", color: C.text, lineHeight: 1.4 }}>{route.originAirportFull}</span>
              </figure>
              <figure style={{ margin: 0, background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, height: "220px", display: "flex", flexDirection: "column", justifyContent: "center", gap: "0.5rem", padding: "0 1.25rem" }}>
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "2.2rem", fontWeight: 700, color: C.primary }}>{route.destinationAirportCode}</span>
                <span style={{ fontSize: "0.85rem", color: C.text, lineHeight: 1.4 }}>{route.destinationAirportFull}</span>
              </figure>
            </>
          )}
        </div>
      </div>

      {/* Route Map — topographic SVG visual (standards item 8: topical image, item 5: descriptive alt) */}
      <RouteMap
        C={C}
        originCity={route.originCity}
        originCode={route.originAirportCode}
        destCity={route.destinationCity}
        destCode={route.destinationAirportCode}
        distanceKm={route.distanceKm}
        flightTime={route.flightTime}
        timezone={route.timezone}
      />

      {/* ============================================ */}
      {/* SEARCH WIDGET (Flights + Hotels)             */}
      {/* ============================================ */}
      <section id="search-flights" style={{ background: C.surface, borderBottom: `1px solid ${C.border}`, padding: "2rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div id="tpwl-search" role="search" aria-label="Flight search widget" style={{ minHeight: 180, maxWidth: "100%" }} />
        </div>
      </section>

      {/* ============================================ */}
      {/* MAIN CONTENT                                 */}
      {/* ============================================ */}
      <main style={{ maxWidth: "1360px", marginLeft: "auto", marginRight: "auto", padding: "2.5rem clamp(1.5rem, 5vw, 4rem)" }}>
              <div className="route-layout">
          {/* Content Column */}
          <div>
            {/* About Section */}
            <RouteSection>
              <SectionH2 C={C} fontSize="1.75rem">Cheap Flights from {route.originCity} to {route.destinationCity}</SectionH2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "1rem", fontSize: "1.05rem" }}>
                {getRouteIntro(route, route.description)}
              </p>
            </RouteSection>

            {/* Long Description (SEO content) */}
            {route.longDescription && (
              <RouteSection>
                {(() => {
                  const blocks = route.longDescription.split("\n\n");
                  type Sec = { title?: string; items: string[] };
                  const sections: Sec[] = [];
                  let current: Sec = { items: [] };
                  blocks.forEach((para) => {
                    const isHeader = para.startsWith("**") && para.endsWith("**");
                    if (isHeader) {
                      if (current.items.length > 0 || current.title) sections.push(current);
                      current = { title: "", items: [] } as Sec;
                      current.title = para.slice(2, -2);
                    } else {
                      current.items.push(para);
                    }
                  });
                  if (current.items.length > 0 || current.title) sections.push(current);
                  return sections.map((sec, si) => {
                    // First block before any header → highlighted lead paragraph
                    if (!sec.title && sec.items.length === 1) {
                      return (
                        <div
                          key={si}
                          style={{
                            background: "#fff",
                            borderLeft: `4px solid ${C.accent}`,
                            borderRadius: 12,
                            padding: "1.5rem 1.75rem",
                            marginBottom: "1.5rem",
                            color: C.text,
                            fontSize: "1.12rem",
                            lineHeight: 1.8,
                          }}
                        >
                          {sec.items[0]}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={si}
                        style={{
                          background: C.surface,
                          border: `1px solid ${C.border}`,
                          borderRadius: 16,
                          padding: "1.75rem 2rem",
                          marginBottom: "1.5rem",
                        }}
                      >
                        {sec.title && (
                          <h3
                            style={{
                              fontFamily: "'Space Grotesk', sans-serif",
                              fontSize: "1.2rem",
                              fontWeight: 700,
                              color: C.primary,
                              margin: "0 0 1rem",
                              letterSpacing: "-0.01em",
                              display: "flex",
                              alignItems: "center",
                              gap: "0.7rem",
                            }}
                          >
                            <span
                              style={{
                                display: "inline-block",
                                width: 10,
                                height: 24,
                                borderRadius: 3,
                                background: C.accent,
                              }}
                            />
                            {sec.title}
                          </h3>
                        )}
                        {sec.items.map((para, pi) => {
                          const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
                          const isList = lines.length > 0 && lines.every((l) => l.startsWith("- "));
                          if (isList) {
                            return (
                              <ul key={pi} className="route-bullets">
                                {lines.map((l, j) => (
                                  <li
                                    key={j}
                                    style={{
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: "0.5rem",
                                      color: C.muted,
                                      lineHeight: 1.7,
                                      fontSize: "1.02rem",
                                      marginBottom: "0.4rem",
                                      breakInside: "avoid",
                                    }}
                                  >
                                    <span style={{ color: C.primary, fontWeight: 700, marginTop: "0.05rem" }}>›</span>
                                    <span>{l.slice(2)}</span>
                                  </li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p
                              key={pi}
                              style={{
                                color: C.muted,
                                lineHeight: 1.75,
                                marginBottom: "1rem",
                                fontSize: "1.02rem",
                              }}
                            >
                              {para}
                            </p>
                          );
                        })}
                      </div>
                    );
                  });
                })()}
              </RouteSection>
            )}

            {/* Seasonality Chart — topical SVG visual from monthlyPrices data (standards item 8: topical image, item 5: descriptive alt) */}
            {route.monthlyPrices && route.monthlyPrices.length > 0 && (
              <SeasonalityChart C={C} monthlyPrices={route.monthlyPrices} />
            )}

            {/* Airlines Detail Table */}
            {route.airlines_detail && route.airlines_detail.length > 0 && (
              <RouteSection>
                <SectionH2 C={C}>Airline Comparison: {route.originCity} to {route.destinationCity}</SectionH2>
                <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "1rem" }}>
                  Here&apos;s a detailed breakdown of each airline flying this route, including aircraft type, frequency, and what to expect:
                </p>
                <div style={{ overflowX: "auto", border: `1px solid ${C.border}`, borderRadius: 12, background: "#fff" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", margin: 0 }}>
                    <thead>
                      <tr>
                        {["Airline", "Aircraft", "Frequency", "Alliance", "Notes"].map((h, i) => (
                          <th
                            key={i}
                            style={{
                              background: C.surface,
                              padding: "0.85rem 1rem",
                              paddingRight: i === 4 ? "1.75rem" : "1rem",
                              textAlign: "left",
                              fontSize: "0.75rem",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                              color: C.muted,
                              fontWeight: 700,
                              borderBottom: `2px solid ${C.border}`,
                              width: i === 4 ? "34%" : "auto",
                              borderTopLeftRadius: i === 0 ? 12 : 0,
                              borderTopRightRadius: i === 4 ? 12 : 0,
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {route.airlines_detail.map((airline, i) => (
                        <tr key={i}>
                          <td style={{ padding: "0.75rem 1rem", paddingRight: "1rem", verticalAlign: "top", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem", fontWeight: 700, color: C.primary }}>
                            {airline.name}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", paddingRight: "1rem", verticalAlign: "top", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem" }}>
                            {airline.aircraft}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", paddingRight: "1rem", verticalAlign: "top", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem" }}>
                            {airline.frequency}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", paddingRight: "1rem", verticalAlign: "top", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem" }}>
                            {airline.alliance || "—"}
                          </td>
                          <td style={{ padding: "0.75rem 1rem", paddingRight: "1.75rem", verticalAlign: "top", borderBottom: `1px solid ${C.border}`, fontSize: "0.85rem", color: C.muted, width: "34%" }}>
                            {airline.notes}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </RouteSection>
            )}

            {/* Carrier aircraft gallery */}
            {route.aircraftImages ? (
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.primary,
                  margin: "0 0 1rem",
                  letterSpacing: "-0.01em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                }}
              >
                <span>✈️ Aircraft on This Route</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src={`/images/route/${route.imageDir}/egyptair-a330.webp`} alt="EgyptAir Airbus A330 in flight" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>MS A330</span>
                  </figcaption>
                </figure>
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src={`/images/route/${route.imageDir}/egyptair-a320.webp`} alt="EgyptAir Airbus A320 in flight" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>MS A320</span>
                  </figcaption>
                </figure>
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src={`/images/route/${route.imageDir}/saudia-a320neo.webp`} alt="Saudia Airbus A320neo in flight" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>SV A320neo</span>
                  </figcaption>
                </figure>
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src={`/images/route/${route.imageDir}/airbus-a320.webp`} alt="Airbus A320 aircraft in flight against a clear blue sky" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>A320</span>
                  </figcaption>
                </figure>
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src={`/images/route/${route.imageDir}/boeing-737.webp`} alt="Boeing 737 aircraft in flight" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>737</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            ) : route.slug === "singapore-to-bangkok" ? (
            <div style={{ marginBottom: "2rem" }}>
              <h3
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: C.primary,
                  margin: "0 0 1rem",
                  letterSpacing: "-0.01em",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.7rem",
                }}
              >
                <span>✈️ Aircraft on This Route</span>
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem" }}>
                {/* Singapore Airlines A350-900 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/sq-airbus-a350-900-flight.webp" alt="Singapore Airlines Airbus A350-900 aircraft in flight against a cloudy sky" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>SQ A350-900</span>
                  </figcaption>
                </figure>
                {/* Singapore Airlines 787-10 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/sq-boeing-787-10-flight.webp" alt="Singapore Airlines Boeing 787-10 Dreamliner soaring through a clear sky" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>SQ 787-10</span>
                  </figcaption>
                </figure>
                {/* Singapore Airlines A380 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/sq-airbus-a380-flight.webp" alt="Singapore Airlines Airbus A380 jet flying against a clear blue sky — double-decker aircraft" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>SQ A380</span>
                  </figcaption>
                </figure>
                {/* Thai Airways A350 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/tg-airbus-a350-flight.webp" alt="Thai Airways Airbus A350 aircraft in flight showcasing its modern design" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>TG A350</span>
                  </figcaption>
                </figure>
                {/* AirAsia A320 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/airasia-airbus-a320-landing.webp" alt="AirAsia Airbus A320 aircraft landing on an airport runway on a bright sunny day" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>AirAsia A320</span>
                  </figcaption>
                </figure>
                {/* Scoot 787 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/scoot-boeing-787-flight.webp" alt="Scoot Boeing 787 Dreamliner soaring through a clear blue sky" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Scoot 787</span>
                    <span style={{ color: C.mutedLight, fontSize: "0.75rem" }}></span>
                  </figcaption>
                </figure>
                {/* Scoot A320 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/scoot-airbus-a320-flight.webp" alt="Scoot Airlines Airbus A320 flying high with Scoot branding against a clear blue sky" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Scoot A320</span>
                  </figcaption>
                </figure>
                {/* Jetstar A320 */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/jetstar-airbus-a320-flight.webp" alt="Jetstar Airbus A320 aircraft flying against a clear blue sky — low-cost carrier" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Jetstar A320</span>
                  </figcaption>
                </figure>
                {/* Jetstar A320 (alternate) */}
                <figure style={{ margin: 0, background: C.surface, borderRadius: 12, border: `1px solid ${C.border}`, overflow: "hidden" }}>
                  <img src="/images/route/sin-bkk/jetstar-airbus-a320-flight-cloudy.webp" alt="Jetstar Airbus A320 airliner flying in clear cloudy skies" style={{ width: "100%", height: "130px", objectFit: "cover", display: "block" }} loading="lazy" width="1200" height="800" />
                  <figcaption style={{ padding: "0.4rem 0.6rem", fontSize: "0.75rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>Jetstar A320</span>
                  </figcaption>
                </figure>
              </div>
            </div>
            ) : null}

            {/* Monthly Prices Chart */}
            {route.monthlyPrices && route.monthlyPrices.length > 0 && (
              <RouteSection>
                <SectionH2 C={C}>Cheapest Months to Fly {route.originCity} to {route.destinationCity}</SectionH2>
                <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "1.5rem" }}>
                  Prices fluctuate throughout the year. Here&apos;s what to expect each month (round-trip economy estimates):
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.75rem" }}>
                  {route.monthlyPrices.map((mp, i) => {
                    const maxPrice = Math.max(...route.monthlyPrices!.map((m) => m.price));
                    const minPrice = Math.min(...route.monthlyPrices!.map((m) => m.price));
                    const isCheapest = mp.price === minPrice;
                    const isMostExpensive = mp.price === maxPrice;
                    return (
                      <div
                        key={i}
                        style={{
                          background: isCheapest ? "#dcfce7" : isMostExpensive ? "#fef2f2" : C.surface,
                          borderRadius: 12,
                          padding: "1rem",
                          border: `1px solid ${isCheapest ? "#86efac" : isMostExpensive ? "#fecaca" : C.border}`,
                          textAlign: "center",
                        }}
                      >
                        <div style={{ fontSize: "0.75rem", color: C.mutedLight, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {mp.month}
                        </div>
                        <div
                          style={{
                            fontFamily: "'Space Grotesk', sans-serif",
                            fontSize: "1.25rem",
                            fontWeight: 700,
                            color: isCheapest ? "#166534" : isMostExpensive ? "#991b1b" : C.primary,
                            margin: "0.25rem 0",
                          }}
                        >
                          ${mp.price}
                        </div>
                        {isCheapest && <div style={{ fontSize: "0.75rem", color: "#166534", fontWeight: 700 }}>💰 CHEAPEST</div>}
                        {mp.note && <div style={{ fontSize: "0.75rem", color: C.mutedLight, marginTop: "0.25rem" }}>{mp.note}</div>}
                      </div>
                    );
                  })}
                </div>
              </RouteSection>
            )}

            {/* Destination Info */}
            {route.destination_info && (
              <RouteSection>
                <SectionH2 C={C}>Travel Guide: {route.destinationCity}</SectionH2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
                  {[
                    { label: "Visa", value: route.destination_info.visa, icon: "🛂" },
                    { label: "Currency", value: route.destination_info.currency, icon: "💰" },
                    { label: "Language", value: route.destination_info.language, icon: "🗣️" },
                    { label: "Timezone", value: route.destination_info.timezone, icon: "🕐" },
                  ].map((item, i) => (
                    <div key={i} style={{ background: C.surface, borderRadius: 12, padding: "1rem", border: `1px solid ${C.border}` }}>
                      <div style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>{item.icon}</div>
                      <div style={{ fontSize: "0.75rem", color: C.mutedLight, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 500 }}>{item.label}</div>
                      <div style={{ fontSize: "0.9rem", fontWeight: 600, color: C.primary, marginTop: "0.25rem" }}>{item.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ background: C.surface, borderRadius: 16, padding: "1.5rem", border: `1px solid ${C.border}`, marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.primary, marginBottom: "0.75rem" }}>🚖 Getting from {route.destinationAirportFull} to the City</h3>
                  <p style={{ color: C.muted, lineHeight: 1.7, fontSize: "0.95rem" }}>{route.destination_info.airportTransport}</p>
                </div>
                <div style={{ background: C.surface, borderRadius: 16, padding: "1.5rem", border: `1px solid ${C.border}` }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.primary, marginBottom: "0.75rem" }}>🌤️ Best Time to Visit {route.destinationCity}</h3>
                  <p style={{ color: C.muted, lineHeight: 1.7, fontSize: "0.95rem" }}>{route.destination_info.bestTimeToVisit}</p>
                </div>
                {route.destination_info.localTips.length > 0 && (
                  <div style={{ marginTop: "1rem" }}>
                    <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.primary, marginBottom: "0.75rem" }}>💡 Local Tips</h3>
                    <ul style={{ margin: 0, paddingLeft: "1.5rem", color: C.muted, lineHeight: 1.8 }}>
                      {route.destination_info.localTips.map((tip, i) => (
                        <li key={i}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Baggage comparison visual */}
                <div style={{ marginTop: "1.5rem", background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                  {route.imageDir && (
                    <img
                      src={`/images/route/${route.imageDir}/baggage-suits.webp`}
                      alt="Variety of modern suitcases — visual comparison of carry-on and checked baggage allowances"
                      style={{ width: "140px", height: "100px", objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                      loading="lazy" width="1200" height="800" />
                  )}
                  <div style={{ fontSize: "0.85rem", color: C.muted, lineHeight: 1.6 }}>
                    <strong style={{ color: C.primary, fontSize: "0.95rem" }}>Baggage on this route:</strong>{" "}
                    {"Full-service carriers include a checked bag on most fares; budget carriers typically charge extra for a checked bag, with carry-on often included. Compare the total price including bags before booking."}
                    <br />
                    <span style={{ fontSize: "0.75rem", color: C.mutedLight, display: "block", marginTop: "0.25rem" }}>
                  Baggage allowance varies — confirm with your airline before booking.
                </span>
                  </div>
                </div>
              </RouteSection>
            )}

            {/* Route Comparisons */}
            {route.routeComparisons && route.routeComparisons.length > 0 && (
              <RouteSection>
                <SectionH2 C={C}>{route.originCity} to {route.destinationCity} vs Similar Routes</SectionH2>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1rem" }}>
                  {route.routeComparisons.map((comp, i) => (
                    <div
                      key={i}
                      style={{
                        background: C.surface,
                        borderRadius: 16,
                        padding: "1.5rem",
                        border: `1px solid ${C.border}`,
                      }}
                    >
                      <h3 style={{ fontSize: "1rem", fontWeight: 700, color: C.primary, marginBottom: "0.5rem" }}>
                        {comp.originCity} → {comp.destinationCity}
                      </h3>
                      <div style={{ fontSize: "0.85rem", color: C.muted, marginBottom: "0.75rem" }}>
                        From ${comp.price} · {comp.flightTime}
                      </div>
                      <div style={{ marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#166534", textTransform: "uppercase" }}>✅ Pros: </span>
                        <span style={{ fontSize: "0.85rem", color: C.muted }}>{comp.pros}</span>
                      </div>
                      <div>
                        <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#991b1b", textTransform: "uppercase" }}>⚠️ Cons: </span>
                        <span style={{ fontSize: "0.85rem", color: C.muted }}>{comp.cons}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </RouteSection>
            )}

            {/* Travel Tips */}
            {route.travelTips && route.travelTips.length > 0 && (
              <RouteSection>
                <SectionH2 C={C}>Practical Tips for Flying {route.originCity} to {route.destinationCity}</SectionH2>
                <div style={{ background: C.surface, borderRadius: 16, padding: "1.5rem", border: `1px solid ${C.border}` }}>
                  <ul style={{ margin: 0, paddingLeft: "1.5rem", color: C.muted, lineHeight: 1.8 }}>
                    {route.travelTips.map((tip, i) => (
                      <li key={i} style={{ marginBottom: "0.5rem" }}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </RouteSection>
            )}

            {/* Flight Time Section — answer-first (2026-10-01)
                Evidence: airmilescalculator.com ranks page one for corridor flight-time
                queries with 251 words and zero schema; our pages had the data but no
                heading matching the query. See seo-secrets/source/market-intel-teardown-2-20261001.md.
                Every value below comes from the route's own fields. No invented data. */}
            <RouteSection>
              <SectionH2 C={C}>Flight Time {route.originCity} to {route.destinationCity}</SectionH2>
              <div style={{ background: C.surface, borderRadius: 16, padding: "1.5rem", border: `1px solid ${C.border}` }}>
                <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "0.75rem" }}>
                  A direct flight from {route.originCity} ({route.originAirportCode}) to{" "}
                  {route.destinationCity} ({route.destinationAirportCode}) takes{" "}
                  <strong style={{ color: C.primary }}>{route.flightTime}</strong>. That is the
                  nonstop time. Connecting itineraries take longer.
                </p>
                <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "0.75rem" }}>
                  The sector covers about {route.distanceKm} ({route.distance}), landing at{" "}
                  {route.destinationAirportFull}. {route.airlineCount} airlines operate it nonstop.
                </p>
                <p style={{ color: C.muted, lineHeight: 1.8, margin: 0 }}>
                  Nonstop sample fares start around ${route.price} {route.priceSuffix}. Confirm
                  the live price before booking.
                </p>
              </div>
            </RouteSection>

            {/* Airlines Section */}
            <RouteSection>
              <SectionH2 C={C}>Airlines Flying {route.originCity} to {route.destinationCity}</SectionH2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "1rem" }}>
                {route.airlineCount} airlines operate nonstop between {route.originCity} and {route.destinationCity}:
              </p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", margin: "1rem 0 1.5rem" }}>
                  <thead>
                    <tr>
                      {["Airline", "Nonstop", "Notes"].map((h, i) => (
                        <th
                          key={i}
                          style={{
                            background: C.surface,
                            padding: "0.75rem 1rem",
                            textAlign: "left",
                            fontSize: "0.75rem",
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: C.muted,
                            fontWeight: 700,
                            borderBottom: `2px solid ${C.border}`,
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem", fontWeight: 700, color: C.primary }}>
                        {route.airlines}
                      </td>
                      <td style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem" }}>
                        <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: 9999, fontSize: "0.75rem", fontWeight: 700, background: "#dcfce7", color: "#166534" }}>
                          Nonstop
                        </span>
                      </td>
                      <td style={{ padding: "0.75rem 1rem", borderBottom: `1px solid ${C.border}`, fontSize: "0.9rem", color: C.muted }}>
                        Highest frequency
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p style={{ color: C.muted, lineHeight: 1.8 }}>
                Flexible on layovers? Connecting flights via major hubs can sometimes be cheaper than flying direct. Use Flighko to compare both options and find the best deal for your schedule.
              </p>
            </RouteSection>

            {/* Best Time to Book */}
            <RouteSection>
              <SectionH2 C={C}>Best Time to Book & Fly {route.originCity} to {route.destinationCity}</SectionH2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "1.25rem" }}>
                Finding cheap flights depends on timing. Here&apos;s what you need to know about the best time to fly from {route.originCity} to {route.destinationCity}:
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1rem" }}>
                {route.tips.map((tip, i) => (
                  <div
                    key={i}
                    style={{
                      background: C.surface,
                      borderRadius: 16,
                      padding: "1.5rem",
                      border: `1px solid ${C.border}`,
                      transition: "border-color 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.accent;
                      e.currentTarget.style.boxShadow = `0 4px 16px ${accentShadow(0.1)}`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{tip.icon}</div>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700, color: C.primary, marginBottom: "0.5rem" }}>{tip.title}</h3>
                    <p style={{ fontSize: "0.85rem", color: C.muted, margin: 0, lineHeight: 1.6 }}>{tip.text}</p>
                  </div>
                ))}
              </div>
            </RouteSection>

            {/* Delay Info */}
            <RouteSection>
              <SectionH2 C={C}>Are {route.originCity} to {route.destinationCity} Flights Often Delayed?</SectionH2>
              <p style={{ color: C.muted, lineHeight: 1.8 }}>
                Historical tracking shows roughly {route.delayRate} of flights on this route run late, averaging around {route.avgDelay}. {route.bestPerformanceTime} have historically run more reliably — worth factoring in if you&apos;ve got a tight connection.
              </p>
            </RouteSection>

            {/* How to Find Cheap Flights */}
            <RouteSection>
              <SectionH2 C={C}>How to Find Cheap Flights from {route.originCity} to {route.destinationCity}</SectionH2>
              <p style={{ color: C.muted, lineHeight: 1.8, marginBottom: "1rem" }}>
                Here are proven strategies to help you find the cheapest flights on this route:
              </p>
              <ul style={{ margin: "0.5rem 0 1.5rem 1.5rem", color: C.muted, lineHeight: 1.8, padding: 0 }}>
                {[
                  { strong: "Book in advance:", text: `For the best prices, book your flight ${route.bookAhead} before departure. Last-minute bookings typically cost 20-40% more.` },
                  { strong: "Be flexible with dates:", text: `Flying on ${route.cheapestDay}s can save you 15-25% compared to other days. Use Flighko's flexible date search to see prices across the entire month.` },
                  { strong: "Compare airlines:", text: "Don't settle for the first price you see. Flighko compares prices from 200+ airlines, including budget carriers and full-service airlines." },
                  { strong: "Set price alerts:", text: "Not ready to book yet? Set a price alert on Flighko and we'll notify you when fares drop for your desired route." },
                  { strong: "Consider nearby airports:", text: "Sometimes flying into or out of a nearby airport can save you hundreds of dollars. Check prices for alternate airports on Flighko." },
                  { strong: "Travel during off-peak seasons:", text: "Avoid peak travel times like holidays and school breaks. Shoulder season travel (just before or after peak) often offers the best balance of good weather and low prices." },
                ].map((item, i) => (
                  <li key={i} style={{ marginBottom: "0.5rem" }}>
                    <strong style={{ color: C.primary }}>{item.strong}</strong> {item.text}
                  </li>
                ))}
              </ul>
            </RouteSection>

            {/* Route Information */}
            <RouteSection>
              <SectionH2 C={C}>Flight Route Information</SectionH2>
              <div style={{ background: C.surface, borderRadius: 16, padding: "1.5rem", border: `1px solid ${C.border}` }}>
                {[
                  ["Origin", `${route.originCity} (${route.originAirportCode}) — ${route.originAirportFull}`],
                  ["Destination", `${route.destinationCity} (${route.destinationAirportCode}) — ${route.destinationAirportFull}`],
                  ["Flight Time", `${route.flightTime} (nonstop)`],
                  ["Distance", `Approximately ${route.distance} (${route.distanceKm})`],
                  ["Typical Round-Trip Fare", `$${route.price} economy`],
                  ["Nonstop Airlines", route.airlines],
                  ["Frequency", route.frequency],
                ].map(([label, value], i, arr) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "0.75rem 0",
                      borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                      gap: "1rem",
                    }}
                  >
                    <span style={{ fontSize: "0.9rem", color: C.muted, fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, color: C.primary, textAlign: "right" }}>{value}</span>
                  </div>
                ))}
              </div>
            </RouteSection>

            {/* CTA */}
            <section
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${accentLight()})`,
                borderRadius: 20,
                padding: "2.5rem",
                textAlign: "center",
                marginBottom: "3rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#fff",
                  marginBottom: "0.75rem",
                }}
              >
                Want to Search Live Prices Right Now?
              </h2>
              <p style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.7, marginBottom: "1.25rem", maxWidth: 500, margin: "0 auto 1.25rem" }}>
                Static fare estimates only go so far — search live {route.originCity}–{route.destinationCity} prices with Flighko&apos;s flight search to see today&apos;s actual fares across airlines.
              </p>
              <a
                href="#search-flights"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.875rem 2rem",
                  background: "#fff",
                  color: C.primary,
                  borderRadius: 12,
                  fontWeight: 700,
                  fontSize: "1rem",
                  textDecoration: "none",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
              >
                Search Live Prices
              </a>
            </section>
          </div>

          {/* Sidebar */}
          <div style={{ position: "sticky", top: "5rem", alignSelf: "start" }}>
            {/* Route Summary Card */}
            <div
              style={{
                background: C.primary,
                color: "#fff",
                borderRadius: 20,
                padding: "1.75rem",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "#fff" }}>
                Route at a Glance
              </h3>
              {[
                ["Flight Time", route.flightTime],
                ["Distance", route.distance],
                ["Nonstop Airlines", String(route.airlineCount)],
                ["Frequency", route.frequency],
                ["Cheapest Day", route.cheapestDay],
                ["Best Month", route.bestMonth],
                ["Book Ahead", route.bookAhead],
              ].map(([label, value], i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.6rem 0",
                    borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.6)" }}>{label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#fff" }}>{value}</span>
                </div>
              ))}
            </div>

            {/* On-Time Performance Card */}
            <div
              style={{
                background: "#fff",
                borderRadius: 20,
                padding: "1.75rem",
                marginBottom: "1.5rem",
                border: `1px solid ${C.border}`,
              }}
            >
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1rem", fontWeight: 700, marginBottom: "1rem", color: C.primary }}>
                On-Time Performance
              </h3>
              {[
                ["Delay Rate", route.delayRate],
                ["Avg Delay", route.avgDelay],
                ["Best Time", route.bestPerformanceTime],
              ].map(([label, value], i, arr) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0.6rem 0",
                    borderBottom: i < arr.length - 1 ? `1px solid ${C.border}` : "none",
                  }}
                >
                  <span style={{ fontSize: "0.85rem", color: C.muted }}>{label}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: C.primary }}>{value}</span>
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div
              style={{
                background: `linear-gradient(135deg, ${C.accent}, ${accentLight()})`,
                color: "#fff",
                textAlign: "center",
                padding: "1.75rem",
                borderRadius: 20,
              }}
            >
              <h3 style={{ color: "#fff", marginBottom: "0.5rem", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }}>
                Search Live Prices
              </h3>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.9rem", marginBottom: "1rem" }}>
                Compare fares from 200+ airlines instantly
              </p>
              <a
                href="#search-flights"
                style={{
                  display: "inline-block",
                  background: "#fff",
                  color: C.primary,
                  padding: "0.75rem 1.5rem",
                  borderRadius: 9999,
                  textDecoration: "none",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  transition: "transform 0.15s",
                }}
              >
                Find Deals
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* FAQ                                          */}
      {/* ============================================ */}
      <section style={{ background: C.surface, borderTop: `1px solid ${C.border}`, padding: "3rem clamp(1.5rem, 5vw, 4rem)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "1.75rem",
              fontWeight: 700,
              color: C.primary,
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
            }}
          >
            Frequently Asked Questions
          </h2>
          {/* Visa visual */}
          {route.destination_info && (
            <div style={{ marginBottom: "1.5rem", display: "flex", gap: "1rem", alignItems: "center", padding: "0.75rem 1rem", background: C.surface, borderRadius: 12, border: `1px solid ${C.border}` }}>
              {route.imageDir && (
                <img
                  src={`/images/route/${route.imageDir}/visa-stamps.webp`}
                  alt="Close-up of an open passport displaying travel stamps — visa requirements for international travel"
                  style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: 8, flexShrink: 0 }}
                  loading="lazy" width="1200" height="800" />
              )}
              <div style={{ fontSize: "0.8rem", color: C.muted, lineHeight: 1.5 }}>
                <strong>Visa:</strong> {route.destination_info.visa}
                <br />
              </div>
            </div>
          )}
          {route.faq.map((item, i) => (
            <div
              key={i}
              style={{
                borderBottom: `1px solid ${C.border}`,
                padding: "1.25rem 0",
              }}
            >
              <h3
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: C.primary,
                  margin: 0,
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {item.question}
                <span
                  style={{
                    fontSize: "1.25rem",
                    color: C.primary,
                    transition: "transform 0.2s",
                    flexShrink: 0,
                    transform: openFaq === i ? "rotate(45deg)" : "none",
                  }}
                >
                  +
                </span>
              </h3>
              {openFaq === i && (
                <p style={{ color: C.muted, fontSize: "0.95rem", margin: "0.75rem 0 0", lineHeight: 1.7 }}>
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ============================================ */}
      {/* RELATED ROUTES                               */}
      {/* ============================================ */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem clamp(1.5rem, 5vw, 4rem)" }}>
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
          Related Flight Routes
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
          {route.relatedRoutes.filter((rr) => flightRoutes[rr.slug]).map((rr, i) => (
            <Link
              key={i}
              href={`/flight-routes/${rr.slug}`}
              style={{
                background: C.surface,
                padding: "1.25rem",
                borderRadius: 16,
                textDecoration: "none",
                color: C.text,
                border: `1px solid ${C.border}`,
                transition: "all 0.2s",
                display: "block",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.accent;
                e.currentTarget.style.boxShadow = `0 4px 12px ${accentShadow(0.12)}`;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.border;
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 4, color: C.primary }}>
                {rr.originCity} → {rr.destinationCity}
              </div>
              <div style={{ fontSize: "0.85rem", color: C.muted }}>
                From ${rr.price} · {rr.flightTime}
              </div>
            </Link>
          ))}
        </div>

        {/* P5: bidirectional hub links — route → region hub only (city hubs removed) */}
        {hubLinks && hubLinks.regionSlug && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "1.25rem" }}>
            <Link
              href={`/flight-routes`}
              style={{ padding: "0.5rem 1rem", borderRadius: 9999, border: `1px solid ${C.border}`, color: C.accent, fontWeight: 600, fontSize: "0.85rem", textDecoration: "none", background: C.surface }}
            >
              {hubLinks.regionName} routes →
            </Link>
          </div>
        )}

        {/* P5: descriptive-anchor sibling route links — derived from real routes only (no 404s) */}
        {(() => {
          const sibSlugs: string[] = [];
          const seen = new Set<string>([route.slug]);
          const add = (s: string) => {
            if (seen.has(s) || !flightRoutes[s]) return;
            seen.add(s);
            sibSlugs.push(s);
          };
          Object.keys(flightRoutes).forEach((s) => { if (flightRoutes[s].originCity === route.originCity) add(s); });
          Object.keys(flightRoutes).forEach((s) => { if (flightRoutes[s].destinationCity === route.destinationCity) add(s); });
          const siblings = sibSlugs.slice(0, 5);
          if (siblings.length === 0) return null;
          return (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginTop: "1.25rem" }}>
              {siblings.map((s) => (
                <Link
                  key={s}
                  href={`/flight-routes/${s}`}
                  style={{ padding: "0.75rem 1rem", borderRadius: 12, border: `1px solid ${C.border}`, color: C.text, fontWeight: 500, fontSize: "0.85rem", textDecoration: "none", background: C.surface, transition: "border-color 0.2s, box-shadow 0.2s" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.accent; (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 2px 8px ${accentShadow(0.08)}`; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = C.border; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
                >
                  Flights from {flightRoutes[s].originCity} to {flightRoutes[s].destinationCity}
                </Link>
              ))}
            </div>
          );
        })()}
      </section>

      {/* Author byline + last-updated date (E-E-A-T signal) */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "1rem clamp(1.5rem, 5vw, 4rem)",
          fontSize: "0.85rem",
          color: C.muted,
          borderTop: `1px solid ${C.border}`,
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <span>Reviewed by the Flighko Editorial Team</span>
        <span style={{ margin: "0 0.75rem" }}>·</span>
        <span>Route data last updated {route.lastUpdated}</span>
        <span style={{ margin: "0 0.75rem" }}>·</span>
        <a
          href="/contact"
          style={{ color: C.accent, textDecoration: "none" }}
        >
          Corrections or suggestions?
        </a>
      </div>

      {/* Destination city hero */}
      {route.imageDir && (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        <figure style={{ margin: "2rem 0", background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>
          <img
            src={`/images/route/${route.imageDir}/dest-city-hero.webp`}
            alt={`${route.destinationCity} skyline — destination city for flights from ${route.originCity}`}
            style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
            loading="lazy" width="1200" height="800" />
          <figcaption style={{ padding: "0.75rem 1.25rem", fontSize: "0.85rem", color: C.muted, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{`📍 ${route.destinationCity}, ${route.destinationCountry}`}</span>
          </figcaption>
        </figure>
      </div>
      )}

      <Footer />

      {/* JSON-LD: Trip */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Trip",
            name: `Cheap Flights from ${route.originCity} to ${route.destinationCity}`,
            description: getRouteIntro(route, route.description),
            url: `https://www.flighko.com/flight-routes/${route.originAirportCode.toLowerCase()}-to-${route.destinationAirportCode.toLowerCase()}`,
            departureLocation: { "@type": "Place", name: route.originCity },
            arrivalLocation: { "@type": "Place", name: route.destinationCity },
          }),
        }}
      />

      {/* Travelpayouts Widget */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.TPWL_CONFIGURATION = {
            ...window.TPWL_CONFIGURATION,
            resultsURL: "https://search.flighko.com",
            showHotels: true,
            sub_id: "${route.slug}",
            flightParams: {
              origin: "${route.originAirportCode}",
              destination: "${route.destinationAirportCode}"
            }
          };`,
        }}
      />
    </div>
  );
}
