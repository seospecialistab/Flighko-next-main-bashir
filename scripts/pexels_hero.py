#!/usr/bin/env python3
"""
pexels_hero.py — fetch a licensed hero image from Pexels per Flighko route/blog.

Usage:
  python pexels_hero.py --query "beach travel" --slug flights-cairo-sharm --orientation landscape
  python pexels_hero.py --query "city skyline" --slug blog-top-10-europe --out src/data/images

Outputs JSON to stdout:
  { "slug": "...", "url": "<large src>", "alt": "...", "photographer": "...",
    "photographer_url": "...", "source_url": "...", "attribution": "Photo by X on Pexels" }

Key: read from env PEXELS_API_KEY (never hardcoded). Store the key in
D:\\Whitelabel_flighko\\flighko-knowledge\\pages\\Secrets & Locations.md (redacted).
Free tier: 200 req/hour. Exceeding -> 429.
"""
import argparse, json, os, sys, urllib.parse, urllib.request

API = "https://api.pexels.com/v1/search"


def fetch(query, per_page=5, orientation="landscape", page=1):
    key = os.environ.get("PEXELS_API_KEY")
    if not key:
        sys.exit("ERROR: set PEXELS_API_KEY env var (key from pexels.com/api)")
    qs = urllib.parse.urlencode({
        "query": query, "per_page": per_page,
        "orientation": orientation, "page": page,
    })
    req = urllib.request.Request(f"{API}?{qs}", headers={"Authorization": key})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        if e.code == 429:
            sys.exit("ERROR: Pexels rate limit (429) — wait or reduce calls")
        sys.exit(f"ERROR: Pexels HTTP {e.code}")


def pick(data):
    photos = data.get("photos") or []
    if not photos:
        return None
    p = photos[0]
    return {
        "id": p["id"],
        "url": p["src"]["large2x"] or p["src"]["large"],
        "alt": p.get("alt", ""),
        "photographer": p.get("photographer", ""),
        "photographer_url": p.get("photographer_url", ""),
        "source_url": p.get("url", ""),
        "attribution": f"Photo by {p.get('photographer','')} on Pexels",
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--query", required=True)
    ap.add_argument("--slug", default="")
    ap.add_argument("--orientation", default="landscape")
    ap.add_argument("--per-page", type=int, default=5)
    ap.add_argument("--out", default="")
    args = ap.parse_args()

    data = fetch(args.query, args.per_page, args.orientation)
    img = pick(data)
    if not img:
        sys.exit("ERROR: no photos found for query")
    img["slug"] = args.slug
    print(json.dumps(img, indent=2, ensure_ascii=False))

    if args.out:
        os.makedirs(args.out, exist_ok=True)
        path = os.path.join(args.out, f"{args.slug or 'hero'}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(img, f, indent=2, ensure_ascii=False)
        print(f"# saved -> {path}", file=sys.stderr)


if __name__ == "__main__":
    main()
