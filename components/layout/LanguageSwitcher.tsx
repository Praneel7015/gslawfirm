"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { useRouter, usePathname, routing, type Locale } from "@/i18n/routing";

const LABELS: Record<Locale, string> = {
  en: "EN",
  te: "తె",
  hi: "हिं",
};

/**
 * Tiny inline EN · తె · हिं switcher.
 * Preserves the current route across locales via next-intl's typed router.
 */
export function LanguageSwitcher({
  className,
  onLocaleChange,
}: {
  className?: string;
  onLocaleChange?: () => void;
} = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const current = useLocale() as Locale;
  const [pending, startTransition] = useTransition();

  const onPick = (next: Locale) => {
    if (next === current) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
      onLocaleChange?.();
    });
  };

  return (
    <div
      className={["lang", className].filter(Boolean).join(" ")}
      role="group"
      aria-label="Language"
    >
      {routing.locales.map((l, i) => (
        <span key={l} className="lang-row">
          {i > 0 && <span className="sep" aria-hidden="true">·</span>}
          <button
            type="button"
            className={"lang-btn" + (l === current ? " is-active" : "")}
            aria-current={l === current ? "true" : undefined}
            aria-label={`Switch to ${l.toUpperCase()}`}
            disabled={pending}
            onClick={() => onPick(l)}
          >
            {LABELS[l]}
          </button>
        </span>
      ))}
    </div>
  );
}
