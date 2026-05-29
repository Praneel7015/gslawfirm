import type { Metadata } from "next";

import { routing } from "@/i18n/routing";
import { SITE_URL } from "./site";

/**
 * Build per-page `alternates` for the `Metadata` export of a page.
 *
 * - `canonical` always points at the English path (default locale,
 *   no prefix), this consolidates ranking on a single URL while
 *   `languages` gives Google the localised alternates via hreflang.
 * - `languages` includes one entry per locale plus an `x-default`
 *   pointing back to the English path.
 *
 * `path` is the path without locale prefix, starting with "/". For
 * the home page, pass "/".
 */
export function alternatesFor(path: string): Metadata["alternates"] {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const en = clean ? `/${clean}` : "/";

  const languages: Record<string, string> = {
    "x-default": en,
    en,
  };
  for (const l of routing.locales) {
    if (l === routing.defaultLocale) continue;
    languages[l] = clean ? `/${l}/${clean}` : `/${l}`;
  }
  return { canonical: en, languages };
}

/**
 * Convenience wrapper, build OG + Twitter metadata for a page in one
 * shot. Returns a partial Metadata you can spread into your page-level
 * `metadata` export.
 */
export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const og = image ? [{ url: image, width: 1200, height: 630 }] : undefined;
  return {
    title,
    description,
    alternates: alternatesFor(path),
    openGraph: {
      type: "website",
      url,
      title,
      description,
      images: og,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
