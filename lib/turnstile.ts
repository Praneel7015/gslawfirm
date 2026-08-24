/**
 * Verify a Cloudflare Turnstile token server-side.
 *
 * Returns `{ ok: true }` if the token is valid OR Turnstile isn't
 * configured (no secret key). Returns `{ ok: false, reason }` only
 * when Turnstile IS configured and the token check fails.
 *
 * Canonical contract per developers.cloudflare.com/turnstile/spin:
 *   - token length guard (1–2048 chars)
 *   - 10-second AbortSignal timeout
 *   - result.action must equal expectedAction
 *   - result.hostname must be in the TURNSTILE_HOSTNAMES allowlist
 *
 * See https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */

const EXPECTED_ACTION = "contact";

function buildHostnameSet(): Set<string> {
  return new Set(
    (process.env.TURNSTILE_HOSTNAMES ?? "")
      .split(",")
      .map((h) => h.trim())
      .filter(Boolean),
  );
}

export async function verifyTurnstile(
  token: string | null | undefined,
  clientIp: string,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  // Skip unless BOTH keys are set. A secret without the public site key
  // (common when .env is only on laptop, not Vercel) blocks every submit.
  if (!secret || !siteKey) {
    return { ok: true };
  }

  if (
    typeof token !== "string" ||
    token.length === 0 ||
    token.length > 2048
  ) {
    return { ok: false, reason: "missing-token" };
  }

  const expectedHostnames = buildHostnameSet();
  if (expectedHostnames.size === 0) {
    console.warn(
      "[turnstile] TURNSTILE_HOSTNAMES is unset — hostname validation skipped",
    );
  }

  let result: {
    success: boolean;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };

  try {
    const body = new URLSearchParams({
      secret,
      response: token,
      remoteip: clientIp,
    });
    const r = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!r.ok) throw new Error(`siteverify ${r.status}`);
    result = (await r.json()) as typeof result;
  } catch (err) {
    console.error("[turnstile] verify error", err);
    return { ok: false, reason: "verify-error" };
  }

  if (!result.success) {
    return {
      ok: false,
      reason: (result["error-codes"] ?? ["unknown"]).join(","),
    };
  }

  if (result.action !== EXPECTED_ACTION) {
    return { ok: false, reason: `action-mismatch:${result.action}` };
  }

  if (
    expectedHostnames.size > 0 &&
    !expectedHostnames.has(result.hostname ?? "")
  ) {
    return { ok: false, reason: `hostname-mismatch:${result.hostname}` };
  }

  return { ok: true };
}
