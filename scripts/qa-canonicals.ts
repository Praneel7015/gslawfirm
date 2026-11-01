import { resourceArticles } from "../content/resources";
import { routing, type Locale } from "../i18n/routing";
import {
  localizedMetadataAuditRows,
  localizedPageMetadata,
  localizedResourceMetadata,
  type LocalizedPageKey,
} from "../lib/localized-metadata";
import { SITE_URL } from "../lib/site";

const rows = localizedMetadataAuditRows();

for (const row of rows) {
  const metadata = localizedPageMetadata(
    row.key as LocalizedPageKey,
    row.locale,
  );
  const canonical = metadata.alternates?.canonical;

  if (!canonical) {
    throw new Error(`Missing canonical for ${row.locale}:${row.path}.`);
  }

  const expectedPath = localizedPath(row.locale, row.path);
  const expected = new URL(expectedPath, SITE_URL).href;
  const actual = new URL(String(canonical), SITE_URL).href;

  if (actual !== expected) {
    throw new Error(
      `Canonical mismatch for ${row.locale}:${row.path}. Expected ${expected}, found ${actual}.`,
    );
  }
}

// Exercise the same slug lookup used by article generateMetadata, so an
// unregistered article or incorrect mapping cannot pass via registry rows alone.
for (const article of resourceArticles) {
  for (const locale of routing.locales) {
    const metadata = localizedResourceMetadata(article.slug, locale);
    const expectedPath = localizedPath(locale, `/resources/${article.slug}`);
    const canonical = metadata.alternates?.canonical;
    if (
      !canonical ||
      new URL(String(canonical), SITE_URL).href !==
        new URL(expectedPath, SITE_URL).href
    ) {
      throw new Error(
        `Resource canonical mismatch for ${locale}:${article.slug}.`,
      );
    }
  }
}

console.log(
  `Canonicals passed: ${rows.length} localized pages each point to their own final URL.`,
);

function localizedPath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (locale === routing.defaultLocale) return clean ? `/${clean}` : "/";
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
