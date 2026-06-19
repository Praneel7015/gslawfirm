import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { highCourtMattersFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `High Court Matters in Hyderabad | ${firm.name}`,
  description:
    "High Court matter information for writ petitions, criminal and civil revisions, quashing petitions, second appeals and High Court bail applications in Telangana, from GS Law Firm in Kondapur.",
  path: "/high-court-matters",
});

const highCourtStages = [
  {
    title: "Order and case-paper review",
    body:
      "The first reading usually starts with the order under challenge, pleadings, FIR or complaint if relevant, notices, certified copies, lower-court papers, next-date details, and any limitation or filing deadline.",
  },
  {
    title: "Writ, quashing and jurisdiction questions",
    body:
      "High Court steps may be discussed when the papers raise a question around public-authority action, jurisdiction, quashing, procedural fairness, or an order that may need supervisory review. The right forum depends on the file.",
  },
  {
    title: "Revisions, appeals and High Court bail",
    body:
      "Criminal revisions, civil revisions, second appeals, High Court bail applications, interim relief, replies, and hearing preparation each depend on the stage below and the question that can properly be placed before the court.",
  },
] as const;

const handled = [
  "Writ petitions under Article 226",
  "Criminal revisions and quashing petitions",
  "Civil revisions and second appeals",
  "High Court bail applications",
  "Interim relief and order-review questions",
  "Filing, reply and hearing-stage preparation",
] as const;

function highCourtMattersServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/high-court-matters" : `/${locale}/high-court-matters`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "High Court matters",
    name: "High Court matters in Hyderabad",
    description:
      "Information on writ petitions, criminal revisions, civil revisions, quashing petitions, second appeals, High Court bail applications and order-review steps before the High Court of Telangana.",
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
      name: "High Court matters handled",
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

export default async function HighCourtMattersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedHighCourtUrl =
    locale === "en"
      ? `${SITE_URL}/high-court-matters`
      : `${SITE_URL}/${locale}/high-court-matters`;

  const ld = graphSchema([
    highCourtMattersServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "High Court Matters", url: localizedHighCourtUrl },
    ]),
    faqPageSchema(highCourtMattersFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero high-court-hero"
        aria-labelledby="high-court-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">High Court Matters</span>
        </nav>
        <h1 id="high-court-title">High Court matters in Hyderabad.</h1>
        <p className="lede">
          Writ petitions, revisions, quashing petitions, second appeals and High
          Court bail applications, reviewed carefully before a petition, reply
          or hearing step is discussed.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body high-court-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="high-court" size={36} />
            </span>
            <span>
              High Court work usually begins by reading what happened in the
              forum below and what question can properly be placed before the
              High Court of Telangana. The useful first step is to understand
              the order, papers, deadline, and current stage.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the papers is the one who discusses whether
            a High Court step should be considered, so the file stays with one
            counsel.
          </p>

          <div
            className="high-court-steps"
            aria-label="High Court matter stages"
          >
            {highCourtStages.map((stage, index) => (
              <article className="high-court-step" key={stage.title}>
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
            aria-labelledby="high-court-faq-title"
          >
            <h2 id="high-court-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {highCourtMattersFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. High Court
            matters depend on the order, papers, limitation, forum below, and
            the question that may properly be raised before the court.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a High Court step in confidence.</h3>
            <p>
              Share the order, case stage, next date, lower-court or authority
              papers, and any filing deadline. A first conversation helps decide
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
                <Link href="/practice/high-court">High Court Matters</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/criminal-defense">Criminal Defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/bail">Bail Applications</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/injunction-interim-relief">
                  Injunction and Interim Relief
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/continuity-of-counsel">
                  Continuity of Counsel
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
