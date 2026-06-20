import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { injunctionInterimReliefFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Injunction and Interim Relief in Hyderabad | ${firm.name}`,
  description:
    "Injunction and interim-relief information for possession, title, tenancy, contract restraint, notices, pleadings and urgency in Hyderabad.",
  path: "/injunction-interim-relief",
});

const injunctionStages = [
  {
    title: "Papers, possession and urgency review",
    body:
      "The first reading usually starts with property or contract papers, possession details, notices, photographs, messages, prior orders, court papers, and the event that made the issue time-sensitive.",
  },
  {
    title: "Suit, reply and interim application stage",
    body:
      "Injunction and interim-relief questions can arise before a suit, with the first filing, in a reply, or after an order. The papers need to show what restraint or direction is being discussed and what facts support that request.",
  },
  {
    title: "Order, compliance and later court steps",
    body:
      "After an interim order, the next question may involve compliance, modification, evidence, execution, appeal or revision. The order, pleadings, deadlines and practical position on the ground need to be read together.",
  },
] as const;

const handled = [
  "Temporary and permanent injunction context",
  "Possession, title and boundary disputes",
  "Tenancy or contract-related restraint questions",
  "Notices, photographs and document review",
  "Pleadings, affidavits and urgency papers",
  "Order, execution, appeal and revision context",
] as const;

function injunctionInterimReliefServiceSchema(locale: string) {
  const path =
    locale === "en"
      ? "/injunction-interim-relief"
      : `/${locale}/injunction-interim-relief`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Injunction and interim relief",
    name: "Injunction and interim relief in Hyderabad",
    description:
      "Information on temporary and permanent injunction context, possession, title, tenancy, contract restraint, notices, photographs, documents, pleadings, urgency and court-stage questions in Hyderabad.",
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
      name: "Injunction and interim-relief matters handled",
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

export default async function InjunctionInterimReliefPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedInjunctionUrl =
    locale === "en"
      ? `${SITE_URL}/injunction-interim-relief`
      : `${SITE_URL}/${locale}/injunction-interim-relief`;

  const ld = graphSchema([
    injunctionInterimReliefServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      {
        name: "Injunction and Interim Relief",
        url: localizedInjunctionUrl,
      },
    ]),
    faqPageSchema(injunctionInterimReliefFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero injunction-hero"
        aria-labelledby="injunction-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Injunction and Interim Relief</span>
        </nav>
        <h1 id="injunction-title">
          Injunction and interim relief matters in Hyderabad.
        </h1>
        <p className="lede">
          Possession, title, tenancy or contract-restraint questions, reviewed
          with the documents, photographs, pleadings, urgency and current court
          stage before the next filing or hearing is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body injunction-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Injunction and interim-relief questions usually depend on timing,
              possession, documents and what has changed on the ground. A
              careful first reading helps decide what needs to be clarified
              before any court-stage step is discussed.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the papers and photographs is the one who
            discusses the next civil-court step, so the facts stay with one
            counsel.
          </p>

          <div
            className="injunction-steps"
            aria-label="Injunction and interim-relief stages"
          >
            {injunctionStages.map((stage, index) => (
              <article className="injunction-step" key={stage.title}>
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
            aria-labelledby="injunction-faq-title"
          >
            <h2 id="injunction-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {injunctionInterimReliefFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Whether an
            injunction or interim-relief step can be discussed depends on the
            facts, documents, possession, urgency, limitation, pleadings and
            court stage.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss an interim civil-court step in confidence.</h3>
            <p>
              Share the property or contract papers, notices, photographs,
              messages, present possession or status, case stage, and next date
              if there is one. A first conversation helps decide whether this
              firm is the right fit for the matter.
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
                <Link href="/property-dispute-courts-telangana">
                  Property Dispute Court Guide
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/tenancy-eviction">Tenancy and Eviction</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/legal-notices">Legal Notices</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/high-court-matters">High Court Matters</Link>
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
