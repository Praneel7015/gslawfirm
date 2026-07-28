import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { practiceAreas } from "@/content/practice-areas";
import { SITE_URL } from "@/lib/site";

// Update only the route whose visible content or search metadata changed.
// These dates come from the corresponding production release history.
const ROUTE_LAST_MODIFIED: Record<string, string> = {
  "": "2026-07-26",
  bail: "2026-06-20",
  "bail-hearing-procedure-hyderabad": "2026-06-20",
  "criminal-defense": "2026-06-20",
  "cyber-crime-complaints": "2026-06-20",
  "property-disputes": "2026-06-20",
  "property-dispute-courts-telangana": "2026-06-20",
  "consumer-forum-complaints": "2026-06-20",
  "legal-notices": "2026-06-20",
  "commercial-contracts": "2026-06-20",
  "succession-probate": "2026-07-28",
  "high-court-matters": "2026-07-28",
  "cheque-dishonour": "2026-07-28",
  "cheque-bounce-case-procedure-hyderabad": "2026-06-20",
  "tenancy-eviction": "2026-06-20",
  "specific-performance": "2026-06-20",
  "injunction-interim-relief": "2026-06-20",
  "continuity-of-counsel": "2026-07-28",
  "kondapur-legal-services": "2026-06-20",
  about: "2026-07-28",
  practice: "2026-07-28",
  "practice/criminal": "2026-07-26",
  "practice/civil": "2026-07-26",
  "practice/corporate": "2026-07-28",
  "practice/will-succession": "2026-07-26",
  "practice/high-court": "2026-07-28",
  contact: "2026-07-26",
  privacy: "2026-07-28",
  disclaimer: "2026-07-28",
};

/**
 * Sitemap for /sitemap.xml.
 *
 * Emits every static route + every practice-detail route, across all
 * locales, with proper `alternates.languages` so Google can wire up
 * hreflang relationships automatically.
 *
 * The default locale (en) lives at the unprefixed path (e.g. `/about`).
 * Other locales live at `/<locale>/<path>` (e.g. `/te/about`). This
 * mirrors `localePrefix: "as-needed"` in i18n/routing.ts.
 *
 * Total entries: 29 routes × 3 locales = 87.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Static paths, strings without a slash prefix; the home is "".
  const staticPaths: Array<{
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }> = [
    { path: "", priority: 1.0, changeFrequency: "monthly" },
    { path: "bail", priority: 0.85, changeFrequency: "monthly" },
    {
      path: "bail-hearing-procedure-hyderabad",
      priority: 0.82,
      changeFrequency: "monthly",
    },
    { path: "criminal-defense", priority: 0.85, changeFrequency: "monthly" },
    { path: "cyber-crime-complaints", priority: 0.85, changeFrequency: "monthly" },
    { path: "property-disputes", priority: 0.85, changeFrequency: "monthly" },
    {
      path: "property-dispute-courts-telangana",
      priority: 0.82,
      changeFrequency: "monthly",
    },
    {
      path: "consumer-forum-complaints",
      priority: 0.85,
      changeFrequency: "monthly",
    },
    { path: "legal-notices", priority: 0.85, changeFrequency: "monthly" },
    { path: "commercial-contracts", priority: 0.85, changeFrequency: "monthly" },
    { path: "succession-probate", priority: 0.85, changeFrequency: "monthly" },
    { path: "high-court-matters", priority: 0.85, changeFrequency: "monthly" },
    { path: "cheque-dishonour", priority: 0.85, changeFrequency: "monthly" },
    {
      path: "cheque-bounce-case-procedure-hyderabad",
      priority: 0.82,
      changeFrequency: "monthly",
    },
    { path: "tenancy-eviction", priority: 0.85, changeFrequency: "monthly" },
    { path: "specific-performance", priority: 0.85, changeFrequency: "monthly" },
    { path: "injunction-interim-relief", priority: 0.85, changeFrequency: "monthly" },
    { path: "continuity-of-counsel", priority: 0.82, changeFrequency: "monthly" },
    { path: "kondapur-legal-services", priority: 0.82, changeFrequency: "monthly" },
    { path: "about", priority: 0.8, changeFrequency: "yearly" },
    { path: "practice", priority: 0.9, changeFrequency: "monthly" },
    { path: "contact", priority: 0.9, changeFrequency: "yearly" },
    { path: "privacy", priority: 0.3, changeFrequency: "yearly" },
    { path: "disclaimer", priority: 0.3, changeFrequency: "yearly" },
  ];

  const practicePaths = practiceAreas.map((a) => ({
    path: `practice/${a.slug}`,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  const allPaths = [...staticPaths, ...practicePaths];
  const entries: MetadataRoute.Sitemap = [];

  for (const { path, priority, changeFrequency } of allPaths) {
    const lastModified = ROUTE_LAST_MODIFIED[path];
    if (!lastModified) {
      throw new Error(
        `Missing stable lastModified date for sitemap path: ${path}`,
      );
    }

    for (const locale of routing.locales) {
      const url = buildUrl(locale, path);
      entries.push({
        url,
        lastModified: new Date(`${lastModified}T00:00:00.000Z`),
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            [
              ...routing.locales.map((l) => [l, buildUrl(l, path)]),
              ["x-default", buildUrl(routing.defaultLocale, path)],
            ],
          ),
        },
      });
    }
  }

  return entries;
}

function buildUrl(locale: string, path: string): string {
  const isDefault = locale === routing.defaultLocale;
  const localeSegment = isDefault ? "" : `/${locale}`;
  const pathSegment = path ? `/${path}` : "";
  return `${SITE_URL}${localeSegment}${pathSegment}`;
}
