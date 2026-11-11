"use client";

import { useState, useEffect } from "react";
import { parseDestinationContent } from "./parseContent";
import { SectionHead, InfoPillRow, StatCardGrid, SeasonPriceGrid, FaqAccordion, CtaBand } from "@/components/templates/destinationBlocks";

interface DestinationData {
  slug: string;
  title: string;
  description: string;
  heroImage: string;
  content: string;
  category: string;
}

const T = {
  canvas: "#f8faf7",
  surfaceSoft: "#ffffff",
  surfaceCard: "#ffffff",
  primary: "#ea580c",
  primaryActive: "#ea580c",
  badgeBg: "#166534",
  badgeOn: "#fff",
  ink: "#14532d",
  body: "#3f6212",
  muted: "#5a7a3a",
  accent: "#dcfce7",
  searchBorder: "#d9edd9",
  onPrimary: "#fff",
  fontDisplay: "'DM Sans', system-ui, sans-serif",
  fontText: "'DM Sans', system-ui, sans-serif",
  radiusSm: "8px",
  radiusMd: "14px",
  radiusLg: "20px",
  radiusFull: "9999px",
  spaceXs: "4px",
  spaceSm: "8px",
  spaceBase: "16px",
  spaceMd: "20px",
  spaceLg: "24px",
  spaceXl: "32px",
  spaceXxl: "48px",
  spaceSection: "64px",
};

function SectionHeader({ tag, heading }: { tag: string; heading: string }) {
  return (
    <SectionHead tag={tag} heading={heading} fontText={T.fontText} fontDisplay={T.fontDisplay} tagBg={`${T.primary}15`} tagColor={T.primary} headingColor={T.ink} marginBottom={T.spaceXl}
      headingLetterSpacing={null} />
  );
}

function TrustBar() {
  return (
    <div style={{ background: T.surfaceSoft, borderBottom: `1px solid ${T.primary}15`, padding: `${T.spaceBase} 1.5rem` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: T.spaceXl, flexWrap: "wrap" }}>
        {["✓ Adventure-Ready Flights", "✓ Flexible Booking", "✓ Expert Trail Guides", "✓ 24/7 Support"].map((t) => (
          <span key={t} style={{ fontFamily: T.fontText, fontSize: "14px", color: T.muted, fontWeight: 500 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function FlightDealsTable() { return <div id="tp-flight-deals" style={{ minHeight: 40 }} />; }
function BestTimeChart() { return <div id="tp-best-time" style={{ minHeight: 40 }} />; }
function PhotoGallery({ activeGallery, setActiveGallery }: { activeGallery: number; setActiveGallery: (i: number) => void }) { return <div id="tp-photo-gallery" style={{ minHeight: 40 }} />; }
function ToursWidget() { return <div id="tp-tours" style={{ minHeight: 40 }} />; }
function TransferWidget() { return <div id="tp-transfers" style={{ minHeight: 40 }} />; }
function ReviewsWidget() { return <div id="tp-reviews" style={{ minHeight: 40 }} />; }

// Topographic pattern SVG for background texture
function TopoPattern() {
  return (
    <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} viewBox="0 0 800 600" preserveAspectRatio="none">
      <path d="M0,300 Q200,250 400,300 T800,300" fill="none" stroke={T.primary} strokeWidth="1" />
      <path d="M0,280 Q200,230 400,280 T800,280" fill="none" stroke={T.primary} strokeWidth="0.8" />
      <path d="M0,320 Q200,270 400,320 T800,320" fill="none" stroke={T.primary} strokeWidth="0.8" />
      <path d="M0,260 Q200,210 400,260 T800,260" fill="none" stroke={T.primary} strokeWidth="0.6" />
      <path d="M0,340 Q200,290 400,340 T800,340" fill="none" stroke={T.primary} strokeWidth="0.6" />
      <path d="M0,240 Q200,190 400,240 T800,240" fill="none" stroke={T.primary} strokeWidth="0.4" />
      <path d="M0,360 Q200,310 400,360 T800,360" fill="none" stroke={T.primary} strokeWidth="0.4" />
    </svg>
  );
}

export default function AdventureDestination({ dest }: { dest: DestinationData }) {
  const { hero, sections } = parseDestinationContent(dest.content);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    const fix = () => {
      document.querySelectorAll("#tpwl-search span, #tpwl-search label").forEach((el) => {
        const t = el.textContent?.trim().toLowerCase() || "";
        if (t.includes("show hotels") || t.includes("show results") || t.includes("show prices")) {
          (el as HTMLElement).style.color = "#ea580c";
        }
      });
    };
    fix();
    const ids = [setTimeout(fix, 1000), setTimeout(fix, 3000)];
    return () => ids.forEach(clearTimeout);
  }, []);

  const faqSections = sections.filter((s) => s.tag === "FAQ" || s.tag === "Getting Around" || s.tag === "Where to Stay");
  const contentSections = sections.filter((s) => s.tag !== "FAQ" && s.tag !== "Getting Around" && s.tag !== "Where to Stay" && !s.hasSearchWidget && !s.hasPopularDestinations);

  return (
    <div style={{ fontFamily: T.fontText, background: T.canvas, color: T.ink, minHeight: "100vh", position: "relative" }}>
      <TopoPattern />

      {/* HERO — Alpine Morning light sage */}
      <section style={{ position: "relative", width: "100%", minHeight: "60vh", overflow: "hidden" }}>
        <img src={dest.heroImage} alt={hero.titleSpan || dest.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(transparent 10%, rgba(0,0,0,0.45))", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "60vh", padding: `0 1.5rem ${T.spaceXxl}`, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: T.badgeBg, color: T.badgeOn, padding: `${T.spaceSm} ${T.spaceLg}`, borderRadius: T.radiusFull, fontWeight: 700, fontSize: "15px", marginBottom: T.spaceBase, boxShadow: "0 4px 20px rgba(22,101,52,0.4)" }}>
            ⛰️ {hero.priceBadge || "Find adventure flights"}
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: T.ink, margin: 0, letterSpacing: "-1px", lineHeight: 1.1 }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ color: T.body, fontSize: "18px", lineHeight: 1.5, marginTop: T.spaceSm, maxWidth: 600 }}>{hero.subtitle}</p>}
        </div>
      </section>

      <TrustBar />

      {contentSections[0]?.infoCards && (
        <InfoPillRow cards={contentSections[0].infoCards} surface={T.surfaceSoft} border={`1px solid ${T.primary}25`} radius={T.radiusFull} color={T.body} labelColor={T.muted} valueColor={T.primary} />
      )}

      <section style={{ padding: `0 1.5rem ${T.spaceXl}`, maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div style={{ background: T.surfaceSoft, borderRadius: T.radiusLg, padding: T.spaceXl, border: `1px solid ${T.searchBorder}` }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.spaceBase, marginBottom: T.spaceBase }}>
            <div style={{ width: 44, height: 44, borderRadius: T.radiusFull, background: `${T.accent}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>✈️</div>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 600, margin: 0 }}>Search Flights to {hero.titleSpan || dest.title}</h2>
          </div>
          <div id="tpwl-search" style={{ minHeight: 60 }} />
        </div>
      </section>

      <FlightDealsTable />

      {contentSections.map((section, idx) => (
        <section key={idx} style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionHeader tag={section.tag} heading={section.heading} />
          {section.infoCards && (
            <StatCardGrid cards={section.infoCards} surface={T.surfaceCard} border={`1px solid ${T.primary}20`} muted={T.muted} accent={T.primary} fontDisplay={T.fontDisplay} letterSpacing="0.5px" gap={T.spaceMd} cardRadius={T.radiusMd} cardPad={T.spaceLg} />
          )}
          {section.seasonPrices && (
            <SeasonPriceGrid prices={section.seasonPrices} surface={T.surfaceCard} border={`1px solid ${T.searchBorder}`} muted={T.muted} accent={T.primary} ink={T.ink} fontDisplay={T.fontDisplay} gap={T.spaceMd} cardRadius={T.radiusMd} cardPad={T.spaceBase} padValueFont />
          )}
          {section.htmlContent && <div className="adventure-prose" dangerouslySetInnerHTML={{ __html: section.htmlContent }} style={{ fontSize: "16px", lineHeight: 1.6, color: T.body, maxWidth: 900 }} />}
          {section.hasPopularDestinations && <div id="tp-popular-destinations" style={{ minHeight: 40 }} />}
        </section>
      ))}

      <BestTimeChart />
      <PhotoGallery activeGallery={activeGallery} setActiveGallery={setActiveGallery} />
      <ToursWidget />
      <TransferWidget />
      <ReviewsWidget />

      {faqSections.length > 0 && (
        <section style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <SectionHeader tag="FAQ" heading="Frequently Asked Questions" />
          <FaqAccordion
            items={faqSections}
            openIdx={openFaq}
            onToggle={setOpenFaq}
            surface={T.surfaceCard}
            cardRadius={T.radiusMd}
            openBorder={T.primary}
            closedBorder={T.searchBorder}
            transition="border-color 0.15s"
            fontDisplay={T.fontDisplay}
            ink={T.ink}
            body={T.body}
            muted={T.muted}
            answerBorder={`1px solid ${T.primary}20`}
          />
        </section>
      )}

      <CtaBand
        heading={`Conquer ${hero.titleSpan || dest.title}`}
        sub="Your next great adventure starts with the right flight."
        cta="⛰️ Find Adventure Flights"
        bandBg={T.surfaceSoft}
        borderTop={`1px solid ${T.primary}15`}
        btnBg={T.primary}
        btnColor={T.onPrimary}
        btnRadius={T.radiusFull}
        btnShadow="0 4px 20px rgba(234,88,12,0.4)"
        fontDisplay={T.fontDisplay}
        muted={T.muted}
        headingFontSize="clamp(28px, 4vw, 40px)"
        sectionPadding={T.spaceSection}
      />
    </div>
  );
}
