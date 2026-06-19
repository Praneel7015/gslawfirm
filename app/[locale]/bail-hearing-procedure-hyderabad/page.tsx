import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { bailHearingProcedureFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Bail Hearing Procedure in Hyderabad | ${firm.name}`,
  description:
    "General information on bail hearing procedure in Hyderabad: FIR or complaint papers, remand stage, surety context, court dates and order conditions.",
  path: "/bail-hearing-procedure-hyderabad",
});

const hearingStages = [
  {
    title: "Before the hearing",
    body:
      "The first reading usually starts with the FIR or complaint, arrest or notice stage, remand papers if any, sections invoked, prior orders, court name, next date, and the documents available from the family or accused person.",
  },
  {
    title: "When the matter is listed",
    body:
      "A bail matter may be listed for filing, notice, objections, arguments, an order, or another date depending on the forum and papers. The useful question is not just which application exists, but what the court is expected to take up that day.",
  },
  {
    title: "After the order or next date",
    body:
      "If the court passes an order, the next step may involve surety, bond papers, identity or address records, police-station attendance, travel limits, or other conditions. If the matter is adjourned, the next-date preparation should be clear.",
  },
] as const;

const covered = [
  "Regular bail and anticipatory bail hearing context",
  "FIR, complaint, notice and remand-paper review",
  "Court, next-date and listing-stage questions",
  "Surety, bond and order-condition follow-up",
  "Magistrate, sessions court and High Court context",
  "A confidential first enquiry before any fit is discussed",
] as const;

function bailHearingWebPageSchema(locale: string) {
  const path =
    locale === "en"
      ? "/bail-hearing-procedure-hyderabad"
      : `/${locale}/bail-hearing-procedure-hyderabad`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Bail hearing procedure in Hyderabad",
    description:
      "General information on bail hearing procedure in Hyderabad, including papers, court stage, surety context, next dates and order conditions.",
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

export default async function BailHearingProcedurePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedGuideUrl =
    locale === "en"
      ? `${SITE_URL}/bail-hearing-procedure-hyderabad`
      : `${SITE_URL}/${locale}/bail-hearing-procedure-hyderabad`;

  const ld = graphSchema([
    bailHearingWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Bail", url: `${SITE_URL}/bail` },
      { name: "Bail Hearing Procedure", url: localizedGuideUrl },
    ]),
    faqPageSchema(bailHearingProcedureFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero bail-hero"
        aria-labelledby="bail-hearing-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <Link href="/bail">Bail</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Bail Hearing Procedure</span>
        </nav>
        <h1 id="bail-hearing-title">Bail hearing procedure in Hyderabad.</h1>
        <p className="lede">
          A plain guide to the papers, listing stage, surety context and court
          conditions that often shape a first bail-hearing conversation.
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
              A bail hearing is not one fixed event. The court stage may be
              filing, notice, objections, arguments, an order, or a later date,
              so the useful first step is to understand where the matter stands.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. For
            a bail matter, the first discussion is usually about the papers,
            the current court stage, and the next listed date before any legal
            step is discussed.
          </p>

          <div className="bail-steps" aria-label="Bail hearing stages">
            {hearingStages.map((stage, index) => (
              <article className="bail-step" key={stage.title}>
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
            aria-labelledby="bail-hearing-faq-title"
          >
            <h2 id="bail-hearing-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {bailHearingProcedureFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This guide is general information, not legal advice. Bail hearing
            steps depend on the papers, facts, court stage, sections invoked,
            objections, prior orders and the court before which the matter is
            listed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Share the stage and the next date.</h3>
            <p>
              A useful first note names the police station or court, FIR or
              complaint details if available, arrest or notice stage, next date,
              papers already received, and any order or condition already
              passed.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related pages</h3>
            <ul>
              <li>
                <Link href="/bail">Bail Applications</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/criminal-defense">Criminal Defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/criminal">Criminal Litigation</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/high-court-matters">High Court Matters</Link>
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
