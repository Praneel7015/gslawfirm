import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { focusedGuidanceLinks } from "../content/focused-guidance";
import {
  practiceHubLinks,
  practiceResourceLinks,
  servicePageExtraLinks,
} from "../content/internal-links";
import { resourceArticles } from "../content/resources";

const ROOT = process.cwd();

function read(relativePath: string) {
  return readFileSync(join(ROOT, relativePath), "utf8");
}

const hubRoutes = new Set(["/resources", "/legal-statistics-hyderabad"]);
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
  assert.ok(
    /<SourceAwareContactLink(?:\s|>)/.test(source) ||
      /href=["']\/contact["']/.test(source),
    `${route} must link to the localized contact page`,
  );

  if (!hubRoutes.has(route)) {
    assert.match(
      source,
      /RelatedPagesNav/,
      `${route} must use RelatedPagesNav so hub pages stay linked`,
    );
  }
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
  ["/legal-notices", "/legal-notice-reply-format"],
  ["/cyber-crime-complaints", "/cyber-crime-complaint-format"],
] as const;

for (const [left, right] of reciprocalPairs) {
  for (const [from, to] of [
    [left, right],
    [right, left],
  ] as const) {
    const source = read(`app/[locale]/${from.replace(/^\//, "")}/page.tsx`);
    assert.ok(
      source.includes(`href="${to}"`) ||
        source.includes(`href: "${to}"`) ||
        (servicePageExtraLinks[from] ?? []).some((l) => l.href === to),
      `${from} must link to related service ${to}`,
    );
  }
}

const practiceDetail = read("app/[locale]/practice/[slug]/page.tsx");
assert.match(
  practiceDetail,
  /practiceResourceLinks/,
  "Practice detail must import practiceResourceLinks",
);
assert.match(
  practiceDetail,
  /practiceHubLinks/,
  "Practice detail must import practiceHubLinks",
);
assert.ok(
  practiceHubLinks.some((l) => l.href === "/resources"),
  "practiceHubLinks must include /resources",
);
assert.ok(
  practiceHubLinks.some((l) => l.href === "/legal-statistics-hyderabad"),
  "practiceHubLinks must include /legal-statistics-hyderabad",
);
assert.ok(
  Object.keys(practiceResourceLinks).length >= 5,
  "practiceResourceLinks must cover practice slugs",
);

for (const article of resourceArticles) {
  const related = article.relatedSlugs ?? [];
  assert.ok(
    related.some(
      (href) =>
        href.startsWith("/practice/") ||
        href.startsWith("/legal-statistics-hyderabad"),
    ),
    `${article.slug} must link to practice or statistics`,
  );
}

const resourcesIndex = read("app/[locale]/resources/page.tsx");
assert.match(
  resourcesIndex,
  /legal-statistics-hyderabad/,
  "Resources index must link to statistics",
);
assert.match(
  resourcesIndex,
  /\/practice/,
  "Resources index must link to practice",
);

const statsPage = read("app/[locale]/legal-statistics-hyderabad/page.tsx");
assert.match(
  statsPage,
  /\/resources/,
  "Statistics page must link to resources",
);
assert.match(statsPage, /\/practice/, "Statistics page must link to practice");

const contactPage = read("app/[locale]/contact/page.tsx");
assert.match(
  contactPage,
  /cp-first-msg/,
  "Contact page must show the first-message checklist",
);
assert.match(
  contactPage,
  /firstMessage/,
  "Contact page must use firstMessage copy",
);

console.log(
  `Internal-link QA passed: ${serviceRoutes.length} service pages are linked from the homepage and practice overview, link to contact, use RelatedPagesNav for hub reachability, and include the required reciprocal topic links. Resources ↔ statistics ↔ practice cross-links and Contact first-message checklist verified.`,
);
