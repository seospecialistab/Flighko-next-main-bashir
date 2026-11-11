import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "70vh", padding: "4rem 1.5rem", maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem", lineHeight: 1 }}>404</div>
          <h1
            style={{
              fontFamily: "'Space Grotesk',sans-serif",
              fontSize: "clamp(2rem,5vw,3rem)",
              fontWeight: 700,
              color: "#0F172A",
              marginBottom: "0.75rem",
              letterSpacing: "-0.025em",
            }}
          >
            Page not found
          </h1>
          <p
            style={{
              color: "#64748B",
              fontSize: "1.0625rem",
              lineHeight: 1.6,
              maxWidth: 480,
              margin: "0 auto 2rem",
            }}
          >
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="/"
              style={{
                background: "#FF6B35",
                color: "#fff",
                padding: "12px 28px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                textDecoration: "none",
                fontFamily: "'Space Grotesk',sans-serif",
                boxShadow: "0 4px 16px rgba(255,107,53,0.3)",
              }}
            >
              Go Home
            </a>
            <a
              href="/flight-routes"
              style={{
                background: "#F1F5F9",
                color: "#0F172A",
                padding: "12px 28px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                textDecoration: "none",
                fontFamily: "'Space Grotesk',sans-serif",
                border: "1px solid #E2E8F0",
              }}
            >
              Browse Routes
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
