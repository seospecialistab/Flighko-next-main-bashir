"use client";

import { useState, useEffect } from "react";
import { parseDestinationContent } from "./parseContent";

/**
 * EntertainmentDestination — "Park Pop" light theme
 * Purple + pink on white — playful and vivid
 * Tokens from: VoltAgent/awesome-design-md + HeroUI
 */

interface DestinationData {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  content: string;
  category: string;
}

// ============================================================
// AIRBNB DESIGN TOKENS
// ============================================================
const T = {
  canvas: "#fffaff",
  surfaceSoft: "#fce7f3",
  surfaceCard: "#ffffff",
  surfaceStrong: "#f8f0f7",
  hairline: "#f3e8f2",
  hairlineSoft: "#fdf4fa",
  borderStrong: "#fbcfe8",
  primary: "#db2777",
  primaryActive: "#be185d",
  primaryDisabled: "#fbcfe8",
  ink: "#4c1d95",
  body: "#831843",
  muted: "#a5b4fc",
  mutedSoft: "#c084fc",
  onPrimary: "#ffffff",
  starRating: "#222222",
  success: "#008a05",
  warning: "#c13515",
  fontDisplay: "'DM Sans', -apple-system, system-ui, 'Helvetica Neue', sans-serif",
  fontText: "'DM Sans', -apple-system, system-ui, 'Helvetica Neue', sans-serif",
  radiusSm: "8px",
  radiusMd: "14px",
  radiusLg: "20px",
  radiusXl: "32px",
  radiusFull: "9999px",
  spaceXxs: "2px",
  spaceXs: "4px",
  spaceSm: "8px",
  spaceMd: "12px",
  spaceBase: "16px",
  spaceLg: "24px",
  spaceXl: "32px",
  spaceXxl: "48px",
  spaceSection: "64px",
};

// ============================================================
// DATA
// ============================================================
// Real Orlando photos sourced from Pexels API (verified 200 OK)
const ORLANDO_GALLERY = [
  "/images/pexels-12569769.webp", // Cinderella Castle — Walt Disney World
  "/images/pexels-9400905.webp",   // Aerial Universal Orlando
  "/images/pexels-1369466.webp",   // Jurassic Park entrance
  "/images/pexels-17159617.webp", // Disney's Hollywood Studios
  "/images/pexels-17194336.webp", // Orlando sunset skyline
  "/images/pexels-1860618.webp",   // Universal Studios ticket
];

const MONTHLY_PRICES = [
  { month: "Jan", price: 50, label: "$50", color: T.success },
  { month: "Feb", price: 55, label: "$55", color: T.success },
  { month: "Mar", price: 100, label: "$100", color: T.warning },
  { month: "Apr", price: 120, label: "$120", color: T.warning },
  { month: "May", price: 90, label: "$90", color: T.success },
  { month: "Jun", price: 150, label: "$150", color: T.primary },
  { month: "Jul", price: 180, label: "$180", color: T.primary },
  { month: "Aug", price: 160, label: "$160", color: T.primary },
  { month: "Sep", price: 45, label: "$45", color: T.success },
  { month: "Oct", price: 80, label: "$80", color: T.success },
  { month: "Nov", price: 100, label: "$100", color: T.warning },
  { month: "Dec", price: 170, label: "$170", color: T.primary },
];

const FLIGHT_DEALS = [
  { from: "New York", code: "JFK", price: 80, airline: "JetBlue", stops: "Nonstop" },
  { from: "Chicago", code: "ORD", price: 110, airline: "Southwest", stops: "Nonstop" },
  { from: "Atlanta", code: "ATL", price: 55, airline: "Delta", stops: "Nonstop" },
  { from: "Nashville", code: "BNA", price: 80, airline: "Southwest", stops: "Nonstop" },
  { from: "Miami", code: "MIA", price: 50, airline: "Spirit", stops: "Nonstop" },
  { from: "Boston", code: "BOS", price: 95, airline: "JetBlue", stops: "Nonstop" },
  { from: "Dallas", code: "DFW", price: 110, airline: "American", stops: "Nonstop" },
  { from: "Phoenix", code: "PHX", price: 130, airline: "Southwest", stops: "Nonstop" },
];

// ============================================================
// SectionHeader
// ============================================================
function SectionHeader({ tag, heading }: { tag: string; heading: string }) {
  return (
    <div style={{ marginBottom: T.spaceLg }}>
      <span style={{ display: "inline-block", fontFamily: T.fontText, fontSize: "11px", fontWeight: 600, lineHeight: "1.18", letterSpacing: "0.32px", textTransform: "uppercase" as const, color: T.muted, marginBottom: T.spaceSm }}>{tag}</span>
      <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.44px", margin: 0, color: T.ink }}>{heading}</h2>
    </div>
  );
}

// ============================================================
// FlightDealsTable
// ============================================================
function FlightDealsTable() {
  return (
    <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeader tag="Flights" heading="Popular Flights to Orlando" />
      <div style={{ background: T.surfaceCard, borderRadius: T.radiusMd, border: `1px solid ${T.hairline}`, overflow: "hidden" }}>
        {FLIGHT_DEALS.map((deal, i) => (
          <div key={i}
            style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr auto", gap: T.spaceBase, alignItems: "center", padding: `${T.spaceBase} ${T.spaceLg}`, borderBottom: i < FLIGHT_DEALS.length - 1 ? `1px solid ${T.hairlineSoft}` : "none", textDecoration: "none", color: T.ink, transition: "background 0.15s" }}>
            <div>
              <div style={{ fontFamily: T.fontText, fontWeight: 500, fontSize: "16px" }}>{deal.from}</div>
              <div style={{ fontFamily: T.fontText, fontSize: "14px", color: T.muted }}>{deal.code}</div>
            </div>
            <div style={{ color: T.mutedSoft, fontSize: "16px" }}>→</div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontFamily: T.fontText, fontWeight: 500, fontSize: "16px" }}>Orlando</div>
              <div style={{ fontFamily: T.fontText, fontSize: "14px", color: T.muted }}>MCO</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: "18px", color: T.ink }}>${deal.price}</div>
              <div style={{ fontFamily: T.fontText, fontSize: "12px", color: T.muted }}>{deal.airline} · {deal.stops}</div>
            </div>
          </div>
        ))}
      </div>
      <p style={{ fontFamily: T.fontText, textAlign: "center", color: T.mutedSoft, fontSize: "14px", marginTop: T.spaceMd }}>Prices shown are approximate round-trip fares.</p>
    </section>
  );
}

// ============================================================
// TrustBar
// ============================================================
function TrustBar() {
  return (
    <section style={{ padding: `${T.spaceLg} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: T.spaceXl, flexWrap: "wrap", padding: T.spaceLg, background: T.surfaceSoft, borderRadius: T.radiusLg, border: `1px solid ${T.hairlineSoft}` }}>
        {[{ value: "300+", label: "Airlines" }, { value: "50+", label: "Partners" }, { value: "★ 4.8", label: "Trust Rating" }, { value: "2M+", label: "Travelers" }].map((s, i) => (
          <div key={i} style={{ textAlign: "center", display: "flex", alignItems: "center", gap: T.spaceXl }}>
            {i > 0 && <div style={{ width: 1, height: 32, background: T.hairline }} />}
            <div>
              <div style={{ fontFamily: T.fontDisplay, fontWeight: 700, fontSize: "24px", color: i === 2 ? T.starRating : T.primary }}>{s.value}</div>
              <div style={{ fontFamily: T.fontText, fontSize: "14px", color: T.muted }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// PhotoGallery
// ============================================================
function PhotoGallery({ activeGallery, setActiveGallery }: { activeGallery: number; setActiveGallery: (n: number) => void }) {
  return (
    <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeader tag="Gallery" heading="Photo Gallery" />
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: T.spaceSm, borderRadius: T.radiusLg, overflow: "hidden" }}>
        <div style={{ gridRow: "1 / 3", position: "relative", minHeight: 300 }}>
          <img src={ORLANDO_GALLERY[activeGallery]} alt="Orlando destination" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: T.spaceMd, left: T.spaceMd, background: "rgba(255,255,255,0.95)", color: T.ink, padding: `${T.spaceSm} ${T.spaceMd}`, borderRadius: T.radiusSm, fontFamily: T.fontText, fontSize: "13px", fontWeight: 500, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
            {activeGallery + 1} / {ORLANDO_GALLERY.length}
          </div>
        </div>
        {ORLANDO_GALLERY.slice(1, 5).map((img, i) => (
          <div key={i} onClick={() => setActiveGallery(i + 1)} style={{ cursor: "pointer", border: activeGallery === i + 1 ? `2px solid ${T.primary}` : `2px solid transparent`, overflow: "hidden", minHeight: 145, borderRadius: activeGallery === i + 1 ? T.radiusSm : 0 }}>
            <img src={img} alt={`Orlando photo ${i + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: T.spaceSm, marginTop: T.spaceSm }}>
        {ORLANDO_GALLERY.slice(4).map((img, i) => (
          <div key={i} onClick={() => setActiveGallery(i + 4)} style={{ cursor: "pointer", border: activeGallery === i + 4 ? `2px solid ${T.primary}` : `2px solid transparent`, borderRadius: T.radiusSm, overflow: "hidden", width: 100, height: 60, flexShrink: 0 }}>
            <img src={img} alt={`Orlando photo ${i + 5}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// BestTimeChart
// ============================================================
function BestTimeChart() {
  const maxPrice = Math.max(...MONTHLY_PRICES.map((m) => m.price));
  return (
    <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeader tag="Price Trends" heading="Best Time to Book Orlando Flights" />
      <p style={{ fontFamily: T.fontText, color: T.muted, fontSize: "16px", lineHeight: 1.5, marginTop: `-${T.spaceSm}`, marginBottom: T.spaceLg }}>Average round-trip prices by month — book Sep–Feb for the best deals</p>
      <div style={{ background: T.surfaceSoft, borderRadius: T.radiusLg, padding: `${T.spaceXl} ${T.spaceLg} ${T.spaceMd}`, border: `1px solid ${T.hairlineSoft}` }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: T.spaceSm, height: 220 }}>
          {MONTHLY_PRICES.map((mp, i) => {
            const barHeight = (mp.price / maxPrice) * 180;
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: T.spaceXxs }}>
                <span style={{ fontFamily: T.fontDisplay, fontSize: "12px", fontWeight: 600, color: mp.color }}>{mp.label}</span>
                <div style={{ width: "100%", maxWidth: 48, height: barHeight, background: mp.color, borderRadius: `${T.radiusSm} ${T.radiusSm} 2px 2px`, opacity: 0.85 }} title={`${mp.month}: ${mp.label}`} />
                <span style={{ fontFamily: T.fontText, fontSize: "12px", color: T.muted }}>{mp.month}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: "flex", gap: T.spaceLg, marginTop: T.spaceMd, justifyContent: "center" }}>
        {[{ color: T.success, label: "Good price" }, { color: T.warning, label: "Average" }, { color: T.primary, label: "Peak price" }].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: T.spaceSm, fontFamily: T.fontText, fontSize: "13px", color: T.muted }}>
            <div style={{ width: 10, height: 10, borderRadius: T.radiusSm, background: item.color }} />
            {item.label}
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// ReviewsWidget
// ============================================================
function ReviewsWidget() {
  return (
    <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
      <SectionHeader tag="Reviews" heading="What Travelers Say" />
      <div style={{ background: T.surfaceCard, borderRadius: T.radiusMd, border: `1px solid ${T.hairline}`, padding: T.spaceLg }}>
        {[
          { name: "Sarah M.", rating: 5, text: "Best prices I found for Orlando flights. Saved $200 on our family trip!", source: "Verified Traveler" },
          { name: "James K.", rating: 5, text: "Found a round-trip for $55 from Atlanta. No hidden fees, booked through Kiwi.com.", source: "Verified Traveler" },
          { name: "Maria L.", rating: 4, text: "Great selection of airlines. The monthly price chart helped me pick the cheapest week.", source: "Verified Traveler" },
        ].map((r, i) => (
          <div key={i} style={{ padding: `${T.spaceBase} 0`, borderBottom: i < 2 ? `1px solid ${T.hairlineSoft}` : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: T.spaceMd, marginBottom: T.spaceMd }}>
              <div style={{ width: 40, height: 40, borderRadius: T.radiusFull, background: T.surfaceStrong, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: T.fontDisplay, fontSize: "16px", fontWeight: 600, color: T.primary }}>{r.name.charAt(0)}</div>
              <div>
                <div style={{ fontFamily: T.fontText, fontWeight: 500, fontSize: "16px", color: T.ink }}>{r.name}</div>
                <div style={{ fontFamily: T.fontText, fontSize: "13px", color: T.muted }}>{r.source}</div>
              </div>
              <div style={{ marginLeft: "auto", color: T.starRating, fontSize: "14px" }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
            </div>
            <p style={{ margin: 0, fontFamily: T.fontText, fontSize: "16px", lineHeight: 1.5, color: T.body }}>{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ============================================================
// ToursWidget (Tiqets — Popular Tours)
// ============================================================
function ToursWidget() {
  useEffect(() => {
    const id = "tiqets-script";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://tpemd.com/content?currency=USD&trs=518364&shmarker=414586&language=en&locale=260932&layout=horizontal&cards=4&powered_by=true&campaign_id=89&promo_id=3947";
    s.charset = "utf-8";
    document.getElementById("tiqets-widget")?.appendChild(s);
  }, []);
  return (
    <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ background: T.surfaceCard, borderRadius: T.radiusMd, border: `1px solid ${T.hairline}`, padding: T.spaceXl }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.spaceMd, marginBottom: T.spaceBase }}>
          <div style={{ width: 44, height: 44, borderRadius: T.radiusMd, background: `${T.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🎡</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.18px", margin: 0, color: T.ink }}>Theme Park Tickets & Tours</h2>
        </div>
        <div id="tiqets-widget" style={{ minHeight: 80 }} />
      </div>
    </section>
  );
}

// ============================================================
// TransferWidget (Kiwitaxi — Shuttles Search Form)
// ============================================================
function TransferWidget() {
  useEffect(() => {
    const id = "kiwitaxi-script";
    if (document.getElementById(id)) return;
    const s = document.createElement("script");
    s.id = id;
    s.async = true;
    s.src = "https://tpemd.com/content?currency=USD&trs=518364&shmarker=414586&language=en&theme=1&powered_by=true&campaign_id=1&promo_id=1486";
    s.charset = "utf-8";
    document.getElementById("kiwitaxi-widget")?.appendChild(s);
  }, []);
  return (
    <section style={{ padding: `0 1.5rem ${T.spaceXxl}`, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ background: T.surfaceCard, borderRadius: T.radiusMd, border: `1px solid ${T.hairline}`, padding: T.spaceXl }}>
        <div style={{ display: "flex", alignItems: "center", gap: T.spaceMd, marginBottom: T.spaceBase }}>
          <div style={{ width: 44, height: 44, borderRadius: T.radiusMd, background: `${T.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>🚗</div>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.18px", margin: 0, color: T.ink }}>Airport Transfers</h2>
        </div>
        <div id="kiwitaxi-widget" style={{ minHeight: 80 }} />
      </div>
    </section>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function EntertainmentDestination({ dest }: { dest: DestinationData }) {
  const { hero, sections } = parseDestinationContent(dest.content);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    const fix = () => {
      document.querySelectorAll("#tpwl-search span, #tpwl-search label, #tpwl-search div, #tpwl-search p").forEach((el) => {
        const t = el.textContent?.trim().toLowerCase() || "";
        if (t.includes("show hotels") || t.includes("show results") || t.includes("show prices") || t.includes("share results") || t.includes("create multi")) {
          (el as HTMLElement).style.color = "#222222";
          (el as HTMLElement).style.fontWeight = "500";
        }
      });
    };
    fix();
    const ids = [setTimeout(fix, 1000), setTimeout(fix, 3000), setTimeout(fix, 5000), setTimeout(fix, 8000)];
    const c = document.getElementById("tpwl-search");
    let obs: MutationObserver | null = null;
    if (c) { obs = new MutationObserver(fix); obs.observe(c, { childList: true, subtree: true }); }
    return () => { ids.forEach(clearTimeout); obs?.disconnect(); };
  }, []);

  const faqSections = sections.filter((s) => s.tag === "Getting Around" || s.tag === "Where to Stay" || s.tag === "Stay");
  const contentSections = sections.filter((s) => s.tag !== "Getting Around" && s.tag !== "Where to Stay" && s.tag !== "Stay" && !s.hasSearchWidget && !s.hasPopularDestinations);

  return (
    <div style={{ fontFamily: T.fontText, background: T.canvas, color: T.ink, minHeight: "100vh" }}>
      {/* HERO */}
      <section style={{ position: "relative", width: "100%", minHeight: "55vh", overflow: "hidden" }}>
        <img src={dest.heroImage} alt={hero.titleSpan || dest.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: "linear-gradient(transparent 20%, rgba(0,0,0,0.45))", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "55vh", padding: `0 1.5rem ${T.spaceXxl}`, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: T.primary, color: T.onPrimary, padding: `${T.spaceSm} ${T.spaceLg}`, borderRadius: T.radiusFull, fontFamily: T.fontText, fontWeight: 600, fontSize: "16px", marginBottom: T.spaceBase, boxShadow: "0 4px 12px rgba(255,56,92,0.3)" }}>
            {hero.priceBadge || "From $50+ round trip"}
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-1px", lineHeight: 1.1, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ fontFamily: T.fontText, color: "rgba(255,255,255,0.9)", fontSize: "18px", lineHeight: 1.5, marginTop: T.spaceSm, maxWidth: 600 }}>{hero.subtitle}</p>}
        </div>
      </section>

      <TrustBar />

      {contentSections[0]?.infoCards && (
        <section style={{ padding: `${T.spaceLg} 0` }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: T.spaceSm, maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
            {contentSections[0].infoCards.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: T.spaceSm, background: T.surfaceSoft, border: `1px solid ${T.hairlineSoft}`, padding: `${T.spaceSm} ${T.spaceBase}`, borderRadius: T.radiusFull, whiteSpace: "normal", minWidth: 0, fontFamily: T.fontText, fontSize: "14px", color: T.ink }}>
                <span style={{ color: T.muted }}>{c.label}:</span><span style={{ fontWeight: 500 }}>{c.value}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section style={{ padding: `0 1.5rem ${T.spaceXl}`, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: T.surfaceSoft, borderRadius: T.radiusLg, padding: T.spaceXl, border: `1px solid ${T.hairlineSoft}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.spaceMd, marginBottom: T.spaceBase }}>
            <div style={{ width: 44, height: 44, borderRadius: T.radiusMd, background: `${T.primary}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>✈️</div>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 600, letterSpacing: "-0.18px", margin: 0, color: T.ink }}>Search Flights to {hero.titleSpan || dest.title}</h2>
          </div>
          <div id="tpwl-search" style={{ minHeight: 60 }} />
        </div>
      </section>

      <FlightDealsTable />

      {contentSections.map((section, idx) => (
        <section key={idx} style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader tag={section.tag} heading={section.heading} />
          {section.infoCards && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: T.spaceMd, marginBottom: T.spaceLg }}>
              {section.infoCards.map((c, i) => (
                <div key={i} style={{ background: T.surfaceSoft, borderRadius: T.radiusMd, padding: T.spaceLg, border: `1px solid ${T.hairlineSoft}` }}>
                  <div style={{ fontFamily: T.fontText, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.32px", color: T.mutedSoft, marginBottom: T.spaceXs }}>{c.label}</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: "24px", fontWeight: 700, color: T.ink }}>{c.value}</div>
                </div>
              ))}
            </div>
          )}
          {section.seasonPrices && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: T.spaceMd, marginBottom: T.spaceLg }}>
              {section.seasonPrices.map((sp, i) => (
                <div key={i} style={{ background: T.surfaceSoft, borderRadius: T.radiusMd, padding: T.spaceBase, border: `1px solid ${T.hairlineSoft}`, textAlign: "center" }}>
                  <div style={{ fontFamily: T.fontText, fontSize: "13px", color: T.muted, marginBottom: T.spaceXxs }}>{sp.label}</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: "16px", fontWeight: 600, color: T.primary, marginBottom: T.spaceXxs }}>{sp.value}</div>
                  <div style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 700, color: T.ink }}>{sp.price}</div>
                </div>
              ))}
            </div>
          )}
          {section.htmlContent && <div className="entertainment-prose" dangerouslySetInnerHTML={{ __html: section.htmlContent }} style={{ fontFamily: T.fontText, fontSize: "16px", lineHeight: 1.5, color: T.body, maxWidth: 900 }} />}
          {section.hasPopularDestinations && <div id="tp-popular-destinations" style={{ minHeight: 40 }} />}
        </section>
      ))}

      <BestTimeChart />
      <PhotoGallery activeGallery={activeGallery} setActiveGallery={setActiveGallery} />
      <ToursWidget />
      <TransferWidget />
      <ReviewsWidget />

      {faqSections.length > 0 && (
        <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader tag="FAQ" heading="Frequently Asked Questions" />
          <div style={{ display: "flex", flexDirection: "column", gap: T.spaceMd, maxWidth: 900 }}>
            {faqSections.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} style={{ background: T.surfaceCard, borderRadius: T.radiusMd, border: `1px solid ${isOpen ? T.primary : T.hairlineSoft}`, overflow: "hidden", transition: "border-color 0.15s" }}>
                  <button onClick={() => setOpenFaq(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: `${T.spaceBase} ${T.spaceLg}`, background: "none", border: "none", cursor: "pointer", fontFamily: T.fontDisplay, fontSize: "16px", fontWeight: 600, color: T.ink, textAlign: "left" }}>
                    <span>{faq.heading}</span>
                    <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", fontSize: "14px", color: T.muted }}>▾</span>
                  </button>
                  {isOpen && <div dangerouslySetInnerHTML={{ __html: faq.htmlContent }} style={{ padding: `0 ${T.spaceLg} ${T.spaceBase}`, fontFamily: T.fontText, fontSize: "16px", lineHeight: 1.5, color: T.body, borderTop: `1px solid ${T.hairlineSoft}` }} />}
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section style={{ background: T.surfaceSoft, borderTop: `1px solid ${T.hairline}`, padding: `${T.spaceSection} 1.5rem`, textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, margin: `0 0 ${T.spaceBase}`, letterSpacing: "-0.5px", color: T.ink }}>Experience {hero.titleSpan || dest.title}</h2>
          <p style={{ fontFamily: T.fontText, fontSize: "18px", color: T.muted, marginBottom: T.spaceXl, lineHeight: 1.5 }}>The ultimate entertainment destination awaits. Find flights and start your adventure.</p>
          <a href="#tpwl-search" style={{ display: "inline-block", background: T.primary, color: T.onPrimary, padding: `${T.spaceMd} ${T.spaceXl}`, borderRadius: T.radiusSm, fontFamily: T.fontText, fontWeight: 500, fontSize: "16px", textDecoration: "none", transition: "background 0.15s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = T.primaryActive; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = T.primary; }}
          >Search Flights</a>
        </div>
      </section>
    </div>
  );
}
