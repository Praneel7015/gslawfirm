/**
 * Verify a Cloudflare Turnstile token server-side.
 *
 * Returns `{ ok: true }` if the token is valid OR Turnstile isn't
 * configured (no secret key). Returns `{ ok: false, reason }` only
 * when Turnstile IS configured and the token check fails.
 *
 * This shape means Turnstile is purely additive — if the client
 * hasn't set up the keys yet, the form keeps working. Once the keys
 * are in env, every submission must verify.
 *
 * See https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
 */
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

  if (!token) {
    return { ok: false, reason: "missing-token" };
  }

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
      },
    );
    const data = (await r.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };
    if (data.success) return { ok: true };
    return {
      ok: false,
      reason: (data["error-codes"] ?? ["unknown"]).join(","),
    };
  } catch (err) {
    console.error("[turnstile] verify error", err);
    return { ok: false, reason: "verify-error" };
  }
}
