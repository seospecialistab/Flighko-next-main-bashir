import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Contact Flighko – Get in Touch",
  description:
    "Have a question about a booking or a partnership inquiry? Our concierge team is ready to assist.",
  alternates: { canonical: "https://www.flighko.com/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <section
        style={{
          background: "linear-gradient(135deg,#0F2A4A,#0b1f38,#0F2A4A)",
          paddingTop: "8rem",
          paddingBottom: "5rem",
          textAlign: "center",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 768, margin: "0 auto", padding: "0 1.5rem" }}>
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(2rem,5vw,3.5rem)",
              fontWeight: 700,
              marginBottom: "1.5rem",
              letterSpacing: "-0.025em",
            }}
          >
            Get in Touch
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.125rem",
              lineHeight: 1.7,
            }}
          >
            Have a question about a booking or a partnership inquiry? Our
            concierge team is ready to assist.
          </p>
        </div>
      </section>

      <main
        style={{
          padding: "6rem 1.5rem",
          maxWidth: 768,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "4rem",
        }}
      >
        {/* Left: Contact Info */}
        <div>
          <h2
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "1.875rem",
              fontWeight: 700,
              marginBottom: "1.5rem",
              color: "#0f172a",
            }}
          >
            Reach Out
          </h2>
          <p
            style={{
              color: "#4b5563",
              lineHeight: 1.7,
              marginBottom: "2rem",
            }}
          >
            We strive to respond to all inquiries within 24 business hours. For
            urgent booking issues, please contact your airline directly.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#ffedd5",
                  color: "#f97316",
                  borderRadius: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "1.25rem",
                }}
              >
                ✉
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#0f172a" }}>Email Support</p>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                  support@flighko.com
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#FFF7F2",
                  color: "#FF6B35",
                  borderRadius: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  fontSize: "1.25rem",
                }}
              >
                🏢
              </div>
              <div>
                <p style={{ fontWeight: 700, color: "#0f172a" }}>Corporate</p>
                <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
                  partners@flighko.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <div
          style={{
            background: "#fff",
            padding: "2rem",
            borderRadius: 24,
            boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
            border: "1px solid #f3f4f6",
          }}
        >
          <form style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: "#9ca3af",
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Message
              </label>
              <textarea
                rows={4}
                placeholder="How can we help you?"
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: 12,
                  border: "1px solid #e5e7eb",
                  fontSize: "0.95rem",
                  outline: "none",
                  resize: "vertical",
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                background: "#0f172a",
                color: "#fff",
                padding: "1rem",
                borderRadius: 12,
                fontWeight: 700,
                fontSize: "0.95rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
