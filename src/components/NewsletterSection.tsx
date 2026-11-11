"use client";

import { useState } from "react";
import { getAttribution } from "@/lib/attribution";

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 9999,
  padding: "1rem 1.5rem",
  fontSize: "0.95rem",
  fontFamily: "'Inter', sans-serif",
  outline: "none",
  color: "#0F172A",
};

export default function NewsletterSection() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (new FormData(form).get("email") as string)?.trim();
    if (!email) return;
    setStatus("sending");
    try {
      const attribution = getAttribution() || undefined;
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "newsletter", attribution }),
      });
      if (res.ok) {
        setStatus("done");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section style={{ padding: "48px 1.5rem", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <div className="reveal">
          <span style={{ display: "inline-block", fontFamily: "'Space Grotesk', sans-serif", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#FF6B35", marginBottom: 12 }}>
            Newsletter
          </span>
          <h2 className="section-title">
            Get Deal Alerts & Travel Guides
          </h2>
          <p style={{ fontSize: "1rem", color: "#334155", margin: "0 0 32px", lineHeight: 1.6 }}>
            Get editorial travel guides and deal alerts delivered to your inbox.
          </p>
          {status === "done" ? (
            <p style={{ color: "#4ADE80", fontWeight: 600, fontSize: "1rem" }} role="status">
              You're in! Check your inbox for a confirmation.
            </p>
          ) : (
            <form id="newsletter-form" className="newsletter-form reveal" onSubmit={handleSubmit} style={{ display: "flex", gap: 12, maxWidth: 460, margin: "0 auto" }}>
              <input
                type="email"
                name="email"
                placeholder="you@flighko.com"
                aria-label="Email for newsletter"
                required
                disabled={status === "sending"}
                style={inputStyle}
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                disabled={status === "sending"}
                style={{
                  background: "#CC4A14",
                  border: "none",
                  borderRadius: 9999,
                  padding: "0 1.5rem",
                  color: "white",
                  fontWeight: 700,
                  cursor: status === "sending" ? "wait" : "pointer",
                }}
              >
                {status === "sending" ? "..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p style={{ color: "#FCA5A5", fontSize: "0.9rem", marginTop: 12 }} role="alert">
              Something went wrong - email us directly at support@flighko.com
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
