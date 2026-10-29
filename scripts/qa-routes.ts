/**
 * Smoke-test all public routes return HTTP 200.
 * Usage: pnpm qa:routes [baseUrl]
 * Default base: NEXT_PUBLIC_SITE_URL or https://sunitha.sindhole.com
 */

const BASE =
  process.argv[2]?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";

async function main() {
  // Use the deployed sitemap so newly published guides cannot silently escape smoke tests.
  const response = await fetch(`${BASE}/sitemap.xml`, { signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Sitemap returned HTTP ${response.status}.`);
  const xml = await response.text();
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]!);
  if (!locations.length) throw new Error("Sitemap contains no public URLs.");
  const urls = locations.map((location) => {
    const path = new URL(location.replaceAll("&amp;", "&")).pathname;
    return `${BASE}${path}`;
  });
  urls.push(`${BASE}/sitemap.xml`, `${BASE}/robots.txt`, `${BASE}/llms.txt`);

  let failed = 0;
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: "follow", signal: AbortSignal.timeout(15_000) });
      const ok = r.status >= 200 && r.status < 400;
      console.log(ok ? "✓" : "✗", r.status, url);
      if (!ok) failed++;
    } catch (err) {
      console.log("✗", "ERR", url, String(err));
      failed++;
    }
  }

  console.log(`\n${urls.length - failed}/${urls.length} OK`);
  if (failed) process.exit(1);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
