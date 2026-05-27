"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Lockup } from "@/components/brand/Lockup";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky header. Transparent over the dark hero, then `.solid` once the
 * user has scrolled past the hero threshold (or when the page is not
 * the home page — see `alwaysSolid` prop).
 */
export function Header({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (alwaysSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  const solid = alwaysSolid || scrolled;

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <header className={"site-header" + (solid ? " solid" : "")}>
        <Lockup />
        <nav className="nav" aria-label="Primary">
          <Link href="/about" className={isActive("/about") ? "active" : ""}>
            {t("about")}
          </Link>
          <Link href="/practice" className={isActive("/practice") ? "active" : ""}>
            {t("practice")}
          </Link>
          <Link href="/about#approach">{t("approach")}</Link>
          <Link href="/contact" className={isActive("/contact") ? "active" : ""}>
            {t("contact")}
          </Link>
          <LanguageSwitcher />
          <Link href="/contact" className="btn-consult">
            {t("consult")} <span aria-hidden="true">→</span>
          </Link>
        </nav>
        <button
          className={"ham" + (menuOpen ? " open" : "")}
          aria-label="Menu"
          aria-controls="mobile-menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span></span>
          <span></span>
        </button>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
