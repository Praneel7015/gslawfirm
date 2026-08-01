import { getTranslations } from "next-intl/server";

const faqKeys = ["contract", "business", "criminal", "nearby"] as const;

export async function HomeFaqs() {
  const t = await getTranslations("homeFaqs");

  return (
    <section className="home-faqs" aria-labelledby="home-faq-title">
      <div className="home-faqs-head">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2 id="home-faq-title">{t("heading")}</h2>
        <p>{t("lede")}</p>
      </div>
      <div className="home-faqs-list">
        {faqKeys.map((key, index) => (
          <article className="home-faqs-item" key={key}>
            <span className="home-faqs-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{t(`items.${key}.question`)}</h3>
              <p>{t(`items.${key}.answer`)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
