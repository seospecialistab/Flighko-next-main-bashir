#!/usr/bin/env python3
"""
Refresh GSC OAuth token using stored refresh_token and client credentials.
Reads .secrets/gsc-config.json and .secrets/gsc-token.json, writes updated token.
"""
import json
import sys
import urllib.request
import urllib.parse
import time
from pathlib import Path

ROOT = Path(__file__).parent.parent
SECRETS = ROOT / ".secrets"
CONFIG_FILE = SECRETS / "gsc-config.json"
TOKEN_FILE = SECRETS / "gsc-token.json"

def load_json(path):
    with open(path, "r") as f:
        return json.load(f)

def save_json(path, data):
    with open(path, "w") as f:
        json.dump(data, f, indent=2)

def refresh_token(config, token_data):
    """Refresh access token using refresh_token."""
    data = {
        "client_id": config["client_id"],
        "client_secret": config["client_secret"],
        "refresh_token": token_data["refresh_token"],
        "grant_type": "refresh_token",
    }
    req = urllib.request.Request(
        "https://oauth2.googleapis.com/token",
        data=urllib.parse.urlencode(data).encode(),
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.load(resp)
    
    # Update token data
    new_token = token_data.copy()
    new_token["access_token"] = result["access_token"]
    new_token["token"] = result["access_token"]  # alias
    new_token["expires_at"] = time.time() + result.get("expires_in", 3599)
    new_token["expiry"] = str(int(new_token["expires_at"]))
    if "refresh_token" in result:
        new_token["refresh_token"] = result["refresh_token"]
    return new_token

def main():
    config = load_json(CONFIG_FILE)
    token = load_json(TOKEN_FILE)
    
    # Check if expired
    if token.get("expires_at", 0) > time.time():
        print("Token still valid, no refresh needed")
        print(f"  Expires at: {token['expires_at']} ({time.ctime(token['expires_at'])})")
        return 0
    
    print("Token expired, refreshing...")
    new_token = refresh_token(config, token)
    save_json(TOKEN_FILE, new_token)
    print(f"Refreshed. New expiry: {new_token['expires_at']} ({time.ctime(new_token['expires_at'])})")
    return 0

if __name__ == "__main__":
    sys.exit(main())