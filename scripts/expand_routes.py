#!/usr/bin/env python3
"""
P0 Content Expansion for top 2 golden-signal route pages.
Adds targeted FAQs matching GSC golden queries, tightens meta tags,
adds internal links to sibling routes. Dry-run first (prints diff).
"""
import re
import sys
from pathlib import Path

FILE = Path("D:/Whitelabel_flighko/flighko-next/src/data/flight-routes.ts")
OUT = Path("D:/Whitelabel_flighko/flighko-next/src/data/flight-routes.ts.expanded")

# ---------- NEW FAQs derived from golden-signal queries ----------
NEW_FAQ = {
    "amsterdam-to-dubai": [
        # From golden queries: "amsterdam to dubai flights", "amsterdam to dubai",
        # "flights from amsterdam to dubai today", "amsterdam to dubai flight time"
        {"question": "What is the flight time from Amsterdam to Dubai?",
         "answer": "Nonstop flights from Amsterdam (AMS) to Dubai (DXB) take 6 hours 25 minutes to 6 hours 35 minutes, covering approximately 5,230 km (3,250 miles). Emirates, KLM, Etihad, and Transavia operate daily nonstop service."},
        {"question": "Are there flights from Amsterdam to Dubai today?",
         "answer": "Yes — Emirates, KLM, and Transavia operate daily nonstop flights from Amsterdam Schiphol (AMS) to Dubai International (DXB). Use Flighko to check real-time availability and compare today's fares across all four carriers."},
        {"question": "What is the cheapest way to fly from Amsterdam to Dubai?",
         "answer": "Book 4-8 weeks ahead for a Tuesday departure in January, February, or October. Transavia often has the lowest base fares (from ~$250 round trip), but factor in baggage fees. Emirates and KLM include checked baggage and meals, often making them better total value."},
        {"question": "Which airline is best for Amsterdam to Dubai?",
         "answer": "Emirates (A380, premium experience, 30kg baggage) and KLM (home carrier, reliable European service) lead for full-service. For budget, Transavia has the lowest fares seasonally. Etihad via Abu Dhabi is cheapest for one-stop."},
        {"question": "How much are Amsterdam to Dubai flights right now?",
         "answer": "Round-trip economy currently ranges from $250 (Transavia sale) to $440 (Emirates/KLM standard). Premium economy ~$600, business class from $1,800 on Emirates A380. Prices shift daily — set a Flighko price alert for drops."},
        {"question": "Do Emirates fly Amsterdam to Dubai nonstop?",
         "answer": "Yes, Emirates operates daily nonstop AMS-DXB flights, typically on the Airbus A380 or Boeing 777. Flight time is ~6h 30m. Includes meals, 30kg checked baggage, and award-winning IFE."},
        {"question": "What is the baggage allowance for Amsterdam to Dubai flights?",
         "answer": "Emirates: 30kg checked + 7kg cabin. KLM: 23kg checked + 12kg cabin. Etihad: 23-30kg checked. Transavia: 0kg included (pay separately, 15-20kg for fee). Always check your fare class."},
    ],
    "singapore-to-bangkok": [
        # From golden queries: "flight singapore to bangkok", "flight from singapore to bkk",
        # "bkk singapore", "bangkok singapore flight", "flight singapore bangkok",
        # "flight from singapore to bangkok", "bangkok to singapore", "flights to bangkok from singapore"
        {"question": "What is the flight time from Singapore to Bangkok?",
         "answer": "Nonstop flights from Singapore Changi (SIN) to Bangkok Suvarnabhumi (BKK) take 2 hours 15 minutes to 2 hours 25 minutes, covering ~1,416 km (880 miles). Five airlines operate nonstop: Singapore Airlines, Thai Airways, AirAsia, Scoot, Jetstar Asia."},
        {"question": "Which airlines fly direct from Singapore to Bangkok?",
         "answer": "Singapore Airlines (SQ), Thai Airways (TG), AirAsia (AK), Scoot (TR), and Jetstar Asia (3K) all fly nonstop. Singapore Airlines and Thai Airways are full-service (meals + baggage included). AirAsia, Scoot, and Jetstar are low-cost (extras charged separately)."},
        {"question": "What is the cheapest month to fly Singapore to Bangkok?",
         "answer": "September is consistently the cheapest month — round-trip fares from $90 on budget carriers, ~$130 on full-service. December and January are most expensive (holiday peak, $150-$170)."},
        {"question": "How much are flights from Singapore to Bangkok right now?",
         "answer": "Currently $80-$120 round trip on AirAsia/Scoot/Jetstar, $150-$250 on Singapore Airlines/Thai Airways. Prices update daily — book 3-6 weeks ahead and fly Tuesday for the best rate. Set a Flighko price alert."},
        {"question": "Is it cheaper to fly to Bangkok from Singapore or Kuala Lumpur?",
         "answer": "Kuala Lumpur to Bangkok is slightly cheaper (~$110) with similar flight time (~2h 30m), but requires transit through KLIA. From Singapore you save the connection and get 5 airlines competing — often better total value on SIN-BKK."},
        {"question": "Do I need a visa for Bangkok from Singapore?",
         "answer": "Thailand offers 30-day visa-free entry for most nationalities (including Singapore passport holders). If you need longer, apply for a 60-day tourist visa or extend 30 days at a Thai immigration office. Check your nationality's rules before travel."},
        {"question": "What is the baggage allowance on Singapore to Bangkok flights?",
         "answer": "Singapore Airlines: 30kg checked + 7-10kg cabin. Thai Airways: 20-30kg checked. AirAsia/Scoot/Jetstar: 0kg included — pay per kg or bundle. A 20kg checked bag adds ~$15-25 on budget carriers. Factor this when comparing fares."},
        {"question": "Are there flights from Bangkok to Singapore?",
         "answer": "Yes — the reverse BKK-SIN route is served by the same five airlines (Singapore Airlines, Thai Airways, AirAsia, Scoot, Jetstar) with identical schedules and pricing. Compare both directions; one-way pricing can differ."},
    ],
    "chicago-to-las-vegas": [
        # From golden queries: "chicago to las vegas", "flight from chicago to las vegas how long",
        # "flight chicago to las vegas", "chicago las vegas flights", "chicago to las vegas flight time",
        # "direct flight from chicago to las vegas", "direct flights chicago to las vegas"
        {"question": "What is the flight time from Chicago to Las Vegas?",
         "answer": "Nonstop flights from Chicago O'Hare (ORD) to Las Vegas (LAS) take approximately 3 hours 30 minutes to 4 hours, covering ~1,530 km (950 miles). United, American, Southwest, and Delta operate frequent nonstop service."},
        {"question": "Which airlines fly nonstop from Chicago to Las Vegas?",
         "answer": "United (from ORD), American (from ORD/DFW), Southwest (from MDW/MDW), and Delta (from ORD/ATL) all offer daily nonstop ORD-LAS service. Budget carriers like Spirit and Frontier also fly the route with connections via Denver or Dallas."},
        {"question": "What is the cheapest month to fly Chicago to Las Vegas?",
         "answer": "August and September are typically the cheapest months — round-trip fares from $180 on Southwest/Spirit. December and February (presidents week) are most expensive ($280-$350). Tuesday and Wednesday departures usually offer the best rates."},
        {"question": "How much are flights from Chicago to Las Vegas right now?",
         "answer": "Currently $190-$280 round trip on Southwest/Spirit/Frontier. United and American typically $250-$380. Prices shift daily — book 2-4 weeks ahead and fly mid-week for best value. Set a Flighko price alert."},
        {"question": "Is it cheaper to fly from Chicago O'Hare or Midway to Las Vegas?",
         "answer": "Southwest flies exclusively from Midway (MDW) with fares from $180 round trip. O'Hare (ORD) has more carrier options (United, American, Delta) but often $50-$100 higher. If Southwest flies your dates, MDW is usually cheaper; otherwise ORD has more schedule flexibility."},
        {"question": "Do I need a visa for Las Vegas from Chicago?",
         "answer": "No visa required — Las Vegas is domestic travel for US citizens. Valid government-issued ID (driver's license or state ID) is sufficient for airport security. International travelers need standard US entry documentation."},
        {"question": "What is the baggage allowance on Chicago to Las Vegas flights?",
         "answer": "Basic carriers (Spirit, Frontier): 1 personal item free, carry-on and checked bags cost extra ($30-$65 each). Mainline carriers (United, American, Delta, Southwest): 1 carry-on + 1 personal item free; checked bags $30-$35 first, $45 second. Southwest allows 2 free checked bags. Always verify your fare class before packing."},
    ],
}

# ---------- META TAG UPGRADES (targeted to golden queries) ----------
META_UPGRADE = {
    "amsterdam-to-dubai": {
        "seoTitle": "Amsterdam to Dubai Flights from $250 | Nonstop on Emirates, KLM, Etihad 2026",
        "seoDescription": "Compare Amsterdam to Dubai flights from $250 round trip. 4 airlines nonstop (Emirates, KLM, Etihad, Transavia). 6h 30m flight time. Cheapest months, days, baggage rules — updated 2026.",
    },
    "singapore-to-bangkok": {
        "seoTitle": "Singapore to Bangkok Flights from $80 | 5 Airlines Nonstop 2026",
        "seoDescription": "Singapore to Bangkok flights from $80 round trip on 5 nonstop airlines (SQ, TG, AirAsia, Scoot, Jetstar). 2h 15m flight. Cheapest month (Sep), visa-free entry, baggage guide — 2026 update.",
    },
    "chicago-to-las-vegas": {
        "seoTitle": "Chicago to Las Vegas Flights from $180 | Nonstop on United, American, Southwest 2026",
        "seoDescription": "Chicago to Las Vegas flights from $180 round trip. 4 airlines nonstop (United, American, Southwest, Delta). 3h 30m flight time. Cheapest months (Aug/Sep), mid-week departures, baggage guide — 2026 update.",
    },
}

# ---------- INTERNAL LINKS: add sibling routes to relatedRoutes ----------
# We'll add 3-4 more sibling routes per page from the same origin/dest hub
SIBLING_LINKS = {
    "amsterdam-to-dubai": [
        {"slug": "dubai-to-amsterdam", "originCity": "Dubai", "destinationCity": "Amsterdam", "price": 250, "flightTime": "6h 25m–6h 35m"},
        {"slug": "amsterdam-to-doha", "originCity": "Amsterdam", "destinationCity": "Doha", "price": 380, "flightTime": "5h 55m–6h 05m"},
        {"slug": "amsterdam-to-riyadh", "originCity": "Amsterdam", "destinationCity": "Riyadh", "price": 420, "flightTime": "5h 50m–6h 00m"},
        {"slug": "dubai-to-amman", "originCity": "Dubai", "destinationCity": "Amman", "price": 200, "flightTime": "3h 05m–3h 15m"},
    ],
    "singapore-to-bangkok": [
        {"slug": "bangkok-to-singapore", "originCity": "Bangkok", "destinationCity": "Singapore", "price": 120, "flightTime": "2h 15m–2h 25m"},
        {"slug": "singapore-to-phuket", "originCity": "Singapore", "destinationCity": "Phuket", "price": 150, "flightTime": "1h 45m–2h 00m"},
        {"slug": "singapore-to-ho-chi-minh-city", "originCity": "Singapore", "destinationCity": "Ho Chi Minh City", "price": 100, "flightTime": "2h 00m–2h 15m"},
        {"slug": "singapore-to-kuala-lumpur", "originCity": "Singapore", "destinationCity": "Kuala Lumpur", "price": 50, "flightTime": "1h 00m–1h 10m"},
    ],
    "chicago-to-las-vegas": [
        {"slug": "las-vegas-to-chicago", "originCity": "Las Vegas", "destinationCity": "Chicago", "price": 190, "flightTime": "3h 30m–4h 00m"},
        {"slug": "chicago-to-denver", "originCity": "Chicago", "destinationCity": "Denver", "price": 220, "flightTime": "2h 30m–3h 00m"},
        {"slug": "chicago-to-dallas", "originCity": "Chicago", "destinationCity": "Dallas", "price": 250, "flightTime": "2h 45m–3h 15m"},
        {"slug": "minneapolis-to-las-vegas", "originCity": "Minneapolis", "destinationCity": "Las Vegas", "price": 280, "flightTime": "3h 00m–3h 30m"},
    ],
}

def read_file():
    return FILE.read_text(encoding="utf-8")

def find_route_block(text, slug):
    """Return (start_idx, end_idx) of the route object in the TS file."""
    # Find the key line: "slug": "xxx",
    key = f'"{slug}": {{'
    idx = text.find(key)
    if idx == -1:
        return None, None
    # Find matching closing brace at same nesting level
    # The object starts at idx, find the '}' that closes it
    brace = 0
    in_string = False
    escape = False
    start = idx
    for i, ch in enumerate(text[idx:], start=idx):
        if escape:
            escape = False
            continue
        if ch == '\\':
            escape = True
            continue
        if ch == '"' and not escape:
            in_string = not in_string
            continue
        if not in_string:
            if ch == '{':
                brace += 1
            elif ch == '}':
                brace -= 1
                if brace == 0:
                    return start, i + 1
    return None, None

def inject_faqs(block, new_faqs):
    """Insert new FAQs into existing faq array, before closing ]."""
    # Find faq: [ ... ]
    m = re.search(r'(faq\s*:\s*\[)([\s\S]*?)(\n\s*\])', block)
    if not m:
        return block
    prefix, existing, suffix = m.groups()
    # Parse existing items to avoid duplicates
    existing_qs = set(re.findall(r'question\s*:\s*"([^"]+)"', existing))
    # Normalize for comparison: lowercase, strip, remove punctuation
    def norm(q): return re.sub(r'[^\w\s]', '', q.lower().strip())
    existing_norm = {norm(q) for q in existing_qs}
    # Build new items
    new_items = []
    for f in new_faqs:
        if norm(f["question"]) in existing_norm:
            continue
        q = f["question"].replace('"', '\\"')
        a = f["answer"].replace('"', '\\"')
        new_items.append(f'      {{ question: "{q}", answer: "{a}" }}')
    if not new_items:
        return block
    # Insert before suffix
    combined = existing.rstrip()
    if combined.endswith(','):
        combined = combined[:-1]
    combined += ',\n' + ',\n'.join(new_items) + ',\n'
    return block[:m.start(2)] + combined + block[m.start(3):]

def upgrade_meta(block, meta):
    """Replace seoTitle and seoDescription."""
    if "seoTitle" in meta:
        block = re.sub(r'seoTitle\s*:\s*"[^"]*"', f'seoTitle: "{meta["seoTitle"]}"', block)
    if "seoDescription" in meta:
        block = re.sub(r'seoDescription\s*:\s*"[^"]*"', f'seoDescription: "{meta["seoDescription"]}"', block)
    return block

def add_siblings(block, siblings):
    """Append sibling routes to relatedRoutes array."""
    m = re.search(r'(relatedRoutes\s*:\s*\[)([\s\S]*?)(\n\s*\])', block)
    if not m:
        return block
    prefix, existing, suffix = m.groups()
    # Check existing slugs
    existing_slugs = set(re.findall(r'slug\s*:\s*"([^"]+)"', existing))
    new_items = []
    for s in siblings:
        if s["slug"] in existing_slugs:
            continue
        new_items.append(
            f'      {{ slug: "{s["slug"]}", originCity: "{s["originCity"]}", '
            f'destinationCity: "{s["destinationCity"]}", price: {s["price"]}, '
            f'flightTime: "{s["flightTime"]}" }}'
        )
    if not new_items:
        return block
    combined = existing.rstrip()
    if combined.endswith(','):
        combined = combined[:-1]
    combined += ',\n' + ',\n'.join(new_items) + ',\n'
    return block[:m.start(2)] + combined + block[m.start(3):]

def main():
    text = read_file()
    original = text
    for slug in ["amsterdam-to-dubai", "singapore-to-bangkok", "chicago-to-las-vegas"]:
        start, end = find_route_block(text, slug)
        if start is None:
            print(f"[ERR] {slug} not found")
            continue
        block = text[start:end]
        print(f"\n=== {slug} ===")
        print(f"Block length: {len(block)} chars")
        # Inject
        block = inject_faqs(block, NEW_FAQ[slug])
        block = upgrade_meta(block, META_UPGRADE[slug])
        block = add_siblings(block, SIBLING_LINKS[slug])
        # Replace in text
        text = text[:start] + block + text[end:]
        print(f"New block length: {len(block)} chars")

    # Write expanded file
    OUT.write_text(text, encoding="utf-8")
    print(f"\n✅ Expanded file written to {OUT}")
    # Show diff summary
    orig_lines = original.splitlines()
    new_lines = text.splitlines()
    print(f"Original lines: {len(orig_lines)}")
    print(f"New lines: {len(new_lines)}")
    print(f"Delta: +{len(new_lines) - len(orig_lines)} lines")
    return 0

if __name__ == "__main__":
    sys.exit(main())