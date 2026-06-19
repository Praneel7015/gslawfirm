import type { MetadataRoute } from "next";

import { routing } from "@/i18n/routing";
import { practiceAreas } from "@/content/practice-areas";
import { SITE_URL } from "@/lib/site";

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
 * Total entries: 12 routes × 3 locales = 36.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static paths, strings without a slash prefix; the home is "".
  const staticPaths: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
    { path: "", priority: 1.0, changeFrequency: "monthly" },
    { path: "bail", priority: 0.85, changeFrequency: "monthly" },
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
    for (const locale of routing.locales) {
      const url = buildUrl(locale, path);
      entries.push({
        url,
        lastModified: now,
        changeFrequency,
        priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, buildUrl(l, path)]),
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
