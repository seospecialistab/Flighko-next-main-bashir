#!/usr/bin/env python3
"""
Inject 7 FAQ HTML sections into Prague's content field.
Pattern matches existing destinations (Rio, Orlando, Hawaii): each FAQ is a
<section class="section st-border"> with <span class="tag">FAQs</span>.
"""
from pathlib import Path

d = Path("D:/Whitelabel_flighko/flighko-next/src/data/destinations.ts").read_text(encoding="utf-8")

i = d.find('"prague": {')
j = d.find('"punta-cana": {', i)
seg = d[i:j]

# Find the content field: content: "....",
# The content value is a TS string with escaped quotes (\" for ") and \n for newlines
content_marker = 'content: "'
cs = seg.find(content_marker)
assert cs >= 0, "content field not found"

# Content starts after 'content: "'
html_start = cs + len(content_marker)
pos = html_start
while pos < len(seg):
    if seg[pos] == '\\' and pos + 1 < len(seg) and seg[pos + 1] == '"':
        pos += 2
        continue
    if seg[pos] == '"':
        break
    pos += 1
else:
    raise RuntimeError("content field never closes")

# Raw TS source of the content value
content_raw_ts = seg[html_start:pos]

# Unescape to get actual HTML
html = content_raw_ts.replace('\\"', '"').replace('\\n', '\n').replace('\\t', '\t').replace('\\\\', '\\')

# Build FAQ HTML sections (matching the pattern from other destinations)
# Insert BEFORE the last </section>
last_section_end = html.rfind('</section>')
assert last_section_end >= 0, "no </section> in content"

faq_html = """<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>How much does a round-trip flight to Prague cost?</h2></div>
<div class="ct"><p>Round-trip flights to Prague start from $430 in 2026. Prices vary by season and departure city. Book April-May or September-October for the best deals. Budget carriers often offer fares 20-30% lower than full-service airlines.</p></div>
</section>
<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>What is the best time of year to visit Prague?</h2></div>
<div class="ct"><p>The best time to visit Prague is spring (April-May) and early autumn (September-October) — mild temperatures, fewer crowds, and good flight prices. Summer is warm but busy; winter is cold but cheapest, with Christmas markets adding charm in December.</p></div>
</section>
<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>Do I need a visa to visit Prague, Czech Republic?</h2></div>
<div class="ct"><p>Visa requirements depend on your nationality. US, UK, Canadian, Australian, and most EU passport holders can enter visa-free for stays up to 90 days (Schengen Area). Check the latest entry requirements on the official Czech Republic immigration website before booking, as policies can change.</p></div>
</section>
<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>How many days should I spend in Prague?</h2></div>
<div class="ct"><p>A minimum of 3-4 days is recommended for Prague to explore the Old Town, Charles Bridge, Prague Castle, and Jewish Quarter without rushing. For a more relaxed pace or to take day trips to Cesky Krumlov or Kutna Hora, plan for 5-7 days. Prague offers plenty to see and do for longer stays.</p></div>
</section>
<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>Is Prague expensive for tourists?</h2></div>
<div class="ct"><p>Prague can be affordable or upscale depending on your choices. Flights start from $430 round trip. Daily costs vary. Budget travelers can expect to spend 50-80 EUR per day, mid-range 120-200 EUR, and luxury 300+ EUR. Prague is significantly cheaper than Paris, London, or Amsterdam — a half-liter of Pilsner Urquell costs under 2 EUR at local pubs.</p></div>
</section>
<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>When is the cheapest time to fly to Prague?</h2></div>
<div class="ct"><p>The cheapest time to fly to Prague is April-May and September-October. These shoulder seasons have the lowest fares, with round trips from many European cities dropping under $350. Mid-week Tuesday and Wednesday departures are consistently 20-30% cheaper than weekend flights, and the cheapest flights to Prague typically appear 4-8 weeks before departure for European routes.</p></div>
</section>
<section class="section st-border">
<div class="sh"><span class="tag">FAQs</span><h2>How do I get from Prague Airport (PRG) to the city center?</h2></div>
<div class="ct"><p>Prague Airport (Václav Havel Airport PRG) is located about 10 km northwest of the city center. The Airport Express bus takes 15 minutes to the main train station (~250 CZK). Public bus line 119 to Náměstí Republiky + Metro Line A takes approximately 30 minutes (~30 CZK). Rideshare takes 20-30 minutes and costs 400-700 CZK. The metro does not connect directly to the airport.</p></div>
</section>"""

new_html = html[:last_section_end] + faq_html + html[last_section_end:]

# Re-escape for TS source
new_content_ts = new_html.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

print(f"Original content: {len(content_raw_ts)} chars (TS)")
print(f"New content:      {len(new_content_ts)} chars (TS)")
print(f"FAQ sections added: 7")
print(f"New section st-border count in HTML: {new_html.count('section st-border')}")

# Replace in the full file
full_old = d[i + cs:i + pos + 1]  # includes 'content: "' ... '"'
new_val = 'content: "' + new_content_ts + '"'
d_new = d[:i + cs] + new_val + d[i + pos + 1:]

Path("D:/Whitelabel_flighko/flighko-next/src/data/destinations.ts").write_text(d_new, encoding="utf-8")

# Verify
d2 = Path("D:/Whitelabel_flighko/flighko-next/src/data/destinations.ts").read_text(encoding="utf-8")
i2 = d2.find('"prague": {')
j2 = d2.find('"punta-cana": {', i2)
seg2 = d2[i2:j2]
cs2 = seg2.find('content: "')
start2 = cs2 + len('content: "')
pos2 = start2
while pos2 < len(seg2):
    if seg2[pos2] == '\\' and pos2 + 1 < len(seg2) and seg2[pos2 + 1] == '"':
        pos2 += 2
        continue
    if seg2[pos2] == '"':
        break
    pos2 += 1
else:
    raise RuntimeError("content field never closes in verified file")

raw2 = seg2[start2:pos2]
html2 = raw2.replace('\\"', '"').replace('\\n', '\n')
faq_count = html2.count('<span class="tag">FAQs</span>')
stb_count = html2.count('section st-border')
print(f"\nVerification:")
print(f"  Content field closes properly: yes")
print(f"  Content length (TS): {len(raw2)} chars")
print(f"  Content length (HTML): {len(html2)} chars")
print(f"  FAQ sections in content: {faq_count}")
print(f"  section st-border count: {stb_count}")
print(f"  Has faq data field: {'faq: [' in seg2}")