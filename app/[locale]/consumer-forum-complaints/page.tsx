import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { consumerForumComplaintsFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Consumer Forum Complaints in Hyderabad | ${firm.name}`,
  description:
    "Consumer-forum complaint information for defective goods, service deficiency, refund issues, builder-service records, notices, evidence, orders and appeal context in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/consumer-forum-complaints",
});

const consumerStages = [
  {
    title: "Purchase, service and complaint records",
    body:
      "The first reading usually starts with invoices, receipts, order confirmations, warranty papers, service records, emails, messages, complaint numbers, photographs, notices and replies.",
  },
  {
    title: "Consumer forum or alternate forum context",
    body:
      "A consumer complaint can involve defective goods, service deficiency, refund or replacement issues, platform responses, builder-service records, or other documents showing the transaction and the grievance.",
  },
  {
    title: "Evidence, orders and later steps",
    body:
      "If the matter is already before a consumer commission, the next step may involve reply papers, evidence, written arguments, settlement discussion, order review, execution, appeal or revision context.",
  },
] as const;

const handled = [
  "Defective goods and service-deficiency complaints",
  "Refund, replacement and warranty records",
  "Builder or housing-service deficiency context",
  "Notices, replies and complaint papers",
  "Evidence, invoices and correspondence",
  "Consumer commission orders, execution and appeal context",
] as const;

function consumerForumComplaintsServiceSchema(locale: string) {
  const path =
    locale === "en"
      ? "/consumer-forum-complaints"
      : `/${locale}/consumer-forum-complaints`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Consumer forum complaints",
    name: "Consumer forum complaints in Hyderabad",
    description:
      "Information on consumer complaints, defective goods, service deficiency, refund issues, builder-service records, notices, evidence, orders, execution and appeal context in Hyderabad.",
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
      name: "Consumer-forum complaint matters handled",
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

export default async function ConsumerForumComplaintsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedConsumerUrl =
    locale === "en"
      ? `${SITE_URL}/consumer-forum-complaints`
      : `${SITE_URL}/${locale}/consumer-forum-complaints`;

  const ld = graphSchema([
    consumerForumComplaintsServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Consumer Forum Complaints", url: localizedConsumerUrl },
    ]),
    faqPageSchema(consumerForumComplaintsFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero consumer-hero"
        aria-labelledby="consumer-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Consumer Forum Complaints</span>
        </nav>
        <h1 id="consumer-title">Consumer forum complaints in Hyderabad.</h1>
        <p className="lede">
          Defective goods, service deficiency, refund issues, builder-service
          records, notices, evidence, orders and appeal context, read before the
          next consumer forum step is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body consumer-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Consumer complaints usually turn on the transaction record: what
              was promised, what was supplied, what was complained about, and
              what response was received. A careful first reading keeps the
              documents, forum and practical next step together.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the purchase, service and complaint records
            is the one who discusses the notice, complaint, evidence or
            court-stage question.
          </p>

          <div
            className="consumer-steps"
            aria-label="Consumer-forum complaint stages"
          >
            {consumerStages.map((stage, index) => (
              <article className="consumer-step" key={stage.title}>
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

          <section className="service-faq" aria-labelledby="consumer-faq-title">
            <h2 id="consumer-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {consumerForumComplaintsFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Consumer
            complaint next steps depend on the transaction, documents, notices,
            limitation, forum, current stage, and the response already received.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a consumer complaint in confidence.</h3>
            <p>
              Share the bill, receipt, warranty or service papers, complaint
              record, messages, notice or reply, forum papers, and any next date
              if the matter is already filed. A first conversation helps decide
              whether this firm is the right fit for the matter.
            </p>
            <Link href="/contact" className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/commercial-contracts">Commercial Contracts</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/specific-performance">Specific Performance</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil & Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/corporate">
                  Corporate & Commercial
                </Link>
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
