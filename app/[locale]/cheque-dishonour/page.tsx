import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { chequeDishonourFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Cheque Dishonour in Hyderabad | ${firm.name}`,
  description:
    "Cheque-dishonour information for N.I. Act Section 138 notices, complaints, summons, evidence, settlement discussions and appeal or revision steps in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/cheque-dishonour",
});

const chequeStages = [
  {
    title: "Notice and limitation review",
    body:
      "The first reading usually starts with the cheque, bank return memo, invoice or transaction papers, notice timeline, acknowledgement details, and any reply or communication already exchanged.",
  },
  {
    title: "Complaint, summons and evidence stage",
    body:
      "If a complaint has already been filed or summons has been received, the papers need to be read with the court stage, next date, evidence, and defence or reply material in mind.",
  },
  {
    title: "Settlement, appeal and revision context",
    body:
      "Settlement discussions, compounding, appeals, revisions, and related civil or commercial steps depend on the documents, payment history, court stage, and the practical position between the parties.",
  },
] as const;

const handled = [
  "Demand-notice and limitation papers",
  "N.I. Act Section 138 complaints",
  "Summons, appearance and evidence-stage questions",
  "Reply papers and transaction records",
  "Settlement and compounding context",
  "Appeal, revision and related court-stage steps",
] as const;

function chequeDishonourServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/cheque-dishonour" : `/${locale}/cheque-dishonour`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Cheque dishonour matters",
    name: "Cheque dishonour matters in Hyderabad",
    description:
      "Information on N.I. Act Section 138 demand notices, complaints, summons, evidence, settlement discussions, appeals and revisions in Hyderabad.",
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
      name: "Cheque-dishonour matters handled",
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

export default async function ChequeDishonourPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedChequeUrl =
    locale === "en"
      ? `${SITE_URL}/cheque-dishonour`
      : `${SITE_URL}/${locale}/cheque-dishonour`;

  const ld = graphSchema([
    chequeDishonourServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Cheque Dishonour", url: localizedChequeUrl },
    ]),
    faqPageSchema(chequeDishonourFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero cheque-hero" aria-labelledby="cheque-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Cheque Dishonour</span>
        </nav>
        <h1 id="cheque-title">Cheque dishonour matters in Hyderabad.</h1>
        <p className="lede">
          N.I. Act Section 138 notices, complaints, summons, evidence,
          settlement discussions and appeal or revision steps, read with the
          transaction papers before the next move is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body cheque-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="criminal" size={36} />
            </span>
            <span>
              Cheque-dishonour matters sit between criminal process and
              commercial paperwork. The useful first step is to place the cheque,
              bank memo, notice, transaction documents, reply, summons, and court
              stage in one chronology.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the transaction papers is the one who
            discusses notice, complaint, evidence, settlement, or court-stage
            questions, so the commercial context stays with the file.
          </p>

          <div className="cheque-steps" aria-label="Cheque-dishonour stages">
            {chequeStages.map((stage, index) => (
              <article className="cheque-step" key={stage.title}>
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

          <section className="service-faq" aria-labelledby="cheque-faq-title">
            <h2 id="cheque-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {chequeDishonourFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Cheque-dishonour
            matters depend on the cheque, bank return memo, notice timeline,
            transaction papers, court stage, and the position taken by both
            parties.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a cheque-dishonour matter in confidence.</h3>
            <p>
              Share the cheque, return memo, notice papers, transaction records,
              reply or summons, and the next court date if there is one. A first
              conversation helps decide whether this firm is the right fit for
              the matter.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/criminal-defense">Criminal Defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/commercial-contracts">Commercial Contracts</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/criminal">Criminal Litigation</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/corporate">
                  Corporate & Commercial
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <SourceAwareContactLink>Contact the firm</SourceAwareContactLink>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
