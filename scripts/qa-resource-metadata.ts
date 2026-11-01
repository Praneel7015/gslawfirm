import assert from "node:assert/strict";
import { resourceArticles } from "../content/resources";
import { routing } from "../i18n/routing";
import { SITE_URL } from "../lib/site";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

function attributes(tag: string) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)]
    .map((match) => [match[1]!.toLowerCase(), match[2]]));
}

async function main() {
  let checked = 0;
  for (const locale of routing.locales) {
    for (const article of resourceArticles) {
      const path = `/resources/${article.slug}`;
      const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
      const expected = `${SITE_URL}${prefix}${path}`;
      const response = await fetch(`${base}${prefix}${path}`, { signal: AbortSignal.timeout(30_000) });
      assert.equal(response.status, 200, `${locale}:${article.slug}`);
      const html = await response.text();
      const links = [...html.matchAll(/<link\b[^>]*>/g)].map(([tag]) => attributes(tag));
      const canonicals = links.filter((link) => link.rel === "canonical");
      assert.equal(canonicals.length, 1, "Each article needs exactly one canonical");
      assert.equal(canonicals[0]?.href, expected, "Article must not inherit homepage canonical");
      for (const language of [...routing.locales, "x-default"]) {
        const languagePrefix = language === "en" || language === "x-default" ? "" : `/${language}`;
        assert(links.some((link) => link.rel === "alternate" && link.hreflang === language &&
          link.href === `${SITE_URL}${languagePrefix}${path}`), `Missing article alternate: ${language}`);
      }
      const metas = [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => attributes(tag));
      assert(metas.some((meta) => meta.property === "og:url" && meta.content === expected));
      assert(metas.some((meta) => meta.property === "og:type" && meta.content === "article"));
      assert(metas.some((meta) => meta.name === "twitter:title" && meta.content?.includes("GS Law Firm")));
      assert(metas.some((meta) => meta.name === "description" && meta.content));
      assert(html.includes('<h1 id="article-title">'), "Article body must render");
      checked++;
    }
  }
  console.log(`Rendered article metadata passed: ${checked} pages, self-canonicals, article alternates and sharing tags.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
