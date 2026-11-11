#!/usr/bin/env python3
"""
Re-authorise GSC OAuth and write a fresh .secrets/gsc-token.json.

WHY THIS EXISTS
The stored refresh_token was revoked (Google returns
`invalid_grant: Token has been expired or revoked`). That has now happened
twice, and there was no script to recover from it — only gsc_refresh.py, which
needs a LIVE refresh token to work. This is the bootstrap path for when the
refresh token itself is dead.

HOW IT WORKS
Installed-app loopback flow:
  1. Print a consent URL.
  2. Start a local HTTP server on 127.0.0.1:<PORT>.
  3. You open the URL, approve access, Google redirects to the local server.
  4. The server captures `code`, exchanges it for tokens, writes gsc-token.json.

USAGE
  python gsc_reauth.py            # prints URL, waits for callback
  python gsc_reauth.py --port 8080

The access token is written with an `expires_at` field so the existing
get_access_token()/gsc_refresh.py logic keeps working unchanged.
"""
import argparse
import json
import sys
import time
import urllib.parse
import urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SECRETS = ROOT / ".secrets"
CONFIG_FILE = SECRETS / "gsc-config.json"
TOKEN_FILE = SECRETS / "gsc-token.json"

SCOPES = [
    "https://www.googleapis.com/auth/webmasters.readonly",
    "https://www.googleapis.com/auth/indexing",
    "https://www.googleapis.com/auth/webmasters",
]
AUTH_URI = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URI = "https://oauth2.googleapis.com/token"

_code_holder = {}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        qs = urllib.parse.urlparse(self.path).query
        params = urllib.parse.parse_qs(qs)
        if "code" in params:
            _code_holder["code"] = params["code"][0]
            body = b"<h2>Authorised.</h2><p>You can close this tab and return to the terminal.</p>"
        elif "error" in params:
            _code_holder["error"] = params["error"][0]
            body = f"<h2>Error: {params['error'][0]}</h2>".encode()
        else:
            body = b"<h2>Waiting for authorisation code...</h2>"
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *args):
        pass  # silence default request logging


def build_auth_url(client_id, redirect_uri):
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": " ".join(SCOPES),
        "access_type": "offline",      # required to get a refresh_token
        "prompt": "consent",           # force a new refresh_token
        "include_granted_scopes": "true",
    }
    return f"{AUTH_URI}?{urllib.parse.urlencode(params)}"


def exchange_code(code, client_id, client_secret, redirect_uri):
    data = urllib.parse.urlencode({
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "grant_type": "authorization_code",
    }).encode()
    req = urllib.request.Request(
        TOKEN_URI, data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="ignore")
        try:
            parsed = json.loads(raw)
            msg = parsed.get("error_description") or parsed.get("error") or raw
        except Exception:
            msg = raw
        raise SystemExit(
            "\nTOKEN EXCHANGE FAILED (HTTP %s)\n"
            "  %s\n\n"
            "Common causes:\n"
            "  - the code was already used (codes are single-use)\n"
            "  - the code expired (they last ~10 minutes)\n"
            "  - redirect_uri did not match the one used to authorise\n" % (e.code, msg)
        )


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--port", type=int, default=8099)
    ap.add_argument("--timeout", type=int, default=900,
                    help="seconds to wait for the browser callback (default 900)")
    ap.add_argument("--manual", action="store_true",
                    help="skip the local server; paste the code/URL from the browser instead")
    ap.add_argument("--open", action="store_true",
                    help="open the consent URL in the default browser automatically")
    args = ap.parse_args()

    cfg = json.loads(CONFIG_FILE.read_text(encoding="utf-8"))
    client_id = cfg["client_id"]
    client_secret = cfg["client_secret"]

    # A bare loopback URI is registered for this client; Google accepts any port.
    redirect_uri = f"http://localhost:{args.port}/" if not args.manual else "http://localhost"
    url = build_auth_url(client_id, redirect_uri)

    print("=" * 72)
    print("OPEN THIS URL IN YOUR BROWSER AND APPROVE ACCESS")
    print("=" * 72)
    print()
    print(url)
    print()
    print("=" * 72)

    if args.open:
        import webbrowser
        try:
            webbrowser.open(url)
            print("Opened the consent URL in your default browser.")
            print()
        except Exception as e:
            print(f"Could not auto-open browser ({e}). Open the URL above manually.")
            print()

    if args.manual:
        print("MANUAL MODE")
        print("After approving, the browser lands on a localhost URL that will not load.")
        print("Copy the ENTIRE address bar URL (or just the code value) and paste it below.")
        print()
        try:
            pasted = input("Paste redirect URL or code: ").strip()
        except EOFError:
            print("No input received.", file=sys.stderr)
            return 1
        code = pasted
        if "code=" in pasted:
            qs = urllib.parse.urlparse(pasted).query or pasted.split("?", 1)[-1]
            code = urllib.parse.parse_qs(qs).get("code", [""])[0]
        if not code:
            print("Could not find a code in that input.", file=sys.stderr)
            return 1
        _code_holder["code"] = code
    else:
        print(f"Waiting for callback on {redirect_uri} ...")
        print("(If the browser shows a connection error after approving, that is fine —")
        print(" the code is still captured. Only worry if this script keeps waiting.)")
        print()
        server = HTTPServer(("127.0.0.1", args.port), Handler)
        server.timeout = 30
        deadline = time.time() + args.timeout
        while "code" not in _code_holder and "error" not in _code_holder:
            if time.time() > deadline:
                print(f"TIMEOUT: no callback received within {args.timeout}s.", file=sys.stderr)
                print("Retry with:  python gsc_reauth.py --manual", file=sys.stderr)
                return 1
            server.handle_request()
        server.server_close()

    if "error" in _code_holder:
        print(f"AUTH ERROR: {_code_holder['error']}", file=sys.stderr)
        return 1

    print("Code received. Exchanging for tokens...")
    tok = exchange_code(_code_holder["code"], client_id, client_secret, redirect_uri)

    if "refresh_token" not in tok:
        print("WARNING: no refresh_token returned. The stored token will not auto-refresh.",
              file=sys.stderr)

    out = {
        "access_token": tok["access_token"],
        "expires_in": tok.get("expires_in", 3599),
        "scope": tok.get("scope", " ".join(SCOPES)),
        "token_type": tok.get("token_type", "Bearer"),
        "refresh_token": tok.get("refresh_token", ""),
        "expires_at": time.time() + tok.get("expires_in", 3599),
    }
    TOKEN_FILE.write_text(json.dumps(out, indent=2), encoding="utf-8")
    print(f"✅ Wrote {TOKEN_FILE.name}")
    print(f"   scope: {out['scope']}")
    print(f"   refresh_token present: {bool(out['refresh_token'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
