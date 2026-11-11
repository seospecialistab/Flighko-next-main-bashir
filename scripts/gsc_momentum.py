#!/usr/bin/env python3
"""
GSC momentum check: find pages that went from 0 impressions to 50+
between two 28-day windows, with position <= 30.
"""
import json
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SECRETS = ROOT / ".secrets"
TOKEN_FILE = SECRETS / "gsc-token.json"
SITE = "sc-domain:flighko.com"

def load_token():
    with open(TOKEN_FILE, "r") as f:
        return json.load(f)["access_token"]

def query_gsc(access_token, site, start_date, end_date):
    url = "https://www.googleapis.com/webmasters/v3/sites/" + urllib.parse.quote(site, safe="") + "/searchAnalytics/query"
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": ["page"],
        "rowLimit": 20000,
        "aggregationType": "byPage",
        "sortOrder": "DESCENDING",
        "sort": "impressions"
    }
    data = json.dumps(body).encode()
    req = urllib.request.Request(url, data=data, headers={
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    })
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}")
        return None

# Date ranges
today = datetime(2026, 9, 25)
last_28_end = today - timedelta(days=1)   # Sep 24
last_28_start = last_28_end - timedelta(days=27)  # Aug 28
prev_28_end = last_28_start - timedelta(days=1)   # Aug 27
prev_28_start = prev_28_end - timedelta(days=27)  # Jul 31

print(f"Last 28 days: {last_28_start.strftime('%Y-%m-%d')} to {last_28_end.strftime('%Y-%m-%d')}")
print(f"Previous 28 days: {prev_28_start.strftime('%Y-%m-%d')} to {prev_28_end.strftime('%Y-%m-%d')}")

token = load_token()
print(f"Token loaded, expiry check...")

# Get last 28 days data
print("\n=== Fetching last 28 days ===")
data1 = query_gsc(token, SITE, last_28_start.strftime("%Y-%m-%d"), last_28_end.strftime("%Y-%m-%d"))
if not data1:
    print("FAILED to get last 28 days data")
    exit(1)

rows1 = data1.get("rows", [])
print(f"Got {len(rows1)} rows for last 28 days")

# Build impression map for last 28 days
impressions1 = {}
positions1 = {}
for row in rows1:
    page = row.get("keys", [""])[0] if row.get("keys") else ""
    impressions1[page] = row.get("impressions", 0)
    positions1[page] = row.get("position", 0)

# Get previous 28 days data
print("\n=== Fetching previous 28 days ===")
data2 = query_gsc(token, SITE, prev_28_start.strftime("%Y-%m-%d"), prev_28_end.strftime("%Y-%m-%d"))
if not data2:
    print("FAILED to get previous 28 days data")
    exit(1)

rows2 = data2.get("rows", [])
print(f"Got {len(rows2)} rows for previous 28 days")

# Build impression map for previous 28 days
impressions2 = {}
for row in rows2:
    page = row.get("keys", [""])[0] if row.get("keys") else ""
    impressions2[page] = row.get("impressions", 0)

# Find momentum pages: 0 -> 50+ impressions, position <= 30
print("\n=== MOMENTUM PAGES (0 -> 50+ impressions, position <= 30) ===")
momentum = []
for page, imp1 in impressions1.items():
    imp2 = impressions2.get(page, 0)
    pos = positions1.get(page, 999)
    if imp2 <= 5 and imp1 >= 50 and pos <= 30:
        momentum.append((page, imp2, imp1, pos))

momentum.sort(key=lambda x: -x[2])  # sort by last 28d impressions desc

if momentum:
    print(f"\nFound {len(momentum)} momentum pages:\n")
    print(f"{'Page':<70} {'Prev 28d':>10} {'Last 28d':>10} {'Position':>10}")
    print("-" * 100)
    for page, prev, last, pos in momentum:
        print(f"{page:<70} {prev:>10} {last:>10} {pos:>10.1f}")
else:
    print("\nNo momentum pages found (0 -> 50+ with position <= 30).")

# Also show top pages by impressions for context
output_lines = []
output_lines.append("\n=== TOP 30 PAGES BY IMPRESSIONS (last 28 days) ===")
top = sorted(impressions1.items(), key=lambda x: -x[1])[:30]
for page, imp in top:
    pos = positions1.get(page, 0)
    prev = impressions2.get(page, 0)
    output_lines.append(f"{page:<70} {imp:>10} pos={pos:>6.1f}  prev={prev:>10}")

output_text = "\n".join(output_lines)
print(output_text)
report_file = ROOT / ".tmp-gsc-momentum-report.txt"
with open(report_file, "w") as f:
    f.write(output_text)
print(f"\nReport written to {report_file}")
