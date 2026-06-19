import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { cyberCrimeComplaintsFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Cyber Crime Complaints in Hyderabad | ${firm.name}`,
  description:
    "Cyber-crime complaint information for online fraud, account misuse, harassment messages, screenshots, transaction records, police or portal complaint papers, FIR and notice context in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/cyber-crime-complaints",
});

const cyberStages = [
  {
    title: "Screenshots, transactions and account records",
    body:
      "The first reading usually starts with screenshots, links, profile details, phone numbers, email headers, UPI or bank transaction records, platform responses, complaint numbers and any messages already exchanged.",
  },
  {
    title: "Portal, police and notice context",
    body:
      "If a complaint has already been made online, at a police station, through a bank, or with a platform, the next discussion should place that record beside any acknowledgement, notice, FIR or response received.",
  },
  {
    title: "FIR, court and later-stage questions",
    body:
      "Some cyber matters move into FIR, summons, bail, quashing, evidence, settlement, restitution or appeal context. The correct discussion depends on whether the person is reporting a misuse or responding to papers.",
  },
] as const;

const handled = [
  "Online fraud and transaction-record context",
  "Account misuse and impersonation complaints",
  "Harassment messages and screenshot records",
  "Cyber portal or police complaint papers",
  "FIR, notice and summons context",
  "Evidence preservation and court-stage questions",
] as const;

function cyberCrimeComplaintsServiceSchema(locale: string) {
  const path =
    locale === "en"
      ? "/cyber-crime-complaints"
      : `/${locale}/cyber-crime-complaints`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Cyber-crime complaint matters",
    name: "Cyber-crime complaint matters in Hyderabad",
    description:
      "Information on online fraud, account misuse, harassment messages, screenshots, transaction records, police or portal complaint papers, FIR, notice and court-stage context in Hyderabad.",
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
      name: "Cyber-crime complaint matters handled",
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

export default async function CyberCrimeComplaintsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedCyberUrl =
    locale === "en"
      ? `${SITE_URL}/cyber-crime-complaints`
      : `${SITE_URL}/${locale}/cyber-crime-complaints`;

  const ld = graphSchema([
    cyberCrimeComplaintsServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Cyber Crime Complaints", url: localizedCyberUrl },
    ]),
    faqPageSchema(cyberCrimeComplaintsFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero cyber-hero" aria-labelledby="cyber-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Cyber Crime Complaints</span>
        </nav>
        <h1 id="cyber-title">Cyber-crime complaints in Hyderabad.</h1>
        <p className="lede">
          Online fraud, account misuse, harassment messages, complaint or FIR
          papers, screenshots, transaction records and notice context, read
          before the next legal step is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body cyber-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="criminal" size={36} />
            </span>
            <span>
              Cyber-crime complaint questions often begin with scattered digital
              records. The useful first step is to place the messages,
              screenshots, transaction records, complaint numbers, notices and
              present stage in one chronology.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the digital complaint papers is the one who
            discusses the police, FIR, notice, court-stage or response question.
          </p>

          <div className="cyber-steps" aria-label="Cyber-crime complaint stages">
            {cyberStages.map((stage, index) => (
              <article className="cyber-step" key={stage.title}>
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

          <section className="service-faq" aria-labelledby="cyber-faq-title">
            <h2 id="cyber-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {cyberCrimeComplaintsFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Cyber-crime
            complaint next steps depend on the records, parties, complaint
            stage, police or portal response, forum, current court stage and the
            papers already received.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a cyber-crime complaint in confidence.</h3>
            <p>
              Share screenshots, transaction records, links, profile details,
              complaint numbers, FIR or notice papers, and any next date if the
              matter is already before an authority or court. A first
              conversation helps decide whether this firm is the right fit for
              the matter.
            </p>
            <Link href="/contact" className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="pd-adj">
            <h3>Related practice areas</h3>
            <ul>
              <li>
                <Link href="/criminal-defense">Criminal Defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/bail">Bail Applications</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-dishonour">Cheque Dishonour</Link>
                <span aria-hidden="true">→</span>
              </li>
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
