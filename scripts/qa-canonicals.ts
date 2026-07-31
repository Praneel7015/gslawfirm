import { routing, type Locale } from "../i18n/routing";
import {
  localizedMetadataAuditRows,
  localizedPageMetadata,
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

console.log(
  `Canonicals passed: ${rows.length} localized pages each point to their own final URL.`,
);

function localizedPath(locale: Locale, path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  if (locale === routing.defaultLocale) return clean ? `/${clean}` : "/";
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
