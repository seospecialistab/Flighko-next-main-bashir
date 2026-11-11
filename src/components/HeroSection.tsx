"use client";

import { useEffect } from "react";

export default function HeroSection() {
  useEffect(() => {
    // TPWL script is lazy-loaded by layout.tsx (IntersectionObserver).
    // Here we only watch for the widget container to get content; if it stays
    // empty after the load event + grace period, show the quick-picks fallback.
    const container = document.getElementById("tpwl-search");
    if (!container) return;

    let fallbackTimer: ReturnType<typeof setTimeout>;
    const startFallbackTimer = () => {
      fallbackTimer = setTimeout(() => {
        if (!container.children.length) {
          const fb = document.getElementById("tpwl-fallback");
          if (fb) fb.style.display = "block";
        }
      }, 4000);
    };

    // if widget already loading/loaded, start timer now
    startFallbackTimer();
    // also restart timer when layout dispatches the lazy-load event
    window.addEventListener("tpwl-loaded", startFallbackTimer);
    return () => {
      clearTimeout(fallbackTimer);
      window.removeEventListener("tpwl-loaded", startFallbackTimer);
    };
  }, []);

  return (
    <>
      <section className="hero-wrap">
        <div className="hero">
          <h1>Find Cheap Flights on 35 Routes Across 200+ Airlines</h1>

          {/* Travelpayouts Metasearch Widget */}
          <div id="tpwl-search" style={{ minHeight: 300 }}></div>

          {/* Fallback: shown only if TPWL widget fails to mount (mirrors preview safety net) */}
          <div id="tpwl-fallback" style={{ display: "none", marginTop: 16 }}>
            <p style={{ color: "#64748B", fontSize: ".9rem", marginBottom: 12 }}>
              Quick picks: compare top routes:
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              <a href="/flight-routes/cairo-to-dubai" style={{ display: "block", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "#1E293B", fontWeight: 600 }}>
                Cairo → Dubai <span style={{ float: "right", color: "#C2410C" }}>from $250</span>
              </a>
              <a href="/flight-routes/cairo-to-istanbul" style={{ display: "block", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "#1E293B", fontWeight: 600 }}>
                Cairo → Istanbul <span style={{ float: "right", color: "#C2410C" }}>from $220</span>
              </a>
              <a href="/flight-routes/dubai-to-paris" style={{ display: "block", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "#1E293B", fontWeight: 600 }}>
                Dubai → Paris <span style={{ float: "right", color: "#C2410C" }}>from $460</span>
              </a>
              <a href="/flight-routes/london-to-amsterdam" style={{ display: "block", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px", textDecoration: "none", color: "#1E293B", fontWeight: 600 }}>
                London → Amsterdam <span style={{ float: "right", color: "#C2410C" }}>from $75</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Route homepage searches to the white-label (results render there, not inline) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.TPWL_CONFIGURATION = {
            ...window.TPWL_CONFIGURATION,
            resultsURL: "https://search.flighko.com"
          };`,
        }}
      />
    </>
  );
}
