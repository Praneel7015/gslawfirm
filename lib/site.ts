/**
 * Canonical site URL — change ONLY NEXT_PUBLIC_SITE_URL when migrating
 * from sunitha.sindhole.com to gslawfirm.in. See docs/DOMAIN_MIGRATION.md.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";
