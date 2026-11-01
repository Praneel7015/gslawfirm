"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { usePathname, routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = { en: "EN", te: "తెలుగు", hi: "हिंदी" };

export function LanguageSwitcher({ className, onLocaleChange }: {
  className?: string;
  onLocaleChange?: () => void;
} = {}) {
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const [suffix, setSuffix] = useState("");
  useEffect(() => {
    const update = () => setSuffix(window.location.search + window.location.hash);
    update();
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
    };
  }, [pathname]);
  return (
    <div className={["lang", className].filter(Boolean).join(" ")} role="group" aria-label={{ en: "Language", hi: "भाषा", te: "భాష" }[current]}>
      {routing.locales.map((locale) => (
        <a key={locale} href={`${locale === "en" ? "" : `/${locale}`}${pathname === "/" ? (locale === "en" ? "/" : "") : pathname}${suffix}`}
          hrefLang={locale} lang={locale}
          className={"lang-btn" + (locale === current ? " is-active" : "")}
          aria-current={locale === current ? "page" : undefined}
          onClick={onLocaleChange}>
          {LABELS[locale]}
        </a>
      ))}
    </div>
  );
}
