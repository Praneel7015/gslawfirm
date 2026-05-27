import Script from "next/script";

/**
 * Cloudflare Web Analytics beacon. Cookie-less, no consent banner
 * needed. Renders nothing if the token env var is unset (dev mode).
 *
 * Token is sourced from NEXT_PUBLIC_CF_ANALYTICS_TOKEN — grab it from
 * the Cloudflare dashboard (Web Analytics → Manage Site → JS snippet).
 */
export function CloudflareAnalytics() {
  const token = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;
  if (!token) return null;
  return (
    <Script
      src="https://static.cloudflareinsights.com/beacon.min.js"
      strategy="afterInteractive"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
