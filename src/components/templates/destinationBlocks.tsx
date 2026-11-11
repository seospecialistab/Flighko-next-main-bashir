/* Shared destination-page pieces (Batch 3 component extraction).
 * These centralize the JSX STRUCTURE that all 5 destination category
 * variants repeated. Each variant passes its own skin (colors/fonts/
 * radii/spacing) so the visual result stays IDENTICAL — structure shared,
 * style NOT. Rule: any future fix (overflow, spacing, a11y) lands HERE
 * once, not 5x. */

/* ─── Shared types ─── */
export interface Card {
  label: string;
  value: string;
}
export interface SeasonPrice {
  label: string;
  value: string;
  price: string;
}

/* ─── Section wrapper: padding + max-width + centering only ─── */
export function SectionShell({
  children,
  padding,
  maxWidth = 1200,
  background,
  borderTop,
  textAlign,
}: {
  children: React.ReactNode;
  padding: string;
  maxWidth?: number;
  background?: string;
  borderTop?: string;
  textAlign?: "left" | "center" | "right";
}) {
  return (
    <section style={{ padding, maxWidth, margin: "0 auto", background, borderTop, textAlign }}>
      {children}
    </section>
  );
}

/* ─── Tag + H2 header (was duplicated 5x with per-variant colors) ─── */
export function SectionHead({
  tag,
  heading,
  fontText,
  fontDisplay,
  tagBg,
  tagColor,
  headingColor,
  marginBottom = "32px",
  chipExtra,
  blockExtra,
  headingExtra,
  headingLetterSpacing = "-0.5px",
}: {
  tag: string;
  heading: string;
  fontText: string;
  fontDisplay: string;
  tagBg: string;
  tagColor: string;
  headingColor: string;
  marginBottom?: string;
  chipExtra?: React.CSSProperties;
  blockExtra?: React.CSSProperties;
  headingExtra?: React.CSSProperties;
  headingLetterSpacing?: string | null;
}) {
  return (
    <div style={{ marginBottom, ...blockExtra }}>
      <div style={{ display: "inline-block", background: tagBg, color: tagColor, padding: "4px 16px", borderRadius: "9999px", fontFamily: fontText, fontSize: "12px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: "8px", ...chipExtra }}>{tag}</div>
      <h2 style={{ fontFamily: fontDisplay, fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 700, color: headingColor, margin: 0, ...(headingLetterSpacing === null ? {} : { letterSpacing: headingLetterSpacing }), ...headingExtra }}>{heading}</h2>
    </div>
  );
}

/* ─── Hero info-pill row (label: value pills under the hero) ─── */
export function InfoPillRow({
  cards,
  surface,
  border,
  radius,
  color,
  labelColor,
  valueColor,
  fontText,
}: {
  cards: Card[];
  surface: string;
  border: string;
  radius: string;
  color: string;
  labelColor: string;
  valueColor: string;
  fontText?: string;
}) {
  return (
    <section style={{ padding: "24px 0" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "8px", maxWidth: 1200, margin: "0 auto", padding: "0 1.5rem" }}>
        {cards.map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", background: surface, border, padding: "8px 16px", borderRadius: radius, whiteSpace: "normal", minWidth: 0, ...(fontText ? { fontFamily: fontText } : {}), fontSize: "14px", color }}>
            <span style={{ color: labelColor }}>{c.label}:</span><span style={{ fontWeight: 600, color: valueColor }}>{c.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Stat card grid inside content sections ─── */
export function StatCardGrid({
  cards,
  surface,
  border,
  muted,
  accent,
  fontDisplay,
  letterSpacing = "0.32px",
  gap = "20px",
  cardRadius = "14px",
  cardPad = "24px",
  cardExtra,
  valueExtra,
}: {
  cards: Card[];
  surface: string;
  border: string;
  muted: string;
  accent: string;
  fontDisplay: string;
  letterSpacing?: string;
  gap?: string;
  cardRadius?: string;
  cardPad?: string;
  cardExtra?: React.CSSProperties;
  valueExtra?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap, marginBottom: "24px" }}>
      {cards.map((c, i) => (
        <div key={i} style={{ background: surface, borderRadius: cardRadius, padding: cardPad, border, ...cardExtra }}>
          <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing, color: muted, marginBottom: "4px" }}>{c.label}</div>
          <div style={{ fontFamily: fontDisplay, fontSize: "24px", fontWeight: 700, color: accent, ...valueExtra }}>{c.value}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── Season price mini-cards ─── */
export function SeasonPriceGrid({
  prices,
  surface,
  border,
  muted,
  accent,
  ink,
  fontDisplay,
  gap = "20px",
  cardRadius = "14px",
  cardPad = "16px",
  padValueFont,
  valueExtra,
}: {
  prices: SeasonPrice[];
  surface: string;
  border: string;
  muted: string;
  accent: string;
  ink: string;
  fontDisplay: string;
  gap?: string;
  cardRadius?: string;
  cardPad?: string;
  padValueFont?: boolean;
  valueExtra?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap, marginBottom: "24px" }}>
      {prices.map((sp, i) => (
        <div key={i} style={{ background: surface, borderRadius: cardRadius, padding: cardPad, border, textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: muted, marginBottom: "4px" }}>{sp.label}</div>
          <div style={{ ...(padValueFont ? { fontFamily: fontDisplay } : {}), fontSize: "16px", fontWeight: 600, color: accent, marginBottom: "4px", ...valueExtra }}>{sp.value}</div>
          <div style={{ fontFamily: fontDisplay, fontSize: "20px", fontWeight: 700, color: ink }}>{sp.price}</div>
        </div>
      ))}
    </div>
  );
}

/* ─── FAQ accordion (behavior preserved exactly as each variant had it:
 * answer renders only when open; changing that is a separate future batch) ─── */
export function FaqAccordion({
  items,
  openIdx,
  onToggle,
  surface,
  openBorder,
  closedBorder,
  answerBorder,
  transition,
  boxShadow,
  fontDisplay,
  ink,
  body,
  muted,
  cardRadius = "14px",
  lineHeight = 1.5,
  buttonFontWeight = 600,
  buttonExtra,
}: {
  items: { heading: string; htmlContent?: string }[];
  openIdx: number | null;
  onToggle: (i: number | null) => void;
  surface: string;
  openBorder: string;
  closedBorder: string;
  answerBorder?: string;
  transition?: string;
  boxShadow?: string;
  fontDisplay: string;
  ink: string;
  body: string;
  muted: string;
  cardRadius?: string;
  lineHeight?: number;
  buttonFontWeight?: number;
  buttonExtra?: React.CSSProperties;
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: 900 }}>
      {items.map((faq, i) => {
        const isOpen = openIdx === i;
        return (
          <div key={i} style={{ background: surface, borderRadius: cardRadius, border: `1px solid ${isOpen ? openBorder : closedBorder}`, overflow: "hidden", ...(transition ? { transition } : {}), ...(boxShadow ? { boxShadow } : {}) }}>
            <button onClick={() => onToggle(isOpen ? null : i)} style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", background: "none", border: "none", cursor: "pointer", fontFamily: fontDisplay, fontSize: "16px", fontWeight: buttonFontWeight, color: ink, textAlign: "left", ...buttonExtra }}>
              <span>{faq.heading}</span>
              <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s", fontSize: "14px", color: muted }}>▾</span>
            </button>
            {isOpen && <div dangerouslySetInnerHTML={{ __html: faq.htmlContent || "" }} style={{ padding: "0 24px 16px", fontSize: "16px", lineHeight, color: body, ...(answerBorder ? { borderTop: answerBorder } : {}) }} />}
          </div>
        );
      })}
    </div>
  );
}

/* ─── Bottom single-CTA band ─── */
export function CtaBand({
  heading,
  sub,
  cta,
  bandBg,
  borderTop,
  btnBg,
  btnColor,
  btnRadius,
  btnShadow,
  fontDisplay,
  fontText,
  muted,
  transition,
  headingFontSize,
  headingLetterSpacing,
  headingFontStyle,
  sectionPadding,
  btnFontFamily,
  btnFontSize,
  btnFontWeight,
  btnLetterSpacing,
  btnTextDecoration,
  btnHoverBg,
}: {
  heading: string;
  sub: string;
  cta: string;
  bandBg: string;
  borderTop: string;
  btnBg: string;
  btnColor: string;
  btnRadius: string;
  btnShadow?: string;
  fontText?: string;
  muted: string;
  fontDisplay?: string;
  transition?: string;
  headingFontSize?: string;
  headingLetterSpacing?: string;
  headingFontStyle?: "normal" | "italic" | "oblique";
  sectionPadding?: string;
  btnFontFamily?: string;
  btnFontSize?: string;
  btnFontWeight?: number;
  btnLetterSpacing?: string;
  btnTextDecoration?: string;
  btnHoverBg?: string;
}) {
  return (
    <section style={{ background: bandBg, borderTop, padding: sectionPadding || "64px 1.5rem", textAlign: "center" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 style={{ fontFamily: fontDisplay, fontSize: headingFontSize || "clamp(28px, 4vw, 40px)", fontWeight: 700, margin: "0 0 16px", letterSpacing: headingLetterSpacing || "-0.5px", fontStyle: headingFontStyle || "normal" }}>{heading}</h2>
        <p style={{ fontSize: "18px", color: muted, marginBottom: "32px", lineHeight: 1.5 }}>{sub}</p>
        <a
          href="#tpwl-search"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: btnBg,
            color: btnColor,
            padding: "16px 32px",
            borderRadius: btnRadius,
            fontFamily: btnFontFamily || fontDisplay,
            fontSize: btnFontSize || "16px",
            fontWeight: btnFontWeight ?? 700,
            letterSpacing: btnLetterSpacing || "normal",
            textDecoration: btnTextDecoration || "none",
            boxShadow: btnShadow,
            ...(transition ? { transition } : {}),
          }}
          onMouseEnter={(e) => { if (btnHoverBg) (e.currentTarget as HTMLElement).style.background = btnHoverBg; }}
          onMouseLeave={(e) => { if (btnHoverBg) (e.currentTarget as HTMLElement).style.background = btnBg; }}
        >
          {cta}
        </a>
      </div>
    </section>
  );
}
