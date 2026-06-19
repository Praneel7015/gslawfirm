const LOCALE_PREFIX_RE = /^\/(hi|te)(?=\/|$)/;

export function cleanSitePath(value: string | null | undefined, max = 240) {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return undefined;
  }
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

export function withoutLocalePrefix(pathname: string) {
  return pathname.replace(LOCALE_PREFIX_RE, "") || "/";
}

export function isContactPath(sourcePath: string) {
  const pathname = sourcePath.split(/[?#]/, 1)[0] || "/";
  return withoutLocalePrefix(pathname) === "/contact";
}
