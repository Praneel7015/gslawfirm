import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { specificPerformanceFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Specific Performance in Hyderabad | ${firm.name}`,
  description:
    "Specific-performance information for sale agreements, property and business-contract obligations, notices, pleadings, interim relief, evidence, execution and appeal context in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/specific-performance",
});

const performanceStages = [
  {
    title: "Agreement and obligation review",
    body:
      "The first reading usually starts with the sale agreement or contract, payment records, timelines, correspondence, notices, replies, possession or delivery context, and papers showing what each side was expected to do.",
  },
  {
    title: "Notices, pleadings and interim relief",
    body:
      "When an agreement is not being performed, the next step may involve a notice, reply, settlement discussion, suit papers, written statement, or interim application. The choice depends on the document, deadline, forum and current stage.",
  },
  {
    title: "Evidence, execution and later court steps",
    body:
      "Specific-performance matters can move through evidence, cross-examination, final arguments, decree, execution, appeal or revision. Each stage needs the contract record and chronology to stay clear.",
  },
] as const;

const handled = [
  "Sale-agreement and contract-performance disputes",
  "Property or business-contract obligations",
  "Notices, replies and pre-suit document review",
  "Injunction and interim-relief context",
  "Pleadings, evidence and witness-stage papers",
  "Execution, appeal and revision context",
] as const;

function specificPerformanceServiceSchema(locale: string) {
  const path =
    locale === "en"
      ? "/specific-performance"
      : `/${locale}/specific-performance`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Specific performance",
    name: "Specific performance in Hyderabad",
    description:
      "Information on agreement-enforcement disputes, sale agreements, contract obligations, notices, pleadings, interim relief, evidence, execution and appeal context in Hyderabad.",
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
      name: "Specific-performance matters handled",
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

export default async function SpecificPerformancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedSpecificPerformanceUrl =
    locale === "en"
      ? `${SITE_URL}/specific-performance`
      : `${SITE_URL}/${locale}/specific-performance`;

  const ld = graphSchema([
    specificPerformanceServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Specific Performance", url: localizedSpecificPerformanceUrl },
    ]),
    faqPageSchema(specificPerformanceFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero specific-hero"
        aria-labelledby="specific-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Specific Performance</span>
        </nav>
        <h1 id="specific-title">Specific performance matters in Hyderabad.</h1>
        <p className="lede">
          Sale agreements, property and business-contract obligations, notices,
          interim relief, evidence, execution and appeal context, read before
          the next court step.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body specific-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Specific-performance questions usually start with the agreement:
              what was promised, what was paid, what changed, and what papers
              show each side&apos;s position. A careful first reading helps
              separate the document issue from the court-stage question.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the agreement and chronology is the one who
            discusses the next step, so the paper trail stays with one counsel.
          </p>

          <div
            className="specific-steps"
            aria-label="Specific-performance stages"
          >
            {performanceStages.map((stage, index) => (
              <article className="specific-step" key={stage.title}>
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
            aria-labelledby="specific-faq-title"
          >
            <h2 id="specific-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {specificPerformanceFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Whether a
            specific-performance step can be discussed depends on the agreement,
            parties, limitation, prior notices, facts, forum and court stage.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss an agreement-enforcement matter in confidence.</h3>
            <p>
              Share the agreement, payment record, notices or replies, messages,
              current court stage, next date, and what has already happened. A
              first conversation helps decide whether this firm is the right fit
              for the matter.
            </p>
            <Link href="/contact" className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/commercial-contracts">Commercial Contracts</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil & Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/high-court-matters">High Court Matters</Link>
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
