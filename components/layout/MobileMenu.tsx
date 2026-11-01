"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { useModalFocus } from "@/lib/use-modal-focus";
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

  const dialogRef = useRef<HTMLDialogElement>(null);
  useModalFocus(dialogRef, open);

  const items: Array<[string, "/about" | "/practice" | "/resources" | "/contact"]> = [
    [t("about"), "/about"],
    [t("practice"), "/practice"],
    [t("resources"), "/resources"],
    [t("contact"), "/contact"],
  ];

  return (
    <dialog
      ref={dialogRef}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      aria-label={t("menu")}
      id="mobile-menu"
      className={"mobile-menu" + (open ? " open" : "")}
      aria-hidden={!open}
    >
      <button type="button" className="ham menu-close open" data-initial-focus aria-label={t("close")} onClick={onClose}>
        <span aria-hidden="true" /><span aria-hidden="true" />
      </button>
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
    </dialog>
  );
}
