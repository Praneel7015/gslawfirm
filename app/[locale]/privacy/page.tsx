import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";

export const metadata: Metadata = {
  title: `Privacy · ${firm.name}`,
  description:
    "Privacy notice for visitors to the GS Law Firm website. What we collect, why, and how to ask for it back.",
};

const SECTION_KEYS = ["collect", "use", "retention", "rights", "contact"] as const;

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("privacy");

  return (
    <main id="main">
      <section className="legal-hero" aria-labelledby="priv-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="priv-title">{t("heading")}</h1>
        <p className="legal-updated">{t("updated")}</p>
        <p className="lede">{t("lede")}</p>
      </section>

      <section className="legal-body" aria-label="Privacy policy sections">
        {SECTION_KEYS.map((k) => (
          <article key={k} className="legal-section">
            <h2>{t(`sections.${k}.heading`)}</h2>
            <p>{t(`sections.${k}.body`)}</p>
          </article>
        ))}
        <p className="legal-footer">
          {firm.name} · {firm.address.city}, {firm.address.region}, India
        </p>
      </section>
    </main>
  );
}
