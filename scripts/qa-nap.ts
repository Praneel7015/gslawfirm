import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { firm, firmNap } from "../content/firm";
import { legalServiceSchema } from "../lib/jsonld";

const ROOT = process.cwd();

function read(relativePath: string) {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

// Canonical NAP pieces must stay aligned.
assert.equal(
  firmNap.street,
  `${firm.address.line1}, ${firm.address.line2}`,
  "firmNap.street must match address lines",
);
assert.equal(
  firm.address.full,
  `${firm.address.line1}, ${firm.address.line2}, ${firm.address.city}, ${firm.address.region} ${firm.address.postalCode}`,
  "firm.address.full must be the canonical NAP address string",
);
assert.equal(firm.address.postalCode, "500084", "Postal code must be 500084 (no spaces)");
assert.match(firm.phone, /^\+91 \d{5} \d{5}$/, "Display phone format");
assert.equal(firm.phoneE164, "+919963847704");

const schema = legalServiceSchema();
const address = schema.address as Record<string, string>;
assert.equal(address.streetAddress, firmNap.street);
assert.equal(address.addressLocality, firm.address.city);
assert.equal(address.addressRegion, firm.address.region);
assert.equal(address.postalCode, firm.address.postalCode);
assert.equal(schema.telephone, firm.phoneE164);
assert.equal(schema.email, firm.publicEmail);

// On-page surfaces must not reintroduce spaced postal codes or reordered address.
const surfaces = [
  "components/layout/Footer.tsx",
  "components/sections/Location.tsx",
  "app/[locale]/contact/page.tsx",
  "public/llms.txt",
  "messages/en.json",
  "messages/hi.json",
  "messages/te.json",
];

for (const file of surfaces) {
  const source = read(file);
  assert.doesNotMatch(
    source,
    /500\s+084/,
    `${file} must not use a spaced postal code`,
  );
}

const footer = read("components/layout/Footer.tsx");
assert.match(footer, /firm\.address\.line1/);
assert.match(footer, /firm\.address\.city/);
assert.match(footer, /firm\.address\.region/);
assert.match(footer, /firm\.address\.postalCode/);

const contact = read("app/[locale]/contact/page.tsx");
assert.match(contact, /firm\.address\.line1/);
assert.match(contact, /firm\.address\.postalCode/);

const llms = read("public/llms.txt");
assert.ok(
  llms.includes(firm.address.full),
  "llms.txt must include the canonical full address",
);
assert.ok(llms.includes(firm.phone), "llms.txt must include the display phone");
assert.ok(
  llms.includes(firm.publicEmail),
  "llms.txt must include the public email",
);

console.log(
  "NAP QA passed: canonical firmNap, LegalService schema address, and on-page contact surfaces are consistent.",
);
