"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Lockup } from "@/components/brand/Lockup";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileMenu } from "./MobileMenu";

/**
 * Sticky header. Transparent over the dark hero (home only), and
 * always solid on every other route. Falls into the `.solid` state
 * automatically once the user scrolls past the hero threshold.
 */
export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const solid = !isHome || scrolled;

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
          <Link href="/#approach">{t("approach")}</Link>
          <SourceAwareContactLink className={isActive("/contact") ? "active" : ""}>
            {t("contact")}
          </SourceAwareContactLink>
          <LanguageSwitcher />
          <SourceAwareContactLink className="btn-consult">
            {t("consult")} <span aria-hidden="true">→</span>
          </SourceAwareContactLink>
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
