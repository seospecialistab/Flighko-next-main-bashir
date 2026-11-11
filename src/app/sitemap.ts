import type { MetadataRoute } from "next";
import { flightRoutes } from "@/data/flight-routes";
import { blogpost as blogPosts } from "@/data/blog-posts";
import { destination as destinations } from "@/data/destinations";
import { regions } from "@/data/route-graph";
import fs from "fs";
import path from "path";

const BASE_URL = "https://www.flighko.com";

// Real lastmod = latest mtime across content data files.
function latestMtime(...files: string[]): string {
  let latest = 0;
  for (const f of files) {
    const fp = path.resolve("src/data", f);
    try {
      const m = fs.statSync(fp).mtimeMs;
      if (m > latest) latest = m;
    } catch {
      // file missing — skip, don't crash the sitemap
    }
  }
  return new Date(latest).toISOString();
}

const CONTENT_UPDATED = latestMtime(
  "flight-routes.ts",
  "blog-posts.ts",
  "destinations.ts",
  "route-regions.json",
  "route-graph.ts",
);

// Sitemap index — references static child sitemaps in public/.
// Static files are generated at build time by scripts/generate-sitemaps.mjs.
// Submitting each child separately in GSC gives section-level indexing data.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = CONTENT_UPDATED;

  return [
    { url: `${BASE_URL}/sitemap-core.xml`, lastModified: now },
    { url: `${BASE_URL}/sitemap-routes.xml`, lastModified: now },
    { url: `${BASE_URL}/sitemap-destinations.xml`, lastModified: now },
    { url: `${BASE_URL}/sitemap-blog.xml`, lastModified: now },
  ];
}