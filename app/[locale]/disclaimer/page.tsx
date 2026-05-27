import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";

export const metadata: Metadata = {
  title: `Disclaimer · ${firm.name}`,
  description:
    "Bar Council of India advertising disclaimer for visitors to the GS Law Firm website.",
};

const PARAS = ["p1", "p2", "p3", "p4", "p5"] as const;

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("disclaimerPage");

  return (
    <main id="main">
      <section className="legal-hero" aria-labelledby="disc-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="disc-title">{t("heading")}</h1>
        <p className="legal-updated">{t("updated")}</p>
      </section>

      <section className="legal-body" aria-label="Disclaimer text">
        {PARAS.map((k) => (
          <p key={k} className="legal-para">
            {t(k)}
          </p>
        ))}
        <p className="legal-footer">
          {firm.name} · {firm.address.city}, {firm.address.region}, India
        </p>
      </section>
    </main>
  );
}
