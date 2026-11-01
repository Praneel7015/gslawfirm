/**
 * Smoke-test all public routes return HTTP 200.
 * Usage: pnpm qa:routes [baseUrl]
 * QA_BASE_URL can target a local production server.
 * Default base: NEXT_PUBLIC_SITE_URL or https://sunitha.sindhole.com
 */

import sitemap from "../app/sitemap";

const BASE =
  process.argv[2]?.replace(/\/$/, "") ??
  process.env.QA_BASE_URL?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";

async function main() {
  const urls = sitemap().map(
    (entry) => `${BASE}${new URL(entry.url).pathname}`,
  );
  urls.push(`${BASE}/sitemap.xml`, `${BASE}/robots.txt`, `${BASE}/llms.txt`);

  let failed = 0;
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: "follow" });
      const ok = r.status === 200;
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

main();
