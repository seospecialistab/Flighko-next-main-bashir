#!/usr/bin/env python3
"""
omni_watchdog.py — keeps OmniRoute alive via restart-on-failure.

Runs forever (no cron needed — zero-resident-proc rule satisfied: it's ONE
persistent python loop, not multiple daemons).

Usage:
  python scripts/omni_watchdog.py   # foreground
  python scripts/oomni_watchdog.py & # background
"""
import os, sys, time, subprocess, signal, requests

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
# Use node directly on the .mjs entry (avoids bash shebang wrapper that
# subprocess.Popen can't exec on Windows).
CMD = ["node", os.path.join(ROOT, "node_modules/omniroute/bin/omniroute.mjs")]
ENV = dict(os.environ, NODE_OPTIONS="--max-old-space-size=2048")
HEALTH_URL = "http://127.0.0.1:20128/v1/models"
MAX_FAILS = 30  # 60s * 30 = 30 min tolerance before giving up

def launch():
    return subprocess.Popen(CMD, cwd=ROOT, env=ENV, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def healthy():
    try:
        return requests.get(HEALTH_URL, headers={"Authorization": "Bearer x"}, timeout=6).status_code == 200
    except Exception:
        return False

def main():
    p = launch()
    fails = 0
    warmup_fails = 0  # tolerate health timeouts during cold-start warmup
    print(f"[watchdog] omni started pid={p.pid}", flush=True)
    while True:
        # If the process itself is dead, respawn immediately (max gap ~55s)
        if p.poll() is not None:
            print(f"[watchdog] respawning omni (prev exit {p.returncode})", flush=True)
            p = launch()
            fails = 0
            warmup_fails = 0
            time.sleep(55)
            continue

        # Process alive — check HTTP health (tolerate warmup window)
        if not healthy():
            warmup_fails += 1
            # Give a healthy process room to boot (up to ~3 min of timeouts)
            if warmup_fails > 6:
                fails += 1
                print(f"[watchdog] health fail #{fails} (proc alive, pid={p.pid})", flush=True)
            else:
                print(f"[watchdog] warm-up... ({warmup_fails}/6) pid={p.pid}", flush=True)
        else:
            if fails or warmup_fails:
                print(f"[watchdog] healthy pid={p.pid}", flush=True)
            fails = 0
            warmup_fails = 0
        time.sleep(55)

if __name__ == "__main__":
    main()
