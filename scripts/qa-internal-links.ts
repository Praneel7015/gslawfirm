import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { focusedGuidanceLinks } from "../content/focused-guidance";

const ROOT = process.cwd();

function read(relativePath: string) {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

const serviceRoutes = focusedGuidanceLinks.map(({ href }) => href);
assert.equal(
  new Set(serviceRoutes).size,
  serviceRoutes.length,
  "Focused service links must be unique",
);

for (const route of serviceRoutes) {
  const pagePath = join(
    ROOT,
    "app/[locale]",
    route.replace(/^\//, ""),
    "page.tsx",
  );
  assert.ok(existsSync(pagePath), `Missing service page for ${route}`);

  const source = readFileSync(pagePath, "utf8");
  assert.match(
    source,
    /<SourceAwareContactLink(?:\s|>)/,
    `${route} must link to the localized contact page`,
  );
}

const homepagePractice = read("components/sections/Practice.tsx");
assert.match(
  homepagePractice,
  /<FocusedGuidance\s*\/>/,
  "Homepage practice section must render every focused service link",
);

const practiceOverview = read("app/[locale]/practice/page.tsx");
assert.match(
  practiceOverview,
  /<FocusedGuidance[\s\S]*extraLinks=\{practiceIndexExtraLinks\}/,
  "Practice overview must render every focused service link",
);

const reciprocalPairs = [
  ["/bail", "/criminal-defense"],
  ["/commercial-contracts", "/succession-probate"],
] as const;

for (const [left, right] of reciprocalPairs) {
  for (const [from, to] of [
    [left, right],
    [right, left],
  ] as const) {
    const source = read(
      `app/[locale]/${from.replace(/^\//, "")}/page.tsx`,
    );
    assert.ok(
      source.includes(`href="${to}"`),
      `${from} must link to related service ${to}`,
    );
  }
}

console.log(
  `Internal-link QA passed: ${serviceRoutes.length} service pages are linked from the homepage and practice overview, link to contact, and include the required reciprocal topic links.`,
);
