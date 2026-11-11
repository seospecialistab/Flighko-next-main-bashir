"""Strip orphan relatedRoutes entries from flight-routes.ts.

The relatedRoutes arrays in this file point to slugs that don't exist as
top-level flightRoutes keys (the pages were never generated). The audit
finds hundreds of broken internal links because these nested entries are
rendered as <a> tags inside FAQ answers.

This script removes every relatedRoutes entry whose slug is not a top-level
flightRoutes key, then writes the cleaned file back.
"""
import re
import sys
from pathlib import Path

ROOT = Path("D:/Whitelabel_flighko/flighko-next/src/data/flight-routes.ts")
SRC = ROOT.read_text(encoding="utf-8")

# Top-level flightRoutes keys: optional indentation, then "slug": {
top_level = set(re.findall(r'^[ \t]*"([a-z0-9-]+)": \{', SRC, re.M))
print("top-level routes:", len(top_level))

# Every nested { slug: "..." } entry inside a relatedRoutes array
entries = re.findall(r'\{\s*\n\s+slug:\s*"([^"]+)"', SRC)
print("nested relatedRoutes entries:", len(entries))

orphans = sorted({e for e in entries if e not in top_level})
print("orphan entries:", len(orphans))

if not orphans:
    print("nothing to do")
    sys.exit(0)


def remove_orphans(txt):
    """Remove nested blocks whose slug is not a top-level route."""
    lines = txt.split("\n")
    out = []
    skip_until = -1
    for i, line in enumerate(lines):
        if skip_until > i:
            continue
        if skip_until < 0:
            m = re.search(r'\{', line)
            if m:
                block_slug = None
                for j in range(i + 1, min(i + 15, len(lines))):
                    sm = re.search(r'slug:\s*"([^"]+)"', lines[j])
                    if sm:
                        block_slug = sm.group(1)
                        break
                if block_slug in orphans:
                    skip_until = i
                    depth = 1
                    for j in range(i + 1, len(lines)):
                        depth += lines[j].count("{") - lines[j].count("}")
                        if "}," in lines[j] and depth <= 0:
                            skip_until = j
                            break
                    continue
        out.append(line)
    return "\n".join(out)


cleaned = remove_orphans(SRC)
cleaned = re.sub(r'\n{3,}', '\n\n', cleaned)

remaining = re.findall(r'^  "([a-z0-9-]+)": \{', cleaned, re.M)
print("top-level routes after:", len(remaining))

remaining_nested = re.findall(r'\{\s*\n\s+slug:\s*"([^"]+)"', cleaned)
print("nested remaining:", len(remaining_nested))

still = [e for e in orphans if e in remaining_nested]
print("orphans remaining:", len(still))
if still:
    print("  still:", still)
    print("\nWARNING: orphans still present -- aborting")
    sys.exit(1)

ROOT.write_text(cleaned, encoding="utf-8")
print("replaced", len(orphans), "orphan relatedRoutes entries")
