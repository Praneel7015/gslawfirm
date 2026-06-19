import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";
import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Bail Applications in Hyderabad | ${firm.name}`,
  description:
    "Information on regular bail, anticipatory bail, remand, surety paperwork and criminal-court appearances in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/bail",
});

const bailSteps = [
  {
    title: "Regular bail",
    body:
      "Regular bail is usually considered after arrest, production before court, or remand. The papers matter: FIR, remand report, sections invoked, prior orders, and any medical or family circumstances that should be placed before court.",
  },
  {
    title: "Anticipatory bail",
    body:
      "Anticipatory bail is considered before an expected arrest. The work begins with reading the complaint or FIR, understanding the accusation, and preparing the facts that explain why custodial interrogation should not be necessary.",
  },
  {
    title: "After the order",
    body:
      "A bail order is not the last step. Conditions, sureties, execution, police-station attendance, and later dates all need to be followed carefully so the order is not put at risk.",
  },
] as const;

const handled = [
  "Regular bail after arrest or remand",
  "Anticipatory bail before expected arrest",
  "FIR, complaint and remand-paper review",
  "Sessions court and High Court bail filings",
  "Surety, bond and order-condition follow-up",
  "Bail cancellation or condition-modification questions",
] as const;

function bailServiceSchema(locale: string) {
  const path = locale === "en" ? "/bail" : `/${locale}/bail`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Bail applications",
    name: "Bail applications in Hyderabad",
    description:
      "Information on regular bail, anticipatory bail, remand, surety paperwork and criminal-court appearances in Hyderabad.",
    url: `${SITE_URL}${path}`,
    provider: {
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
    areaServed: firm.areasServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Bail matters handled",
      itemListElement: handled.map((name, index) => ({
        "@type": "Offer",
        position: index + 1,
        itemOffered: {
          "@type": "Service",
          name,
        },
      })),
    },
  };
}

export default async function BailPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedBailUrl =
    locale === "en" ? `${SITE_URL}/bail` : `${SITE_URL}/${locale}/bail`;

  const ld = graphSchema([
    bailServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Bail", url: localizedBailUrl },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero bail-hero" aria-labelledby="bail-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Bail</span>
        </nav>
        <h1 id="bail-title">Bail applications in Hyderabad.</h1>
        <p className="lede">
          Regular bail, anticipatory bail, remand papers and court conditions,
          handled with a clear reading of the file before the next step is taken.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body bail-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="criminal" size={36} />
            </span>
            <span>
              Bail work often starts before there is time to prepare calmly. The
              useful first step is to collect the papers, understand the stage of
              the case, and decide which court should hear the application.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the papers is the one who appears for the
            matter, so the facts do not have to be retold at every stage.
          </p>

          <div className="bail-steps" aria-label="Bail application stages">
            {bailSteps.map((step, index) => (
              <article className="bail-step" key={step.title}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="pd-handle">
            <h2>What this page covers</h2>
            <ul>
              {handled.map((item, index) => (
                <li key={item}>
                  <span className="li-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="pd-footnote">
            This page is general information, not legal advice. Bail depends on
            the facts of the case, the sections invoked, prior orders, and the
            court before which the matter is listed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a bail matter in confidence.</h3>
            <p>
              Share the FIR number, court stage, next date, and what has already
              happened. A first conversation helps decide whether this firm is
              the right fit for the matter.
            </p>
            <Link href="/contact" className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/practice/criminal">Criminal Litigation</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/high-court">High Court Matters</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/contact">Contact the firm</Link>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
