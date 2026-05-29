/**
 * Extract the originating client IP from a request.
 *
 * On Vercel, `x-forwarded-for` is the canonical header (Vercel sets it
 * to a comma-separated list, leftmost = real client). On Cloudflare
 * proxied deployments, `cf-connecting-ip` is also set, but for
 * non-Cloudflare traffic (which is our default, see grey-cloud note
 * in docs/CLOUDFLARE_SETUP.md) we rely on Vercel's header.
 *
 * Falls back to a sentinel string so the rate-limit key is always
 * non-empty (rate-limiting `unknown` is the safe default).
 */
export function getClientIp(headers: Headers): string {
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;

  const fwd = headers.get("x-forwarded-for");
  if (fwd) {
    const first = fwd.split(",")[0]?.trim();
    if (first) return first;
  }

  const real = headers.get("x-real-ip");
  if (real) return real;

  return "unknown";
}
