import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SearchPage() {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "80vh", background: "#0e1729" }}>
        {/* Search widget container — TP script from layout.tsx auto-loads here */}
        <section
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "2rem 1.5rem",
          }}
        >
          <div id="tpwl-search" style={{ minHeight: 300 }}></div>
        </section>
      </main>
      <Footer />
    </>
  );
}
