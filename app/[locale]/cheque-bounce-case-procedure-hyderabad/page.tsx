import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { RelatedPagesNav } from "@/components/seo/RelatedPagesNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { chequeBounceProcedureFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema, howToSchema } from "@/lib/jsonld";
import {
  localizedPageHeading,
  localizedPageMetadata,
} from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("chequeBounceProcedure", locale);
}

const procedureStages = [
  {
    title: "Dishonour, memo and notice stage",
    body:
      "The first reading usually starts with the cheque, bank return memo, transaction papers, notice date, delivery or acknowledgement record, reply if any, and the dates that connect those papers.",
  },
  {
    title: "Complaint filing and summons stage",
    body:
      "If a complaint has been filed or summons has been received, the useful first question is what papers are already before the court, what the next date is for, and what stage the matter has reached.",
  },
  {
    title: "Evidence, settlement and later steps",
    body:
      "Evidence, cross-examination, settlement discussions, compounding, appeal, revision, and related civil or commercial steps depend on the documents, payment history, court stage, and the positions taken by the parties.",
  },
] as const;

const covered = [
  "Cheque, bank memo and transaction-paper context",
  "Demand notice and payment-window context",
  "Complaint filing and summons-stage questions",
  "Evidence and hearing-stage documents",
  "Settlement and compounding context",
  "Appeal, revision and related court-stage steps",
] as const;

const howToSteps = [
  {
    name: "Collect the cheque, bank memo and transaction records",
    text: "Gather the cheque, bank return memo, transaction papers, invoices, payment records and correspondence that connect the cheque to the underlying obligation.",
  },
  {
    name: "Review the demand notice and payment-window dates",
    text: "Check the notice date, delivery or acknowledgement record, reply if any, and whether the payment window has passed. The dates determine the next procedural step.",
  },
  {
    name: "Prepare complaint or summons-stage papers",
    text: "If a complaint is to be filed or summons has been received, organise the papers already before the court, verify the next date and identify the current stage of the matter.",
  },
  {
    name: "Prepare for evidence, settlement or later steps",
    text: "Organise documents for evidence, cross-examination, settlement discussions, compounding, appeal or revision based on the current court stage and positions taken.",
  },
] as const;

function chequeBounceProcedureWebPageSchema(locale: string) {
  const path =
    locale === "en"
      ? "/cheque-bounce-case-procedure-hyderabad"
      : `/${locale}/cheque-bounce-case-procedure-hyderabad`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cheque bounce case procedure in Hyderabad",
    description:
      "General information on cheque bounce case procedure in Hyderabad, including legal notice, payment-window context, complaint filing, summons, evidence, hearings and later court stages.",
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
    about: covered,
  };
}

export default async function ChequeBounceCaseProcedurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedGuideUrl =
    locale === "en"
      ? `${SITE_URL}/cheque-bounce-case-procedure-hyderabad`
      : `${SITE_URL}/${locale}/cheque-bounce-case-procedure-hyderabad`;

  const ld = graphSchema([
    chequeBounceProcedureWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Cheque Dishonour", url: `${SITE_URL}/cheque-dishonour` },
      { name: "Cheque Bounce Procedure", url: localizedGuideUrl },
    ]),
    howToSchema({
      name: "Cheque bounce case procedure in Hyderabad",
      description:
        "Steps in a cheque-bounce case: collecting the cheque and bank memo, reviewing the demand notice, preparing for complaint or summons, and handling evidence and later court stages.",
      steps: howToSteps,
    }),
    faqPageSchema(chequeBounceProcedureFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero cheque-hero"
        aria-labelledby="cheque-procedure-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <Link href="/cheque-dishonour">Cheque Dishonour</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Cheque Bounce Procedure</span>
        </nav>
        <h1 id="cheque-procedure-title">
          {localizedPageHeading("chequeBounceProcedure", locale)}
        </h1>
        <p className="lede">
          A plain guide to notice, payment-window context, complaint filing,
          summons, evidence, hearings, settlement discussions and later court
          stages in cheque-bounce matters.
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
              A cheque-bounce case usually turns on dates and documents. The
              same chronology that starts with dishonour and notice may later
              affect complaint papers, summons, evidence, settlement discussions
              and later court steps.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. For
            a cheque-bounce matter, the first conversation is usually about
            placing the cheque, bank memo, notice, transaction records and court
            stage in order before any next step is discussed.
          </p>

          <div className="cheque-steps" aria-label="Cheque bounce case stages">
            {procedureStages.map((stage, index) => (
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
            <h2>What this guide covers</h2>
            <ul>
              {covered.map((item, index) => (
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
            aria-labelledby="cheque-procedure-faq-title"
          >
            <h2 id="cheque-procedure-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {chequeBounceProcedureFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This guide is general information, not legal advice. Cheque-bounce
            procedure depends on the cheque, bank return memo, notice dates,
            delivery proof, transaction papers, limitation, current court stage,
            and the position taken by both parties.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Share the dates and papers.</h3>
            <p>
              A useful first note names the cheque date, return memo date,
              notice date, delivery or acknowledgement record, reply if any,
              complaint or summons stage, and next court date if one is listed.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <RelatedPagesNav
            pagePath="/cheque-bounce-case-procedure-hyderabad"
            heading="Related pages"
            links={[
              { href: "/cheque-dishonour", label: "Cheque Dishonour" },
              { href: "/legal-notices", label: "Legal Notices" },
              { href: "/commercial-contracts", label: "Commercial Contracts" },
              { href: "/criminal-defense", label: "Criminal Defense" },
              { href: "/practice/criminal", label: "Criminal Litigation" },
              { href: "/practice/corporate", label: "Corporate & Commercial" },
              { href: "/contact", label: "Contact the firm", contact: true },
            ]}
          />
        </aside>
      </section>
    </main>
  );
}
