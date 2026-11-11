#!/usr/bin/env python3
"""
GSC URL Inspection API (v1) — full coverage audit.

Inspects ALL URLs from the live sitemap.xml (451 URLs expected)
and categorizes them by index status.

Rate limit: GSC URL Inspection API = 600 queries per minute (user-rate limit).
We use a 100 concurrent thread pool with 0.2s spacing, ~200 QPM, safe.

Output:
  - flighko-next/gsc-index-audit-<date>.json  (full results)
  - flighko-next/gsc-coverage-summary-<date>.txt (human-readable summary)

Usage:
  python gsc_index_audit.py
  python gsc_index_audit.py --sample 50    # only first 50 URLs
"""
import json
import re
import sys
import time
import urllib.request
import urllib.error
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

ROOT = Path(__file__).parent.parent
SECRETS = ROOT / ".secrets"
TOKEN_FILE = SECRETS / "gsc-token.json"
OUTPUT_DIR = ROOT / "gsc-reports"
OUTPUT_DIR.mkdir(exist_ok=True)

SITE_URL = "sc-domain:flighko.com"
INSPECTION_API = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"

# GSC URL Inspection API quota: 600/min. We keep well under that.
MAX_WORKERS = 50
RATE_LIMIT_DELAY = 0.15  # seconds between submissions per worker


def load_token():
    with open(TOKEN_FILE, "r") as f:
        return json.load(f)


def get_access_token():
    token = load_token()
    # Check expiry
    expires_at = token.get("expires_at", 0)
    if time.time() > expires_at - 60:
        print("Token expired or about to expire, refreshing...", file=sys.stderr)
        token = refresh_token(token)
    return token["access_token"]


def refresh_token(old_token):
    """Refresh the OAuth token using the refresh token."""
    creds_file = SECRETS / "client_secret_2_536561629160-dbr4dmt1vnustmd0oienqmfktcml9hju.apps.googleusercontent.com.json"
    with open(creds_file, "r") as f:
        creds = json.load(f)
    client_id = creds["installed"]["client_id"]
    client_secret = creds["installed"]["client_secret"]
    refresh_tok = old_token.get("refresh_token")

    data = urllib.parse.urlencode({
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_tok,
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        new_token = json.load(resp)
    new_token["refresh_token"] = refresh_tok
    new_token["expires_at"] = time.time() + new_token.get("expires_in", 3600)
    with open(TOKEN_FILE, "w") as f:
        json.dump(new_token, f, indent=2)
    return new_token


def fetch_sitemap_urls():
    """Fetch all URLs from the live sitemap.xml."""
    sitemap_url = "https://www.flighko.com/sitemap.xml"
    print(f"Fetching sitemap: {sitemap_url}", file=sys.stderr)
    try:
        req = urllib.request.Request(sitemap_url, headers={"User-Agent": "Flighko-SEO-Bot/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read().decode("utf-8")
    except Exception as e:
        print(f"Failed to fetch sitemap: {e}", file=sys.stderr)
        sys.exit(1)

    urls = re.findall(r"<loc>([^<]+)</loc>", content)
    print(f"Found {len(urls)} URLs in sitemap", file=sys.stderr)
    return urls


def inspect_url(access_token, url, site_url=SITE_URL):
    """Inspect a single URL via GSC URL Inspection API v1."""
    body = {
        "inspectionUrl": url,
        "siteUrl": site_url,
        "languageCode": "en",
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        INSPECTION_API,
        data=data,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        return {
            "error": True,
            "status": e.code,
            "detail": error_body[:500],
        }
    except Exception as e:
        return {"error": True, "status": 0, "detail": str(e)[:500]}


def parse_result(result, url):
    """Parse the inspection result into a structured dict."""
    if "error" in result:
        verdict = "ERROR"
        coverage_state = result.get("detail", "API_ERROR")
    else:
        ir = result.get("inspectionResult", {})
        index_status = ir.get("indexStatusResult", {})
        verdict = index_status.get("verdict", "UNKNOWN")
        coverage_state = index_status.get("coverageState", "UNKNOWN")

    is_indexed = verdict == "PASS"
    return {
        "url": url,
        "verdict": verdict,
        "indexed": is_indexed,
        "coverage_state": coverage_state,
        "last_crawl": ir.get("lastCrawlTime", "N/A") if not result.get("error") else "N/A",
        "canonical_url": ir.get("canonicalUrl", "N/A") if not result.get("error") else "N/A",
        "mobile_usability": ir.get("mobileUsabilityResult", {}).get("verdict", "N/A") if not result.get("error") else "N/A",
        "rich_results": ir.get("richResultsResult", {}).get("verdict", "N/A") if not result.get("error") else "N/A",
        "error": result.get("error", False),
        "error_detail": result.get("detail", "") if result.get("error") else "",
    }


def main():
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--sample", type=int, default=0, help="Only inspect first N URLs")
    args = parser.parse_args()

    access_token = get_access_token()
    urls = fetch_sitemap_urls()

    if args.sample > 0:
        urls = urls[:args.sample]

    total = len(urls)
    print(f"\n=== GSC URL INSPECTION AUDIT ===")
    print(f"Total URLs to inspect: {total}")
    print(f"Workers: {MAX_WORKERS}, rate limit delay: {RATE_LIMIT_DELAY}s\n")

    results = {}
    completed = 0
    errors = 0
    indexed = 0
    not_indexed = 0
    error_states = {}

    started = datetime.now()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_url = {
            executor.submit(inspect_url, access_token, url): url for url in urls
        }
        for future in as_completed(future_to_url):
            url = future_to_url[future]
            completed += 1
            try:
                raw = future.result()
                parsed = parse_result(raw, url)
                results[url] = parsed

                if parsed["error"]:
                    errors += 1
                    state = parsed.get("error_detail", "UNKNOWN")[:80]
                    error_states[state] = error_states.get(state, 0) + 1
                elif parsed["indexed"]:
                    indexed += 1
                else:
                    not_indexed += 1
                    state = parsed.get("coverage_state", "UNKNOWN")
                    error_states[state] = error_states.get(state, 0) + 1

                # Progress
                pct = int(completed / total * 100)
                status = "✓" if parsed["indexed"] else "—" if not parsed["error"] else "⚠"
                sys.stdout.write(f"\r[{completed}/{total}] {pct}% {status} {url[:70]}...  ")
                sys.stdout.flush()
                time.sleep(RATE_LIMIT_DELAY)
            except Exception as e:
                completed += 1
                errors += 1
                results[url] = {"url": url, "error": True, "detail": str(e)[:200]}
                sys.stdout.write(f"\r[{completed}/{total}] ⚠ {url[:70]} (exception)  ")
                sys.stdout.flush()

    elapsed = datetime.now() - started

    # Print summary
    print("\n\n=== COVERAGE SUMMARY ===")
    print(f"Total URLs:     {total}")
    print(f"Indexed (PASS): {indexed}")
    print(f"Not indexed:    {not_indexed}")
    print(f"Errors:         {errors}")
    print(f"Time:           {elapsed}")

    print("\n=== NOT-INDEXED BREAKDOWN ===")
    for state, count in sorted(error_states.items(), key=lambda x: -x[1]):
        pct = f" ({count/not_indexed*100:.0f}%)" if not_indexed > 0 else ""
        print(f"  {state}: {count}{pct}")

    # Save detailed results
    date_str = datetime.now().strftime("%Y%m%d")
    json_file = OUTPUT_DIR / f"gsc-index-audit-{date_str}.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

    txt_file = OUTPUT_DIR / f"gsc-coverage-summary-{date_str}.txt"
    with open(txt_file, "w", encoding="utf-8") as f:
        f.write("=== GSC URL INSPECTION COVERAGE AUDIT ===\n")
        f.write(f"Generated: {datetime.now().isoformat()}\n")
        f.write(f"URLs inspected: {total}\n")
        f.write(f"Indexed (PASS): {indexed}\n")
        f.write(f"Not indexed: {not_indexed}\n")
        f.write(f"Errors: {errors}\n\n")
        f.write("=== NOT-INDEXED BREAKDOWN ===\n")
        for state, count in sorted(error_states.items(), key=lambda x: -x[1]):
            f.write(f"  {state}: {count}\n")
        f.write("\n=== NOT-INDEXED URLS (top 50) ===\n")
        not_idx = [r for r in results.values() if not r.get("indexed", False) and not r.get("error")]
        for r in sorted(not_idx, key=lambda x: x.get("coverage_state", ""))[:50]:
            f.write(f"  [{r['coverage_state']}] {r['url']}\n")

    print(f"\nFull JSON: {json_file}")
    print(f"Summary:  {txt_file}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
