"""Remove orphan relatedRoutes entries. Only touches entries strictly inside a relatedRoutes array."""
import re
import sys
from pathlib import Path

ROOT = Path("D:/Whitelabel_flighko/flighko-next/src/data/flight-routes.ts")
src = ROOT.read_text(encoding="utf-8")

top_level = set(re.findall(r"^[ \t]*\"([a-z0-9-]+)\": \{$", src, re.M))
print("top-level routes:", len(top_level))

lines = src.split("\n")
out = []
in_related = False
related_depth = 0
i = 0
removed = 0
kept = 0

while i < len(lines):
    line = lines[i]
    stripped = line.strip()

    if not in_related:
        if stripped.startswith("relatedRoutes: ["):
            in_related = True
            related_depth = 0
            out.append(line)
            i += 1
            continue
        out.append(line)
        i += 1
        continue

    # inside a relatedRoutes array
    if stripped == "{":
        slug = None
        for j in range(i + 1, min(i + 10, len(lines))):
            m = re.search(r"slug:\s*\"([^\"]+)\"", lines[j])
            if m:
                slug = m.group(1)
                break
        if slug is not None:
            depth = 1
            j = i + 1
            while j < len(lines) and depth > 0:
                depth += lines[j].count("{") - lines[j].count("}")
                j += 1
            if slug not in top_level:
                removed += 1
            else:
                out.extend(lines[i:j])
                kept += 1
            i = j
            continue

    if stripped in ("],", "]"):
        in_related = False
        out.append(line)
        i += 1
        continue

    out.append(line)
    i += 1

cleaned = "\n".join(out)
print("kept:", kept, "removed:", removed)
ROOT.write_text(cleaned, encoding="utf-8")
print("OK")
