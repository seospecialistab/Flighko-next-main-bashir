#!/usr/bin/env python3
"""Idempotent: inject 7 FAQ HTML sections into Prague's content field."""
import re
from pathlib import Path

PATH = "D:/Whitelabel_flighko/flighko-next/src/data/destinations.ts"
d = Path(PATH).read_text(encoding="utf-8")

i = d.find('"prague": {')
j = d.find('"punta-cana": {', i)
seg = d[i:j]

FAQUOTE = '<span class="tag">FAQs</span>'

# Find content value boundaries in TS source
ci = seg.find('content: "')
start = ci + len('content: "')
# scan for unescaped closing quote
pos = start
while pos < len(seg):
    if seg[pos] == '\\' and pos+1 < len(seg) and seg[pos+1] == '"':
        pos += 2
        continue
    if seg[pos] == '"':
        break
    pos += 1
else:
    raise RuntimeError("content field never closes")

raw = seg[start:pos]
# unescape: \\" -> ", \\n -> newline
html = raw.replace('\\"', '"').replace('\\n', '\n')

existing = html.count(FAQUOTE)
print("Prague content currently has %d FAQ sections" % existing)

if existing >= 7:
    print("Already has 7+ FAQs - skipping")
    exit(0)

faq_html = (
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>How much does a round-trip flight to Prague cost?</h2></div>\n'
    '<div class="ct"><p>Round-trip flights to Prague start from $430 in 2026. Prices vary by season and departure city. Book April-May or September-October for the best deals. Budget carriers often offer fares 20-30% lower than full-service airlines.</p></div>\n'
    '</section>\n'
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>What is the best time of year to visit Prague?</h2></div>\n'
    '<div class="ct"><p>The best time to visit Prague is spring (April-May) and early autumn (September-October) - mild temperatures, fewer crowds, and good flight prices. Summer is warm but busy; winter is cold but cheapest, with Christmas markets adding charm in December.</p></div>\n'
    '</section>\n'
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>Do I need a visa to visit Prague, Czech Republic?</h2></div>\n'
    '<div class="ct"><p>Visa requirements depend on your nationality. US, UK, Canadian, Australian, and most EU passport holders can enter visa-free for stays up to 90 days (Schengen Area). Check the latest entry requirements on the official Czech Republic immigration website before booking, as policies can change.</p></div>\n'
    '</section>\n'
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>How many days should I spend in Prague?</h2></div>\n'
    '<div class="ct"><p>A minimum of 3-4 days is recommended for Prague to explore the Old Town, Charles Bridge, Prague Castle, and Jewish Quarter without rushing. For a more relaxed pace or to take day trips to Cesky Krumlov or Kutna Hora, plan for 5-7 days.</p></div>\n'
    '</section>\n'
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>Is Prague expensive for tourists?</h2></div>\n'
    '<div class="ct"><p>Prague can be affordable or upscale depending on your choices. Flights start from $430 round trip. Budget travelers can expect to spend 50-80 EUR per day, mid-range 120-200 EUR, and luxury 300+ EUR. Prague is significantly cheaper than Paris, London, or Amsterdam.</p></div>\n'
    '</section>\n'
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>When is the cheapest time to fly to Prague?</h2></div>\n'
    '<div class="ct"><p>The cheapest time to fly to Prague is April-May and September-October. These shoulder seasons have the lowest fares. Mid-week Tuesday and Wednesday departures are 20-30% cheaper than weekend flights. The cheapest flights to Prague typically appear 4-8 weeks before departure for European routes.</p></div>\n'
    '</section>\n'
    '<section class="section st-border">\n'
    '<div class="sh"><span class="tag">FAQs</span><h2>How do I get from Prague Airport (PRG) to the city center?</h2></div>\n'
    '<div class="ct"><p>Prague Airport (Vaclav Havel Airport PRG) is 10 km northwest of the city center. The Airport Express bus takes 15 minutes to the main train station (~250 CZK). Public bus line 119 to Namesti Republiky + Metro Line A takes ~30 minutes (~30 CZK). Rideshare takes 20-30 minutes and costs 400-700 CZK.</p></div>\n'
    '</section>'
)

last_s = html.rfind('</section>')
new_html = html[:last_s] + faq_html + html[last_s:]

# re-escape for TS: " -> \", newline -> \n, backslash -> \\
new_ts = new_html.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')

old_val = 'content: "' + raw + '"'
new_val = 'content: "' + new_ts + '"'
d_new = d[:i+ci] + new_val + d[i+pos+1:]

Path(PATH).write_text(d_new, encoding="utf-8")

# verify
d2 = Path(PATH).read_text(encoding="utf-8")
i2 = d2.find('"prague": {')
j2 = d2.find('"punta-cana": {', i2)
seg2 = d2[i2:j2]
ci2 = seg2.find('content: "')
s2 = ci2 + len('content: "')
p2 = s2
while p2 < len(seg2):
    if seg2[p2] == '\\' and p2+1 < len(seg2) and seg2[p2+1] == '"':
        p2 += 2
        continue
    if seg2[p2] == '"':
        break
    p2 += 1
raw2 = seg2[s2:p2]
html2 = raw2.replace('\\"', '"').replace('\\n', '\n')
after = html2.count(FAQUOTE)
print("Done. Prague content now has %d FAQ sections" % after)
print("section st-border count: %d" % html2.count('section st-border'))