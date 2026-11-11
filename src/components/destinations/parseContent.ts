/**
 * Parse destination HTML content into structured sections.
 * Each destination's `content` field is a string of HTML with well-known class names:
 *   hero, section st-border, sh, tag, ig, ic, ct, sp, sp-c, sp-label, sp-val, sp-price
 */

export interface HeroData {
  priceBadge: string;
  title: string;
  titleSpan: string;
  subtitle: string;
  hasSearchWidget: boolean;
}

export interface InfoCard {
  label: string;
  value: string;
}

export interface SeasonPrice {
  label: string;
  value: string;
  price: string;
}

export interface ContentSection {
  tag: string;
  heading: string;
  htmlContent: string;
  infoCards?: InfoCard[];
  seasonPrices?: SeasonPrice[];
  hasSearchWidget?: boolean;
  hasPopularDestinations?: boolean;
}

/* ---------- helpers ---------- */

function decodeEntities(s: string): string {
  return s
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function getText(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "").trim());
}

/** Find inner HTML of a div by class name, counting nesting levels. */
function extractDivInner(html: string, className: string): string {
  const re = new RegExp(`<div[^>]*class=["']${className}["'][^>]*>`, "i");
  const m = re.exec(html);
  if (!m) return "";
  return countDivInner(html, m.index + m[0].length);
}

/** Starting at `start`, count div nesting to find the matching close. */
function countDivInner(html: string, start: number): string {
  let depth = 1;
  let i = start;
  while (i < html.length && depth > 0) {
    const next = html.substring(i).match(/<\/?div[^>]*>/i);
    if (!next) break;
    const tagStart = i + next.index!;
    const tag = next[0];
    if (tag.match(/^<\//)) depth--;
    else depth++;
    if (depth === 0) return html.substring(start, tagStart);
    i = tagStart + tag.length;
  }
  return html.substring(start);
}

/* ---------- main parser ---------- */

export function parseDestinationContent(rawHtml: string) {
  return { hero: parseHero(rawHtml), sections: parseSections(rawHtml) };
}

function parseHero(html: string): HeroData {
  const heroMatch = html.match(/<section[^>]*class=["'][^"']*hero[^"']*["'][^>]*>([\s\S]*?)<\/section>/i);
  const heroInner = heroMatch ? heroMatch[1] : html;

  const pbMatch = heroInner.match(/<div[^>]*class=["'][^"']*price-badge[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
  const priceBadge = pbMatch ? getText(pbMatch[1]) : "Find flights";

  const h1Match = heroInner.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1Text = h1Match ? h1Match[1] : "";
  const spanMatch = h1Text.match(/<span[^>]*>([\s\S]*?)<\/span>/i);
  const titleSpan = spanMatch ? decodeEntities(spanMatch[1]) : "";
  const title = getText(h1Text) || "Destination";

  const subMatch = heroInner.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  const subtitle = subMatch ? decodeEntities(subMatch[1]) : "";

  return { priceBadge, title, titleSpan, subtitle, hasSearchWidget: html.includes("tpwl-search") };
}

function parseSections(html: string): ContentSection[] {
  const sectionRe = /<section[^>]*class=["'][^"']*section\s+st-border[^"']*["'][^>]*>([\s\S]*?)<\/section>/gi;
  const sections: ContentSection[] = [];
  let m: RegExpExecArray | null;

  while ((m = sectionRe.exec(html)) !== null) {
    const inner = m[1];

    const tagM = inner.match(/<span[^>]*class=["'][^"']*tag[^"']*["'][^>]*>([\s\S]*?)<\/span>/i);
    const tag = tagM ? getText(tagM[1]) : "";

    const h2M = inner.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
    const heading = h2M ? getText(h2M[1]) : "";

    // Info cards (.ic divs)
    let infoCards: InfoCard[] | undefined;
    const cards: InfoCard[] = [];
    const icRe = /<div[^>]*class=["']ic["'][^>]*>/gi;
    let ic: RegExpExecArray | null;
    while ((ic = icRe.exec(inner)) !== null) {
      const cardInner = countDivInner(inner, ic.index + ic[0].length);
      const h3m = cardInner.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
      const vm = cardInner.match(/<div[^>]*class=["']v["'][^>]*>([\s\S]*?)<\/div>/i);
      if (h3m && vm) cards.push({ label: getText(h3m[1]), value: getText(vm[1]) });
    }
    if (cards.length > 0) infoCards = cards;

    // Content (.ct divs) — ALL of them
    const ctRe = /<div[^>]*class=["']ct["'][^>]*>/gi;
    const ctParts: string[] = [];
    let ct: RegExpExecArray | null;
    while ((ct = ctRe.exec(inner)) !== null) {
      ctParts.push(countDivInner(inner, ct.index + ct[0].length));
    }
    const htmlContent = ctParts.join("\n");

    // Season prices (.sp > .sp-c)
    let seasonPrices: SeasonPrice[] | undefined;
    const spM = inner.match(/<div[^>]*class=["']sp["'][^>]*>/i);
    if (spM && spM.index !== undefined) {
      const spInner = countDivInner(inner, spM.index + spM[0].length);
      const prices: SeasonPrice[] = [];
      const spcRe = /<div[^>]*class=["']sp-c["'][^>]*>/gi;
      let spc: RegExpExecArray | null;
      while ((spc = spcRe.exec(spInner)) !== null) {
        const cardInner = countDivInner(spInner, spc.index + spc[0].length);
        const labelM = cardInner.match(/<div[^>]*class=["']sp-label["'][^>]*>([\s\S]*?)<\/div>/i);
        const valM = cardInner.match(/<div[^>]*class=["']sp-val["'][^>]*>([\s\S]*?)<\/div>/i);
        const priceM = cardInner.match(/<div[^>]*class=["']sp-price["'][^>]*>([\s\S]*?)<\/div>/i);
        if (labelM && valM && priceM) {
          prices.push({ label: getText(labelM[1]), value: getText(valM[1]), price: getText(priceM[1]) });
        }
      }
      if (prices.length > 0) seasonPrices = prices;
    }

    sections.push({
      tag,
      heading,
      htmlContent,
      infoCards,
      seasonPrices,
      hasSearchWidget: inner.includes("tpwl-search"),
      hasPopularDestinations: inner.includes("tp-popular-destinations"),
    });
  }
  return sections;
}
