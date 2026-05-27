"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";

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

  const items: Array<[string, "/about" | "/practice" | "/about#approach" | "/contact", string]> = [
    [t("about"), "/about", "01"],
    [t("practice"), "/practice", "02"],
    [t("approach"), "/about#approach", "03"],
    [t("contact"), "/contact", "04"],
  ];

  return (
    <div
      id="mobile-menu"
      className={"mobile-menu" + (open ? " open" : "")}
      aria-hidden={!open}
    >
      {items.map(([label, href, num]) => (
        <Link key={href} href={href} onClick={onClose}>
          {label}
          <span className="num">{num}</span>
        </Link>
      ))}
      <div className="menu-foot">
        {firm.phone} · {firm.publicEmail}
        <br />
        Kondapur, Hyderabad
      </div>
    </div>
  );
}
