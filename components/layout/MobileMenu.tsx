"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { LanguageSwitcher } from "./LanguageSwitcher";

/**
 * Fullscreen black overlay menu (mobile only).
 * Locks body scroll while open and closes on link tap.
 */
export function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("nav");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items: Array<[string, "/about" | "/practice" | "/contact"]> = [
    [t("about"), "/about"],
    [t("practice"), "/practice"],
    [t("contact"), "/contact"],
  ];

  return (
    <div
      id="mobile-menu"
      className={"mobile-menu" + (open ? " open" : "")}
      aria-hidden={!open}
    >
      {items.map(([label, href]) =>
        href === "/contact" ? (
          <SourceAwareContactLink key={href} onClick={onClose}>
            {label}
          </SourceAwareContactLink>
        ) : (
          <Link key={href} href={href} onClick={onClose}>
            {label}
          </Link>
        ),
      )}
      <div className="mobile-menu-lang">
        <LanguageSwitcher onLocaleChange={onClose} />
      </div>
      <div className="menu-foot">
        {firm.phone} · {firm.publicEmail}
        <br />
        Kondapur, Hyderabad
      </div>
    </div>
  );
}
