import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Disclaimer · ${firm.name}`,
  description:
    "Bar Council of India advertising disclaimer for visitors to the GS Law Firm website.",
  path: "/disclaimer",
});

const PARAS = ["p1", "p2", "p3", "p4", "p5"] as const;

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("disclaimerPage");

  const ld = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Disclaimer", url: `${SITE_URL}/disclaimer` },
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
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
