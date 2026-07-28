import sitemap from "../app/sitemap";
import { routing, type Locale } from "../i18n/routing";
import { localizedMetadataAuditRows } from "../lib/localized-metadata";

const rows = localizedMetadataAuditRows();
const entries = sitemap();

if (rows.length !== entries.length) {
  throw new Error(
    `Expected one description for each of ${entries.length} sitemap URLs, found ${rows.length}.`,
  );
}

const rowKeys = new Set<string>();
const descriptionOwners = new Map<string, string>();
const localTerms: Record<Locale, RegExp> = {
  en: /Hyderabad|Kondapur|Telangana/,
  hi: /हैदराबाद|कोंडापुर|तेलंगाना/,
  te: /హైదరాబాద్|కొండాపూర్|తెలంగాణ/,
};

for (const row of rows) {
  const rowKey = `${row.locale}:${row.path}`;
  const description = row.description.trim();

  if (rowKeys.has(rowKey)) {
    throw new Error(`Duplicate metadata row for ${rowKey}.`);
  }
  rowKeys.add(rowKey);

  if (!description) {
    throw new Error(`Missing page description for ${rowKey}.`);
  }

  const existingOwner = descriptionOwners.get(description);
  if (existingOwner) {
    throw new Error(
      `Duplicate page description used by ${existingOwner} and ${rowKey}: ${description}`,
    );
  }
  descriptionOwners.set(description, rowKey);

  if (!localTerms[row.locale].test(description)) {
    throw new Error(
      `Missing local qualifier in description for ${rowKey}: ${description}`,
    );
  }

  if (row.descriptionLength < 80 || row.descriptionLength > 170) {
    throw new Error(
      `Description length for ${rowKey} is ${row.descriptionLength}; expected 80-170 characters.`,
    );
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
    throw new Error(`Missing page description for sitemap URL ${entry.url}.`);
  }
}

console.log(
  `Metadata descriptions passed: ${rows.length} localized pages across ${descriptionOwners.size} unique, locally qualified descriptions.`,
);
