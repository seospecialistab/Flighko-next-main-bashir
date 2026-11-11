// Quick sanity check for destinationRelatedPosts() — run with npx tsx (repo tsconfig paths).
import { destinationRelatedPosts } from "@/data/route-graph";

const cases = [
  ["hawaii", "best-time-to-visit-hawaii-2026"],
  ["bangkok", "cheapest-asian-destinations-2026"],
  ["dubai", "last-minute-flight-deals-2026"],
] as const;

let fails = 0;
for (const [dest, expected] of cases) {
  const posts = destinationRelatedPosts(dest);
  const hit = posts.find((p) => p.slug === expected);
  console.log(`\n${dest}: ${posts.length} related posts`);
  posts.slice(0, 3).forEach((p) => console.log(`  [${p.reason}] ${p.slug}`));
  if (!hit) {
    console.log(`  FAIL: expected "${expected}" in results`);
    fails++;
  } else {
    console.log(`  OK: contains expected "${expected}"`);
  }
}

// Coverage: how many of the 53 destinations get >=1 post?
import { destination as dests } from "@/data/destinations";
const withPosts: string[] = [];
const without: string[] = [];
for (const d of Object.values(dests)) {
  const n = destinationRelatedPosts(d.slug).length;
  (n > 0 ? withPosts : without).push(d.slug);
}
console.log(`\nDestinations with >=1 related post: ${withPosts.length}/${Object.keys(dests).length}`);
console.log(`Without (first 15): ${without.slice(0, 15).join(", ")}`);

// Dead-link check: every returned slug must exist in blog data
import { blogpost as posts } from "@/data/blog-posts";
const allSlugs = new Set(Object.keys(posts));
let dead = 0;
for (const d of Object.values(dests)) {
  for (const p of destinationRelatedPosts(d.slug, 999)) {
    if (!allSlugs.has(p.slug)) {
      console.log(`DEAD LINK: ${d.slug} -> ${p.slug}`);
      dead++;
    }
  }
}
console.log(`dead links: ${dead}`);
process.exit(fails + dead > 0 ? 1 : 0);
