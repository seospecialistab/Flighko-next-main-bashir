import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface LegalSection {
  title: string;
  content: string;
}

interface LegalPageProps {
  title: string;
  description: string;
  sections: LegalSection[];
}

export default function LegalPage({ title, description, sections }: LegalPageProps) {
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
            {title}
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "1.125rem",
              lineHeight: 1.7,
            }}
          >
            {description}
          </p>
        </div>
      </section>

      <main style={{ padding: "6rem 1.5rem" }}>
        <div style={{ maxWidth: 768, margin: "0 auto" }}>
          {sections.map((s, i) => (
            <div key={i} style={{ marginBottom: "2rem" }}>
              <h2
                style={{
                  fontFamily: "'Space Grotesk',sans-serif",
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "#0f172a",
                  marginBottom: "0.75rem",
                }}
              >
                {s.title}
              </h2>
              {s.content.split("\n").map((line, j) => (
                <p
                  key={j}
                  style={{
                    color: "#444",
                    lineHeight: 1.8,
                    marginBottom: line.startsWith("•") ? "0.25rem" : "0.75rem",
                    paddingLeft: line.startsWith("•") ? "1.5rem" : 0,
                    fontSize: "0.95rem",
                  }}
                >
                  {line.replace("• ", "")}
                </p>
              ))}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
