"use client";

import type { MonthlyPrice } from "@/data/flight-routes";
import type { RouteSkin } from "@/components/templates/routePageBlocks";

interface SeasonalityChartProps {
  C: RouteSkin;
  monthlyPrices: MonthlyPrice[];
}

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function SeasonalityChart({ C, monthlyPrices }: SeasonalityChartProps) {
  const maxPrice = Math.max(...monthlyPrices.map((m) => m.price));
  const minPrice = Math.min(...monthlyPrices.map((m) => m.price));
  const range = maxPrice - minPrice || 1;
  const barW = Math.min(32, Math.max(18, 280 / monthlyPrices.length - 4));

  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.primary, marginBottom: "1rem", letterSpacing: "-0.01em" }}>
        Seasonal Price Chart — {monthlyPrices.length} Months
      </h3>
      <p style={{ color: C.muted, fontSize: "0.85rem", marginBottom: "1.25rem", lineHeight: 1.6 }}>
        Lowest fares in{" "}
        <strong style={{ color: C.accent, fontWeight: 700 }}>
          {monthlyPrices.find((m) => m.price === minPrice)?.month ?? "—"}
        </strong>{" "}
        (around ${minPrice}); highest in{" "}
        <strong style={{ color: C.primary, fontWeight: 700 }}>
          {monthlyPrices.find((m) => m.price === maxPrice)?.month ?? "—"}
        </strong>{" "}
        (around ${maxPrice}).
      </p>
      <div style={{ display: "flex", alignItems: "flex-end", gap: "4px", height: "160px" }}>
        {monthlyPrices.map((m, i) => {
          const barH = ((m.price - minPrice) / range) * 130 + 10;
          const isCheapest = m.price === minPrice;
          const note = m.note ?? "";
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "4px",
                flex: 1,
              }}
            >
              <div
                style={{
                  width: barW,
                  height: `${barH}px`,
                  background: isCheapest ? C.accent : C.primary,
                  borderRadius: "3px 3px 0 0",
                  minHeight: "8px",
                  transition: "background 0.2s",
                  cursor: "default",
                }}
                title={`${MONTH_SHORT[i]}: $${m.price}${note ? " — " + note : ""}`}
              />
              <span style={{ fontSize: "0.75rem", color: C.muted, fontWeight: isCheapest ? 700 : 400, textTransform: "uppercase" }}>
                {MONTH_SHORT[i]}
              </span>
              {note ? (
                <span style={{ fontSize: "0.75rem", color: C.accent, fontWeight: 600, textTransform: "uppercase" }}>
                  {note}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
      <div style={{ fontSize: "0.75rem", color: C.muted, marginTop: "1rem", display: "flex", justifyContent: "space-between" }}>
        <span>Lower = cheaper</span>
        <span>Bar height = relative fare; cheapest month highlighted in accent</span>
      </div>
    </div>
  );
}
