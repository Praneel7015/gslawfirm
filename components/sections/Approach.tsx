import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";

export async function Approach() {
  const t = await getTranslations("approach");

  const items: Array<{ num: string; key: "personal" | "discreet" | "continuity" }> = [
    { num: "01", key: "personal" },
    { num: "02", key: "discreet" },
    { num: "03", key: "continuity" },
  ];

  return (
    <section className="approach" id="approach">
      <div className="approach-head">
        <div>
          <span className="eyebrow" style={{ marginBottom: 18, display: "block" }}>
            {t("eyebrow")}
          </span>
          <h2>{t("heading")}</h2>
        </div>
        <p>{t("lede")}</p>
      </div>
      <div className="approach-grid">
        {items.map((it) => (
          <div key={it.num} className="approach-cell">
            <h3>{t(`items.${it.key}.title`)}</h3>
            <p>{t(`items.${it.key}.body`)}</p>
          </div>
        ))}
      </div>
      <div className="approach-continuity-link">
        <span>{t("continuityExplainer.label")}</span>
        <p>{t("continuityExplainer.body")}</p>
        <Link href="/continuity-of-counsel">
          {t("continuityExplainer.link")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}
