import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { commercialContractsFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Commercial Contracts in Hyderabad | ${firm.name}`,
  description:
    "Commercial-contract information for vendor, service, employment, contractor, founder, shareholder, NDA and dispute steps in Hyderabad.",
  path: "/commercial-contracts",
});

const contractStages = [
  {
    title: "Drafting and review before signing",
    body:
      "The first reading usually starts with the purpose of the agreement, the parties, payment terms, delivery or service obligations, confidentiality, ownership of work, termination, dispute clauses, and what has already been exchanged in writing.",
  },
  {
    title: "Founder, shareholder and work arrangements",
    body:
      "Founder, shareholder, employment, contractor, NDA, and IP assignment documents need careful reading because small clauses can affect control, payment, responsibility, and later disputes.",
  },
  {
    title: "Notices and commercial-dispute steps",
    body:
      "When a business relationship has already broken down, the next step may be a notice, reply, settlement discussion, interim application, civil suit, arbitration-related step, revision, or appeal depending on the document and stage.",
  },
] as const;

const handled = [
  "Vendor and service agreements",
  "Employment and contractor contracts",
  "Founder and shareholder documents",
  "NDAs and IP assignment documents",
  "Commercial notices, replies and settlement steps",
  "Commercial-dispute filings and court-stage questions",
] as const;

function commercialContractsServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/commercial-contracts" : `/${locale}/commercial-contracts`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Commercial contracts",
    name: "Commercial contracts in Hyderabad",
    description:
      "Information on vendor agreements, service contracts, employment and contractor documents, founder and shareholder papers, NDAs, IP assignments, notices and commercial-dispute steps in Hyderabad.",
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
      name: "Commercial-contract matters handled",
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

export default async function CommercialContractsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedContractsUrl =
    locale === "en"
      ? `${SITE_URL}/commercial-contracts`
      : `${SITE_URL}/${locale}/commercial-contracts`;

  const ld = graphSchema([
    commercialContractsServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Commercial Contracts", url: localizedContractsUrl },
    ]),
    faqPageSchema(commercialContractsFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero commercial-hero"
        aria-labelledby="commercial-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Commercial Contracts</span>
        </nav>
        <h1 id="commercial-title">Commercial contracts in Hyderabad.</h1>
        <p className="lede">
          Vendor agreements, service terms, employment and contractor documents,
          NDAs, IP assignments and commercial-dispute steps, read before the
          next signature, notice or filing.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body commercial-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="corporate" size={36} />
            </span>
            <span>
              Commercial documents are easier to work through when the business
              position is clear before the clauses are edited. The useful first
              step is to understand the document, the relationship, the money,
              the deadline, and the next practical risk.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the document is the one who discusses the
            next step, so the commercial context stays with one counsel.
          </p>

          <div
            className="commercial-steps"
            aria-label="Commercial-contract stages"
          >
            {contractStages.map((stage, index) => (
              <article className="commercial-step" key={stage.title}>
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
            aria-labelledby="commercial-faq-title"
          >
            <h2 id="commercial-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {commercialContractsFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Commercial
            contract and dispute work depends on the document, the business
            context, prior communications, deadlines, and the forum or court
            before which the matter may be placed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a commercial document in confidence.</h3>
            <p>
              Share the document type, business relationship, deadline, and
              whether the matter is before signing, after breach, or already in
              dispute. A first conversation helps decide whether this firm is
              the right fit for the matter.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/cheque-bounce-case-procedure-hyderabad">
                  Cheque Bounce Procedure
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-dishonour">Cheque Dishonour</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/specific-performance">Specific Performance</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/legal-notices">Legal Notices</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/corporate">
                  Corporate & Commercial
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil & Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/high-court">High Court Matters</Link>
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
