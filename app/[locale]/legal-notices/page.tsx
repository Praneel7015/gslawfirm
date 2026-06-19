import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { legalNoticesFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Legal Notices and Replies in Hyderabad | ${firm.name}`,
  description:
    "Legal-notice and reply information for property, contract, tenancy, injunction, specific-performance and civil-suit context in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/legal-notices",
});

const noticeStages = [
  {
    title: "Notice, deadline and reply context",
    body:
      "The first reading usually starts with the notice received or proposed, date of receipt, delivery proof, deadline mentioned, sender details, reply history, and the papers the notice relies on.",
  },
  {
    title: "Documents, facts and limitation",
    body:
      "Property papers, lease papers, agreements, invoices, payment records, messages, photographs, earlier complaints and prior replies help place the notice in a chronology. Limitation and forum questions depend on the facts and documents.",
  },
  {
    title: "Suit, injunction or settlement stage",
    body:
      "After a notice or reply, the next step may involve settlement discussion, pleadings, interim relief, suit papers, written statement, evidence, execution, appeal or revision context. The file decides the direction.",
  },
] as const;

const handled = [
  "Legal notice review and reply context",
  "Property, tenancy and possession notices",
  "Contract, invoice and service-payment notices",
  "Specific-performance and injunction-related notices",
  "Civil suit papers, pleadings and next-date context",
  "Documents, limitation and court-stage questions",
] as const;

function legalNoticesServiceSchema(locale: string) {
  const path = locale === "en" ? "/legal-notices" : `/${locale}/legal-notices`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Legal notices and replies",
    name: "Legal notices and replies in Hyderabad",
    description:
      "Information on legal notices, replies, documents, limitation and civil-suit context for property, tenancy, contract, specific-performance and injunction matters in Hyderabad.",
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
      name: "Legal-notice and reply matters handled",
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

export default async function LegalNoticesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedNoticeUrl =
    locale === "en"
      ? `${SITE_URL}/legal-notices`
      : `${SITE_URL}/${locale}/legal-notices`;

  const ld = graphSchema([
    legalNoticesServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Legal Notices", url: localizedNoticeUrl },
    ]),
    faqPageSchema(legalNoticesFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero legal-hero" aria-labelledby="legal-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Legal Notices</span>
        </nav>
        <h1 id="legal-title">Legal notices and replies in Hyderabad.</h1>
        <p className="lede">
          Notice review, reply preparation, documents, limitation and civil-suit
          context, read before the next reply, filing or hearing is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body legal-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Legal notices often arrive before the court stage, but they still
              need a careful reading of documents, dates, replies and what has
              already happened. A measured first step keeps the notice, facts
              and possible court context together.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the notice, agreements, property papers,
            messages or invoices is the one who discusses the reply, filing,
            interim relief or court-stage question.
          </p>

          <div className="legal-steps" aria-label="Legal-notice stages">
            {noticeStages.map((stage, index) => (
              <article className="legal-step" key={stage.title}>
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

          <section className="service-faq" aria-labelledby="legal-faq-title">
            <h2 id="legal-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {legalNoticesFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Notice and reply
            next steps depend on the documents, limitation, forum, parties,
            current stage, prior communications and the record already created.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a notice or reply in confidence.</h3>
            <p>
              Share the notice received or proposed, delivery proof, agreements,
              property or lease papers, invoices, payment records, messages,
              earlier replies, case papers and any next date. A first
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
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/tenancy-eviction">Tenancy and Eviction</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/specific-performance">Specific Performance</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/injunction-interim-relief">
                  Injunction and Interim Relief
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/commercial-contracts">Commercial Contracts</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-bounce-case-procedure-hyderabad">
                  Cheque Bounce Procedure
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil & Property Disputes</Link>
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
