"use client";

import Link from "next/link";

async function handleFooterSubscribe(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const form = e.currentTarget;
  const email = (new FormData(form).get("email") as string)?.trim();
  if (!email) return;
  const btn = form.querySelector("button");
  if (btn) btn.setAttribute("disabled", "true");
  try {
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "footer" }),
    });
    if (res.ok) {
      form.reset();
      if (btn) btn.textContent = "\u2713";
    } else {
      window.location.href = "mailto:support@flighko.com?subject=Subscribe";
    }
  } catch {
    window.location.href = "mailto:support@flighko.com?subject=Subscribe";
  }
}

export default function Footer() {
  return (
    <footer className="footer" style={{ background: "#071d2d", color: "#fff", padding: "4rem 0 2rem" }}>
      <div className="footer__inner" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div className="footer__grid">
          {/* Brand */}
          <div className="footer__brand">
            <Link href="/" className="footer__brand-logo" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none", marginBottom: "0.75rem" }}>
              <img src="/flighko-icon.png" alt="Flighko" width={28} height={28} loading="lazy" style={{ objectFit: "contain", borderRadius: 8 }} />
              <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: "1.125rem", fontWeight: 700, color: "#fff" }}>flighko</span>
            </Link>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.6, maxWidth: 280 }}>
              Compare flights from 200+ airlines. Find the cheapest fares from Egypt &amp; the Middle East, with no hidden fees.
            </p>
          </div>

          {/* Company */}
          <div className="footer__col">
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Company</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/about" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>About Us</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/blog/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Blog</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/contact" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Contact us</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div className="footer__col">
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Explore</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/destinations/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Destinations</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/flight-routes/" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Routes</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/faq" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>FAQ</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer__col">
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Support</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/contact" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Help Centre</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/terms" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Terms of Service</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/privacy" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Popular routes (S3: deep internal route interlinking on homepage) */}
          <div className="footer__col">
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Popular Routes</h3>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/flight-routes/cairo-to-dubai" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Cairo → Dubai</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/flight-routes/london-to-amsterdam" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>London → Amsterdam</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/flight-routes/cairo-to-istanbul" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Cairo → Istanbul</Link></li>
              <li style={{ marginBottom: "0.5rem" }}><Link href="/destinations/istanbul" style={{ color: "rgba(255,255,255,0.55)", textDecoration: "none", fontSize: "0.875rem" }}>Istanbul Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer__col footer__newsletter">
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#fff", marginBottom: "1rem" }}>Newsletter</h3>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              Get travel guides and deal alerts.
            </p>
            <form onSubmit={handleFooterSubscribe} style={{ display: "flex", gap: 0, border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, overflow: "hidden" }}>
              <input
                type="email"
                name="email"
                required
                aria-label="Email for newsletter"
                placeholder="you@flighko.com"
                style={{
                  flex: 1,
                  padding: "0.625rem 2.5rem 0.625rem 0.75rem",
                  fontSize: "0.875rem",
                  background: "rgba(255,255,255,0.05)",
                  border: "none",
                  color: "#fff",
                  outline: "none",
                  boxSizing: "border-box",
                }}
              />
              <button type="submit"
                aria-label="Subscribe to newsletter"
                style={{
                  padding: "0 0.75rem",
                  background: "#CC4A14",
                  border: "none",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  boxSizing: "border-box",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 2 11 13" />
                  <path d="m22 2-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer__bottom">
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.9)" }}>
            &copy; 2026 Flighko. All rights reserved.
          </p>
          <div className="footer__social" style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <a href="https://instagram.com/flighko" aria-label="Flighko on Instagram" style={{ color: "rgba(255,255,255,0.9)", transition: "color 0.15s", display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://tiktok.com/@flighko" aria-label="Flighko on TikTok" style={{ color: "rgba(255,255,255,0.9)", transition: "color 0.15s", display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78c.27 0 .54.04.8.1V9.03a6.34 6.34 0 0 0-.8-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.42a8.21 8.21 0 0 0 4.8 1.53V7.5a4.85 4.85 0 0 1-1.07-.81z" />
              </svg>
            </a>
            <a href="https://x.com/flighko" aria-label="Flighko on X" style={{ color: "rgba(255,255,255,0.9)", transition: "color 0.15s", display: "flex", alignItems: "center" }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
