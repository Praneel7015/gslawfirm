import { localizedMetadataAuditRows } from "./localized-metadata";
import { SITE_URL } from "./site";

export function labelForPath(path: string, locale: string) {
  const entry = localizedMetadataAuditRows().find(row => row.locale === locale && row.path === path.split("#")[0]);
  if (!entry) throw new Error(`Missing localized link label: ${locale}:${path}`);
  return entry.title.split("|")[0]!.trim();
}

export function localizedUrl(path: string, locale: string) {
  return `${SITE_URL}${locale === "en" ? "" : `/${locale}`}${path === "/" ? "" : path}`;
}
