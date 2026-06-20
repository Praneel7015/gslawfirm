import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";
import { ContactForm } from "@/components/sections/ContactForm";
import { Location } from "@/components/sections/Location";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graphSchema, placeSchema } from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("contact", locale);
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contactPage");

  const ld = graphSchema([
    placeSchema(),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Contact", url: `${SITE_URL}/contact` },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="cp-hero" aria-labelledby="cp-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="cp-title">{t("heading")}</h1>
        <p className="lede">{t("lede")}</p>
      </section>

      <section className="cp-grid" aria-label="Three ways to reach us">
        <div className="cp-cell">
          <h2>{t("phone.label")}</h2>
          <a href={`tel:${firm.phoneE164}`}>
            <div className="big">{firm.phone}</div>
          </a>
          <p>{t("phone.note")}</p>
        </div>
        <div className="cp-cell">
          <h2>{t("email.label")}</h2>
          <a href={`mailto:${firm.publicEmail}`}>
            <div className="big">{firm.publicEmail}</div>
          </a>
          <p>{t("email.note")}</p>
        </div>
        <div className="cp-cell">
          <h2>{t("inPerson.label")}</h2>
          <a href={firm.mapsUrl} target="_blank" rel="noopener noreferrer">
            <div className="big">{t("inPerson.big")}</div>
          </a>
          <p>{t("inPerson.note")}</p>
        </div>
      </section>

      <ContactForm />
      <Location />
    </main>
  );
}
