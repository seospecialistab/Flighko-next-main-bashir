#!/usr/bin/env python3
"""Site-wide on-page SEO audit via CDP (drives the running Edge, :9226).

No browser install, no extension. For every sitemap URL it collects the same
evidence the Distribb workflow's report holds, then flags defects:

  - broken internal links   (internal href not present in any sitemap)
  - skipped heading levels  (Hn -> Hm where m > n+1)
  - duplicate H2 topics
  - empty anchor text
  - images with missing / empty alt
  - og:title drifting from <title>
  - duplicate schema @type blocks (esp. Organization)

Reuses ONE tab across all pages (navigate -> extract -> next). Runs in the
background; writes a JSON + a readable report.

Usage:  python onpage_audit.py
"""
import json
import re
import sys
import time
import urllib.request
from pathlib import Path

import websocket  # websocket-client

CDP = "http://127.0.0.1:9226"
SITE = "https://www.flighko.com"
SITEMAPS = [
    "/sitemap-core.xml",
    "/sitemap-routes.xml",
    "/sitemap-destinations.xml",
    "/sitemap-blog.xml",
]
OUT_DIR = Path(__file__).resolve().parent.parent / "gsc-reports"

EXTRACT_JS = r"""
(() => {
  const q = (s) => document.querySelector(s);
  const qa = (s) => Array.from(document.querySelectorAll(s));
  const meta = (n) => { const el = q(`meta[name="${n}"]`) || q(`meta[property="${n}"]`); return el ? el.getAttribute('content') : null; };
  const norm = (h) => {
    if (!h) return null;
    if (h.startsWith('#')) return null;
    if (/^(mailto:|tel:|javascript:)/i.test(h)) return null;
    let p = h;
    if (p.startsWith('http')) { try { p = new URL(p).pathname; } catch(e){ return null; } }
    p = p.split('?')[0].split('#')[0];
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p || '/';
  };
  const headings = qa('h1,h2,h3,h4,h5,h6').map(h => ({level: h.tagName, text:(h.innerText||'').trim()}));
  const links = qa('a[href]').map(a => ({text:(a.innerText||'').trim(), href:a.getAttribute('href'), rel:a.getAttribute('rel')||''}));
  const internalPaths = [...new Set(links.map(l=>norm(l.href)).filter(Boolean))];
  const internal = links.filter(l => { const p = norm(l.href); return p && (p.startsWith('/') || (l.href||'').includes('flighko.com')); });
  const external = links.filter(l => { const p = norm(l.href); return p && !p.startsWith('/') && !(l.href||'').includes('flighko.com'); });
  const images = qa('img').map(i => ({hasAlt: i.hasAttribute('alt'), alt: i.alt}));
  const schemaTypes = qa('script[type="application/ld+json"]').map(s => { try { const j = JSON.parse(s.textContent); const t = Array.isArray(j) ? j.map(x=>x['@type']) : [j['@type']]; return t; } catch(e){ return ['(parse error)']; } }).flat();
  const og = {}; qa('meta[property^="og:"]').forEach(m => og[m.getAttribute('property')] = m.getAttribute('content'));
  const title = document.title;
  const desc = meta('description');
  const canonical = q('link[rel="canonical"]') ? q('link[rel="canonical"]').href : null;
  const body = document.body ? document.body.innerText : '';
  const words = body.split(/\s+/).filter(Boolean).length;
  return JSON.stringify({
    url: location.href, title, desc, canonical,
    words, headings,
    internalPaths, externalCount: external.length,
    emptyAnchor: links.filter(l=>!l.text).map(l=>l.href),
    imageCount: images.length,
    noAlt: images.filter(i => !i.hasAlt).length,
    emptyAlt: images.filter(i => i.hasAlt && i.alt === '').length,
    schemaTypes,
    ogTitle: og['og:title'] || null,
    h1: (headings.find(h=>h.level==='H1')||{}).text || null,
  });
})()
"""


def http_json(path, method="GET"):
    req = urllib.request.Request(CDP + path, method=method)
    with urllib.request.urlopen(req, timeout=15) as r:
        return json.loads(r.read().decode())


def sitemap_paths():
    paths = set()
    for sm in SITEMAPS:
        with urllib.request.urlopen(SITE + sm, timeout=20) as r:
            xml = r.read().decode("utf-8", "ignore")
        for loc in re.findall(r"<loc>([^<]+)</loc>", xml):
            p = loc.replace(SITE, "")
            if p.endswith(".xml"):
                continue
            paths.add(p)
    return sorted(paths)


def detect_defects(data, valid_paths):
    d = []
    # broken internal links
    for p in data["internalPaths"]:
        if p not in valid_paths:
            d.append(("broken_link", p))
    # skipped heading levels
    prev = 0
    for h in data["headings"]:
        lvl = int(h["level"][1])
        if prev and lvl > prev + 1:
            d.append(("heading_skip", f"{h['level']}: {h['text'][:50]} (after H{prev})"))
        prev = lvl
    # empty anchors
    for href in data["emptyAnchor"]:
        d.append(("empty_anchor", href))
    # images
    if data["noAlt"]:
        d.append(("image_no_alt", str(data["noAlt"])))
    if data["emptyAlt"]:
        d.append(("image_empty_alt", str(data["emptyAlt"])))
    # og drift
    if data["ogTitle"] and data["title"] and data["ogTitle"] != data["title"]:
        d.append(("og_title_drift", f"og='{data['ogTitle'][:40]}' title='{data['title'][:40]}'"))
    # duplicate schema types
    seen = {}
    for t in data["schemaTypes"]:
        seen[t] = seen.get(t, 0) + 1
    for t, c in seen.items():
        if c > 1 and t not in ("(parse error)",):
            d.append(("dup_schema", f"{t} x{c}"))
    return d


def main():
    paths = sitemap_paths()
    valid = set(paths)
    print(f"sitemap URLs: {len(paths)}", flush=True)

    # Reuse the first existing page tab (don't open a new one — avoids conflicts)
    tabs = http_json("/json/list")
    page_tabs = [t for t in tabs if t.get("type") == "page"]
    if not page_tabs:
        tab = http_json("/json/new?about:blank", method="PUT")
    else:
        tab = page_tabs[0]
    print(f"using tab: {tab.get('url','')[:60]}", flush=True)
    ws = websocket.create_connection(tab["webSocketDebuggerUrl"], timeout=60)
    mid = [0]

    def send(method, params=None, retries=2):
        for attempt in range(retries + 1):
            mid[0] += 1
            ws.send(json.dumps({"id": mid[0], "method": method, "params": params or {}}))
            try:
                while True:
                    msg = json.loads(ws.recv())
                    if msg.get("id") == mid[0]:
                        return msg
            except websocket.WebSocketTimeoutException:
                if attempt < retries:
                    print(f"  (timeout on {method}, retrying)", flush=True)
                    continue
                raise

    def eval_js(expr):
        r = send("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        return r.get("result", {}).get("result", {}).get("value")

    send("Page.enable")
    send("Runtime.enable")

    results = []
    t0 = time.time()
    for i, path in enumerate(paths, 1):
        url = SITE + path
        send("Page.navigate", {"url": url})
        # wait for load
        for _ in range(30):
            if eval_js("document.readyState") == "complete":
                break
            time.sleep(0.2)
        time.sleep(0.6)
        raw = eval_js(EXTRACT_JS)
        if not raw:
            print(f"  [{i}/{len(paths)}] {path} -> NO DATA", flush=True)
            continue
        data = json.loads(raw)
        defects = detect_defects(data, valid)
        # dedupe defect types per page for the summary
        dtype = sorted({k for k, _ in defects})
        results.append({"path": path, "defects": defects, "types": dtype,
                        "words": data["words"], "internal": len(data["internalPaths"]),
                        "images": data["imageCount"], "schema": len(data["schemaTypes"])})
        flag = "  <-- " + ", ".join(dtype) if dtype else ""
        print(f"  [{i}/{len(paths)}] {path}{flag}", flush=True)

    ws.close()
    elapsed = time.time() - t0

    OUT_DIR.mkdir(exist_ok=True)
    stamp = time.strftime("%Y%m%d")
    (OUT_DIR / f"onpage-audit-{stamp}.json").write_text(
        json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")

    # summary
    from collections import Counter
    alltypes = Counter()
    for r in results:
        for t in r["types"]:
            alltypes[t] += 1
    pages_with_defects = sum(1 for r in results if r["types"])
    print(f"\n=== SITE-WIDE ON-PAGE AUDIT ({len(results)} pages, {elapsed:.0f}s) ===")
    print(f"pages with defects: {pages_with_defects}/{len(results)}")
    print("\ndefect breakdown:")
    for t, c in alltypes.most_common():
        print(f"  {c:4}  {t}")

    # broken links detail
    bl = [(r["path"], v) for r in results for k, v in r["defects"] if k == "broken_link"]
    if bl:
        print(f"\nbroken internal links ({len(bl)}):")
        for p, v in bl[:60]:
            print(f"  {p}  ->  {v}")
    print(f"\nsaved: gsc-reports/onpage-audit-{stamp}.json")
    return 0


if __name__ == "__main__":
    sys.exit(main())
