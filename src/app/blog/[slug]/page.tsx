import type { Metadata } from "next";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsletterSection from "@/components/NewsletterSection";
import { blogpost as blogPosts } from "@/data/blog-posts";
import { type BlogPost, type BlogPostsMap } from "@/types";
import { destination } from "@/data/destinations";
import { blogHubLinks } from "@/data/route-graph";
import { KeyTakeawayBox, VpnReviewGrid, PillGrid, StatBand, PriceTable } from "@/components/BlogEnhancements";

type Props = { params: Promise<{ slug: string }> };

function getCategory(slug: string): string {
  if (slug.includes("orlando") || slug.includes("las-vegas") || slug.includes("nyc-to-orlando")) return "Destination Guides";
  if (slug.includes("flights-to") || slug.includes("winter-travel") || slug.includes("summer-travel") || slug.includes("solo-travel") || slug.includes("digital-nomad") || slug.includes("road-trip") || slug.includes("budget-travel") || slug.includes("cheapest")) return "Destination Guides";
  if (slug.includes("airline") || slug.includes("alliance") || slug.includes("star-alliance") || slug.includes("skyteam") || slug.includes("oneworld") || slug.includes("qatar") || slug.includes("transatlantic") || slug.includes("business-class")) return "Airline Reviews";
  if (slug.includes("fees") || slug.includes("hacks") || slug.includes("tricks") || slug.includes("skiplagging") || slug.includes("error-fare") || slug.includes("best-time-book") || slug.includes("vpn") || slug.includes("student") || slug.includes("budget") || slug.includes("packing") || slug.includes("esim")) return "Flight Hacks";
  return "Travel Tips";
}

function getReadingTime(content: string): string {
  const text = content.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function getCategoryAccent(c: string): string {
  switch (c) {
    case "Destination Guides": return "#c2410c";
    case "Flight Hacks": return "#1d4ed8";
    case "Airline Reviews": return "#15803d";
    case "Travel Tips": return "#CC4A14";
    default: return "#c2410c";
  }
}

function getCategoryEmoji(c: string): string {
  switch (c) {
    case "Destination Guides": return "🌍";
    case "Flight Hacks": return "💡";
    case "Airline Reviews": return "✈️";
    case "Travel Tips": return "✅";
    default: return "📖";
  }
}

const NAVY = "#0F172A";
const ACCENT = "#FF6B35";
const MUTED = "#64748B";

/* ─── Category-Specific Palettes ─── */
const CATEGORY_PALETTES: Record<string, {
  primary: string; accent: string; bg: string; text: string; body: string; badgeBg: string;
  heroGradient: string; ctaBg: string; ctaColor: string; ctaShadow: string;
  searchBg: string; searchBorder: string;
  faqBorder: string; newsletterBg: string;
  sectionBorder: string;
}> = {
  "Destination Guides": {
    primary: '#c2410c', accent: '#f97316', bg: '#fff7ed', text: '#1c1917', body: '#78350f', badgeBg: '#7c2d12',
    heroGradient: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 50%, #fed7aa 100%)',
    ctaBg: '#c2410c', ctaColor: '#fff', ctaShadow: '0 6px 16px rgba(194,65,12,0.3)',
    searchBg: '#fff', searchBorder: '2px solid #fed7aa',
    faqBorder: '#fed7aa', newsletterBg: '#7c2d12',
    sectionBorder: '#fed7aa',
  },
  "Flight Hacks": {
    primary: '#FF6B35', accent: '#FF6B35', bg: '#FFF7F2', text: '#0f172a', body: '#1e293b', badgeBg: '#0F172A',
    heroGradient: 'linear-gradient(135deg, #E5511B 0%, #FF6B35 100%)',
    ctaBg: '#CC4A14', ctaColor: '#fff', ctaShadow: '0 6px 16px rgba(255,107,53,.4)',
    searchBg: '#fff', searchBorder: '2px solid #ffe0d0',
    faqBorder: '#ffe0d0', newsletterBg: '#0F172A',
    sectionBorder: '#ffe0d0',
  },
  "Airline Reviews": {
    primary: '#15803d', accent: '#22c55e', bg: '#f0fdf4', text: '#052e16', body: '#166534', badgeBg: '#166534',
    heroGradient: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)',
    ctaBg: '#15803d', ctaColor: '#fff', ctaShadow: '0 6px 12px rgba(21,128,61,0.3)',
    searchBg: '#fff', searchBorder: '2px solid #bbf7d0',
    faqBorder: '#bbf7d0', newsletterBg: '#166534',
    sectionBorder: '#bbf7d0',
  },
  "Travel Tips": {
    primary: '#CC4A14', accent: '#FF6B35', bg: '#FFF7F2', text: '#0f172a', body: '#1e293b', badgeBg: '#0F172A',
    heroGradient: 'linear-gradient(135deg, #FFF7F2 0%, #FFEDE2 50%, #FFE0D0 100%)',
    ctaBg: '#CC4A14', ctaColor: '#fff', ctaShadow: '0 6px 12px rgba(204,74,20,0.35)',
    searchBg: '#fff', searchBorder: '2px solid #ffe0d0',
    faqBorder: '#ffe0d0', newsletterBg: '#0F172A',
    sectionBorder: '#ffe0d0',
  },
};

/* ─── Blog Destination Palette (from .tmp-palette-preview.html) ─── */
const BLOG_PALETTES: Record<string, {
  primary: string; accent: string; bg: string; text: string; body: string; badgeBg: string;
  heroGradient: string; ctaBg: string; ctaColor: string; ctaShadow: string;
  searchBg: string; searchBorder: string;
  faqBorder: string; newsletterBg: string;
  sectionBorder: string;
}> = {
  city: {
    primary: '#1e3a5f', accent: '#facc15', bg: '#ffffff', text: '#1e3a5f', body: '#475569', badgeBg: '#1e3a5f',
    heroGradient: 'linear-gradient(120deg, #ffffff 0%, #FFF7F2 60%, #FFE0D6 100%)',
    ctaBg: '#facc15', ctaColor: '#1e3a5f', ctaShadow: '0 6px 16px rgba(250,204,21,.45)',
    searchBg: '#fff', searchBorder: '2px solid #e2e8f0',
    faqBorder: '#e2e8f0', newsletterBg: '#1e3a5f',
    sectionBorder: '#e2e8f0',
  },
  beach: {
    primary: '#0891b2', accent: '#f97316', bg: '#fffdf6', text: '#164e63', body: '#0e7490', badgeBg: '#0891b2',
    heroGradient: 'linear-gradient(135deg, #fffdf6 0%, #e0f7fa 55%, #bae6fd 100%)',
    ctaBg: '#f97316', ctaColor: '#fff', ctaShadow: '0 6px 16px rgba(249,115,22,.4)',
    searchBg: '#fff', searchBorder: 'none',
    faqBorder: '#bae6fd', newsletterBg: '#0891b2',
    sectionBorder: '#bae6fd',
  },
  culture: {
    primary: '#1d4ed8', accent: '#1d4ed8', bg: '#fdf8ee', text: '#451a03', body: '#78350f', badgeBg: '#7c2d12',
    heroGradient: 'linear-gradient(115deg, #fdf8ee 0%, #faf1dd 70%, #f5e6c4 100%)',
    ctaBg: '#1d4ed8', ctaColor: '#fff', ctaShadow: '0 6px 16px rgba(29,78,216,.35)',
    searchBg: '#fff', searchBorder: '1px solid #e7d7b8',
    faqBorder: '#e7d7b8', newsletterBg: '#7c2d12',
    sectionBorder: '#e7d7b8',
  },
  adventure: {
    primary: '#ea580c', accent: '#ea580c', bg: '#f8faf7', text: '#14532d', body: '#3f6212', badgeBg: '#166534',
    heroGradient: 'linear-gradient(130deg, #f8faf7 0%, #dcfce7 60%, #bae6fd 100%)',
    ctaBg: '#ea580c', ctaColor: '#fff', ctaShadow: '0 6px 16px rgba(234,88,12,.4)',
    searchBg: '#fff', searchBorder: '1px solid #d9edd9',
    faqBorder: '#d9edd9', newsletterBg: '#166534',
    sectionBorder: '#d9edd9',
  },
  entertainment: {
    primary: '#db2777', accent: '#db2777', bg: '#fffaff', text: '#4c1d95', body: '#831843', badgeBg: '#7c3aed',
    heroGradient: 'linear-gradient(125deg, #fffaff 0%, #fce7f3 55%, #ede9fe 100%)',
    ctaBg: '#db2777', ctaColor: '#fff', ctaShadow: '0 6px 16px rgba(219,39,119,.4)',
    searchBg: '#fff', searchBorder: '1px solid #f5d0fe',
    faqBorder: '#f5d0fe', newsletterBg: '#7c3aed',
    sectionBorder: '#f5d0fe',
  },
};

function getBlogTheme(blogSlug: string): string | null {
  const post = blogPosts[blogSlug];
  if (!post?.destination) return null;
  const dest = destination[post.destination];
  if (!dest) return null;
  return dest.category;
}

function extractHeadings(content: string): { id: string; text: string }[] {
  // Remove HTML comments first
  const cleanContent = content.replace(/<!--[\s\S]*?-->/g, '');
  return (cleanContent.match(/<h2[^>]*>(.*?)<\/h2>/g) || []).map((h, i) => {
    const text = h.replace(/<[^>]+>/g, "").trim();
    const slugId = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `section-${i}`;
    return { id: slugId, text };
  });
}

export async function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) return {};
  return {
    title: post.title ? `${post.title} | Flighko` : "Blog | Flighko",
    description: post.description,
    alternates: { canonical: `https://www.flighko.com/blog/${slug}` },
    openGraph: { title: post.title, description: post.description, url: `https://www.flighko.com/blog/${slug}`, siteName: "Flighko", type: "article", ...(post.heroImage ? { images: [{ url: post.heroImage }] } : {}) },
  };
}

/* ─── Content Renderer ─── */
// Inject id="section-N" into styled <h2 class="..."> tags so TOC anchors resolve.
// Plain <h2> blocks are handled by ArticleBody's special path (which assigns ids itself).
function injectHeadingIds(content: string): string {
  let counter = 0;
  const used = new Set<string>();
  return content.replace(/<h2 ([^>]*)>([\s\S]*?)<\/h2>/g, (m, attrs, inner) => {
    if (/id=/.test(attrs)) return m;
    const text = inner.replace(/<[^>]+>/g, "").trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `section-${counter}`;
    while (used.has(id)) id = `${id}-${counter++}`;
    used.add(id);
    return `<h2 id="${id}" ${attrs}>${inner}</h2>`;
  });
}
// B · Modern Minimal article renderer
function ArticleBody({ content, headings }: { content: string; headings: { id: string; text: string }[] }) {
  return (
    <article className="article-content" style={{ fontSize: '16px', lineHeight: 1.7, color: '#1E293B', fontFamily: "'Inter', system-ui, sans-serif" }}>
      {content.split("\n\n").map((block, i) => {
        const t = block.trim();
        if (!t) return null;
        if (t.startsWith("<h2>")) {
          const m = t.match(/<h2>([\s\S]*?)<\/h2>/);
          const headingText = m ? m[1] : t.replace(/<\/?h2>/g, "");
          const rest = t.replace(/<h2>[\s\S]*?<\/h2>/, "").trim();
          const headingId = headingText.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || `section-${i}`;
          return (
            <Fragment key={i}>
              <h2 id={headingId} style={{ fontFamily: "Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', marginTop: '2.5rem', marginBottom: '1rem', letterSpacing: '-0.02em', lineHeight: 1.2, scrollMarginTop: '5rem' }} dangerouslySetInnerHTML={{ __html: headingText }} />
              {rest && <p style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.7, marginBottom: '1.1rem' }} dangerouslySetInnerHTML={{ __html: rest }} />}
            </Fragment>
          );
        }
        if (t.startsWith("<h3>")) {
          const m = t.match(/<h3>([\s\S]*?)<\/h3>/);
          const headingText = m ? m[1] : t.replace(/<\/?h3>/g, "");
          const rest = t.replace(/<h3>[\s\S]*?<\/h3>/, "").trim();
          return (
            <Fragment key={i}>
              <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginTop: '1.5rem', marginBottom: '0.5rem' }} dangerouslySetInnerHTML={{ __html: headingText }} />
              {rest && <p style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.7, marginBottom: '1.1rem' }} dangerouslySetInnerHTML={{ __html: rest }} />}
            </Fragment>
          );
        }
        if (t.startsWith("<ul") || t.startsWith("<ol") || t.startsWith("<li")) return <div key={i} style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.7, marginBottom: '1.1rem' }} dangerouslySetInnerHTML={{ __html: t }} />;
        if (t.startsWith("<strong>")) return <p key={i} style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.7, marginBottom: '1.1rem', fontWeight: 600, background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }} dangerouslySetInnerHTML={{ __html: t }} />;
        if (t.startsWith("<table")) return <div key={i} className="table-wrapper" style={{ width: '100%', overflowX: 'auto', WebkitOverflowScrolling: 'touch', margin: '1.5rem 0' }} dangerouslySetInnerHTML={{ __html: t }} />;
        return <p key={i} style={{ fontSize: '16px', color: '#1E293B', lineHeight: 1.7, marginBottom: '1.1rem' }} dangerouslySetInnerHTML={{ __html: t }} />;
      })}
    </article>
  );
}

/* ─── Main Page ─── */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts[slug];
  if (!post) notFound();

  const category = getCategory(post.slug);
  const readingTime = getReadingTime(post.content);
  const headings = extractHeadings(post.content);
  const accent = getCategoryAccent(category);

  const blogTheme = getBlogTheme(slug);
  const categoryPalette = CATEGORY_PALETTES[category];
  const destPalette = blogTheme ? BLOG_PALETTES[blogTheme] : null;
  const palette = categoryPalette || destPalette;
  const accentColor = palette ? palette.accent : accent;
  const badgeBgColor = palette ? palette.badgeBg : accent;
  const cardBg = palette ? palette.bg : '#fafafa';
  const linkColor = palette ? palette.primary : '#FF6B35';
  const heroGradient = palette ? palette.heroGradient : 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.1) 70%, transparent 100%)';
  const ctaBg = palette ? palette.ctaBg : '#FF6B35';
  const ctaColor = palette ? palette.ctaColor : '#fff';
  const ctaShadow = palette ? palette.ctaShadow : '0 6px 16px rgba(255,107,53,.4)';
  const searchBg = palette ? palette.searchBg : '#fff';
  const searchBorder = palette ? palette.searchBorder : '1px solid #e5e7eb';
  const faqBorder = palette ? palette.faqBorder : '#e5e7eb';
  const newsletterBg = palette ? palette.newsletterBg : '#0F2A4A';
  const sectionBorder = palette ? palette.sectionBorder : '#f0f0f0';
  const textColor = palette ? palette.text : '#0f172a';
  const bodyColor = palette ? palette.body : '#475569';

  const relatedSameCat = (Object.values(blogPosts) as BlogPost[])
      .filter((p: BlogPost) => p.slug !== slug && getCategory(p.slug) === category)
      .sort(() => Math.random() - 0.5);
  const relatedBackfill = (Object.values(blogPosts) as BlogPost[])
      .filter((p: BlogPost) => p.slug !== slug && getCategory(p.slug) !== category)
      .sort(() => Math.random() - 0.5);
  const relatedPosts = [...relatedSameCat, ...relatedBackfill].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    author: { "@type": "Organization", name: "Flighko" },
    publisher: {
      "@type": "Organization",
      name: "Flighko",
      logo: {
        "@type": "ImageObject",
        url: "https://www.flighko.com/assets/White background version website logo.webp",
      },
    },
    image: post.heroImage || "https://www.flighko.com/assets/og-default.png",
    datePublished: post.date,
    dateModified: post.date,
  };

  const faqJsonLd = post.faq ? {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faq.map((item: { q: string; a: string }) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a }
      }))
    } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      
                  <main>
                    <Navbar />

                    {/* ─── B hero: surface bg, tag pill, centered ─── */}
                    <header style={{ background: '#F8FAFC', borderBottom: `1px solid ${sectionBorder}`, padding: '5rem 1.5rem 4rem', textAlign: 'center' }}>
                      <span style={{ display: 'inline-block', background: '#FFF1EA', color: '#FF6B35', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0.35rem 0.9rem', borderRadius: '99px', marginBottom: '1.25rem' }}>{getCategoryEmoji(category)} {category}</span>
                      <h1 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(2.4rem, 5vw, 3.4rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.05, maxWidth: '760px', margin: '0 auto' }}>{post.title}</h1>
                      <p style={{ color: '#64748B', maxWidth: '560px', margin: '1.25rem auto 0', fontSize: '1.05rem' }}>{post.description}</p>
                      <div style={{ fontSize: '0.85rem', color: '#64748B', marginTop: '1.5rem' }}>{post.date} · {readingTime}</div>
                      {post.heroImage && (
                        <div style={{ maxWidth: '1100px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
                          <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover', borderRadius: '16px', border: `1px solid ${sectionBorder}` }} />
                        </div>
                      )}
                    </header>

                    {/* ─── B two-column shell: main + sticky TOC ─── */}
                                        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 260px', gap: '3rem', alignItems: 'start' }} className="blog-shell">
                                          <div style={{ maxWidth: '680px' }}>
                                            <ArticleBody content={injectHeadingIds(post.content)} headings={headings} />
                                            {post.vpnReviews && post.vpnReviews.length > 0 && (
                                              <VpnReviewGrid reviews={post.vpnReviews} />
                                            )}
                                            {post.popularDestinations && post.popularDestinations.length > 0 && (
                                              <PillGrid items={post.popularDestinations} />
                                            )}
                                          </div>
                                          {/* Sticky TOC sidebar */}
                                          <aside style={{ position: 'sticky', top: '5rem', display: 'block' }} className="blog-toc">
                                            <h4 style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#64748B', marginBottom: '0.75rem', fontFamily: "'Space Grotesk', sans-serif" }}>On This Page</h4>
                        {headings.map((h, hi) => (
                          <a key={hi} href={`#${h.id}`} style={{ display: 'block', color: '#1E293B', fontSize: '0.85rem', padding: '0.4rem 0', borderBottom: `1px solid ${sectionBorder}`, textDecoration: 'none' }}>{h.text}</a>
                        ))}
                        <a href="/" style={{ display: 'block', color: ACCENT, fontWeight: 600, fontSize: '0.85rem', padding: '0.4rem 0', textDecoration: 'none', marginTop: '0.5rem' }}>Compare Rewards →</a>
                      </aside>
                    </div>

        {/* ─── FAQ ─── */}
        {post.faq && post.faq.length > 0 && (
          <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1.5rem', borderTop: `1px solid ${sectionBorder}` }}>
            <div style={{ maxWidth: '680px' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.75rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em', marginBottom: '1.5rem', scrollMarginTop: '5rem' }}>Frequently Asked Questions</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                {post.faq.map((item: { q: string; a: string }, i: number) => (
                  <details key={i} style={{ borderBottom: `1px solid ${sectionBorder}`, padding: '1.1rem 0' }}>
                    <summary style={{ cursor: 'pointer', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: '#0F172A', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.05rem' }}>
                      {item.q}
                      <span style={{ color: ACCENT, fontSize: '1.3rem', marginLeft: '1rem' }}>+</span>
                    </summary>
                    <p style={{ color: '#1E293B', fontSize: '0.9375rem', lineHeight: 1.7, margin: '0.75rem 0 0' }}>{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Newsletter (shared main-site component) ─── */}
        <NewsletterSection />

        {/* ─── Find flights on Flighko — blog → route-hub contextual links ─── */}
        {(() => {
          const hubs = blogHubLinks(slug);
          if (hubs.regions.length === 0 && hubs.cities.length === 0) return null;
          return (
            <div style={{ padding: '2.5rem 1.5rem', background: '#FFF7F2', borderTop: `1px solid ${sectionBorder}` }}>
              <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1.5rem' }}>
                <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                  ✈️ Find flights on Flighko
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.9rem', marginBottom: '1.1rem' }}>
                  Compare real fares for the routes in this article — live prices, no booking fees.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {hubs.regions.map((r) => (
                    <a key={r.slug} href={`/flight-routes`} style={{ padding: "0.45rem 0.9rem", borderRadius: "99px", background: "white", border: "1px solid #E2E8F0", color: "#0F2A4A", fontSize: "0.85rem", fontWeight: 600, textDecoration: "none" }}>
                      {r.name} routes →
                    </a>
                  ))}
                  <a href="/flight-routes" style={{ padding: '0.45rem 0.9rem', borderRadius: '99px', background: '#0F172A', color: 'white', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                    All 35 routes →
                  </a>
                </div>
              </div>
            </div>
          );
        })()}

        {/* ─── Internal Links (SEO) — Dynamic ─── */}
        {(() => {
          const postOrigin = post.origin;
          const postDest = post.destination;
          const dynamicRoutes: { slug: string; label: string }[] = [];
          const dynamicDests: { slug: string; label: string }[] = [];
          if (postOrigin && postDest) {
            dynamicRoutes.push({ slug: `${postOrigin}-to-${postDest}`, label: `→ ${destination[postOrigin]?.title || postOrigin} to ${destination[postDest]?.title || postDest}` });
          }
          if (postDest && destination[postDest]) {
            dynamicDests.push({ slug: postDest, label: `→ ${destination[postDest].title} Travel Guide` });
          }
          const cat = getCategory(post.slug);
                    const sameCategoryPosts = (Object.values(blogPosts) as BlogPost[]).filter((p: BlogPost) => p.slug !== slug && getCategory(p.slug) === cat).slice(0, 5);
          if (dynamicRoutes.length === 0 && dynamicDests.length === 0 && sameCategoryPosts.length === 0) return null;
          return (
            <div style={{ padding: '2rem 1.5rem', background: cardBg, borderTop: `1px solid ${sectionBorder}` }}>
              <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                {dynamicRoutes.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '0.75rem' }}>Flight Routes</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {dynamicRoutes.map(r => (
                        <a key={r.slug} href={`/flight-routes/${r.slug}`} style={{ color: linkColor, textDecoration: 'none', fontSize: '0.875rem' }}>{r.label}</a>
                      ))}
                    </div>
                  </div>
                )}
                {dynamicDests.length > 0 && (
                  <div>
                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '0.75rem' }}>Destinations</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {dynamicDests.map(d => (
                        <a key={d.slug} href={`/destinations/${d.slug}`} style={{ color: linkColor, textDecoration: 'none', fontSize: '0.875rem' }}>{d.label}</a>
                      ))}
                    </div>
                  </div>
                )}
                {sameCategoryPosts.length > 0 && (
                                  <div>
                                    <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1rem', fontWeight: 700, color: textColor, marginBottom: '0.75rem' }}>More from {cat}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                      {sameCategoryPosts.map((p: BlogPost) => (
                                        <a key={p.slug} href={`/blog/${p.slug}`} style={{ color: linkColor, textDecoration: 'none', fontSize: '0.875rem' }}>→ {p.title}</a>
                                      ))}
                                    </div>
                                  </div>
                                )}
              </div>
            </div>
          );
        })()}

        {/* ─── Related ─── */}
        {relatedPosts.length > 0 && (
          <div style={{ background: cardBg, borderTop: `1px solid ${sectionBorder}`, padding: '3rem 1.5rem' }}>
            <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1.5rem' }}>
              <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: textColor, marginBottom: '1.5rem' }}>Related Articles</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {relatedPosts.map((rp: BlogPost) => (
                  <a key={rp.slug} href={`/blog/${rp.slug}`} style={{ display: 'block', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${sectionBorder}`, background: 'white', textDecoration: 'none', transition: 'transform 0.2s, box-shadow 0.2s' }}>
                    <div style={{ aspectRatio: '16/10', overflow: 'hidden' }}>
                      <img src={rp.heroImage} alt={rp.heroImageAlt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.875rem', fontWeight: 600, color: textColor, lineHeight: 1.4, marginBottom: '0.5rem' }}>{rp.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{rp.date}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── Social Sharing ─── */}
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.5rem 1.5rem', borderTop: `1px solid ${sectionBorder}` }}>
          <div style={{ maxWidth: '680px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.875rem', color: bodyColor, fontWeight: 500 }}>Share this article</span>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <a href={`https://x.com/intent/tweet?url=https://www.flighko.com/blog/${slug}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#000000', color: 'white', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>X</a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=https://www.flighko.com/blog/${slug}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#4267B2', color: 'white', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>Facebook</a>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=https://www.flighko.com/blog/${slug}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: '#0077B5', color: 'white', fontSize: '0.8125rem', fontWeight: 600, textDecoration: 'none' }}>LinkedIn</a>
            </div>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <div style={{ padding: '3rem 1.5rem', background: newsletterBg }}>
          <div style={{ maxWidth: '896px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.6rem', fontWeight: 700, color: 'white', marginBottom: '0.75rem' }}>Ready to fly smarter?</h2>
            <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '1.5rem' }}>Find the best flight deals before anyone else.</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/blog" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>Read the Blog</a>
              <a href="/" style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', color: ctaColor, fontSize: '0.875rem', fontWeight: 700, textDecoration: 'none', background: ctaBg, boxShadow: ctaShadow }}>Search Flights →</a>
            </div>
          </div>
        </div>
        {/* ─── Sticky bottom CTA (Direction B signature) ─── */}
              </main>


      {/* ─── B · Modern Minimal content styles ─── */}
      <style dangerouslySetInnerHTML={{ __html: `
        .article-content h2 {
          scroll-margin-top: 5rem;
        }
        .article-content .stat-callout {
          background: #FFF1EA;
          border-left: 4px solid #FF6B35;
          padding: 1rem 1.5rem;
          border-radius: 0 8px 8px 0;
          margin: 1.5rem 0;
        }
        .article-content .stat-number {
          color: #9A3412;
          font-weight: 700;
          font-size: 1.125rem;
        }
        .article-content .pro-tip {
          background: #f0fdf4;
          border-left: 4px solid #22c55e;
          padding: 1rem 1.5rem;
          border-radius: 0 8px 8px 0;
          margin: 1.5rem 0;
        }
        .article-content .cta-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #FF6B35;
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .article-content .cta-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255,107,53,0.4);
        }
        .article-content table {
          border-collapse: collapse;
          margin: 1.5rem 0;
          width: max-content;
          min-width: 100%;
        }
        .article-content table-wrapper {
          position: relative;
          overflow: hidden;
        }
        .article-content table-wrapper::after {
          content: "";
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 48px;
          background: linear-gradient(to right, transparent, white);
          pointer-events: none;
        }
        @media (max-width: 640px) {
          .article-content table {
            width: 100%;
            min-width: 0;
          }
          .article-content table th,
          .article-content table td {
            white-space: normal;
            min-width: 0;
            padding: 0.4rem 0.25rem;
            font-size: 0.7rem;
          }
          .article-content table th {
            white-space: normal;
          }
        }
        .article-content th, .article-content td {
          padding: 0.75rem;
          border-bottom: 1px solid #e5e7eb;
          text-align: left;
        }
        .article-content th {
          font-weight: 600;
          color: #374151;
        }
        .article-content tr:hover {
          background: #f9fafb;
        }
        .article-content ul {
          list-style-type: none;
          padding-left: 0;
          margin: 1rem 0;
        }
        .article-content ul li::before {
          content: "";
          display: inline-block;
          width: 6px; height: 6px;
          background: #FF6B35;
          border-radius: 50%;
          margin-right: 0.6rem;
        }
        .article-content ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 1rem 0;
        }
        .article-content li {
          margin-bottom: 0.5rem;
        }
        /* FAQ accordion: rotate + to — on open */
        .article-content details[open] summary span:last-child {
          transform: rotate(45deg);
        }
        .article-content strong {
          color: #0f172a;
          font-weight: 600;
        }
        .article-content a {
          color: #FF6B35;
          font-weight: 600;
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .article-content a:hover {
          color: #ea580c;
        }
      ` }} />
      <Footer />
    </>
  );
}
