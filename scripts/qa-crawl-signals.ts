import assert from "node:assert/strict";

const base = new URL(process.argv[2] ?? "http://localhost:3000");

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)]
    .map((match) => [match[1]!.toLowerCase(), match[2]!]));
}

function normalizedUrl(value: string) {
  const url = new URL(value);
  return `${url.origin}${url.pathname.replace(/\/$/, "")}${url.search}`;
}

async function main() {
  const sitemap = await fetch(new URL("/sitemap.xml", base), { signal: AbortSignal.timeout(15_000) });
  assert.equal(sitemap.status, 200, "Sitemap must be accessible");
  const xml = await sitemap.text();
  const locations = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => match[1]!.replaceAll("&amp;", "&"));
  assert(locations.length > 0, "Sitemap must contain pages");
  assert.equal(new Set(locations).size, locations.length, "Duplicate sitemap URL");

  let checked = 0;
  for (const location of locations) {
    const publicUrl = new URL(location);
    // Keep local runs local, even when the sitemap contains production URLs.
    const target = new URL(publicUrl.pathname + publicUrl.search, base);
    const response = await fetch(target, { redirect: "manual", signal: AbortSignal.timeout(30_000) });
    assert.equal(response.status, 200, `${location}: sitemap pages must return 200 without redirecting`);
    assert(!/\b(noindex|none)\b/i.test(response.headers.get("x-robots-tag") ?? ""),
      `${location}: indexing blocked by response header`);
    const html = await response.text();
    const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
    for (const meta of metas.filter((tag) => /^(robots|googlebot|googlebot-news)$/i.test(tag.name ?? ""))) {
      assert(!/\b(noindex|none)\b/i.test(meta.content ?? ""), `${location}: indexing blocked by meta tag`);
    }
    const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag));
    const canonical = links.filter((link) => link.rel === "canonical");
    assert.equal(canonical.length, 1, `${location}: expected one canonical`);
    assert.equal(normalizedUrl(new URL(canonical[0]!.href!, publicUrl).href), normalizedUrl(location),
      `${location}: canonical points to a different sitemap URL`);
    assert(/<title>[^<]+<\/title>/.test(html), `${location}: missing title`);
    assert(metas.some((meta) => meta.name === "description" && meta.content?.trim()),
      `${location}: missing description`);
    const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert(main && /<h1\b/.test(main), `${location}: missing server-rendered main content or heading`);
    const text = main.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
    assert(text.length > 0, `${location}: empty main content`);
    checked++;
  }
  console.log(`HTTP crawl checks passed for ${checked} sitemap pages: direct 200 responses, self-canonicals, no noindex directives, metadata and server-rendered content.`);
  console.log("This does not verify robots.txt rules, Google-selected canonicals, indexing, content quality or rankings. Check those in Search Console.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
