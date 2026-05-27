import { getTranslations } from "next-intl/server";

/**
 * Full-viewport black hero with the verbatim 3-line copy from the
 * client banner (build-prompt §5 / design-prompt §A.2). The razorbill
 * mark is watermarked bottom-right at ~10% opacity.
 */
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
        <a className="hero-cta" href="#contact">
          {t("cta")} <span className="arrow" aria-hidden="true">→</span>
        </a>
      </div>
      <div className="hero-foot">
        <span>{t("footRole")}</span>
        <span>{t("scroll")}</span>
      </div>
    </section>
  );
}
