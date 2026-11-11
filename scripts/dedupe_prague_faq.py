#!/usr/bin/env python3
"""
Dedupe Prague FAQ sections in the content field.
The page already has 5 original FAQ sections + 7 injected = 12 total,
but 5 of the injected ones duplicate the original questions.
Keep the 7 injected (they're more detailed/SEO-friendly) + drop the 5 originals.
Result: 7 unique FAQ sections.
"""
import re
from pathlib import Path

PATH = "D:/Whitelabel_flighko/flighko-next/src/data/destinations.ts"
d = Path(PATH).read_text(encoding="utf-8")

i = d.find('"prague": {')
j = d.find('"punta-cana": {', i)
seg = d[i:j]

ci = seg.find('content: "')
start = ci + len('content: "')
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
html = raw.replace('\\"', '"').replace('\\n', '\n')

FAQUOTE = '<span class="tag">FAQs</span>'
before = html.count(FAQUOTE)
print("Before: %d FAQ sections" % before)

# The 5 original FAQ questions (to remove)
originals = [
    "How much does a round-trip flight to Prague cost?",
    "What is the best time of year to visit Prague?",
    "Do I need a visa to visit Prague, Czech Republic?",
    "How many days should I spend in Prague?",
    "Is Prague expensive for tourists?",
]

removed = 0
for q in originals:
    # Find the FAQ section containing this question
    pattern = r'<section class="section st-border">\s*<div class="sh"><span class="tag">FAQs</span><h2>' + re.escape(q) + r'</h2></div>\s*<div class="ct"><p>.*?</p></div>\s*</section>'
    m = re.search(pattern, html, re.DOTALL)
    if m:
        html = html[:m.start()] + html[m.end():]
        removed += 1
        print("  Removed: %s" % q)

after = html.count(FAQUOTE)
print("After: %d FAQ sections (%d removed)" % (after, removed))

# Re-escape for TS
new_ts = html.replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
old_val = 'content: "' + raw + '"'
new_val = 'content: "' + new_ts + '"'
d_new = d[:i+ci] + new_val + d[i+pos+1:]

Path(PATH).write_text(d_new, encoding="utf-8")

# Verify
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
final = html2.count(FAQUOTE)
print("\nFinal: %d FAQ sections" % final)
if final != 7:
    print("WARNING: expected 7, got %d" % final)
else:
    print("OK: exactly 7 unique FAQ sections")