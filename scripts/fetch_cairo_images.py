#!/usr/bin/env python3
"""
Download Cairo corridor route images from Pexels API.
Creates cairo-to-jeddah/ and cairo-to-dubai/ dirs with the 12 filenames
the FlightRoutePage component expects.
"""
import os, json, urllib.request, urllib.parse, concurrent.futures

KEY = os.environ.get("PEXELS_API_KEY", "")

ROOT = "D:/Whitelabel_flighko/flighko-next"
BASE = os.path.join(ROOT, "public", "images", "route")

# Generic image filename -> Pexels search query (same for both corridors)
QUERIES = {
    "airport-origin-aerial.jpg": "Cairo International Airport aerial",
    "hero-bg.jpg": "Cairo Egypt skyline aerial night",
    "baggage-suits.jpg": "suitcases airport baggage",
    "visa-stamps.jpg": "passport visa stamps",
    "egyptair-a330.jpg": "airbus A330 aircraft wing sky",
    "egyptair-a320.jpg": "airbus A320 aircraft sky",
    "airbus-a320.jpg": "airbus A320 airplane flight",
    "boeing-737.jpg": "boeing 737 aircraft sky",
}

# Corridor-specific filename -> Pexels search query
CORRIDOR_SPECIFIC = {
    "cairo-to-jeddah": {
        "airport-destination-terminal.jpg": "Jeddah King Abdulaziz International Airport",
        "airport-destination-feature.jpg": "Jeddah city skyline Saudi Arabia",
        "dest-city-hero.jpg": "Jeddah Corniche Saudi Arabia sea",
        "saudia-a320neo.jpg": "Saudia Saudia Airlines airplane",
    },
    "cairo-to-dubai": {
        "airport-destination-terminal.jpg": "Dubai International Airport terminal",
        "airport-destination-feature.jpg": "Burj Khalifa Dubai skyline",
        "dest-city-hero.jpg": "Dubai skyline night Marina",
        "saudia-a320neo.jpg": "Emirates Airbus A380 aircraft",
    },
}

def pexels_download(query, output_path):
    """Download first Pexels result for a query to output_path."""
    url = "https://api.pexels.com/v1/search?query=" + urllib.parse.quote(query) + "&per_page=1"
    req = urllib.request.Request(url, headers={"Authorization": KEY, "User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read())
        photos = data.get("photos", [])
        if not photos:
            return "FAIL " + os.path.basename(output_path) + ": no photos for '" + query + "'"
        src = photos[0].get("src", {})
        img_url = src.get("large2x") or src.get("large") or src.get("medium")
        if not img_url:
            return "FAIL " + os.path.basename(output_path) + ": no img url"
        with urllib.request.urlopen(urllib.request.Request(img_url, headers={"User-Agent": "Mozilla/5.0"}), timeout=30) as img_resp:
            img_data = img_resp.read()
        with open(output_path, "wb") as f:
            f.write(img_data)
        return "OK " + os.path.basename(output_path) + " (" + str(len(img_data)) + " bytes)"
    except Exception as e:
        return "FAIL " + os.path.basename(output_path) + ": " + str(e)

def main():
    if not KEY:
        print("ERROR: PEXELS_API_KEY not set")
        return

    tasks = []
    for corridor, spec in CORRIDOR_SPECIFIC.items():
        corr_dir = os.path.join(BASE, corridor)
        os.makedirs(corr_dir, exist_ok=True)
        # Generic images for this corridor
        for fname, query in QUERIES.items():
            tasks.append((query, os.path.join(corr_dir, fname)))
        # Corridor-specific images
        for fname, query in spec.items():
            tasks.append((query, os.path.join(corr_dir, fname)))

    print("Downloading " + str(len(tasks)) + " images...")
    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
        futures = {executor.submit(pexels_download, q, p): (q, p) for q, p in tasks}
        for future in concurrent.futures.as_completed(futures):
            r = future.result()
            results.append(r)
            print("  " + r)

    ok = sum(1 for r in results if r.startswith("OK"))
    fail = sum(1 for r in results if r.startswith("FAIL"))
    print("\nDone: " + str(ok) + " downloaded, " + str(fail) + " failed")
    for r in results:
        if r.startswith("FAIL"):
            print("  REMAINING: " + r)

if __name__ == "__main__":
    main()