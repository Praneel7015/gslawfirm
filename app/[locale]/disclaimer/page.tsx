import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `BCI Disclaimer Explained | ${firm.name}`,
  description:
    "Plain-English explanation of the Bar Council of India disclaimer, website information limits, and confidential enquiry boundary at GS Law Firm.",
  path: "/disclaimer",
});

const PARAS = ["p1", "p2", "p3", "p4", "p5"] as const;
const EXPLAINER_SECTIONS = [
  "why",
  "site",
  "limits",
  "enquiry",
] as const;

function disclaimerWebPageSchema(locale: string) {
  const url =
    locale === "en" ? `${SITE_URL}/disclaimer` : `${SITE_URL}/${locale}/disclaimer`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Bar Council of India disclaimer explained",
    description:
      "A plain-language explanation of why the GS Law Firm website shows a Bar Council of India disclaimer, what the site can explain, and what a confidential enquiry can and cannot do.",
    url,
    isPartOf: {
      "@type": "WebSite",
      name: firm.name,
      url: SITE_URL,
    },
    publisher: {
      "@type": "LegalService",
      name: firm.name,
      url: SITE_URL,
      telephone: firm.phoneE164,
      address: {
        "@type": "PostalAddress",
        streetAddress: `${firm.address.line1}, ${firm.address.line2}`,
        addressLocality: firm.address.city,
        addressRegion: firm.address.region,
        postalCode: firm.address.postalCode,
        addressCountry: firm.address.country,
      },
    },
    about: [
      "Bar Council of India disclaimer",
      "Legal website information limits",
      "Confidential enquiry boundary",
      "Advocate-client relationship",
    ],
  };
}

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("disclaimerPage");

  const localizedDisclaimerUrl =
    locale === "en" ? `${SITE_URL}/disclaimer` : `${SITE_URL}/${locale}/disclaimer`;

  const ld = graphSchema([
    disclaimerWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Disclaimer", url: localizedDisclaimerUrl },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="legal-hero" aria-labelledby="disc-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="disc-title">{t("heading")}</h1>
        <p className="legal-updated">{t("updated")}</p>
        <p className="lede">{t("lede")}</p>
      </section>

      <section className="legal-body" aria-label="Disclaimer text">
        <article className="legal-section">
          <h2>{t("formal.heading")}</h2>
          {PARAS.map((k) => (
            <p key={k}>{t(k)}</p>
          ))}
        </article>

        {EXPLAINER_SECTIONS.map((k) => (
          <article key={k} className="legal-section">
            <h2>{t(`explainer.${k}.heading`)}</h2>
            <p>{t(`explainer.${k}.body`)}</p>
          </article>
        ))}

        <div className="legal-actions" aria-label="Next steps">
          <SourceAwareContactLink>{t("actions.contact")}</SourceAwareContactLink>
          <Link href="/privacy">{t("actions.privacy")}</Link>
        </div>

        <p className="legal-footer">
          {firm.name} · {firm.address.city}, {firm.address.region}, India
        </p>
      </section>
    </main>
  );
}
