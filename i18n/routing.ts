import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
  locales: ["en", "te", "hi"] as const,
  defaultLocale: "en",
  // English is served at /, /about, /contact etc.
  // Telugu and Hindi get a prefix: /te/about, /hi/contact.
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
