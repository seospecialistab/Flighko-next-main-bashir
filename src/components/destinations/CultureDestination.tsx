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
  canvas: "#fdf8ee",
  surfaceSoft: "#ffffff",
  surfaceCard: "#fff",
  primary: "#1d4ed8",
  primaryActive: "#1d4ed8",
  badgeBg: "#7c2d12",
  badgeOn: "#fff",
  ink: "#451a03",
  body: "#78350f",
  muted: "#78716c",
  accent: "#f5e6c4",
  searchBorder: "#e7d7b8",
  onPrimary: "#fff",
  fontDisplay: "'Playfair Display', Georgia, 'Times New Roman', serif",
  fontText: "'DM Sans', system-ui, sans-serif",
  radiusSm: "4px",
  radiusMd: "8px",
  radiusLg: "12px",
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
    <div style={{ marginBottom: T.spaceLg, borderBottom: `2px solid ${T.accent}`, paddingBottom: T.spaceBase }}>
      <div style={{ display: "inline-block", background: T.accent, color: T.body, padding: `${T.spaceXs} ${T.spaceBase}`, fontFamily: T.fontText, fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "1.5px", marginBottom: T.spaceSm }}>{tag}</div>
      <h2 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: T.ink, margin: 0, fontStyle: "italic" }}>{heading}</h2>
    </div>
  );
}

function TrustBar() {
  return (
    <div style={{ background: T.surfaceSoft, borderBottom: `1px solid ${T.searchBorder}`, padding: `${T.spaceBase} 1.5rem` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: T.spaceXl, flexWrap: "wrap" }}>
        {["✓ Curated Experiences", "✓ Expert Local Guides", "✓ Small Group Tours", "✓ Cultural Immersion"].map((t) => (
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

export default function CultureDestination({ dest }: { dest: DestinationData }) {
  const { hero, sections } = parseDestinationContent(dest.content);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    const fix = () => {
      document.querySelectorAll("#tpwl-search span, #tpwl-search label").forEach((el) => {
        const t = el.textContent?.trim().toLowerCase() || "";
        if (t.includes("show hotels") || t.includes("show results") || t.includes("show prices")) {
          (el as HTMLElement).style.color = "#1d4ed8";
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
    <div style={{ fontFamily: T.fontText, background: T.canvas, color: T.ink, minHeight: "100vh" }}>
      {/* HERO — Royal Heritage warm cream */}
      <section style={{ position: "relative", width: "100%", minHeight: "60vh", overflow: "hidden" }}>
        <img src={dest.heroImage} alt={hero.titleSpan || dest.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(transparent 10%, rgba(0,0,0,0.45))", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "60vh", padding: `0 1.5rem ${T.spaceXxl}`, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: T.badgeBg, color: T.badgeOn, padding: `${T.spaceSm} ${T.spaceLg}`, borderRadius: T.radiusSm, fontFamily: T.fontText, fontWeight: 700, fontSize: "13px", marginBottom: T.spaceBase, letterSpacing: "1px", textTransform: "uppercase" as const }}>
            🏛️ {hero.priceBadge || "Explore culture"}
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: T.ink, margin: 0, fontStyle: "italic", lineHeight: 1.1 }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ fontFamily: T.fontText, color: T.body, fontSize: "18px", lineHeight: 1.6, marginTop: T.spaceSm, maxWidth: 600 }}>{hero.subtitle}</p>}
        </div>
      </section>

      <TrustBar />

      {contentSections[0]?.infoCards && (
        <InfoPillRow cards={contentSections[0].infoCards} surface={T.surfaceSoft} border={`1px solid ${T.searchBorder}`} radius={T.radiusSm} color={T.body} labelColor={T.muted} valueColor={T.primary} />
      )}

      <section style={{ padding: `0 1.5rem ${T.spaceXl}`, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: T.surfaceCard, borderRadius: T.radiusMd, padding: T.spaceXl, border: `1px solid ${T.searchBorder}`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.spaceBase, marginBottom: T.spaceBase }}>
            <div style={{ width: 44, height: 44, borderRadius: T.radiusSm, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>✈️</div>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 700, margin: 0, fontStyle: "italic" }}>Search Flights to {hero.titleSpan || dest.title}</h2>
          </div>
          <div id="tpwl-search" style={{ minHeight: 60 }} />
        </div>
      </section>

      <FlightDealsTable />

      {contentSections.map((section, idx) => (
        <section key={idx} style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader tag={section.tag} heading={section.heading} />
          {section.infoCards && (
            <StatCardGrid cards={section.infoCards} surface={T.surfaceCard} border={`1px solid ${T.searchBorder}`} muted={T.muted} accent={T.primary} fontDisplay={T.fontDisplay} letterSpacing="1.5px" gap={T.spaceMd} cardRadius={T.radiusMd} cardPad={T.spaceLg} cardExtra={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }} valueExtra={{ fontStyle: "italic" }} />
          )}
          {section.seasonPrices && (
            <SeasonPriceGrid prices={section.seasonPrices} surface={T.surfaceCard} border={`1px solid ${T.searchBorder}`} muted={T.muted} accent={T.primary} ink={T.ink} fontDisplay={T.fontDisplay} gap={T.spaceMd} cardRadius={T.radiusMd} cardPad={T.spaceBase} padValueFont valueExtra={{ fontStyle: "italic" }} />
          )}
          {section.htmlContent && <div className="culture-prose" dangerouslySetInnerHTML={{ __html: section.htmlContent }} style={{ fontFamily: T.fontText, fontSize: "16px", lineHeight: 1.7, color: T.body, maxWidth: 900 }} />}
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
          <FaqAccordion
            items={faqSections}
            openIdx={openFaq}
            onToggle={setOpenFaq}
            surface={T.surfaceCard}
            cardRadius={T.radiusMd}
            openBorder={T.primary}
            closedBorder={T.searchBorder}
            boxShadow="0 1px 4px rgba(0,0,0,0.03)"
            fontDisplay={T.fontDisplay}
            ink={T.ink}
            body={T.body}
            muted={T.muted}
            answerBorder={`1px solid ${T.searchBorder}`}
            lineHeight={1.6}
            buttonFontWeight={700}
            buttonExtra={{ fontStyle: "italic" }}
          />
        </section>
      )}

      <CtaBand
        heading={`Experience ${hero.titleSpan || dest.title}`}
        sub="Immerse yourself in centuries of history and culture."
        cta="🏛️ Begin Your Cultural Journey"
        bandBg={T.surfaceSoft}
        borderTop={`1px solid ${T.searchBorder}`}
        btnBg={T.primary}
        btnColor={T.onPrimary}
        btnRadius={T.radiusSm}
        btnFontFamily={T.fontDisplay}
        btnFontSize="16px"
        btnFontWeight={700}
        btnLetterSpacing="0.5px"
        fontDisplay={T.fontDisplay}
        fontText={T.fontText}
        muted={T.body}
        headingFontStyle="italic"
        headingFontSize="clamp(28px, 4vw, 40px)"
        sectionPadding={T.spaceSection}
      />
    </div>
  );
}
