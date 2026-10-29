import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <span className="hero-bg-mark" aria-hidden="true" />
      <div className="hero-inner">
        <p className="hero-eyebrow">
          <span className="line" aria-hidden="true" />
          <span>{t("eyebrow")}</span>
        </p>
        <h1 className="hero-title" id="hero-title">
          <span className="line">{t("line1")}</span>
          <span className="line">{t("line2")}</span>
          <span className="line em-line">
            <span className="em">{t("emphasis")}</span>
          </span>
        </h1>
        <p className="hero-body">{t("body")}</p>
        <nav className="hero-actions" aria-label={t("actions")}>
          <a className="hero-cta" href="#contact">
            {t("cta")} <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="hero-cta" href={`tel:${firm.phoneE164}`}>{t("call")}</a>
          <Link className="hero-cta" href="/commercial-contracts">{t("contractGuide")}</Link>
        </nav>
      </div>
      <div className="hero-foot">
        <span>{t("footRole")}</span>
        <span>{t("scroll")}</span>
      </div>
    </section>
  );
}
