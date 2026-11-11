import type { Metadata } from "next";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import "./globals.css";
import "./blog-design-tokens.css";

export const metadata: Metadata = {
  title: "Flighko – Compare Cheap Flights | 200+ Airlines",
  description: "Compare fares across 200+ airlines - NYC to Nashville, Singapore to Bangkok & more. Real prices, no fees, data-backed route guides.",
  alternates: { canonical: "https://www.flighko.com" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: "/favicon.png",
    other: [{ url: "/favicon.png", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Flighko",
    description: "Compare fares across 200+ airlines. Real prices, no fees, data-backed route guides.",
    url: "https://www.flighko.com",
    siteName: "Flighko",
    type: "website",
    images: [
      {
    url: "https://www.flighko.com/assets/og-default.png",
    width: 1200,
    height: 630,
    alt: "Flighko - Compare Cheap Flights",
    },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["https://www.flighko.com/assets/og-default.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Preload critical above-the-fold fonts */}
        <link rel="preload" href="/fonts/Space-Grotesk-700.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Space-Grotesk-400.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        {/* Inlined font-face declarations (eliminates render-blocking CSS request) */}
        <style dangerouslySetInnerHTML={{ __html: `@font-face{font-family:\'Space Grotesk\';font-style:normal;font-weight:400;font-display:swap;src:url(/fonts/Space-Grotesk-400.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:\'Space Grotesk\';font-style:normal;font-weight:500;font-display:swap;src:url(/fonts/Space-Grotesk-500.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}@font-face{font-family:\'Space Grotesk\';font-style:normal;font-weight:700;font-display:swap;src:url(/fonts/Space-Grotesk-700.woff2) format(\'woff2\');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD}` }} />
        {/* Travelpayouts White Label - Main Script (lazy: mounts when widget near viewport) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var loaded = false;
                function loadTPWL() {
                  if (loaded) return;
                  loaded = true;
                  var s = document.createElement("script");
                  s.async = 1;
                  s.type = "module";
                  s.src = "https://tpemd.com/wl_web/main.js?wl_id=17416";
                  document.head.appendChild(s);
                  // re-run HeroSection fallback timer logic via event
                  window.dispatchEvent(new Event("tpwl-loaded"));
                }
                function init() {
                  var target = document.getElementById("tpwl-search");
                  if (!target) return; // no widget on this page
                  if ("IntersectionObserver" in window) {
                    var io = new IntersectionObserver(function (entries) {
                      entries.forEach(function (e) {
                        if (e.isIntersecting) { loadTPWL(); io.disconnect(); }
                      });
                    }, { rootMargin: "200px" }); // start loading 200px before visible
                    io.observe(target);
                    // safety: also load on first scroll/touch/click within 4s even if observer misses
                    var bail = setTimeout(function(){ loadTPWL(); }, 4000);
                    ["scroll","touchstart","mousedown","keydown"].forEach(function(ev){
                      window.addEventListener(ev, function h(){ clearTimeout(bail); loadTPWL(); window.removeEventListener(ev, h); }, { once: true, passive: true });
                    });
                  } else {
                    loadTPWL();
                  }
                }
                if (document.readyState === "loading") {
                  document.addEventListener("DOMContentLoaded", init);
                } else {
                  init();
                }
              })();
            `,
          }}
        />
        {/* Travelpayouts Drive - Monetization Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var script = document.createElement("script");
                script.async = 1;
                script.src = "https://emrldtp.com/NTE4MzY0.js?t=518364";
                document.head.appendChild(script);
              })();
            `,
          }}
        />
        {/* Scroll reveal observer */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener("DOMContentLoaded",function(){
                var els=document.querySelectorAll(".reveal");
                if(!els.length)return;
                var obs=new IntersectionObserver(function(entries){
                  entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add("visible");obs.unobserve(e.target);}});
                },{threshold:0.1});
                els.forEach(function(el){obs.observe(el);});
              });
            `,
          }}
        />
        {/* llms.txt and AGENTS.md for AI discoverability */}
        <link rel="llms.txt" href="/llms.txt" />
        <link rel="contents" href="/AGENTS.md" type="text/markdown" />
        {/* WebSite + Sitelinks SearchAction JSON-LD (enables Google sitelinks search box) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://www.flighko.com/#website",
              name: "Flighko",
              url: "https://www.flighko.com",
              description: "Compare fares on 35 routes across 200+ airlines. Sample fares from our tracked route data, no fees, data-backed route guides.",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://www.flighko.com/search?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* ItemList of popular routes (helps Google understand route hub structure) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Popular flight routes on Flighko",
              itemListElement: [
                { "@type": "ListItem", position: 1, url: "https://www.flighko.com/flight-routes/singapore-to-bangkok" },
                { "@type": "ListItem", position: 2, url: "https://www.flighko.com/flight-routes/new-york-to-nashville" },
                { "@type": "ListItem", position: 3, url: "https://www.flighko.com/flight-routes/cairo-to-dubai" },
                { "@type": "ListItem", position: 4, url: "https://www.flighko.com/flight-routes/cairo-to-istanbul" },
                { "@type": "ListItem", position: 5, url: "https://www.flighko.com/flight-routes/cairo-to-london" },
                { "@type": "ListItem", position: 6, url: "https://www.flighko.com/flight-routes/london-to-amsterdam" },
                { "@type": "ListItem", position: 7, url: "https://www.flighko.com/flight-routes/bangkok-to-seoul" },
                { "@type": "ListItem", position: 8, url: "https://www.flighko.com/flight-routes/bangkok-to-taipei" },
                { "@type": "ListItem", position: 9, url: "https://www.flighko.com/flight-routes/dubai-to-paris" },
                { "@type": "ListItem", position: 10, url: "https://www.flighko.com/flight-routes/kuala-lumpur-to-bangkok" },
                { "@type": "ListItem", position: 11, url: "https://www.flighko.com/flight-routes/nairobi-to-london" },
                { "@type": "ListItem", position: 12, url: "https://www.flighko.com/flight-routes/los-angeles-to-las-vegas" },
              ],
            }),
          }}
        />
        {/* Organization JSON-LD (brand entity + logo for knowledge panel) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://www.flighko.com/#organization",
              name: "Flighko",
              url: "https://www.flighko.com",
              logo: {
                "@type": "ImageObject",
                url: "https://www.flighko.com/assets/og-default.png",
                width: 1200,
                height: 630,
              },
              description: "Flight comparison platform covering 35 routes across 200+ airlines with data-backed route guides.",
              // 2026-09-20: sameAs ties the Organization entity to real brand
              // profiles (Footer links) — Google uses this for knowledge panel /
              // brand entity confidence. 0-branded-traffic fix, root lever.
              sameAs: [
                "https://instagram.com/flighko",
                "https://tiktok.com/@flighko",
                "https://x.com/flighko",
              ],
            }),
          }}
        />
        {/* BreadcrumbList JSON-LD schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.flighko.com",
                },
              ],
            }),
          }}
        />
      </head>
      <body>{children}
        <Analytics />
      </body>
    </html>
  );
}
