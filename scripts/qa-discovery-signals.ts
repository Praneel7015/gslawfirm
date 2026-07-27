import sitemap from "../app/sitemap";
import { legalServiceSchema } from "../lib/jsonld";

const entries = sitemap();

if (entries.length !== 87) {
  throw new Error(`Expected 87 sitemap entries, found ${entries.length}.`);
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
  "Discovery signals passed: 87 stable sitemap entries, complete locale alternates, and no unsupported LegalService payment claims.",
);
