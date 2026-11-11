"use client";

import type { RouteSkin } from "@/components/templates/routePageBlocks";

interface RouteMapProps {
  C: RouteSkin;
  originCity: string;
  originCode: string;
  destCity: string;
  destCode: string;
  distanceKm: string;
  flightTime: string;
  timezone?: string;
}

export default function RouteMap({ C, originCity, originCode, destCity, destCode, distanceKm, flightTime, timezone }: RouteMapProps) {
  // The topographic landmass view is accurate only for the Singapore-Bangkok
  // pair (Changi -> Suvarnabhumi). Every other route gets the generic
  // schematic overview so no page ever shows wrong geography.
  const topographic = originCode === "SIN" && destCode === "BKK";
  return (
    <div style={{ background: C.surface, borderRadius: 16, border: `1px solid ${C.border}`, padding: "1.5rem", marginBottom: "1.5rem" }}>
      <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "1.1rem", fontWeight: 700, color: C.primary, marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
        Route {topographic ? "Map" : "Overview"}: {originCity} ↔ {destCity}
      </h2>
      <div style={{ width: "100%", maxWidth: 680, margin: "0 auto" }}>
        <svg viewBox="0 0 680 340" style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label={topographic ? `Map showing the flight route from ${originCity} (${originCode}) to ${destCity} (${destCode}), covering ${distanceKm} in ${flightTime}` : `Schematic route overview from ${originCity} (${originCode}) to ${destCity} (${destCode}), covering ${distanceKm} in ${flightTime}`}>
          {/* Background gradient */}
          <defs>
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={C.mutedLight} stopOpacity={0.15} />
              <stop offset="100%" stopColor={C.mutedLight} stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={C.primary} stopOpacity={0.08} />
              <stop offset="100%" stopColor={C.primary} stopOpacity={0.03} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.2)" />
            </filter>
          </defs>

          {/* Sea background */}
          <rect width="680" height="340" fill="url(#seaGrad)" rx={12} />

          {topographic ? (
            <>
              {/* Southeast Asia landmass (simplified) */}
              <path d="M80,80 L180,60 L240,90 L280,75 L340,85 L380,70 L440,95 L480,80 L540,100 L580,90 L620,110 L640,140 L620,160 L580,150 L520,165 L480,155 L440,170 L400,160 L360,175 L320,165 L280,180 L240,170 L200,185 L160,175 L120,190 L100,170 L80,150 Z" fill="url(#landGrad)" stroke={C.border} strokeWidth={1} />
              <path d="M200,120 L260,110 L290,130 L270,145 L240,140 L210,135 Z" fill={C.primary} fillOpacity={0.12} stroke={C.border} strokeWidth={0.5} />
              <path d="M340,95 L400,90 L420,110 L400,125 L360,120 L340,110 Z" fill={C.primary} fillOpacity={0.12} stroke={C.border} strokeWidth={0.5} />
              <text x="370" y="118" fontSize="9" fill={C.muted} fontFamily="'DM Sans', sans-serif" letterSpacing="0.04em">THAILAND</text>
              <text x="230" y="142" fontSize="9" fill={C.muted} fontFamily="'DM Sans', sans-serif" letterSpacing="0.04em">MALAYSIA</text>
            </>
          ) : (
            <>
              {/* Neutral graticule — no invented geography */}
              {[70, 120, 170, 220, 270].map((y) => (
                <line key={`h${y}`} x1="40" y1={y} x2="640" y2={y} stroke={C.border} strokeWidth={0.5} strokeDasharray="1 5" opacity={0.5} />
              ))}
              {[140, 240, 340, 440, 540].map((x) => (
                <line key={`v${x}`} x1={x} y1="50" x2={x} y2="290" stroke={C.border} strokeWidth={0.5} strokeDasharray="1 5" opacity={0.5} />
              ))}
            </>
          )}

          {/* Flight route arc */}
          <path
            d="M160,105 Q340,40 520,95"
            fill="none"
            stroke={C.accent}
            strokeWidth={3}
            strokeDasharray="8 4"
            opacity={0.8}
            filter="url(#glow)"
          />
          {/* Flight path solid core */}
          <path
            d="M160,105 Q340,40 520,95"
            fill="none"
            stroke={C.accent}
            strokeWidth={1.5}
            opacity={0.95}
          />

          {/* Aircraft icon on the arc (mid-point) */}
          <g transform="translate(340, 55) rotate(-15)" filter="url(#shadow)">
            <path d="M-12,0 L12,0 L8,-4 L12,0 L8,4 Z" fill={C.accent} />
            <path d="M-10,-2 L-14,-8 L-6,-4 Z" fill={C.accent} opacity={0.8} />
            <path d="M-10,2 L-14,8 L-6,4 Z" fill={C.accent} opacity={0.8} />
          </g>

          {/* Origin airport: Changi (SIN) — left */}
          <g transform="translate(160, 105)">
            <circle r={14} fill={C.primary} opacity={0.15} />
            <circle r={8} fill={C.primary} />
            <circle r={3} fill="#fff" />
            <text x={0} y={24} textAnchor="middle" fontSize="11" fontWeight={700} fill={C.primary} fontFamily="'DM Sans', sans-serif">{originCity}</text>
            <text x={0} y={37} textAnchor="middle" fontSize="9" fill={C.muted} fontFamily="'DM Sans', sans-serif">{topographic ? `${originCode} · Changi` : originCode}</text>
          </g>

          {/* Destination airport: Suvarnabhumi (BKK) — right */}
          <g transform="translate(520, 95)">
            <circle r={14} fill={C.accent} opacity={0.15} />
            <circle r={8} fill={C.accent} />
            <circle r={3} fill="#fff" />
            <text x={0} y={24} textAnchor="middle" fontSize="11" fontWeight={700} fill={C.accent} fontFamily="'DM Sans', sans-serif">{destCity}</text>
            <text x={0} y={37} textAnchor="middle" fontSize="9" fill={C.muted} fontFamily="'DM Sans', sans-serif">{topographic ? `${destCode} · Suvarnabhumi` : destCode}</text>
          </g>

          {/* DMK alternative airport marker (Singapore-Bangkok only) */}
          {topographic && (
            <>
              <g transform="translate(545, 115)">
                <circle r={5} fill={C.muted} opacity={0.5} stroke={C.border} strokeWidth={1} strokeDasharray="2 2" />
                <text x={10} y={4} fontSize="8" fill={C.muted} fontFamily="'DM Sans', sans-serif">DMK</text>
              </g>
              <line x1="545" y1="115" x2="520" y2="95" stroke={C.muted} strokeWidth={0.5} strokeDasharray="2 2" opacity={0.4} />
              <text x="555" y="108" fontSize="7.5" fill={C.muted} fontFamily="'DM Sans', sans-serif" opacity={0.7}>LCC alternate</text>
            </>
          )}

          {/* Distance label on the arc */}
          <rect x="310" y="30" width={60} height={18} rx={9} fill={C.primary} fillOpacity={0.9} />
          <text x="340" y="43" textAnchor="middle" fontSize="9" fill="#fff" fontWeight={600} fontFamily="'DM Sans', sans-serif">{distanceKm}</text>
        </svg>
      </div>
      <div style={{ fontSize: "0.8rem", color: C.muted, marginTop: "0.75rem", lineHeight: 1.6, display: "flex", justifyContent: "center", gap: "1.5rem" }}>
        <span>✈️ Nonstop: {flightTime}</span>
        <span>🌍 {distanceKm}</span>
        {timezone ? <span>🕐 {timezone}</span> : null}
      </div>
    </div>
  );
}
