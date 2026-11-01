import sitemap from "../app/sitemap";
import { routing } from "../i18n/routing";
import { localizedMetadataAuditRows } from "../lib/localized-metadata";
import { SITE_URL } from "../lib/site";
import { legalServiceSchema } from "../lib/jsonld";

const entries = sitemap();

// Derive the expected inventory independently from the metadata registry so
// adding or dropping a sitemap route still requires complete localized metadata.
const expectedUrls = new Set(
  localizedMetadataAuditRows().map(({ locale, path }) => {
    const prefix = locale === routing.defaultLocale ? "" : `/${locale}`;
    return `${SITE_URL}${prefix}${path === "/" ? "" : path}`;
  }),
);
const actualUrls = new Set(entries.map((entry) => entry.url));

if (actualUrls.size !== entries.length) {
  throw new Error("Duplicate sitemap URLs found.");
}

if (entries.length !== expectedUrls.size) {
  throw new Error(
    `Expected ${expectedUrls.size} sitemap entries from localized metadata, found ${entries.length}.`,
  );
}

for (const url of expectedUrls) {
  if (!actualUrls.has(url)) {
    throw new Error(`Missing sitemap URL for localized metadata: ${url}.`);
  }
}

for (const entry of entries) {
  if (!(entry.lastModified instanceof Date)) {
    throw new Error(`Missing stable lastModified date for ${entry.url}.`);
  }

  const languages = entry.alternates?.languages;
  if (!languages || routing.locales.some((locale) => !languages[locale])) {
    throw new Error(`Missing locale alternates for ${entry.url}.`);
  }

  if (languages["x-default"] !== languages.en) {
    throw new Error(
      `x-default does not match the English URL for ${entry.url}.`,
    );
  }
}

const firstRunDates = entries.map((entry) => entry.lastModified?.toString());
const secondRunDates = sitemap().map((entry) => entry.lastModified?.toString());

if (JSON.stringify(firstRunDates) !== JSON.stringify(secondRunDates)) {
  throw new Error("Sitemap modification dates changed between renders.");
}

const unsupportedPaymentClaims = [
  "priceRange",
  "currenciesAccepted",
  "paymentAccepted",
] as const;
const schema = legalServiceSchema();

for (const claim of unsupportedPaymentClaims) {
  if (claim in schema) {
    throw new Error(`Unsupported LegalService claim remains: ${claim}.`);
  }
}

console.log(
  `Discovery signals passed: ${entries.length} stable sitemap entries, complete locale alternates, and no unsupported LegalService payment claims.`,
);
