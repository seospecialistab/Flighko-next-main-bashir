import type { CSSProperties, ReactNode } from "react";

/**
 * Shared structural blocks for route pages (Batch 4a).
 *
 * Like destinationBlocks/routeBlocks: the page passes its palette, the block
 * owns the shape. Style-object key order matches the original inline markup
 * exactly so SSR output stays byte-identical.
 */

export type RouteSkin = {
  primary: string;
  accent: string;
  bg: string;
  text: string;
  muted: string;
  mutedLight: string;
  surface: string;
  border: string;
};

/** Standard content section wrapper (the 12× repeated marginBottom section). */
export function RouteSection({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <section style={{ marginBottom: "3rem", ...style }}>{children}</section>;
}

/** Standard section heading (Space Grotesk 700, palette primary, tight tracking). */
export function SectionH2({
  children,
  C,
  fontSize = "1.5rem",
  marginBottom = "1rem",
}: {
  children: ReactNode;
  C: RouteSkin;
  fontSize?: string;
  marginBottom?: string;
}) {
  return (
    <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize, fontWeight: 700, color: C.primary, marginBottom, letterSpacing: "-0.02em" }}>
      {children}
    </h2>
  );
}
