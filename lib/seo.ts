import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { SITE_URL } from "./site";

/**
 * Build per-page `alternates` for the `Metadata` export of a page.
 *
 * - `canonical` points at the current locale's own URL.
 * - `languages` includes one entry per locale plus an `x-default`
 *   pointing back to the English path.
 *
 * `path` is the path without locale prefix, starting with "/". For
 * the home page, pass "/".
 */
export function alternatesFor(
  path: string,
  locale: Locale,
): Metadata["alternates"] {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const en = clean ? `/${clean}` : "/";
  const canonical =
    locale === routing.defaultLocale
      ? en
      : clean
        ? `/${locale}/${clean}`
        : `/${locale}`;

  const languages: Record<string, string> = {
    "x-default": en,
    en,
  };
  for (const l of routing.locales) {
    if (l === routing.defaultLocale) continue;
    languages[l] = clean ? `/${l}/${clean}` : `/${l}`;
  }
  return { canonical, languages };
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
  locale,
  image,
}: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image?: string;
}): Metadata {
  const clean = path.replace(/^\/+|\/+$/g, "");
  const localizedPath =
    locale === routing.defaultLocale
      ? clean
        ? `/${clean}`
        : ""
      : clean
        ? `/${locale}/${clean}`
        : `/${locale}`;
  const url = `${SITE_URL}${localizedPath}`;
  const og = image ? [{ url: image, width: 1200, height: 630 }] : undefined;
  return {
    metadataBase: new URL(SITE_URL),
    title: { absolute: title },
    description,
    alternates: alternatesFor(path, locale),
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
