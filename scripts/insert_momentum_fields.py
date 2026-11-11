#!/usr/bin/env python3
"""
Insert depth fields (monthlyPrices, destination_info, routeComparisons,
seoTitle, seoDescription, h1, imageDir, destinationCountry, provider)
into the 3 momentum route entries in flight-routes.ts.
"""
import re
from pathlib import Path

FILE = Path("D:/Whitelabel_flighko/flighko-next/src/data/flight-routes.ts")
content = FILE.read_text(encoding="utf-8")

# ---- austin-to-dallas ----
old1 = '\n    lastUpdated: "July 2026"\n    },\n"austin-to-houston": {'
new1 = (
'\n    lastUpdated: "July 2026",\n'
'    destinationCountry: "United States",\n'
'    imageDir: "austin-to-dallas",\n'
'    provider: "flight",\n'
'    monthlyPrices: [\n'
'      { month: "January", price: 55 },\n'
'      { month: "February", price: 55 },\n'
'      { month: "March", price: 55 },\n'
'      { month: "April", price: 50 },\n'
'      { month: "May", price: 50 },\n'
'      { month: "June", price: 55, note: "Summer travel" },\n'
'      { month: "July", price: 60, note: "Summer travel" },\n'
'      { month: "August", price: 60, note: "Summer travel" },\n'
'      { month: "September", price: 55 },\n'
'      { month: "October", price: 48, note: "Cheapest month" },\n'
'      { month: "November", price: 50 },\n'
'      { month: "December", price: 58, note: "Holiday premium" }\n'
'    ],\n'
'    destination_info: {\n'
'      transport: "Dallas/Fort Worth International Airport (DFW) connects to the city via DART Orange Line (60 min, $3), rideshare (20-40 min, $30-50), and rental cars. The Skylink train connects DFW terminals in 10 minutes.",\n'
'      weather: "Dallas has a humid subtropical climate. Summer highs reach 38\u00B0C (June-September); winter lows dip near freezing (December-February). Severe weather including thunderstorms and occasional tornadoes is most common March-May.",\n'
'      localTips: [\n'
'        "DFW is one of the largest airports in the US \u2014 allow extra time for terminal transfers if your return flight uses a different terminal.",\n'
'        "Austin-Bergstrom (AUS) is compact and walkable, with most gates within 10 minutes of security.",\n'
'        "I-35 connects Austin and Dallas directly; traffic is heavy midday and at rush hour. Driving is often competitive with flying for 1-2 passengers."\n'
'      ]\n'
'    },\n'
'    routeComparisons: [\n'
'      { slug: "austin-to-houston", originCity: "Austin", destinationCity: "Houston", price: 45, flightTime: "0h 40m\u20130h 50m", pros: "Shortest Texas hop, lowest fares", cons: "Limited long-haul connections from Houston" },\n'
'      { slug: "dallas-to-houston", originCity: "Dallas", destinationCity: "Houston", price: 50, flightTime: "0h 45m\u20130h 55m", pros: "Both major Texas hubs, strong business demand", cons: "Often cheaper to drive the 240\u00A0mi" },\n'
'      { slug: "austin-to-denver", originCity: "Austin", destinationCity: "Denver", price: 90, flightTime: "2h 25m\u20132h 35m", pros: "Gateway to Colorado Rockies", cons: "Longer flight, higher fares" }\n'
'    ],\n'
'    seoTitle: "Austin to Dallas Flights from $50 | Compare Cheap Deals",\n'
'    seoDescription: "Find Austin to Dallas flights from $50 round trip. Compare fares, find the cheapest airlines, and book smarter with Flighko.",\n'
'    h1: "Austin to Dallas Flights"\n'
'    },\n"austin-to-houston": {'
)

# ---- austin-to-houston ----
old2 = '\n    lastUpdated: "July 2026"\n    },\n"bangkok-to-seoul": {'
new2 = (
'\n    lastUpdated: "July 2026",\n'
'    destinationCountry: "United States",\n'
'    imageDir: "austin-to-houston",\n'
'    provider: "flight",\n'
'    monthlyPrices: [\n'
'      { month: "January", price: 50 },\n'
'      { month: "February", price: 48 },\n'
'      { month: "March", price: 50 },\n'
'      { month: "April", price: 45 },\n'
'      { month: "May", price: 45 },\n'
'      { month: "June", price: 55, note: "Summer travel" },\n'
'      { month: "July", price: 58, note: "Summer travel" },\n'
'      { month: "August", price: 55, note: "Summer travel" },\n'
'      { month: "September", price: 48 },\n'
'      { month: "October", price: 42, note: "Cheapest month" },\n'
'      { month: "November", price: 48 },\n'
'      { month: "December", price: 55, note: "Holiday premium" }\n'
'    ],\n'
'    destination_info: {\n'
'      transport: "George Bush Intercontinental Airport (IAH) connects to Houston via METRO Rail Orange Line (70 min, $1.25), rideshare (30-50 min, $35-60), and shuttle services.",\n'
'      weather: "Houston has a humid subtropical climate. Summer highs reach 36\u00B0C (June-September) with high humidity; winter highs are 15-18\u00B0C (December-February). Tropical storms and hurricanes are possible June-November; flash flooding is a risk during heavy rain events.",\n'
'      localTips: [\n'
'        "IAH is a sprawling airport with 5 terminals and 120+ gates \u2014 check your terminal before heading to security.",\n'
'        "The METRO Rail Orange Line connects IAH to Downtown in about 70 minutes for $1.25, a budget alternative to rideshare.",\n'
'        "Houston traffic is notoriously heavy \u2014 rush hour (7-9am, 4-7pm) can double cross-town travel times. Plan buffer time.",\n'
'        "Houston has no zoning laws, so the city is spread out. A car or rideshare is almost essential for getting around."\n'
'      ]\n'
'    },\n'
'    routeComparisons: [\n'
'      { slug: "dallas-to-houston", originCity: "Dallas", destinationCity: "Houston", price: 50, flightTime: "0h 45m\u20130h 55m", pros: "Both major Texas hubs, strong business demand", cons: "Often cheaper to drive the 240\u00A0mi" },\n'
'      { slug: "austin-to-dallas", originCity: "Austin", destinationCity: "Dallas", price: 50, flightTime: "0h 45m\u20130h 55m", pros: "Connects three Texas metros on one trip", cons: "Adds a flight segment and cost" },\n'
'      { slug: "new-orleans-to-houston", originCity: "New Orleans", destinationCity: "Houston", price: 55, flightTime: "0h 55m\u20131h 05m", pros: "Short Gulf Coast hop, low fares", cons: "Limited nonstop frequency" }\n'
'    ],\n'
'    seoTitle: "Austin to Houston Flights from $45 | Compare Cheap Deals",\n'
'    seoDescription: "Find Austin to Houston flights from $45 round trip. Compare fares, find the cheapest airlines, and book smarter with Flighko.",\n'
'    h1: "Austin to Houston Flights"\n'
'    },\n"bangkok-to-seoul": {'
)

# ---- los-angeles-to-san-diego ----
old3 = '\n    lastUpdated: "July 2026"\n    },\n"miami-to-new-york": {'
new3 = (
'\n    lastUpdated: "July 2026",\n'
'    destinationCountry: "United States",\n'
'    imageDir: "los-angeles-to-san-diego",\n'
'    provider: "flight",\n'
'    monthlyPrices: [\n'
'      { month: "January", price: 45 },\n'
'      { month: "February", price: 42 },\n'
'      { month: "March", price: 45 },\n'
'      { month: "April", price: 40 },\n'
'      { month: "May", price: 40 },\n'
'      { month: "June", price: 50, note: "Summer travel" },\n'
'      { month: "July", price: 55, note: "Summer travel" },\n'
'      { month: "August", price: 55, note: "Summer travel" },\n'
'      { month: "September", price: 48 },\n'
'      { month: "October", price: 40, note: "Cheapest month" },\n'
'      { month: "November", price: 42 },\n'
'      { month: "December", price: 50, note: "Holiday premium" }\n'
'    ],\n'
'    destination_info: {\n'
'      transport: "San Diego International Airport (SAN) is 3 miles from downtown \u2014 the shortest major US airport-to-city distance. The Airport Coaster train connects to the Santa Fe Depot in 12 minutes ($2.50), and rideshare is 10-15 minutes ($15-25).",\n'
'      weather: "San Diego has a Mediterranean climate with mild, sunny weather year-round. Summer highs are 26-28\u00B0C (June-September); winter highs are 17-20\u00B0C (December-February). Rain is rare and concentrated December-March.",\n'
'      localTips: [\n'
'        "SAN is exceptionally close to downtown \u2014 you can be in a Gaslamp Quarter restaurant 20 minutes after landing.",\n'
'        "The Airport Coaster (SAN DAGO) train is the cheapest and most scenic way into the city \u2014 it runs along the coast and costs $2.50.",\n'
'        "San Diego International Airport has only one runway, so delays during high winds or fog can stack up quickly \u2014 check your flight status.",\n'
'        "La Jolla, Coronado, and Balboa Park are all within 30-45 minutes of SAN by car or rideshare \u2014 easy half-day trips from the airport."\n'
'      ]\n'
'    },\n'
'    routeComparisons: [\n'
'      { slug: "los-angeles-to-las-vegas", originCity: "Los Angeles", destinationCity: "Las Vegas", price: 50, flightTime: "1h 05m\u20131h 15m", pros: "Cheapest California desert getaway", cons: "Longer flight than San Diego pair" },\n'
'      { slug: "los-angeles-to-san-francisco", originCity: "Los Angeles", destinationCity: "San Francisco", price: 70, flightTime: "1h 15m\u20131h 25m", pros: "Connects California\'s two great coastal cities", cons: "Bay Area fares run higher" },\n'
'      { slug: "los-angeles-to-phoenix", originCity: "Los Angeles", destinationCity: "Phoenix", price: 60, flightTime: "1h 15m\u20131h 25m", pros: "Gateway to desert Southwest", cons: "Phoenix is 350\u00A0mi inland \u2014 no coastal access" }\n'
'    ],\n'
'    seoTitle: "Los Angeles to San Diego Flights from $40 | Compare Cheap Deals",\n'
'    seoDescription: "Find Los Angeles to San Diego flights from $40 round trip. Compare fares, find the cheapest airlines, and book smarter with Flighko.",\n'
'    h1: "Los Angeles to San Diego Flights"\n'
'    },\n"miami-to-new-york": {'
)

hits = 0
for old, new, name in [(old1, new1, 'austin-to-dallas'), (old2, new2, 'austin-to-houston'), (old3, new3, 'los-angeles-to-san-diego')]:
    if old in content:
        content = content.replace(old, new, 1)
        print(f"OK: {name} depth fields inserted")
        hits += 1
    else:
        print(f"FAIL: {name} old_string not found")

FILE.write_text(content, encoding="utf-8")
print(f"\nWrote {FILE}")
print(f"Replacements made: {hits}/3")