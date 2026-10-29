import sitemap from "../app/sitemap";
import { legalServiceSchema } from "../lib/jsonld";
import { localizedMetadataAuditRows } from "../lib/localized-metadata";
import { routing } from "../i18n/routing";
import { SITE_URL } from "../lib/site";

const entries = sitemap();

const expectedUrls = new Set(localizedMetadataAuditRows().map((row) => {
  const prefix = row.locale === routing.defaultLocale ? "" : `/${row.locale}`;
  return `${SITE_URL}${prefix}${row.path === "/" ? "" : row.path}`;
}));
const actualUrls = new Set(entries.map((entry) => entry.url));
if (entries.length !== actualUrls.size || actualUrls.size !== expectedUrls.size ||
    [...expectedUrls].some((url) => !actualUrls.has(url))) {
  throw new Error("Sitemap URLs must be unique and match all public page metadata URLs.");
}

for (const entry of entries) {
  if (!(entry.lastModified instanceof Date)) {
    throw new Error(`Missing stable lastModified date for ${entry.url}.`);
  }

  const languages = entry.alternates?.languages;
  if (!languages || !languages.en || !languages.hi || !languages.te) {
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
