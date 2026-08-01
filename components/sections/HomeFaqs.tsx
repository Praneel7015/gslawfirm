import { getTranslations } from "next-intl/server";

import type { ServiceFaq } from "@/content/service-faqs";

const faqKeys = ["contract", "business", "criminal", "nearby"] as const;

export type HomeFaq = ServiceFaq & { key: (typeof faqKeys)[number] };

export async function getHomeFaqs(): Promise<readonly HomeFaq[]> {
  const t = await getTranslations("homeFaqs");

  return faqKeys.map((key) => ({
    key,
    question: t(`items.${key}.question`),
    answer: t(`items.${key}.answer`),
  }));
}

export async function HomeFaqs({ items }: { items: readonly HomeFaq[] }) {
  const t = await getTranslations("homeFaqs");

  return (
    <section className="home-faqs" aria-labelledby="home-faq-title">
      <div className="home-faqs-head">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2 id="home-faq-title">{t("heading")}</h2>
        <p>{t("lede")}</p>
      </div>
      <div className="home-faqs-list">
        {items.map((item, index) => (
          <article className="home-faqs-item" key={item.key}>
            <span className="home-faqs-number" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
