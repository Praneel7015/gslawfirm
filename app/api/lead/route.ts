import { NextResponse } from "next/server";

import { leadSchema } from "@/lib/lead-schema";
import { getClientIp } from "@/lib/get-ip";
import { rateLimit } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendLeadEmail } from "@/lib/resend";

export const runtime = "nodejs";

/**
 * POST /api/lead — handle contact form submissions.
 *
 * Flow (build-prompt §8):
 *   1. Read JSON body, validate with zod
 *   2. Honeypot drop — if `website` field is non-empty, silently 200
 *   3. IP-based rate limit (5/hour) — 429 with retry hint on excess
 *   4. Optional Turnstile token verification (only if env configured)
 *   5. Send Resend email to LEAD_NOTIFY_TO
 *   6. 200 with confirmation; never leak internal errors
 */
export async function POST(req: Request) {
  // ── 1. Parse + validate
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Accept the Turnstile token as a sibling field; strip before zod
  // validates so the lead schema stays clean.
  const turnstileToken =
    typeof (raw as { turnstileToken?: unknown })?.turnstileToken === "string"
      ? ((raw as { turnstileToken: string }).turnstileToken)
      : null;
  const inputForZod =
    typeof raw === "object" && raw !== null
      ? { ...(raw as Record<string, unknown>) }
      : raw;
  if (inputForZod && typeof inputForZod === "object") {
    delete (inputForZod as Record<string, unknown>).turnstileToken;
  }

  const parsed = leadSchema.safeParse(inputForZod);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form fields and try again." },
      { status: 422 },
    );
  }
  const lead = parsed.data;

  // ── 2. Honeypot drop. Silently accept, do nothing.
  if (lead.website && lead.website.length > 0) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  // ── 3. Rate limit by IP
  const ip = getClientIp(req.headers);
  const rl = await rateLimit!.check(`ip:${ip}`);
  if (!rl.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate-limit",
        retryAt: rl.resetAt,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((rl.resetAt - Date.now()) / 1000)),
          ),
        },
      },
    );
  }

  // ── 4. Turnstile (optional; no-op if env unset)
  const tsVerify = await verifyTurnstile(turnstileToken, ip);
  if (!tsVerify.ok) {
    console.warn("[lead] turnstile failed:", tsVerify.reason);
    return NextResponse.json(
      { ok: false, error: "challenge" },
      { status: 400 },
    );
  }

  // ── 5. Send
  const userAgent = req.headers.get("user-agent") ?? "unknown";
  const result = await sendLeadEmail(lead, {
    ip,
    userAgent,
    submittedAt: new Date(),
  });

  if (!result.ok) {
    // Never leak result.error to the client — log internally only.
    console.error("[lead] send failed:", result.error);
    return NextResponse.json(
      { ok: false, error: "send-failed" },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
