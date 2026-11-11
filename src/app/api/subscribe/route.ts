import { NextResponse } from "next/server";

// Subscriber capture → forwards to support@flighko.com
// Uses Resend HTTP API directly (no SDK dep). Set RESEND_API_KEY in Vercel env.
// Without a key, returns 503 so the client can fall back to a mailto link.

const TO = "support@flighko.com";
const RESEND_ENDPOINT = "https://api.resend.com/emails";

export async function POST(req: Request) {
  let email = "";
  let source = "homepage";
  let attribution: Record<string, string> = {};
  try {
    const body = await req.json();
    email = String(body.email || "").trim();
    source = String(body.source || "homepage");
    attribution = body.attribution || {};
  } catch {
    return NextResponse.json({ ok: false, error: "bad request" }, { status: 400 });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, error: "invalid email" }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json(
      { ok: false, error: "email service not configured" },
      { status: 503 }
    );
  }

  // Build attribution text for the email
  const attrLines: string[] = [];
  if (attribution.utm_source) {
    attrLines.push(`UTM Source: ${attribution.utm_source}`);
    attrLines.push(`UTM Medium: ${attribution.utm_medium || ""}`);
    attrLines.push(`UTM Campaign: ${attribution.utm_campaign || ""}`);
    if (attribution.utm_term) attrLines.push(`UTM Term: ${attribution.utm_term}`);
    if (attribution.utm_content) attrLines.push(`UTM Content: ${attribution.utm_content}`);
  }
  if (attribution.referrer) {
    attrLines.push(`Referrer: ${attribution.referrer}`);
  }
  if (attribution.landing_page) {
    attrLines.push(`Landing Page: ${attribution.landing_page}`);
  }
  if (attribution.captured_at) {
    attrLines.push(`Captured At: ${attribution.captured_at}`);
  }

  const attrText = attrLines.length > 0 ? `\nAttribution:\n${attrLines.join("\n")}` : "";

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Flighko <noreply@flighko.com>",
        to: [TO],
        subject: `New subscriber (${source}): ${email}`,
        text: `Email: ${email}\nSource: ${source}\nTime: ${new Date().toISOString()}${attrText}`,
      }),
    });
    if (!res.ok) {
      return NextResponse.json({ ok: false, error: "relay failed" }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "relay unreachable" }, { status: 502 });
  }
}
