/**
 * Smoke-test all public routes return HTTP 200.
 * Usage: pnpm qa:routes [baseUrl]
 * Default base: NEXT_PUBLIC_SITE_URL or https://sunitha.sindhole.com
 */

const BASE =
  process.argv[2]?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";

const LOCALES = ["", "/te", "/hi"] as const;
const ROUTES = [
  "",
  "/bail",
  "/bail-hearing-procedure-hyderabad",
  "/criminal-defense",
  "/cyber-crime-complaints",
  "/property-disputes",
  "/property-dispute-courts-telangana",
  "/consumer-forum-complaints",
  "/legal-notices",
  "/commercial-contracts",
  "/succession-probate",
  "/high-court-matters",
  "/cheque-dishonour",
  "/cheque-bounce-case-procedure-hyderabad",
  "/tenancy-eviction",
  "/specific-performance",
  "/injunction-interim-relief",
  "/continuity-of-counsel",
  "/kondapur-legal-services",
  "/about",
  "/practice",
  "/practice/criminal",
  "/practice/civil",
  "/practice/corporate",
  "/practice/will-succession",
  "/practice/high-court",
  "/contact",
  "/privacy",
  "/disclaimer",
];

async function main() {
  const urls: string[] = [];
  for (const locale of LOCALES) {
    for (const route of ROUTES) {
      const prefix = locale ? locale : "";
      urls.push(`${BASE}${prefix}${route || "/"}`);
    }
  }
  urls.push(`${BASE}/sitemap.xml`, `${BASE}/robots.txt`, `${BASE}/llms.txt`);

  let failed = 0;
  for (const url of urls) {
    try {
      const r = await fetch(url, { redirect: "follow" });
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

main();
