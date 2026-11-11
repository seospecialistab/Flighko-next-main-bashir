import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Redirect /flight-routes/*.html to /flight-routes/* (remove .html)
      { source: "/flight-routes/:slug.html", destination: "/flight-routes/:slug", permanent: true },
      // Redirect /blog/*.html to /blog/* (remove .html)
      { source: "/blog/:slug.html", destination: "/blog/:slug", permanent: true },
      // Redirect pruned blog posts to blog index
      { source: "/blog/airline-fees-guide-2026.html", destination: "/blog", permanent: true },
      { source: "/blog/airline-fees-guide-2026", destination: "/blog", permanent: true },
      // Redirect deleted error-fare-alerts page to live error-fares guide
      { source: "/blog/best-error-fare-alert-services-2026.html", destination: "/blog/error-fares-guide-2026", permanent: true },
      { source: "/blog/best-error-fare-alert-services-2026", destination: "/blog/error-fares-guide-2026", permanent: true },
      // 2026-10-01: /from/mal was a malformed slug — cityToSlug() deleted the
      // accented "é" in "Malé" instead of transliterating it. Fixed at source in
      // route-graph.ts; this redirect preserves any equity the old URL gathered.
      { source: "/flight-routes/from/mal", destination: "/flight-routes/from/male", permanent: true },
    ];
  },
};

export default nextConfig;