import assert from "node:assert/strict";
import en from "../messages/en.json";
import hi from "../messages/hi.json";
import te from "../messages/te.json";
import { translatedGuides } from "../content/localized-guides";
import { localizedPracticeAreas } from "../content/localized-practice";
import { localizedResourceBody } from "../content/localized-resources";
import { localizedMetadataAuditRows } from "../lib/localized-metadata";
import { readFileSync } from "node:fs";

function leaves(value: unknown, path = ""): Record<string, string> {
  if (typeof value === "string") return { [path]: value };
  assert(value && typeof value === "object", `Invalid message at ${path}`);
  return Object.assign({}, ...Object.entries(value).map(([key, item]) => leaves(item, `${path}.${key}`)));
}
const english = leaves(en);
for (const [locale, messages] of Object.entries({ hi, te })) {
  const translated = leaves(messages);
  assert.deepEqual(Object.keys(translated).sort(), Object.keys(english).sort(), `${locale}: missing message keys`);
  for (const [key, value] of Object.entries(translated)) {
    assert(value.trim() && !/TRANSLATION PENDING|\[PLACEHOLDER\]/.test(value), `${locale}:${key}: incomplete translation`);
    assert(!(value === english[key] && value.length > 40), `${locale}:${key}: English prose copied into translation`);
  }
}
const messagePages = new Set(["/", "/about", "/contact", "/privacy", "/disclaimer", "/practice", "/resources"]);
for (const row of localizedMetadataAuditRows()) {
  if (messagePages.has(row.path)) continue;
  if (row.path.startsWith("/resources/")) {
    const article = localizedResourceBody(row.path.slice(11), row.locale);
    assert(article && article.sections.length >= 5, `${row.locale}:${row.path}: missing article`);
  } else if (row.path.startsWith("/practice/")) {
    const area = localizedPracticeAreas(row.locale).find(area => area.slug === row.path.slice(10));
    assert(area && area.handle.length >= 4 && area.paragraphs.length >= 2, `${row.locale}:${row.path}: missing practice copy`);
  } else {
    const id = row.path.slice(1) as keyof typeof translatedGuides.hi;
    if (row.locale === "hi" || row.locale === "te") {
      const copy = translatedGuides[row.locale][id];
      assert(copy && copy.sections.length >= 2 && copy.intro.length > 50, `${row.locale}:${row.path}: missing guide copy`);
      const source = readFileSync(`app/[locale]${row.path}/page.tsx`, "utf8");
      assert(source.includes(`<TranslatedGuide id="${id}"`), `${row.path}: localized record is not rendered`);
    }
  }
}
console.log("Localization coverage passed: message parity and content records for all 108 route editions.");
