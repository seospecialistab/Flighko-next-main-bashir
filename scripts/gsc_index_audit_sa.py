#!/usr/bin/env python3
"""
GSC URL Inspection audit — keyless impersonation version.

WHY THIS EXISTS
The OAuth refresh-token flow kept dying: the token has a ~6-day lifetime, so it
expired weekly and gsc_refresh.py (which needs a LIVE refresh token) could not
recover it.

Key files are also not an option here: the Google Cloud organization enforces
`iam.disableServiceAccountKeyCreation` at the ORG level (since April 2026), so no
service-account JSON can be downloaded at all.

THE WORKING PATH — keyless impersonation
  A service account already exists and already holds siteOwner on the GSC
  property:
      flighko-indexing@flighko-gsc.iam.gserviceaccount.com
  We mint short-lived tokens FOR it via the IAM Credentials API, using the
  signed-in user's own gcloud Application Default Credentials.

REQUIREMENT (already granted)
  roles/iam.serviceAccountTokenCreator for the signed-in user on project
  flighko-gsc. Impersonation returns 403 without it.

USAGE:
  python gsc_index_audit_sa.py              # full audit
  python gsc_index_audit_sa.py --sample 10  # first 10 URLs
"""
import argparse
import json
import os
import re
import sys
import time
import urllib.request
import urllib.error
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
SECRETS = ROOT / ".secrets"
OUTPUT_DIR = ROOT / "gsc-reports"
OUTPUT_DIR.mkdir(exist_ok=True)

SITE_URL = "sc-domain:flighko.com"
TOKEN_URL = "https://oauth2.googleapis.com/token"
INSPECTION_API = "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect"
SITEMAP_URL = "https://www.flighko.com/sitemap.xml"

# Service account to impersonate (keyless). Override with GSC_SA_EMAIL.
SA_EMAIL = os.environ.get(
    "GSC_SA_EMAIL",
    "flighko-indexing@flighko-gsc.iam.gserviceaccount.com",
)
ADC_PATH = Path(os.path.expanduser("~/.config/gcloud/application_default_credentials.json"))
SA_SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/indexing",
]

MAX_WORKERS = 20
RATE_LIMIT_DELAY = 0.2


# --------------------------------------------------------------------------
# Credentials
# --------------------------------------------------------------------------

def _adc_token():
    """Get an access token from the signed-in user's gcloud Application Default Credentials."""
    if not ADC_PATH.exists():
        print(f"ERROR: no Application Default Credentials at {ADC_PATH}", file=sys.stderr)
        print("  Run:  gcloud auth application-default login", file=sys.stderr)
        sys.exit(2)
    adc = json.loads(ADC_PATH.read_text(encoding="utf-8"))
    body = urllib.parse.urlencode({
        "client_id": adc["client_id"],
        "client_secret": adc["client_secret"],
        "refresh_token": adc["refresh_token"],
        "grant_type": "refresh_token",
    }).encode()
    req = urllib.request.Request(
        TOKEN_URL, data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)["access_token"]
    except urllib.error.HTTPError as e:
        print(f"ADC refresh failed HTTP {e.code}: {e.read().decode()[:300]}", file=sys.stderr)
        print("  Run:  gcloud auth application-default login", file=sys.stderr)
        sys.exit(2)


def get_access_token():
    """Mint a short-lived token FOR the service account (keyless impersonation).

    No key file is used or needed — the Google Cloud org forbids SA key creation.
    Requires roles/iam.serviceAccountTokenCreator for the signed-in user.
    """
    user_token = _adc_token()
    url = (
        "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/"
        f"{SA_EMAIL}:generateAccessToken"
    )
    payload = {"scope": SA_SCOPES, "lifetime": "3600s"}
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode(), method="POST",
        headers={"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            out = json.load(resp)
        print(f"Impersonating: {SA_EMAIL}", file=sys.stderr)
        print(f"  token expires: {out.get('expireTime')}", file=sys.stderr)
        return out["accessToken"]
    except urllib.error.HTTPError as e:
        detail = e.read().decode("utf-8", errors="ignore")[:400]
        print(f"ERROR: impersonation failed HTTP {e.code}", file=sys.stderr)
        print(detail, file=sys.stderr)
        if e.code == 403:
            print("", file=sys.stderr)
            print("The signed-in user needs roles/iam.serviceAccountTokenCreator", file=sys.stderr)
            print(f"on project flighko-gsc for {SA_EMAIL}", file=sys.stderr)
            print("", file=sys.stderr)
            print("  https://console.cloud.google.com/iam-admin/iam?project=flighko-gsc", file=sys.stderr)
            print("  -> find your account -> Edit -> Add another role", file=sys.stderr)
            print("  -> 'Service Account Token Creator' -> Save", file=sys.stderr)
            print("", file=sys.stderr)
            print("IAM changes can take a minute or two to propagate.", file=sys.stderr)
        sys.exit(2)



# --------------------------------------------------------------------------
# Audit
# --------------------------------------------------------------------------

def fetch_sitemap_urls():
    """Collect page URLs, following a sitemap INDEX down to its child sitemaps.

    sitemap.xml is now an index (it references 4 child sitemaps by section), so a
    single-level fetch would return the child sitemap files rather than pages.
    """
    def locs(url):
        req = urllib.request.Request(url, headers={"User-Agent": "Flighko-SEO-Bot/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            return re.findall(r"<loc>([^<]+)</loc>", resp.read().decode("utf-8"))

    print(f"Fetching sitemap: {SITEMAP_URL}", file=sys.stderr)
    top = locs(SITEMAP_URL)

    urls = []
    for u in top:
        # A child sitemap ends in .xml and is not a page
        if u.endswith(".xml"):
            try:
                children = locs(u)
                print(f"  {u.rsplit('/', 1)[-1]}: {len(children)} URLs", file=sys.stderr)
                urls.extend(c for c in children if not c.endswith(".xml"))
            except Exception as e:
                print(f"  WARN: could not read {u}: {e}", file=sys.stderr)
        else:
            urls.append(u)

    print(f"Found {len(urls)} page URLs", file=sys.stderr)
    return urls


def inspect_url(token, url):
    body = json.dumps({
        "inspectionUrl": url,
        "siteUrl": SITE_URL,
        "languageCode": "en",
    }).encode()
    req = urllib.request.Request(
        INSPECTION_API,
        data=body,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        return {"error": True, "status": e.code, "detail": e.read().decode()[:400]}
    except Exception as e:
        return {"error": True, "status": 0, "detail": str(e)[:400]}


def parse_result(result, url):
    err = result.get("error", False)
    ir = result.get("inspectionResult", {}) or {}
    idx = ir.get("indexStatusResult", {}) or {}
    return {
        "url": url,
        "verdict": "ERROR" if err else idx.get("verdict", "UNKNOWN"),
        "indexed": (not err) and idx.get("verdict") == "PASS",
        "coverage_state": result.get("detail", "API_ERROR") if err else idx.get("coverageState", "UNKNOWN"),
        "last_crawl": idx.get("lastCrawlTime", "N/A"),
        "canonical_url": idx.get("canonicalUrl", "N/A"),
        "error": err,
        "error_detail": result.get("detail", "") if err else "",
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--sample", type=int, default=0, help="only first N URLs")
    args = ap.parse_args()

    token = get_access_token()
    urls = fetch_sitemap_urls()
    if args.sample:
        urls = urls[:args.sample]

    total = len(urls)
    print(f"\n=== GSC URL INSPECTION AUDIT (keyless impersonation) ===")
    print(f"URLs to inspect: {total}\n")

    results, errors, indexed, not_indexed = {}, 0, 0, 0
    states = {}
    started = datetime.now()

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as ex:
        futs = {ex.submit(inspect_url, token, u): u for u in urls}
        done = 0
        for f in as_completed(futs):
            u = futs[f]
            done += 1
            p = parse_result(f.result(), u)
            results[u] = p
            if p["error"]:
                errors += 1
                k = p["error_detail"][:80]
            elif p["indexed"]:
                indexed += 1
                k = None
            else:
                not_indexed += 1
                k = p["coverage_state"]
            if k:
                states[k] = states.get(k, 0) + 1
            mark = "OK" if p["indexed"] else ("!!" if p["error"] else "--")
            sys.stdout.write(f"\r[{done}/{total}] {mark} {u[:65]}...   ")
            sys.stdout.flush()
            time.sleep(RATE_LIMIT_DELAY)

    print("\n\n=== COVERAGE SUMMARY ===")
    print(f"Total:        {total}")
    print(f"Indexed:      {indexed}")
    print(f"Not indexed:  {not_indexed}")
    print(f"Errors:       {errors}")
    print(f"Elapsed:      {datetime.now() - started}")

    if states:
        print("\n=== NOT-INDEXED BREAKDOWN ===")
        for k, v in sorted(states.items(), key=lambda x: -x[1]):
            print(f"  {k}: {v}")

    date = datetime.now().strftime("%Y%m%d")
    out = OUTPUT_DIR / f"gsc-index-audit-{date}.json"
    out.write_text(json.dumps(results, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nSaved: {out}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
