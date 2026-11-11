#!/usr/bin/env python3
from pathlib import Path
import re

st = Path("D:/Whitelabel_flighko/flighko-next/src/lib/seo-titles.ts").read_text(encoding="utf-8")
ft = Path("D:/Whitelabel_flighko/flighko-next/src/data/flight-routes.ts").read_text(encoding="utf-8")

no_override = ['bangkok-to-seoul','cairo-to-doha','cairo-to-istanbul','connecticut-to-miami','lagos-to-johannesburg','los-angeles-to-san-diego']

def slug_index(slug, mod):
    h = 0
    for ch in slug:
        h = (h * 31 + ord(ch)) & 0xFFFFFFFF
    return h % mod

print("=== Computed shape-3 titles for 6 slugs (no override) ===")
for slug in no_override:
    i = ft.find('"' + slug + '": {')
    if i < 0:
        print(f"{slug}: NOT FOUND in flightRoutes")
        continue
    j = ft.find('    },\n', i+20)
    if j < 0:
        j = i + 1000
    seg = ft[i:j]
    
    price_m = re.search(r'price: (\d+)', seg)
    time_m = re.search(r'flightTime: "([^"]+)"', seg)
    origin_m = re.search(r'originCity: "([^"]+)"', seg)
    dest_m = re.search(r'destinationCity: "([^"]+)"', seg)
    code_m = re.search(r'originAirportCode: "([^"]+)"', seg)
    
    pair = f"{origin_m.group(1)} to {dest_m.group(1)}" if origin_m and dest_m else "? to ?"
    price = price_m.group(1) if price_m else "?"
    t_raw = time_m.group(1) if time_m else "?"
    t = re.split(r'[–\u2013\u2014-]', t_raw)[0].strip()
    
    has_codes = bool(code_m and code_m.group(1))
    mod = 5 if has_codes else 4
    shape = slug_index(slug, mod)
    new_title = f"{pair} Flights from ${price}, Nonstop {t} | Flighko"
    print(f"{slug} [shape={shape}] ({len(new_title)} chars): {new_title}")