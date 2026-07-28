import sitemap from "../app/sitemap";
import { routing, type Locale } from "../i18n/routing";
import { localizedMetadataAuditRows } from "../lib/localized-metadata";

const rows = localizedMetadataAuditRows();
const entries = sitemap();

if (rows.length !== entries.length) {
  throw new Error(
    `Expected one title for each of ${entries.length} sitemap URLs, found ${rows.length}.`,
  );
}

const rowKeys = new Set<string>();
const titleOwners = new Map<string, string>();
const localTerms: Record<Locale, RegExp> = {
  en: /Hyderabad|Kondapur|Telangana/,
  hi: /हैदराबाद|कोंडापुर|तेलंगाना/,
  te: /హైదరాబాద్|కొండాపూర్|తెలంగాణ/,
};

for (const row of rows) {
  const rowKey = `${row.locale}:${row.path}`;

  if (rowKeys.has(rowKey)) {
    throw new Error(`Duplicate metadata row for ${rowKey}.`);
  }
  rowKeys.add(rowKey);

  const existingOwner = titleOwners.get(row.title);
  if (existingOwner) {
    throw new Error(
      `Duplicate page title "${row.title}" used by ${existingOwner} and ${rowKey}.`,
    );
  }
  titleOwners.set(row.title, rowKey);

  if (!row.title.includes("GS Law Firm")) {
    throw new Error(`Missing firm name in title for ${rowKey}: ${row.title}`);
  }

  if (!localTerms[row.locale].test(row.title)) {
    throw new Error(`Missing local qualifier in title for ${rowKey}: ${row.title}`);
  }
}

for (const entry of entries) {
  const url = new URL(entry.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const firstSegment = segments[0];
  const hasLocalePrefix =
    firstSegment !== undefined &&
    (routing.locales as readonly string[]).includes(firstSegment);
  const locale = hasLocalePrefix
    ? (firstSegment as Locale)
    : routing.defaultLocale;
  const pathSegments =
    locale === routing.defaultLocale ? segments : segments.slice(1);
  const path = pathSegments.length ? `/${pathSegments.join("/")}` : "/";
  const rowKey = `${locale}:${path}`;

  if (!rowKeys.has(rowKey)) {
    throw new Error(`Missing page title for sitemap URL ${entry.url}.`);
  }
}

console.log(
  `Metadata titles passed: ${rows.length} localized pages across ${titleOwners.size} unique, branded, locally qualified titles.`,
);
