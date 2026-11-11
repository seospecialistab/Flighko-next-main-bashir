"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { blogpost as blogPosts } from "@/data/blog-posts";
import { type BlogPost, type BlogPostsMap } from "@/types";
import { BreadcrumbNav } from "@/components/templates/routeBlocks";

const CATEGORIES = ["All", "Destination Guides", "Flight Hacks", "Airline Reviews", "Travel Tips"] as const;

function getCategory(slug: string): string {
  if (slug.includes("orlando") || slug.includes("las-vegas") || slug.includes("nyc-to-orlando")) return "Destination Guides";
  if (slug.includes("flights-to") || slug.includes("winter-travel") || slug.includes("summer-travel") || slug.includes("solo-travel") || slug.includes("digital-nomad") || slug.includes("road-trip") || slug.includes("budget-travel") || slug.includes("cheapest")) return "Destination Guides";
  if (slug.includes("airline") || slug.includes("alliance") || slug.includes("star-alliance") || slug.includes("skyteam") || slug.includes("oneworld") || slug.includes("qatar") || slug.includes("transatlantic") || slug.includes("business-class")) return "Airline Reviews";
  if (slug.includes("fees") || slug.includes("hacks") || slug.includes("tricks") || slug.includes("skiplagging") || slug.includes("error-fare") || slug.includes("best-time-book") || slug.includes("vpn") || slug.includes("student") || slug.includes("budget") || slug.includes("packing") || slug.includes("esim")) return "Flight Hacks";
  return "Travel Tips";
}

const ACCENT = "#FF6B35";

/* Scroll-reveal hook: IntersectionObserver stagger, no deps, reduced-motion aware */
function useReveal<T extends HTMLElement>(stagger = 60) {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const children = Array.from(el.children) as HTMLElement[];
    children.forEach((c) => {
      c.style.opacity = "0";
      c.style.transform = "translateY(16px)";
      c.style.transition = "opacity 0.5s cubic-bezier(.16,1,.3,1), transform 0.5s cubic-bezier(.16,1,.3,1)";
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const idx = children.indexOf(entry.target as HTMLElement);
          setTimeout(() => {
            (entry.target as HTMLElement).style.opacity = "1";
            (entry.target as HTMLElement).style.transform = "translateY(0)";
          }, idx * stagger);
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    children.forEach((c) => io.observe(c));
    return () => io.disconnect();
  }, [stagger]);
  return ref;
}

function getReadingTime(content: string): string {
  const text = content.replace(/<[^>]+>/g, " ");
  const words = text.split(/\s+/).filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

/* ─── Featured Card ─── */
function FeaturedCard({ post }: { post: (typeof blogPosts)[string] }) {
  const cat = getCategory(post.slug);
  const rt = getReadingTime(post.content);
  return (
    <a href={`/blog/${post.slug}`} style={{ display: "block", borderRadius: 20, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(15,42,74,0.06), 0 16px 48px rgba(15,42,74,0.12)", transition: "all 0.35s cubic-bezier(.16,1,.3,1)", textDecoration: "none", color: "inherit", marginBottom: 48 }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(15,42,74,0.08), 0 28px 64px rgba(15,42,74,0.18)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,42,74,0.06), 0 16px 48px rgba(15,42,74,0.12)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ display: "flex", minHeight: 420, flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 420px", minHeight: 320, overflow: "hidden", backgroundColor: "#1e293b" }}>
              <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(15,42,74,0.4), rgba(15,42,74,0.05))" }} />
              <span style={{ position: "absolute", top: 24, left: 24, background: ACCENT, color: "#fff", fontSize: 11, fontWeight: 700, padding: "8px 16px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>Featured</span>
            </div>
            <div style={{ flex: "1 1 420px", padding: "52px 56px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <span style={{ background: "rgba(15,42,74,0.85)", color: "#fff", fontSize: 11, fontWeight: 700, padding: "6px 14px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.1em" }}>{cat}</span>
                <span style={{ color: "#cbd5e1" }}>·</span>
                <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>{rt}</span>
              </div>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.4rem,2.8vw,2rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.3, marginBottom: 16, letterSpacing: "-0.02em" }}>{post.title}</h2>
          <p style={{ color: "#475569", fontSize: 16, lineHeight: 1.75, marginBottom: 28, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", fontWeight: 400 }}>{post.description}</p>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, color: ACCENT, fontSize: 14, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
            Read Article
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ─── Standard Card ─── */
function PostCard({ post }: { post: (typeof blogPosts)[string] }) {
  const cat = getCategory(post.slug);
  const rt = getReadingTime(post.content);
  return (
    <a href={`/blog/${post.slug}`} style={{ display: "flex", flexDirection: "column", borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)", transition: "all 0.35s cubic-bezier(.16,1,.3,1)", textDecoration: "none", color: "inherit" }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(15,42,74,0.08), 0 20px 48px rgba(15,42,74,0.16)"; e.currentTarget.style.transform = "translateY(-4px)"; const img = e.currentTarget.querySelector("img") as HTMLImageElement | null; if (img) img.style.transform = "scale(1.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)"; e.currentTarget.style.transform = "translateY(0)"; const img = e.currentTarget.querySelector("img") as HTMLImageElement | null; if (img) img.style.transform = "scale(1)"; }}
    >
      <div style={{ position: "relative", overflow: "hidden", aspectRatio: "16/9", backgroundColor: "#1e293b" }}>
        <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.5s cubic-bezier(.16,1,.3,1)" }} />
        <span style={{ position: "absolute", top: 14, left: 14, background: "rgba(15,42,74,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em", backdropFilter: "blur(8px)" }}>{cat}</span>
      </div>
      <div style={{ padding: 24, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>{post.date}</span>
          <span style={{ color: "#cbd5e1" }}>·</span>
          <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>{rt}</span>
        </div>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 700, color: "#0F172A", lineHeight: 1.4, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", letterSpacing: "-0.01em" }}>{post.title}</h2>
        {post.description && <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.65, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0, marginBottom: 16 }}>{post.description}</p>}
        <div style={{ marginTop: "auto", display: "flex", alignItems: "center", gap: 8, color: ACCENT, fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
          Read Article
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </div>
      </div>
    </a>
  );
}

/* ─── Wide Card ─── */
function PostCardWide({ post }: { post: (typeof blogPosts)[string] }) {
  const cat = getCategory(post.slug);
  const rt = getReadingTime(post.content);
  return (
    <a href={`/blog/${post.slug}`} style={{ display: "flex", borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)", transition: "all 0.35s cubic-bezier(.16,1,.3,1)", textDecoration: "none", color: "inherit", gridColumn: "span 2" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(15,42,74,0.08), 0 20px 48px rgba(15,42,74,0.16)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <div style={{ position: "relative", width: 340, minHeight: 220, overflow: "hidden", flexShrink: 0, backgroundColor: "#1e293b" }}>
            <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
            <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(15,42,74,0.85)", color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em", backdropFilter: "blur(8px)" }}>{cat}</span>
          </div>
          <div style={{ flex: 1, padding: 28, display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>{post.date}</span>
              <span style={{ color: "#cbd5e1" }}>·</span>
              <span style={{ color: "#94a3b8", fontSize: 12, fontWeight: 500 }}>{rt}</span>
            </div>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "#0F172A", lineHeight: 1.3, marginBottom: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", letterSpacing: "-0.01em" }}>{post.title}</h2>
            {post.description && <p style={{ color: "#94a3b8", fontSize: 13, lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0, marginBottom: 12 }}>{post.description}</p>}
            <div style={{ display: "flex", alignItems: "center", gap: 8, color: ACCENT, fontSize: 13, fontWeight: 700, fontFamily: "'Space Grotesk',sans-serif" }}>
              Read Article
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </a>
      );
    }

    /* ─── Overlay Card ─── */
    function PostCardCompact({ post }: { post: (typeof blogPosts)[string] }) {
      const cat = getCategory(post.slug);
      return (
        <a href={`/blog/${post.slug}`} style={{ display: "block", borderRadius: 16, overflow: "hidden", position: "relative", aspectRatio: "16/9", backgroundColor: "#1e293b", boxShadow: "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)", textDecoration: "none", color: "inherit", transition: "all 0.35s cubic-bezier(.16,1,.3,1)" }}
          onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(15,42,74,0.08), 0 20px 48px rgba(15,42,74,0.16)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
          onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)"; e.currentTarget.style.transform = "translateY(0)"; }}
        >
          <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,42,74,0.92) 0%, rgba(15,42,74,0.4) 55%, transparent)" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 24 }}>
            <span style={{ background: ACCENT, color: "#fff", fontSize: 10, fontWeight: 700, padding: "4px 12px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em" }}>{cat}</span>
            <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1.3, marginTop: 10, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{post.title}</h2>
          </div>
        </a>
      );
    }

/* ─── Trending Posts ─── */
function TrendingPosts({ posts }: { posts: (typeof blogPosts)[string][] }) {
  if (posts.length === 0) return null;
  return (
    <div style={{ marginBottom: 48 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#FF6B35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M12 2v2" /></svg>
        <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.01em" }}>Trending Posts</h2>
      </div>
      <div style={{ display: "flex", gap: 16, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "thin", WebkitOverflowScrolling: "touch" }}>
              {posts.map((post, i) => {
                const cat = getCategory(post.slug);
                const rt = getReadingTime(post.content);
                return (
                  <a key={post.slug} href={`/blog/${post.slug}`} style={{ position: "relative", flex: "0 0 320px", display: "flex", borderRadius: 16, overflow: "hidden", background: "#fff", boxShadow: "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)", textDecoration: "none", color: "inherit" }}
                    onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 2px 4px rgba(15,42,74,0.08), 0 20px 48px rgba(15,42,74,0.16)"; e.currentTarget.style.transform = "translateY(-4px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 2px rgba(15,42,74,0.06), 0 12px 32px rgba(15,42,74,0.10)"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    <div style={{ position: "relative", width: 96, minHeight: 140, overflow: "hidden", flexShrink: 0, backgroundColor: "#1e293b" }}>
                      <img src={post.heroImage} alt={post.heroImageAlt || post.title} loading="lazy" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 50%, rgba(255,255,255,0.96) 100%)" }} />
                      <span style={{ position: "absolute", top: 10, left: 10, fontFamily: "'Space Grotesk',sans-serif", fontSize: 30, fontWeight: 800, color: "#fff", lineHeight: 1, textShadow: "0 2px 8px rgba(15,42,74,0.5)" }}>{i + 1}</span>
                    </div>
                    <div style={{ flex: 1, padding: "16px 18px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                      <span style={{ display: "inline-block", alignSelf: "flex-start", background: "rgba(15,42,74,0.85)", color: "#fff", fontSize: 9, fontWeight: 700, padding: "3px 10px", borderRadius: 999, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>{cat}</span>
                      <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 14, fontWeight: 700, color: "#0F172A", lineHeight: 1.35, marginBottom: 8, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", letterSpacing: "-0.01em" }}>{post.title}</h3>
                      <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 500 }}>{rt}</span>
                    </div>
                  </a>
                );
              })}
            </div>
    </div>
  );
}

/* ─── Main ─── */
export default function BlogIndex() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const gridRef = useReveal<HTMLDivElement>(70);
    const posts = useMemo(() => (Object.values(blogPosts) as BlogPost[]).sort((a: BlogPost, b: BlogPost) => b.slug.localeCompare(a.slug)), []);

    const filtered = useMemo(() => posts.filter((p: BlogPost) => {
    if (activeCategory !== "All" && getCategory(p.slug) !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  }), [posts, activeCategory, searchQuery]);

  const featured = filtered[0];
  const rest = filtered.slice(1);
  const trending = posts.filter((p: BlogPost) => p.slug !== featured?.slug).slice(0, 5);

  /* Back-to-top visibility */
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Navbar />

      {/* ─── Breadcrumb ─── */}
      <BreadcrumbNav
        items={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        navStyle={{ background: "#fafafa", borderBottom: "1px solid #f0f0f0", padding: "14px 0" }}
        linkColor="#64748b"
        linkHoverColor="#FF6B35"
      />

      {/* ─── Hero: split editorial ─── */}
      <section style={{ position: "relative", background: "linear-gradient(160deg, #0F2A4A 0%, #0b1f38 60%, #0F2A4A 100%)", color: "#fff", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div style={{ position: "relative", maxWidth: 1280, margin: "0 auto", padding: "88px 24px", display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          {/* LEFT: copy */}
          <div style={{ flex: "1 1 480px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,107,53,0.15)", border: "1px solid rgba(255,107,53,0.25)", padding: "8px 16px", borderRadius: 100, marginBottom: 20 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B35", display: "inline-block" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.7)", letterSpacing: "0.05em" }}>{posts.length} ARTICLES - UPDATED WEEKLY</span>
            </div>
            <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(2.2rem,5vw,3.4rem)", fontWeight: 800, lineHeight: 1.08, marginBottom: 18, letterSpacing: "-0.03em" }}>
              Travel guides that<br /><span style={{ color: "#FF6B35" }}>actually save you money</span>
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 17, marginBottom: 32, maxWidth: 460, lineHeight: 1.65 }}>Data-driven guides to find cheaper flights and travel smarter. No fluff, no sponsored content.</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <a href="#articles" style={{ background: "#CC4A14", color: "#fff", padding: "15px 30px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 20px rgba(255,107,53,0.35)" }}>Browse Articles</a>
              <a href="#newsletter" style={{ background: "rgba(255,255,255,0.08)", color: "#fff", padding: "15px 30px", borderRadius: 12, fontSize: 15, fontWeight: 700, textDecoration: "none", fontFamily: "'Space Grotesk',sans-serif", border: "1px solid rgba(255,255,255,0.18)" }}>Get Deals by Email</a>
            </div>
            <div style={{ marginTop: 36, display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13 }}>Trending now:</span>
              {["Error Fares", "Last Minute", "Price Alerts"].map((t) => (
                <span key={t} style={{ fontSize: 12, fontWeight: 600, color: "rgba(255,255,255,0.75)", padding: "6px 14px", borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}>{t}</span>
              ))}
            </div>
          </div>
          {/* RIGHT: search panel */}
          <div style={{ flex: "1 1 380px", maxWidth: 460 }}>
            <div style={{ borderRadius: 20, padding: 28, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", backdropFilter: "blur(16px)" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", marginBottom: 14, fontFamily: "'Space Grotesk',sans-serif" }}>SEARCH ARTICLES</div>
              <div style={{ position: "relative", marginBottom: 16 }}>
                <div style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", width: 18, height: 18, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <input
                  type="text"
                  placeholder="Try: error fares, best time to book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: "100%", paddingLeft: 48, paddingRight: 20, paddingTop: 15, paddingBottom: 15, borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", color: "#fff", fontSize: 15, outline: "none", boxSizing: "border-box", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.01em" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {CATEGORIES.filter(c => c !== "All").map((c) => (
                  <button key={c} onClick={() => setActiveCategory(c)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", textAlign: "left" }}>
                    <span style={{ flex: 1 }}>{c}</span>
                    <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{posts.filter((p: BlogPost) => getCategory(p.slug) === c).length}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Category Tabs ─── */}
      <div style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(255,255,255,0.97)", backdropFilter: "blur(16px)", borderBottom: "1px solid #f0f0f0", boxShadow: "0 1px 0 rgba(0,0,0,0.03)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px", display: "flex", gap: 6, overflowX: "auto" }}>
          {CATEGORIES.map((cat) => {
                      const active = activeCategory === cat;
                      const count = cat === "All" ? posts.length : posts.filter((p: BlogPost) => getCategory(p.slug) === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)} aria-pressed={active} aria-label={`${cat}, ${count} articles`}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  border: "none",
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap" as const,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  fontFamily: "'Space Grotesk',sans-serif",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  ...(active
                    ? { background: "#CC4A14", color: "#fff", boxShadow: `0 2px 12px #FF6B3540` }
                    : { background: "transparent", color: "#64748b", border: "1px solid #e8e8e8" }
                  ),
                }}
              >
                <span>{cat}&nbsp;</span>
                <span style={{ background: active ? "rgba(255,255,255,0.25)" : "#f3f4f6", color: active ? "#fff" : "#64748b", fontSize: 11, padding: "2px 8px", borderRadius: 999, fontWeight: 700, minWidth: 22, textAlign: "center" as const }}>{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Grid ─── */}
      <main id="articles" style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16, lineHeight: 1 }}>✈️</div>
            <h3 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 8px", letterSpacing: "-0.01em" }}>No articles found</h3>
            <p style={{ color: "#64748b", fontSize: 15, marginBottom: 28, maxWidth: 420, marginLeft: "auto", marginRight: "auto" }}>Try a different keyword or browse all categories.</p>
            <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} style={{ background: "#CC4A14", color: "#fff", border: "none", padding: "12px 28px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 16px rgba(255,107,53,0.3)" }}>Browse all articles</button>
          </div>
        ) : (
          <>
            {featured && <FeaturedCard post={featured} />}
                        {rest.length > 0 && <TrendingPosts posts={trending} />}
                        {rest.length > 0 && (
                          <div ref={gridRef} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))", gap: 16, paddingBottom: "1rem" }}>
                            {rest.map((post, i) => {
                              // deterministic rhythm: wide, compact, standard, standard, wide
                              const pattern = i % 5;
                              if (pattern === 0) return <PostCardWide key={post.slug} post={post} />;
                              if (pattern === 1) return <PostCardCompact key={post.slug} post={post} />;
                              return <PostCard key={post.slug} post={post} />;
                            })}
                          </div>
                        )}
          </>
        )}
      </main>

      {/* ─── Newsletter ─── */}
      <section id="newsletter" style={{ position: "relative", padding: "80px 24px", background: "linear-gradient(160deg, #0F2A4A 0%, #0b1f38 100%)", color: "#fff", overflow: "hidden", textAlign: "center" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "22px 22px" }} />
        <div style={{ position: "relative", maxWidth: 580, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(255,107,53,0.18)", border: "1px solid rgba(255,107,53,0.3)", padding: "6px 14px", borderRadius: 999, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", marginBottom: 20, color: "#FF6B35" }}>NEWSLETTER</span>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "clamp(1.8rem,4vw,2.4rem)", fontWeight: 800, marginBottom: 14, lineHeight: 1.15, letterSpacing: "-0.02em" }}>Get the best flight deals delivered to your inbox</h2>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 16, marginBottom: 28, lineHeight: 1.65 }}>Join 10,000+ smart travelers. No spam, just deals.</p>
          {!subscribed ? (
            <form onSubmit={(e) => { e.preventDefault(); if (email.includes("@")) setSubscribed(true); }} style={{ display: "flex", gap: 10, maxWidth: 460, margin: "0 auto", flexWrap: "wrap", justifyContent: "center" }}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: "1 1 240px", minWidth: 220, padding: "14px 18px", borderRadius: 12, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", color: "#fff", fontSize: 15, outline: "none", fontFamily: "'Space Grotesk',sans-serif", boxSizing: "border-box" as const }}
              />
              <button type="submit" style={{ background: "#CC4A14", color: "#fff", border: "none", padding: "14px 28px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'Space Grotesk',sans-serif", boxShadow: "0 4px 16px rgba(255,107,53,0.35)", whiteSpace: "nowrap" as const }}>Subscribe</button>
            </form>
          ) : (
            <div style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.3)", padding: "16px 24px", borderRadius: 12, display: "inline-flex", alignItems: "center", gap: 10, color: "#10b981", fontWeight: 600 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              You're in! Check your inbox.
            </div>
          )}
        </div>
      </section>

      {/* ─── Back to Top ─── */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" style={{ position: "fixed", bottom: 28, right: 28, width: 48, height: 48, borderRadius: "50%", background: "#CC4A14", color: "#fff", border: "none", cursor: "pointer", boxShadow: "0 6px 24px rgba(255,107,53,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"} onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
        </button>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        button:focus-visible, a:focus-visible, input:focus-visible {
          outline: 2px solid #FF6B35;
          outline-offset: 2px;
        }
        .filter-scroll::-webkit-scrollbar { display: none; }
        .filter-scroll { scrollbar-width: none; }
      ` }} />
      <Footer />
    </>
  );
}
