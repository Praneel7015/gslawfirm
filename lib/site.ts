/**
 * Canonical site URL — change ONLY NEXT_PUBLIC_SITE_URL when migrating
 * from sunitha.sindhol.com to gslawfirm.in.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhol.com";
