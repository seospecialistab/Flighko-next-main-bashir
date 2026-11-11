import type { CSSProperties } from "react";

/* ─── Shared palette (Flighko brand: navy + single orange accent) ─── */
const NAVY = "#0F172A";
const ACCENT = "#FF6B35";
const ACCENT_SOFT = "#FFF7F2";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const TEXT = "#1E293B";
const MUTED = "#64748B";

/* ─── KeyTakeawayBox (Direction B: warm gradient, orange left accent) ─── */
export function KeyTakeawayBox({ items }: { items: string[] }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #FFF7F2 0%, #FFFFFF 100%)",
        border: `1px solid #FFE3D6`,
        borderLeft: `4px solid ${ACCENT}`,
        borderRadius: "12px",
        padding: "1.3rem 1.5rem",
        margin: "2rem 0",
      }}
    >
      <h3
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 700,
          fontSize: "1.05rem",
          color: NAVY,
          margin: "0 0 0.6rem",
        }}
      >
        Key Takeaways
      </h3>
      <ul style={{ margin: 0, paddingLeft: 0, color: TEXT, lineHeight: 1.6, listStyle: "none" }}>
        {items.map((it, i) => (
          <li key={i} style={{ marginBottom: "0.4rem", position: "relative", paddingLeft: "1.5rem" }}>
            <span style={{ position: "absolute", left: 0, top: "0.1rem", display: "inline-block", width: "7px", height: "7px", background: ACCENT, borderRadius: "50%", flexShrink: 0 }}></span>
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ─── Stat Band (Direction A: offset inline row, NOT 3-equal cards) ─── */
interface Stat { value: string; label: string; }
export function StatBand({ stats }: { stats: Stat[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr",
        gap: "1.5rem",
        alignItems: "start",
        borderTop: `1px solid ${BORDER}`,
        borderBottom: `1px solid ${BORDER}`,
        padding: "1.5rem 0",
        margin: "1.5rem 0",
      }}
    >
      {stats.map((s, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            minHeight: "6rem",
            ...(i < stats.length - 1
              ? { paddingRight: "1.5rem", borderRight: `2px solid ${ACCENT}` }
              : {}),
          }}
        >
          <div
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700,
              color: ACCENT,
              lineHeight: 1.1,
              marginBottom: "0.5rem",
              whiteSpace: "nowrap",
            }}
          >
            {s.value}
          </div>
          <div style={{ fontSize: "0.9rem", color: MUTED, flex: 1 }}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── VPN Review Spotlight Rows (Direction A: horizontal editorial rows) ─── */
interface VpnReview {
  name: string;
  rank: string;
  badge: string;
  why: string;
  servers: string;
  savings: string;
  bestServer: string;
  price: string;
  ctaLabel: string;
  ctaHref: string;
}

export function VpnReviewGrid({ reviews }: { reviews: VpnReview[] }) {
  return (
    <section style={{ margin: "1.5rem 0 2.5rem" }}>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: NAVY,
          margin: "0 0 1rem",
          borderLeft: `4px solid ${ACCENT}`,
          paddingLeft: "0.85rem",
        }}
      >
        The 4 Best VPNs for Flight Booking
      </h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {reviews.map((r, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "1.5rem",
              alignItems: "center",
              border: `1px solid ${BORDER}`,
              borderRadius: "16px",
              padding: "1.5rem",
              background: "#fff",
            }}
          >
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: ACCENT,
                width: "48px",
              }}
            >
              {r.rank}
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "1.2rem", color: NAVY }}>
                {r.name}
                <span
                  style={{
                    display: "inline-block",
                    background: ACCENT_SOFT,
                    color: ACCENT,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    padding: "0.25rem 0.6rem",
                    borderRadius: "99px",
                    marginLeft: "0.5rem",
                  }}
                >
                  {r.badge}
                </span>
              </div>
              <div style={{ display: "flex", gap: "1.2rem", marginTop: "0.5rem", fontSize: "0.85rem", color: MUTED, flexWrap: "wrap" }}>
                <span><b style={{ color: NAVY }}>{r.servers}</b> servers</span>
                <span><b style={{ color: NAVY }}>{r.savings}</b> savings</span>
                <span>Best: <b style={{ color: NAVY }}>{r.bestServer}</b></span>
                <span><b style={{ color: NAVY }}>{r.price}</b></span>
              </div>
            </div>
            <a
              href={r.ctaHref}
              style={{
                background: NAVY,
                color: "#fff",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                padding: "0.6rem 1.1rem",
                borderRadius: "99px",
                whiteSpace: "nowrap",
              }}
            >
              {r.ctaLabel} →
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── Price Comparison Table (real <table>, locked tokens, no blue) ─── */
interface PriceTableData {
  title: string;
  caption?: string;
  columns: string[];
  rows: { cells: string[]; highlight?: boolean }[];
}
export function PriceTable({ data }: { data: PriceTableData }) {
  const isSaving = (v: string) => v.startsWith("-") || v.endsWith("%");
  return (
    <div style={{ maxWidth: "768px", margin: "28px auto 0", padding: "0 1.5rem" }}>
      <div
        style={{
          background: "#FFFFFF",
          border: `1px solid ${BORDER}`,
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
        }}
      >
        <div style={{ padding: "18px 20px 0" }}>
          <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "1.15rem", fontWeight: 700, color: NAVY, margin: "0 0 6px" }}>
            {data.title}
          </h3>
          {data.caption && (
            <p style={{ fontSize: "0.85rem", color: MUTED, margin: "0 0 14px" }}>{data.caption}</p>
          )}
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.92rem" }}>
          <thead>
            <tr style={{ background: NAVY }}>
              {data.columns.map((c, i) => (
                <th
                  key={i}
                  style={{
                    textAlign: "left",
                    color: "#FFFFFF",
                    fontWeight: 600,
                    padding: "11px 16px",
                    fontSize: "0.8rem",
                    letterSpacing: "0.02em",
                    textTransform: "uppercase",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, ri) => (
              <tr key={ri} style={{ background: row.highlight ? ACCENT_SOFT : ri % 2 ? SURFACE : "#FFFFFF" }}>
                {row.cells.map((cell, ci) => (
                  <td
                    key={ci}
                    style={{
                      padding: "13px 16px",
                      borderTop: `1px solid ${BORDER}`,
                      color: ci === 2 && isSaving(cell) ? ACCENT : TEXT,
                      fontWeight: ci === 0 ? 600 : 400,
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ─── Destination Photo Tiles (Direction A: 3:4 photo cards) ─── */
import { DEST_IMAGES } from "@/data/dest-images.generated";

export function PillGrid({ items }: { items: { slug: string; title: string }[] }) {
  return (
    <section style={{ margin: "2.5rem 0" }}>
      <h2
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: "1.8rem",
          fontWeight: 700,
          color: NAVY,
          margin: "0 0 1rem",
          borderLeft: `4px solid ${ACCENT}`,
          paddingLeft: "0.85rem",
        }}
      >
        Popular Destinations
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        {items.map((d, i) => (
          <a
            key={i}
            href={`/destinations/${d.slug}`}
            style={{
              position: "relative",
              borderRadius: "14px",
              overflow: "hidden",
              aspectRatio: "3 / 4",
              textDecoration: "none",
              color: "#fff",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            <img
              src={DEST_IMAGES[d.slug] || "/images/pexels-1724576.webp"}
              alt={d.title}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            <span
              style={{
                position: "relative",
                zIndex: 2,
                padding: "0.8rem",
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                width: "100%",
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              }}
            >
              {d.title}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
