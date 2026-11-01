/** Audit candidate SSR HTML via HTTP, or .next/server/app with --static. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import sitemap from "../app/sitemap";
import { localizedMetadataAuditRows } from "../lib/localized-metadata";
import { SITE_URL } from "../lib/site";
import { getResourceArticle } from "../content/resources";

async function main() {
const staticMode = process.argv.includes("--static");
const base = process.env.QA_BASE_URL ?? process.argv[2] ?? "http://127.0.0.1:3100";
const rows = localizedMetadataAuditRows();
const decode = (s: string) => s.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">").replaceAll("<!-- -->", "");
const attrs = (tag: string) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(m => [m[1]!.toLowerCase(), decode(m[2]!)]));
const errors: string[] = [];
const pages = new Map<string, { html: string; links: string[]; ids: Set<string> }>();
const images = new Set<string>();
const titles = new Set<string>();
const descriptions = new Set<string>();
const canonicalPath = (locale: string, path: string) => `${locale === "en" ? "" : `/${locale}`}${path === "/" ? "" : path}` || "/";
const fail = (path: string, message: string) => errors.push(`${path}: ${message}`);
for (const row of rows) {
  const path = canonicalPath(row.locale, row.path);
  const html = staticMode
    ? await readFile(join(".next/server/app", `${row.locale}${row.path === "/" ? "" : row.path}.html`), "utf8")
    : await (async () => {
      const response = await fetch(`${base}${path}`, { signal: AbortSignal.timeout(15000), redirect: "manual" });
      if (response.status !== 200) throw new Error(`${path}: status ${response.status}`);
      return response.text();
    })();
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] ?? "");
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map(m => attrs(m[0]));
  const links = [...html.matchAll(/<link\b[^>]*>/g)].map(m => attrs(m[0]));
  const description = meta.find(m => m.name === "description")?.content ?? "";
  if (title !== row.title || title.length < 25 || title.length > 70 || titles.has(title)) fail(path, "missing, duplicate or invalid title");
  if (description !== row.description || description.length < 80 || description.length > 165 || descriptions.has(description)) fail(path, "missing, duplicate or invalid description");
  titles.add(title); descriptions.add(description);
  if (links.find(l => l.rel === "canonical")?.href !== `${SITE_URL}${path === "/" ? "" : path}` && links.find(l => l.rel === "canonical")?.href !== `${SITE_URL}${path}`) fail(path, "incorrect canonical");
  const entry = sitemap().find(e => new URL(e.url).pathname === path);
  for (const [locale, url] of Object.entries(entry?.alternates?.languages ?? {})) {
    const rendered = links.find(l => l.rel === "alternate" && l.hreflang === locale)?.href;
    if (rendered?.replace(/\/$/, "") !== url?.replace(/\/$/, "")) fail(path, `incorrect ${locale} alternate`);
  }
  for (const key of ["og:image", "twitter:image"]) {
    const image = meta.find(m => m.property === key || m.name === key)?.content;
    if (!image) fail(path, `missing ${key}`); else images.add(image);
  }
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1] ?? "";
  if ((main.match(/<h1[\s>]/g) ?? []).length !== 1) fail(path, "expected exactly one H1");
  const text = decode(main.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<[^>]*>/g, " "));
  if (text.length < 300 || /TRANSLATION PENDING|\[PLACEHOLDER\]|ANE\/####/.test(text)) fail(path, "missing main content or placeholder");
  if (row.locale !== "en" && (text.match(row.locale === "hi" ? /[\u0900-\u097f]/g : /[\u0c00-\u0c7f]/g) ?? []).length < 150) fail(path, "missing localized main content");
  let articleFound = !row.path.startsWith("/resources/");
  for (const script of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    const schema = JSON.parse(script[1]!);
    const nodes = schema["@graph"] ?? [schema];
    for (const node of nodes) {
      if (node["@type"] === "BreadcrumbList") {
        for (const item of node.itemListElement) {
          if (row.locale !== "en" && !new URL(item.item).pathname.startsWith(`/${row.locale}`)) fail(path, "breadcrumb destination uses another locale");
        }
      }
    }
    if (row.path.startsWith("/resources/")) {
      const article = nodes.find((node: Record<string, unknown>) => node["@type"] === "Article");
      if (article) {
        articleFound = true;
        const source = getResourceArticle(row.path.slice(11))!;
        const h1 = decode(main.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1]?.replace(/<[^>]*>/g, "") ?? "");
        if (article.inLanguage !== row.locale || article.headline !== h1 ||
            !article.datePublished?.startsWith(source.publishedAt) ||
            !article.dateModified?.startsWith(source.updatedAt) ||
            article.mainEntityOfPage !== `${SITE_URL}${path}` ||
            article.publisher?.name !== "GS Law Firm") fail(path, "article attribution, dates, headline or canonical mismatch");
      }
    }
  }
  if (!articleFound) fail(path, "missing localized Article schema");
  pages.set(path, {
    html,
    links: [...html.matchAll(/<a\b[^>]*href="([^"]*)"[^>]*>/g)].map(m => decode(m[1]!)),
    ids: new Set([...html.matchAll(/\bid="([^"]*)"/g)].map(m => decode(m[1]!))),
  });
}
for (const [path, page] of pages) {
  for (const href of page.links) {
    const url = new URL(href, `${SITE_URL}${path}`);
    if (url.origin !== new URL(SITE_URL).origin) continue;
    if (/\.(svg|png|jpg|pdf|webp)$/.test(url.pathname)) continue;
    const target = pages.get(url.pathname);
    if (!target) fail(path, `broken internal path: ${href}`);
    else if (url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1)))) fail(path, `broken fragment: ${href}`);
  }
}
for (const locale of ["en", "hi", "te"]) {
  const root = canonicalPath(locale, "/");
  const distances = new Map([[root, 0]]);
  const queue = [root];
  for (const path of queue) {
    const distance = distances.get(path)!;
    if (distance === 3) continue;
    for (const href of pages.get(path)?.links ?? []) {
      const url = new URL(href, `${SITE_URL}${path}`);
      const sameLocale = locale === "en" ? !/^\/(hi|te)(\/|$)/.test(url.pathname) : url.pathname === root || url.pathname.startsWith(`${root}/`);
      if (url.origin !== new URL(SITE_URL).origin || !sameLocale || !pages.has(url.pathname) || distances.has(url.pathname)) continue;
      distances.set(url.pathname, distance + 1); queue.push(url.pathname);
    }
  }
  for (const row of rows.filter(row => row.locale === locale)) if (!distances.has(canonicalPath(locale, row.path))) fail(root, `${row.path} is more than three clicks away`);
}
if (!staticMode) for (const image of images) {
  const response = await fetch(`${base}${new URL(image, SITE_URL).pathname}`, { signal: AbortSignal.timeout(15000) });
  if (!response.ok || !response.headers.get("content-type")?.startsWith("image/")) fail(image, "social image is not reachable");
}
if (errors.length) throw new Error(errors.join("\n"));
console.log(`${pages.size} candidate pages passed metadata, content, schema, links/fragments and three-click discovery (${staticMode ? "static HTML; HTTP image availability untested" : "HTTP"}).`);

}
main().catch(error => { console.error(error); process.exitCode = 1; });
