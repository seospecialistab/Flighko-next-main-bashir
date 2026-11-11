import { Fragment } from "react";
import type { CSSProperties } from "react";

/**
 * Shared structural blocks for route-facing pages (Batch 3).
 *
 * Style-agnostic, like destinationBlocks: the page passes its skin, the shared
 * block owns the structure. DOM order is preserved exactly so builds are
 * byte-comparable against the previous inline markup.
 */

/** Chevron-separated breadcrumb: Home › Current. Renders flat (no wrapper spans). */
export function BreadcrumbNav({
  items,
  navStyle,
  innerStyle,
  chevronColor = "#cbd5e1",
  linkColor = "#64748b",
  linkHoverColor,
}: {
  items: { label: string; href?: string }[];
  navStyle?: CSSProperties;
  innerStyle?: CSSProperties;
  chevronColor?: string;
  linkColor?: string;
  linkHoverColor?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" style={navStyle}>
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          fontSize: 13,
          color: linkColor,
          fontFamily: "'Space Grotesk',sans-serif",
          ...innerStyle,
        }}
      >
        {items.map((it, i) => (
          <Fragment key={it.label}>
            {i > 0 && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={chevronColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            )}
            {it.href ? (
              <a
                href={it.href}
                style={{ color: linkColor, textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={linkHoverColor ? (e) => { e.currentTarget.style.color = linkHoverColor; } : undefined}
                onMouseLeave={linkHoverColor ? (e) => { e.currentTarget.style.color = linkColor; } : undefined}
              >
                {it.label}
              </a>
            ) : (
              <span style={{ color: "#0F172A", fontWeight: 600 }}>{it.label}</span>
            )}
          </Fragment>
        ))}
      </div>
    </nav>
  );
}

/**
 * Origin → Destination link card with flight time and from-price.
 * `large` = the big "Popular Routes" card; compact = region grid card.
 * Key order below matches the original inline markup exactly.
 */
export function RouteLinkCard({
  slug,
  originCity,
  destinationCity,
  flightTime,
  price,
  colors,
  large,
}: {
  slug: string;
  originCity: string;
  destinationCity: string;
  flightTime: string;
  price: number;
  colors: { bg: string; border: string; accent: string; text: string; primary: string; muted: string };
  large?: boolean;
}) {
  return (
    <a
      href={`/flight-routes/${slug}`}
      style={{
        background: colors.bg,
        borderRadius: large ? 16 : 12,
        padding: large ? "1.25rem 1.5rem" : "1rem 1.25rem",
        border: `1px solid ${colors.border}`,
        textDecoration: "none",
        color: colors.text,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "all 0.2s",
        ...(large ? { position: "relative" as const, overflow: "hidden" as const } : {}),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = colors.accent;
        e.currentTarget.style.boxShadow = large ? "0 8px 24px rgba(255,107,53,0.12)" : "0 4px 12px rgba(255,107,53,0.1)";
        e.currentTarget.style.transform = large ? "translateY(-2px)" : "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = colors.border;
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ fontWeight: large ? 700 : 600, fontSize: large ? "0.95rem" : "0.9rem", color: colors.primary }}>{originCity}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          style={{ width: large ? 16 : 14, height: large ? 16 : 14, color: colors.accent, flexShrink: 0 }}
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
        <span style={{ fontWeight: large ? 700 : 600, fontSize: large ? "0.95rem" : "0.9rem", color: colors.primary }}>{destinationCity}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: large ? "1rem" : "0.75rem", fontSize: "0.8rem", color: colors.muted }}>
        <span>{flightTime}</span>
        <span
          style={{
            fontWeight: 700,
            color: colors.accent,
            whiteSpace: "nowrap",
          }}
        >
          From ${price}
        </span>
      </div>
    </a>
  );
}
