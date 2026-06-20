import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { propertyDisputesFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("propertyDisputes", locale);
}

const propertyStages = [
  {
    title: "Title and document review",
    body:
      "The first reading usually starts with sale deeds, link documents, gift or settlement deeds, encumbrance records, revenue papers, municipal records, notices, and any prior case papers. The aim is to understand what the papers say before a notice, reply, suit, or interim application is prepared.",
  },
  {
    title: "Partition, inheritance and possession",
    body:
      "Family property disputes often turn on shares, possession, boundaries, prior arrangements, and whether a partition, declaration, injunction, or succession-linked step is needed. The papers and family history need to be read together.",
  },
  {
    title: "Tenancy, injunction and civil-court steps",
    body:
      "Tenancy, eviction, possession, specific performance, and injunction matters can move through notices, pleadings, interim relief, evidence, execution, revision, or appeal. The next step depends on the stage and the court before which the matter is listed.",
  },
] as const;

const handled = [
  "Property and title disputes",
  "Partition and inheritance suits",
  "Tenancy, eviction and possession matters",
  "Injunctions and interim relief",
  "Specific performance and property-related contracts",
  "Civil revision, appeal and execution-stage questions",
] as const;

function propertyDisputesServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/property-disputes" : `/${locale}/property-disputes`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Property disputes",
    name: "Property disputes in Hyderabad",
    description:
      "Information on title disputes, partition, tenancy, injunctions and civil-court steps in Hyderabad.",
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
      name: "Property-dispute matters handled",
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

export default async function PropertyDisputesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedPropertyUrl =
    locale === "en"
      ? `${SITE_URL}/property-disputes`
      : `${SITE_URL}/${locale}/property-disputes`;

  const ld = graphSchema([
    propertyDisputesServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Property Disputes", url: localizedPropertyUrl },
    ]),
    faqPageSchema(propertyDisputesFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero property-hero" aria-labelledby="property-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Property Disputes</span>
        </nav>
        <h1 id="property-title">Property disputes in Hyderabad.</h1>
        <p className="lede">
          Title papers, partition, tenancy, injunctions and civil-court steps,
          read carefully before the next notice, filing or hearing.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body property-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Property disputes often turn on papers that were signed years
              earlier. The useful first step is to understand the documents,
              possession, parties, court stage, and any immediate deadline.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the papers is the one who appears for the
            matter, so the facts and documents stay with one counsel.
          </p>

          <div className="property-steps" aria-label="Property-dispute stages">
            {propertyStages.map((stage, index) => (
              <article className="property-step" key={stage.title}>
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
            aria-labelledby="property-faq-title"
          >
            <h2 id="property-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {propertyDisputesFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Property matters
            depend on the documents, possession, limitation, prior proceedings,
            and the court before which the matter is listed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a property matter in confidence.</h3>
            <p>
              Share the property location, papers available, notice or case
              stage, next date, and what has already happened. A first
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
                <Link href="/specific-performance">Specific Performance</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/legal-notices">Legal Notices</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/injunction-interim-relief">
                  Injunction and Interim Relief
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil & Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/will-succession">
                  Wills, Trusts & Succession
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/high-court">High Court Matters</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/continuity-of-counsel">
                  Continuity of Counsel
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
