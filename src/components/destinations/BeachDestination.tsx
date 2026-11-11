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
  canvas: "#fffdf6",
  surfaceSoft: "#ffffff",
  surfaceCard: "#ffffff",
  primary: "#0891b2",
  primaryActive: "#0e7490",
  badgeBg: "#0891b2",
  badgeOn: "#fff",
  ink: "#164e63",
  body: "#0e7490",
  muted: "#64748b",
  accent: "#bae6fd",
  searchBorder: "#bae6fd",
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
    <SectionHead tag={tag} heading={heading} fontText={T.fontText} fontDisplay={T.fontDisplay} tagBg={`${T.primary}20`} tagColor={T.primary} headingColor={T.ink} marginBottom={T.spaceXl} />
  );
}

function TrustBar() {
  return (
    <div style={{ background: T.surfaceSoft, borderBottom: `1px solid ${T.primary}20`, padding: `${T.spaceBase} 1.5rem` }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "center", gap: T.spaceXl, flexWrap: "wrap" }}>
        {["✓ Best Price Guarantee", "✓ 200+ Airlines", "✓ Free Cancellation", "✓ 24/7 Support"].map((t) => (
          <span key={t} style={{ fontFamily: T.fontText, fontSize: "14px", color: T.muted, fontWeight: 500 }}>{t}</span>
        ))}
      </div>
    </div>
  );
}

function FlightDealsTable() {
  return <div id="tp-flight-deals" style={{ minHeight: 40 }} />;
}

function BestTimeChart() {
  return <div id="tp-best-time" style={{ minHeight: 40 }} />;
}

function PhotoGallery({ activeGallery, setActiveGallery }: { activeGallery: number; setActiveGallery: (i: number) => void }) {
  return <div id="tp-photo-gallery" style={{ minHeight: 40 }} />;
}

function ToursWidget() {
  return <div id="tp-tours" style={{ minHeight: 40 }} />;
}

function TransferWidget() {
  return <div id="tp-transfers" style={{ minHeight: 40 }} />;
}

function ReviewsWidget() {
  return <div id="tp-reviews" style={{ minHeight: 40 }} />;
}

export default function BeachDestination({ dest }: { dest: DestinationData }) {
  const { hero, sections } = parseDestinationContent(dest.content);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeGallery, setActiveGallery] = useState(0);

  useEffect(() => {
    const fix = () => {
      document.querySelectorAll("#tpwl-search span, #tpwl-search label").forEach((el) => {
        const t = el.textContent?.trim().toLowerCase() || "";
        if (t.includes("show hotels") || t.includes("show results") || t.includes("show prices")) {
          (el as HTMLElement).style.color = "#f97316";
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
      {/* HERO — Warm sunset gradient */}
      <section style={{ position: "relative", width: "100%", minHeight: "60vh", overflow: "hidden" }}>
        <img src={dest.heroImage} alt={hero.titleSpan || dest.title} style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", top: 0, left: 0 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "55%", background: "linear-gradient(transparent 10%, rgba(0,0,0,0.5))", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "60vh", padding: `0 1.5rem ${T.spaceXxl}`, maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "inline-flex", alignSelf: "flex-start", background: T.primary, color: T.onPrimary, padding: `${T.spaceSm} ${T.spaceLg}`, borderRadius: T.radiusFull, fontWeight: 700, fontSize: "15px", marginBottom: T.spaceBase, boxShadow: "0 4px 20px rgba(249,115,22,0.4)" }}>
            🏖️ {hero.priceBadge || "Find beach flights"}
          </div>
          <h1 style={{ fontFamily: T.fontDisplay, fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 700, color: "#ffffff", margin: 0, letterSpacing: "-1px", lineHeight: 1.1, textShadow: "0 2px 12px rgba(0,0,0,0.4)" }}>{hero.title}</h1>
          {hero.subtitle && <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "18px", lineHeight: 1.5, marginTop: T.spaceSm, maxWidth: 600 }}>{hero.subtitle}</p>}
        </div>
      </section>

      <TrustBar />

      {contentSections[0]?.infoCards && (
        <InfoPillRow
          cards={contentSections[0].infoCards}
          surface={T.surfaceSoft}
          border={`1px solid ${T.primary}30`}
          radius={T.radiusFull}
          color={T.body}
          labelColor={T.muted}
          valueColor={T.primary}
        />
      )}

      <section style={{ padding: `0 1.5rem ${T.spaceXl}`, maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ background: T.surfaceSoft, borderRadius: T.radiusLg, padding: T.spaceXl, border: `1px solid ${T.primary}20` }}>
          <div style={{ display: "flex", alignItems: "center", gap: T.spaceBase, marginBottom: T.spaceBase }}>
            <div style={{ width: 44, height: 44, borderRadius: T.radiusMd, background: `${T.primary}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px" }}>🏖️</div>
            <h2 style={{ fontFamily: T.fontDisplay, fontSize: "20px", fontWeight: 600, margin: 0 }}>Search Flights to {hero.titleSpan || dest.title}</h2>
          </div>
          <div id="tpwl-search" style={{ minHeight: 60 }} />
        </div>
      </section>

      <FlightDealsTable />

      {contentSections.map((section, idx) => (
        <section key={idx} style={{ padding: `${T.spaceXxl} 1.5rem`, maxWidth: 1200, margin: "0 auto" }}>
          <SectionHeader tag={section.tag} heading={section.heading} />
          {section.infoCards && (
            <StatCardGrid cards={section.infoCards} surface={T.surfaceCard} border={`1px solid ${T.primary}20`} muted={T.muted} accent={T.primary} fontDisplay={T.fontDisplay} gap={T.spaceMd} cardRadius={T.radiusMd} />
          )}
          {section.seasonPrices && (
            <SeasonPriceGrid prices={section.seasonPrices} surface={T.surfaceCard} border={`1px solid ${T.primary}20`} muted={T.muted} accent={T.primary} ink={T.ink} fontDisplay={T.fontDisplay} gap={T.spaceMd} cardRadius={T.radiusMd} padValueFont />
          )}
          {section.htmlContent && <div className="beach-prose" dangerouslySetInnerHTML={{ __html: section.htmlContent }} style={{ fontSize: "16px", lineHeight: 1.6, color: T.body, maxWidth: 900 }} />}
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
            openBorder={T.primary}
            closedBorder={T.primary + "20"}
            answerBorder={`1px solid ${T.primary}20`}
            transition="border-color 0.15s"
            fontDisplay={T.fontDisplay}
            ink={T.ink}
            body={T.body}
            muted={T.muted}
            cardRadius={T.radiusMd}
          />
        </section>
      )}

      <CtaBand
        heading={`Discover ${hero.titleSpan || dest.title}`}
        sub="Find the best deals on flights to this tropical paradise."
        cta="🏖️ Book Your Beach Getaway"
        bandBg={T.surfaceSoft}
        borderTop={`1px solid ${T.primary}20`}
        btnBg="#f97316"
        btnColor={T.onPrimary}
        btnRadius={T.radiusFull}
        btnShadow="0 6px 16px rgba(249,115,22,0.4)"
        fontDisplay={T.fontDisplay}
        muted={T.muted}
        transition="transform 0.15s"
      />
    </div>
  );
}
