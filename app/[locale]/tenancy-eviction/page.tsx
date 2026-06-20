import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { tenancyEvictionFaqs } from "@/content/service-faqs";
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
  return localizedPageMetadata("tenancyEviction", locale);
}

const tenancyStages = [
  {
    title: "Lease, notice and possession review",
    body:
      "The first reading usually starts with the lease or tenancy papers, rent records, notices, messages, possession details, property papers, and what each side says has happened so far.",
  },
  {
    title: "Interim relief, evidence and court stage",
    body:
      "Tenancy and possession matters can involve injunctions, interim applications, rent or arrears material, witness evidence, photographs, inspection records, and hearing-stage papers. The next step depends on the current forum and stage.",
  },
  {
    title: "Execution, revision and appeal context",
    body:
      "If there is already an order, decree, execution petition, revision, or appeal, the papers need to be read with deadlines, prior findings, compliance history, and the practical position on possession.",
  },
] as const;

const handled = [
  "Lease and tenancy-paper review",
  "Notices, replies and rent-record questions",
  "Possession, eviction and arrears disputes",
  "Injunctions and interim relief",
  "Evidence, execution and order-compliance stages",
  "Civil revision, appeal and related court steps",
] as const;

function tenancyEvictionServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/tenancy-eviction" : `/${locale}/tenancy-eviction`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Tenancy and eviction matters",
    name: "Tenancy and eviction matters in Hyderabad",
    description:
      "Information on lease papers, notices, rent or possession disputes, injunctions, interim relief, evidence, execution, revision and appeal steps in Hyderabad.",
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
      name: "Tenancy and eviction matters handled",
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

export default async function TenancyEvictionPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedTenancyUrl =
    locale === "en"
      ? `${SITE_URL}/tenancy-eviction`
      : `${SITE_URL}/${locale}/tenancy-eviction`;

  const ld = graphSchema([
    tenancyEvictionServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Tenancy and Eviction", url: localizedTenancyUrl },
    ]),
    faqPageSchema(tenancyEvictionFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero tenancy-hero"
        aria-labelledby="tenancy-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Tenancy and Eviction</span>
        </nav>
        <h1 id="tenancy-title">Tenancy and eviction matters in Hyderabad.</h1>
        <p className="lede">
          Lease papers, notices, rent or possession disputes, injunctions,
          evidence, execution, revision and appeal steps, reviewed before a
          notice, reply, filing or hearing is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body tenancy-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Tenancy and eviction disputes need careful reading because the
              same papers can matter to both sides of the dispute. The useful
              first step is to understand the lease, possession, notices, rent
              record, court stage, and any immediate deadline.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the lease and case papers is the one who
            discusses notice, interim relief, evidence, execution, revision, or
            appeal questions, so the facts stay with one counsel.
          </p>

          <div
            className="tenancy-steps"
            aria-label="Tenancy and eviction stages"
          >
            {tenancyStages.map((stage, index) => (
              <article className="tenancy-step" key={stage.title}>
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

          <section className="service-faq" aria-labelledby="tenancy-faq-title">
            <h2 id="tenancy-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {tenancyEvictionFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Tenancy and
            eviction matters depend on the lease papers, possession, notices,
            rent records, court stage, limitation, and the position taken by both
            sides.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a tenancy matter in confidence.</h3>
            <p>
              Share the lease or tenancy papers, notices, rent records,
              possession details, case stage, and next date if there is one. A
              first conversation helps decide whether this firm is the right fit
              for the matter.
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
                <Link href="/injunction-interim-relief">
                  Injunction and Interim Relief
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/legal-notices">Legal Notices</Link>
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
