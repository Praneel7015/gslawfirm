import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { RelatedPagesNav } from "@/components/seo/RelatedPagesNav";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { propertyDisputeCourtsFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
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
  return localizedPageMetadata("propertyDisputeCourts", locale);
}

const courtStages = [
  {
    title: "Before a court step is discussed",
    body:
      "The first reading usually starts with sale deeds, link documents, encumbrance records, revenue or municipal papers, notices, photographs, possession details, family or agreement papers, and any deadline or prior proceeding.",
  },
  {
    title: "Civil-court and interim-relief stage",
    body:
      "A property matter may involve declaration, partition, possession, tenancy, eviction, injunction, or specific-performance questions. The useful first question is what relief is being discussed, what papers support it, and where the matter now stands.",
  },
  {
    title: "Order, execution, appeal or High Court context",
    body:
      "If an order or decree already exists, the next discussion may involve compliance, execution, appeal, revision, or a High Court step. The order, pleadings, dates, and practical position on the property need to be read together.",
  },
] as const;

const covered = [
  "Hyderabad and Telangana civil-court context",
  "Title, partition, possession and document questions",
  "Injunction and interim-relief overlap",
  "Tenancy, eviction and possession context",
  "Specific-performance and agreement-enforcement overlap",
  "A confidential first enquiry before any fit is discussed",
] as const;

function propertyDisputeCourtsWebPageSchema(locale: string) {
  const path =
    locale === "en"
      ? "/property-dispute-courts-telangana"
      : `/${locale}/property-dispute-courts-telangana`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Property dispute courts in Telangana",
    description:
      "General information on property dispute court stages in Hyderabad and Telangana, including documents, possession, injunction overlap, tenancy, specific performance and later court steps.",
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

export default async function PropertyDisputeCourtsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedGuideUrl =
    locale === "en"
      ? `${SITE_URL}/property-dispute-courts-telangana`
      : `${SITE_URL}/${locale}/property-dispute-courts-telangana`;

  const ld = graphSchema([
    propertyDisputeCourtsWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Property Disputes", url: `${SITE_URL}/property-disputes` },
      { name: "Property Dispute Courts", url: localizedGuideUrl },
    ]),
    faqPageSchema(propertyDisputeCourtsFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero property-hero"
        aria-labelledby="property-courts-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <Link href="/property-disputes">Property Disputes</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Property Dispute Courts</span>
        </nav>
        <h1 id="property-courts-title">
          {localizedPageHeading("propertyDisputeCourts", locale)}
        </h1>
        <p className="lede">
          A plain guide to the documents, possession questions, relief sought
          and court-stage context that shape first property-dispute
          conversations in Hyderabad and Telangana.
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
              A property dispute is not one fixed route. The court-stage
              question usually depends on the property, papers, parties,
              possession, relief being discussed, prior orders, and any pending
              case.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. For
            a property matter, the first conversation is usually about reading
            the papers and understanding the current stage before any next step
            is discussed.
          </p>

          <div className="property-steps" aria-label="Property court stages">
            {courtStages.map((stage, index) => (
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
            aria-labelledby="property-courts-faq-title"
          >
            <h2 id="property-courts-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {propertyDisputeCourtsFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This guide is general information, not legal advice. Property court
            steps depend on the facts, documents, property location, relief
            sought, valuation, limitation, prior proceedings, and the court or
            forum before which the matter is placed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Share the papers and the current stage.</h3>
            <p>
              A useful first note names the property location, documents
              available, possession status, notice or case stage, any order
              already passed, and the next date if one is listed.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <RelatedPagesNav
            pagePath="/property-dispute-courts-telangana"
            heading="Related pages"
            links={[
              { href: "/property-disputes", label: "Property Disputes" },
              { href: "/tenancy-eviction", label: "Tenancy and Eviction" },
              { href: "/injunction-interim-relief", label: "Injunction and Interim Relief" },
              { href: "/specific-performance", label: "Specific Performance" },
              { href: "/legal-notices", label: "Legal Notices" },
              { href: "/practice/civil", label: "Civil & Property Disputes" },
              { href: "/high-court-matters", label: "High Court Matters" },
              { href: "/contact", label: "Contact the firm", contact: true },
            ]}
          />
        </aside>
      </section>
    </main>
  );
}
