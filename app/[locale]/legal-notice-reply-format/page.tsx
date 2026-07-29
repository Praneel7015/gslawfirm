import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { legalNoticeReplyFormatFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("legalNoticeReplyFormat", locale);
}

const preparationSteps = [
  {
    title: "Read the complete notice",
    body: "Start with the sender, date, delivery method, deadline, legal or contractual clauses cited, factual allegations, amount or relief claimed, and documents mentioned. The envelope, email headers or delivery record may matter as much as the notice itself.",
  },
  {
    title: "Build a dated chronology",
    body: "List the agreement, transaction, possession, payment, communication, complaint and notice events in date order. A chronology helps separate facts that can be supported from assumptions that should not enter the reply.",
  },
  {
    title: "Match each allegation to a record",
    body: "Place agreements, invoices, receipts, bank records, messages, photographs, property or lease papers, earlier complaints and prior replies beside the allegation they address. Note what is missing rather than filling a gap from memory.",
  },
  {
    title: "Identify the real deadline",
    body: "The date printed in a notice is not the only time question. Receipt, contract terms, limitation, a pending court date, statutory steps and earlier communications may all affect the response plan. Do not assume silence or a quick reply has the same effect in every matter.",
  },
] as const;

const replySections = [
  {
    title: "Heading and reference",
    body: "Identify the notice being answered, its date, the parties, the subject and any agreement, property, invoice or case reference needed to connect the reply to the correct record.",
  },
  {
    title: "Authority and opening position",
    body: "State on whose instructions the reply is sent and give a short opening position. This should orient the reader without turning the first paragraph into argument or repetition.",
  },
  {
    title: "Paragraph-wise response",
    body: "Answer material allegations in an order that can be followed. A response may admit a fact, deny it, say it is incomplete, ask for proof, or explain that the record gives a different context. The wording should match the documents.",
  },
  {
    title: "Chronology and supporting facts",
    body: "Set out the dates and documents that support the response. Where the notice omits a payment, communication, delivery, possession event or earlier complaint, place that event in the chronology without overstating what it proves.",
  },
  {
    title: "Legal and contractual context",
    body: "Relevant clauses, obligations, rights or procedural points may be addressed after the factual record is clear. The correct points depend on the matter and should not be copied from an unrelated sample.",
  },
  {
    title: "Closing position and next step",
    body: "The close may reject a demand, seek records, call for a correction, propose a practical discussion, reserve a position, or state another next step. It should be consistent with the rest of the reply and the client's intended course.",
  },
] as const;

const documentChecklist = [
  "The complete notice, every annexure, and delivery proof",
  "The agreement, lease, title paper, invoice or transaction record",
  "Receipts, bank entries, payment acknowledgements and account statements",
  "Emails, messages, letters and earlier complaints or replies",
  "Photographs, inspection records, possession or delivery records",
  "Court, police, consumer-forum or authority papers already received",
  "A dated chronology and the next known deadline or hearing date",
] as const;

const matterContexts = [
  {
    title: "Property and tenancy",
    body: "A reply may need to distinguish title, possession, tenancy terms, rent, termination, maintenance, damage, access, prior notices and pending injunction or eviction proceedings. The property description and documents must stay consistent.",
  },
  {
    title: "Contracts, invoices and business records",
    body: "The agreement, scope, delivery record, acceptance, invoice, payment history, notice clause, correspondence and alleged breach usually shape the response. A generic denial can create a poor record when the documents call for a precise explanation.",
  },
  {
    title: "Consumer complaints and service disputes",
    body: "Bills, warranties, service requests, complaint numbers, refund communications, inspection reports and platform responses may be relevant. The reply should address the actual service or product history rather than a general template.",
  },
  {
    title: "Civil proceedings already underway",
    body: "If a suit, injunction application, consumer complaint, criminal complaint or other proceeding already exists, the reply cannot be planned in isolation. Pleadings, orders, statements already made and the next date should be read together.",
  },
] as const;

function replyFormatWebPageSchema(locale: string) {
  const path =
    locale === "en"
      ? "/legal-notice-reply-format"
      : `/${locale}/legal-notice-reply-format`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Legal notice reply format guide for Hyderabad",
    description:
      "General information on legal notice reply structure, documents, chronology, deadline handling and the limits of generic Word templates in Hyderabad.",
    url: `${SITE_URL}${path}`,
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
      "Legal notice reply format",
      "Reply structure",
      "Notice documents",
      "Chronology",
      "Deadline context",
      "Hyderabad civil matters",
    ],
  };
}

export default async function LegalNoticeReplyFormatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedGuideUrl =
    locale === "en"
      ? `${SITE_URL}/legal-notice-reply-format`
      : `${SITE_URL}/${locale}/legal-notice-reply-format`;

  const ld = graphSchema([
    replyFormatWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Legal Notices", url: `${SITE_URL}/legal-notices` },
      { name: "Legal Notice Reply Format", url: localizedGuideUrl },
    ]),
    faqPageSchema(legalNoticeReplyFormatFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero" aria-labelledby="reply-format-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <Link href="/legal-notices">Legal Notices</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Reply Format</span>
        </nav>
        <h1 id="reply-format-title">
          Legal notice reply format: a Hyderabad guide.
        </h1>
        <p className="lede">
          A practical structure for reading a notice, organizing the record and
          preparing a reply without mistaking a generic Word file for advice on
          a specific matter.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              A legal notice reply is part of the written record. Its structure
              matters, but the facts, documents, deadline and next legal stage
              decide what the reply should actually say.
            </span>
          </p>

          <p>
            People often search for a legal notice reply format in Word because
            they need a quick starting point. A sample can show headings, but it
            cannot know which facts should be admitted, denied or explained,
            which records are missing, whether a deadline has another legal
            effect, or how the reply may be read later in a suit or complaint.
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. This
            guide explains a careful preparation sequence and a common reply
            structure. It does not provide a filing-ready template or decide the
            response for a particular notice.
          </p>

          <div className="legal-steps" aria-label="Preparation before a reply">
            {preparationSteps.map((step, index) => (
              <article className="legal-step" key={step.title}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <section className="service-faq" aria-labelledby="reply-structure">
            <h2 id="reply-structure">A useful legal notice reply structure</h2>
            <p>
              There is no universal reply wording. The six sections below are a
              reading framework for organizing a response, not text to copy
              without checking the record.
            </p>
            <div className="service-faq-list">
              {replySections.map((section, index) => (
                <article className="service-faq-item" key={section.title}>
                  <h3>
                    {String(index + 1).padStart(2, "0")}. {section.title}
                  </h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="service-faq" aria-labelledby="word-template-risk">
            <h2 id="word-template-risk">
              Why a generic Word reply format can create risk
            </h2>
            <div className="service-faq-list">
              <article className="service-faq-item">
                <h3>It may answer a different kind of notice</h3>
                <p>
                  A property notice, tenancy notice, payment demand, consumer
                  complaint and contract dispute can involve different
                  documents, remedies, forums and time questions. Similar
                  headings do not make the underlying response interchangeable.
                </p>
              </article>
              <article className="service-faq-item">
                <h3>It may make an unnecessary admission</h3>
                <p>
                  Standard phrases can accept a relationship, transaction,
                  amount, possession position, delivery event or earlier
                  communication that the actual documents do not support. A
                  reply should not add facts merely because a sample contains
                  them.
                </p>
              </article>
              <article className="service-faq-item">
                <h3>It may omit the strongest record</h3>
                <p>
                  A generic denial may ignore a receipt, message, contract
                  clause, complaint acknowledgement, photograph or order that
                  gives the response its clearest factual foundation.
                </p>
              </article>
              <article className="service-faq-item">
                <h3>It may conflict with the next stage</h3>
                <p>
                  A later pleading, affidavit, complaint, settlement discussion
                  or cross-examination may be compared with the reply. The
                  response should therefore be consistent with the available
                  record and the course the client may need to take.
                </p>
              </article>
            </div>
          </section>

          <section className="service-faq" aria-labelledby="matter-contexts">
            <h2 id="matter-contexts">How the format changes with the matter</h2>
            <div className="service-faq-list">
              {matterContexts.map((context) => (
                <article className="service-faq-item" key={context.title}>
                  <h3>{context.title}</h3>
                  <p>{context.body}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="pd-handle">
            <h2>Documents to place beside the notice</h2>
            <ul>
              {documentChecklist.map((item, index) => (
                <li key={item}>
                  <span className="li-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <section className="service-faq" aria-labelledby="reply-format-faq">
            <h2 id="reply-format-faq">Common questions</h2>
            <div className="service-faq-list">
              {legalNoticeReplyFormatFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This guide is general information, not legal advice or a legal
            notice reply template for a specific matter. The response depends on
            the complete notice, documents, parties, facts, delivery record,
            limitation, forum, prior communications and any pending proceeding.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Share the notice and its deadline.</h3>
            <p>
              A useful first note includes the complete notice, receipt date,
              response date mentioned, a short chronology, the main supporting
              documents, earlier replies and any pending court or complaint
              stage.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related pages</h3>
            <ul>
              <li>
                <Link href="/legal-notices">Legal Notices and Replies</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/tenancy-eviction">Tenancy and Eviction</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/commercial-contracts">Commercial Contracts</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/consumer-forum-complaints">
                  Consumer Forum Complaints
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <SourceAwareContactLink>
                  Contact the firm
                </SourceAwareContactLink>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
