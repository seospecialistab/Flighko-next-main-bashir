#!/usr/bin/env python3
"""
GSC Search Analytics report using REST API directly (no google libs needed).
Uses the refreshed token from .secrets/gsc-token.json
"""
import json
import sys
import urllib.request
import urllib.parse
from datetime import datetime, timedelta
from pathlib import Path

ROOT = Path(__file__).parent.parent
SECRETS = ROOT / ".secrets"
TOKEN_FILE = SECRETS / "gsc-token.json"

def load_token():
    with open(TOKEN_FILE, "r") as f:
        return json.load(f)

def get_token():
    token = load_token()
    # Token should be valid now (we just refreshed)
    return token["access_token"]

def query_search_analytics(access_token, site_url, start_date, end_date, dimensions=None, row_limit=1000):
    """Query GSC Search Analytics API via REST."""
    # Search Analytics is under webmasters/v3, NOT v1
    url = "https://www.googleapis.com/webmasters/v3/sites/" + urllib.parse.quote(site_url, safe="") + "/searchAnalytics/query"
    
    body = {
        "startDate": start_date,
        "endDate": end_date,
        "dimensions": dimensions or ["query", "page"],
        "rowLimit": row_limit,
        "aggregationType": "byPage"
    }
    
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        error_body = e.read().decode()
        print(f"HTTP {e.code}: {error_body}", file=sys.stderr)
        return None

def main():
    # Last 28 days
    end_date = datetime.now().date() - timedelta(days=1)  # GSC data lags by ~1 day
    start_date = end_date - timedelta(days=27)
    
    site_url = "sc-domain:flighko.com"
    
    print(f"Querying GSC for {site_url}")
    print(f"Date range: {start_date} to {end_date}")
    
    token = get_token()
    result = query_search_analytics(
        token,
        site_url,
        start_date.isoformat(),
        end_date.isoformat(),
        dimensions=["query", "page"],
        row_limit=1000
    )
    
    if not result:
        print("Failed to get data")
        return 1
    
    rows = result.get("rows", [])
    print(f"\nTotal rows: {len(rows)}")
    
    # Sort by impressions descending
    rows.sort(key=lambda r: r.get("impressions", 0), reverse=True)
    
    print("\n=== TOP 50 QUERIES BY IMPRESSIONS ===")
    print(f"{'Impressions':>12} {'Clicks':>8} {'CTR':>8} {'Pos':>6}  Query")
    print("-" * 80)
    
    golden_signals = []
    for row in rows[:50]:
        clicks = row.get("clicks", 0)
        impressions = row.get("impressions", 0)
        ctr = row.get("ctr", 0) * 100
        position = row.get("position", 0)
        keys = row.get("keys", [])
        query = keys[0] if keys else "N/A"
        page = keys[1] if len(keys) > 1 else "N/A"
        
        print(f"{impressions:>12} {clicks:>8} {ctr:>7.2f}% {position:>5.1f}  {query[:60]}")
        
        # Golden signal: impressions >= 20, clicks == 0
        if impressions >= 20 and clicks == 0:
            golden_signals.append({
                "query": query,
                "page": page,
                "impressions": impressions,
                "position": position
            })
    
    print(f"\n=== GOLDEN SIGNALS (impr>=20, 0 clicks): {len(golden_signals)} ===")
    for gs in golden_signals[:20]:
        print(f"  {gs['impressions']:>4} impr | pos {gs['position']:>4.1f} | {gs['query'][:60]} -> {gs['page']}")
    
    # Save raw result
    out_file = ROOT / f"gsc-report-{datetime.now().strftime('%Y%m%d')}.json"
    with open(out_file, "w") as f:
        json.dump(result, f, indent=2)
    print(f"\nFull report saved to {out_file}")
    
    return 0

if __name__ == "__main__":
    sys.exit(main())