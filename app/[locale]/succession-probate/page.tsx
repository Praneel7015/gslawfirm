import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { successionProbateFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Succession and Probate in Hyderabad | ${firm.name}`,
  description:
    "Succession and probate information for wills, letters of administration, succession papers, family settlement context and inheritance disputes in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/succession-probate",
});

const successionStages = [
  {
    title: "Will and family-paper review",
    body:
      "The first reading usually starts with the will, if one exists, death certificate, family tree or legal-heir papers, property records, bank or investment papers, notices, and any prior case papers. The aim is to understand the family position and documents before a next step is discussed.",
  },
  {
    title: "Probate and succession papers",
    body:
      "Probate, letters of administration, succession certificates, and related papers depend on the assets, document history, family members involved, and whether any dispute has already started.",
  },
  {
    title: "Inheritance disputes and settlement context",
    body:
      "Inheritance disputes can involve partition, declaration, injunction, possession, family settlement deeds, interim applications, evidence, execution, revision, or appeal. The next step depends on the papers and stage.",
  },
] as const;

const handled = [
  "Will review and drafting context",
  "Probate applications",
  "Letters of administration",
  "Succession certificates and inheritance papers",
  "Inheritance disputes and partition-linked questions",
  "Family settlement deeds and court-stage questions",
] as const;

function successionProbateServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/succession-probate" : `/${locale}/succession-probate`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Succession and probate",
    name: "Succession and probate in Hyderabad",
    description:
      "Information on wills, probate applications, letters of administration, succession certificates, family settlement context and inheritance disputes in Hyderabad.",
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
      name: "Succession and probate matters handled",
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

export default async function SuccessionProbatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedSuccessionUrl =
    locale === "en"
      ? `${SITE_URL}/succession-probate`
      : `${SITE_URL}/${locale}/succession-probate`;

  const ld = graphSchema([
    successionProbateServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Succession and Probate", url: localizedSuccessionUrl },
    ]),
    faqPageSchema(successionProbateFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero succession-hero"
        aria-labelledby="succession-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Succession and Probate</span>
        </nav>
        <h1 id="succession-title">Succession and probate in Hyderabad.</h1>
        <p className="lede">
          Wills, probate, letters of administration, succession papers,
          inheritance disputes and family settlement context, read carefully
          before the next filing, notice or family discussion.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body succession-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="will-succession" size={36} />
            </span>
            <span>
              Succession work often starts with documents and family history
              that need to be read together. The useful first step is to
              understand the papers, people involved, assets, deadlines, and
              whether any court or revenue step has already begun.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the papers is the one who discusses the next
            step, so the family context and document history stay with one
            counsel.
          </p>

          <div
            className="succession-steps"
            aria-label="Succession and probate stages"
          >
            {successionStages.map((stage, index) => (
              <article className="succession-step" key={stage.title}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{stage.title}</h2>
                <p>{stage.body}</p>
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

          <section
            className="service-faq"
            aria-labelledby="succession-faq-title"
          >
            <h2 id="succession-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {successionProbateFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Succession and
            probate work depends on the documents, family history, assets,
            limitation, objections, and the court or authority before which the
            matter may be placed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss succession papers in confidence.</h3>
            <p>
              Share whether there is a will, what papers are available, who is
              involved, whether any notice or case has started, and what deadline
              is coming up. A first conversation helps decide whether this firm
              is the right fit for the matter.
            </p>
            <Link href="/contact" className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/practice/will-succession">
                  Wills, Trusts & Succession
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil & Property Disputes</Link>
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
