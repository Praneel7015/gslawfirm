/**
 * Lighthouse mobile audit for M10 gate pages.
 * Usage: pnpm qa:lighthouse [baseUrl]
 * Requires: npx lighthouse (downloaded on first run).
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const BASE =
  process.argv[2]?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";

const PAGES = [
  { name: "home", path: "/" },
  { name: "criminal", path: "/practice/criminal" },
];

const outDir = resolve(process.cwd(), ".qa");
mkdirSync(outDir, { recursive: true });

const TARGETS = {
  performance: 95,
  accessibility: 100,
  "best-practices": 100,
  seo: 100,
};

let failed = 0;

for (const page of PAGES) {
  const url = `${BASE}${page.path}`;
  const out = resolve(outDir, `lighthouse-${page.name}.json`);
  console.log(`\nAuditing ${url} …`);
  const response = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Lighthouse target is unavailable: ${url} (${response.status})`);
  execFileSync("npx", ["--yes", "lighthouse", url,
    "--only-categories=performance,accessibility,best-practices,seo",
    "--form-factor=mobile", "--screenEmulation.mobile=true",
    "--chrome-flags=--headless --no-sandbox", "--output=json",
    `--output-path=${out}`, "--quiet"], { stdio: "inherit", env: { ...process.env, NPM_CONFIG_CACHE: resolve(outDir, "npm-cache") } });
  const report = JSON.parse(readFileSync(out, "utf8"));
  const scores = Object.fromEntries(
    Object.entries(TARGETS).map(([k, min]) => {
      const score = Math.round((report.categories[k]?.score ?? 0) * 100);
      const ok = score >= min;
      if (!ok) failed++;
      return [k, { score, min, ok }];
    }),
  );
  console.log(page.name, scores);
}

if (failed) {
  console.error(`\n${failed} category score(s) below target. See .qa/lighthouse-*.json`);
  process.exit(1);
}
console.log("\nAll Lighthouse targets met.");
