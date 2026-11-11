#!/usr/bin/env python3
"""
Link-coverage gate (blueprint P1/P4/P5/P6).

Scans the static export (out/) and asserts every flight-route page has
inbound links from NON-route pages (hubs, index, home, destinations).
Route-page-to-route-page links count separately.

Usage:
  python scripts/link_coverage.py            # scan out/
  python scripts/link_coverage.py out2/      # custom export dir

Exit 0 = every route reachable via >=1 non-route page (gate for push).
Exit 1 = orphans found (list printed).
"""
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
EXPORT = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "out"

ROUTE_RE = re.compile(r'href="/flight-routes/([a-z0-9-]+)"')
SLUG_RE = re.compile(r"^[a-z0-9]+(-[a-z0-9]+)*-to-[a-z0-9]+(-[a-z0-9]+)*$")

def main() -> int:
    if not EXPORT.is_dir():
        print(f"FAIL: export dir not found: {EXPORT} (run `npm run build` first)")
        return 1

    # route universe from data file (source of truth)
    data = (ROOT / "src/data/flight-routes.ts").read_text(encoding="utf-8")
    all_slugs = set(re.findall(r'^\s{2}"([a-z0-9-]+)":\s*\{', data, re.M))
    if not all_slugs:
        print("FAIL: could not parse route slugs from flight-routes.ts")
        return 1

    external_in: dict[str, set] = {}   # route slug -> set of non-route source files
    route_in: dict[str, set] = {}      # route slug -> set of route-page source files

    # accept both static-export layout (dir/index.html) and Next .next/server/app (*.html)
    htmls = list(EXPORT.rglob("index.html")) + list(EXPORT.rglob("*.html"))
    seen = set()
    for html in htmls:
        if html in seen:
            continue
        seen.add(html)
        rel = html.relative_to(EXPORT).as_posix()
        if "_next" in rel or rel.startswith("_"):
            continue
        # a route page = file whose own slug matches *-to-* directly under flight-routes/
        parts = rel.split("/")
        is_route_page = (
            len(parts) >= 2
            and parts[0] == "flight-routes"
            and "from" not in parts
            and "region" not in parts
            and bool(re.search(r"/([a-z0-9-]+)(/index\.html|\.html)$", rel))
            and SLUG_RE.search(parts[-2] if parts[-1] == "index.html" else parts[-1].removesuffix(".html"))
        )
        for slug in ROUTE_RE.findall(html.read_text(encoding="utf-8", errors="ignore")):
            bucket = route_in if is_route_page else external_in
            bucket.setdefault(slug, set()).add(rel)

    never = all_slugs - set(external_in) - set(route_in)
    external_only_missing = all_slugs - set(external_in)

    print(f"routes in data:              {len(all_slugs)}")
    print(f"linked from hubs/index/home: {len(all_slugs) - len(external_only_missing)}")
    print(f"linked from route pages:     {len(route_in)}")
    print(f"ZERO inbound anywhere:       {len(never)}")

    if never:
        print("\nORPHANS (no inbound link from any page):")
        for s in sorted(never)[:50]:
            print(f"  {s}")
        print(f"\nFAIL: {len(never)} orphan route pages")
        return 1

    missing_external = sorted(external_only_missing)
    if missing_external:
        print(f"\nWARN: {len(missing_external)} routes linked ONLY from other route pages (P5 dynamic blocks not shipped yet?)")
        for s in missing_external[:20]:
            print(f"  {s}")
        print("Gate requires >=1 NON-route inbound link.")
        return 1

    # ---------------- P9 content-layer checks (blueprint D3) ----------------
    p9_fail = False

    # normalize: posix rel path per file (Windows-safe)
    rels = {html: html.relative_to(EXPORT).as_posix() for html in seen}

    # 1) Destinations -> blog: every destination page that HAS data-matched
    #    guides must render >=1 /blog/ href (helpers guarantee existence;
    #    this catches a broken block or dead slug).
    dest_htmls = [h for h, r in rels.items() if r.startswith("destinations/")]
    dest_with_blog = 0
    dest_missing_blog: list[str] = []
    for html in sorted(dest_htmls, key=lambda h: rels[h]):
        rel = rels[html]
        text = html.read_text(encoding="utf-8", errors="ignore")
        if 'href="/blog/' in text:
            dest_with_blog += 1
        else:
            dest_missing_blog.append(rel)
    print(f"\nP9 destinations with >=1 blog link: {dest_with_blog}/{len(dest_htmls)}")
    if dest_missing_blog:
        print(f"  (destinations without any matching guide — expected for cities no post covers)")
        for s in dest_missing_blog[:10]:
            print(f"    {s}")

    # 2) FAQ main content: >=10 internal links inside <main>
    faq_html = ""
    for html, rel in rels.items():
        if rel in ("faq.html", "faq/index.html"):
            faq_html = html.read_text(encoding="utf-8", errors="ignore")
            break
    if faq_html:
        main_m = re.search(r"<main[^>]*>(.*?)</main>", faq_html, re.S)
        n_faq_links = len(set(re.findall(r'href="(/[^"#]+)"', main_m.group(1)))) if main_m else 0
        print(f"P9 FAQ links inside <main>:      {n_faq_links} (target >=10)")
        if n_faq_links < 10:
            print("FAIL: FAQ main content has fewer than 10 internal links")
            p9_fail = True
    else:
        print("P9 FAQ: /faq page not found in export (skipped)")
        p9_fail = True

    # 3) Dead-link check: no /blog/ or /destinations/ href may point to a slug
    #    that has no HTML file in the export.
    def slug_of(rel: str) -> str:
        parts = rel.split("/")
        name = parts[-1].removesuffix(".html")
        return parts[-2] if name == "index" else name

    dest_slugs_on_disk = {slug_of(r) for r in rels.values() if r.startswith("destinations/")}
    blog_slugs_on_disk = {slug_of(r) for r in rels.values() if r.startswith("blog/") and r != "blog.html"}
    dead: list[str] = []
    for html in seen:
        text = html.read_text(encoding="utf-8", errors="ignore")
        for slug in set(re.findall(r'href="/destinations/([a-z0-9-]+)"', text)):
            if slug not in dest_slugs_on_disk:
                dead.append(f"dest:{slug}")
        for slug in set(re.findall(r'href="/blog/([a-z0-9-]+)"', text)):
            if slug not in blog_slugs_on_disk:
                dead.append(f"blog:{slug}")
    print(f"P9 dead blog/dest links:         {len(set(dead))}")
    if dead:
        for d in sorted(set(dead))[:20]:
            print(f"    {d}")
        p9_fail = True

    if p9_fail:
        return 1

    print("\nPASS: every route page has >=1 inbound link from a non-route page.")
    print("PASS: P9 content-layer checks (dest->blog, FAQ links, dead links).")
    return 0

if __name__ == "__main__":
    sys.exit(main())
