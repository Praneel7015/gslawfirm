import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { criminalDefenseFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Criminal Defense in Hyderabad | ${firm.name}`,
  description:
    "Criminal-defense information for FIRs, complaints, bail stages, remand, trial dates and High Court steps in Hyderabad, from GS Law Firm in Kondapur.",
  path: "/criminal-defense",
});

const defenseStages = [
  {
    title: "Before arrest or first appearance",
    body:
      "The first reading should cover the complaint, FIR, notice, sections invoked, documents available, and any immediate deadline. This is the stage where anticipatory bail, response strategy, or document collection may need to be discussed.",
  },
  {
    title: "Bail, remand and conditions",
    body:
      "If the matter involves arrest, remand, surety, bond conditions, or a next bail date, the papers need to be read with the immediate court step in mind.",
  },
  {
    title: "Trial and higher-court steps",
    body:
      "Once the matter moves into evidence, arguments, revision, appeal, or High Court work, continuity on the file matters because small facts can affect later steps.",
  },
] as const;

const handled = [
  "FIR, complaint and notice review",
  "Regular bail and anticipatory bail coordination",
  "Remand, surety and bond-condition steps",
  "Magistrate and sessions court appearances",
  "Trial preparation and evidence-stage hearings",
  "Criminal revision, appeal and High Court matters",
] as const;

function criminalDefenseServiceSchema(locale: string) {
  const path =
    locale === "en" ? "/criminal-defense" : `/${locale}/criminal-defense`;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: "Criminal defense",
    name: "Criminal defense in Hyderabad",
    description:
      "Information on FIRs, complaints, bail stages, remand, trial dates and High Court steps in Hyderabad.",
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
      name: "Criminal-defense matters handled",
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

export default async function CriminalDefensePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedDefenseUrl =
    locale === "en"
      ? `${SITE_URL}/criminal-defense`
      : `${SITE_URL}/${locale}/criminal-defense`;

  const ld = graphSchema([
    criminalDefenseServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: "Criminal Defense", url: localizedDefenseUrl },
    ]),
    faqPageSchema(criminalDefenseFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero defense-hero"
        aria-labelledby="defense-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Criminal Defense</span>
        </nav>
        <h1 id="defense-title">Criminal defense in Hyderabad.</h1>
        <p className="lede">
          FIRs, complaints, bail stages, trial dates and High Court steps,
          handled by one advocate who reads the file before advising on the next
          move.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body defense-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="criminal" size={36} />
            </span>
            <span>
              Criminal matters move quickly. The useful first step is to
              understand the exact stage: complaint, FIR, notice, remand, bail
              application, charge, trial, revision or appeal.
            </span>
          </p>

          <p>
            GS Law Firm is a solo-advocate practice in Kondapur, Hyderabad. The
            same advocate who reads the papers is the one who appears for the
            matter, so the facts do not have to be retold at every stage.
          </p>

          <div
            className="defense-steps"
            aria-label="Criminal-defense stages"
          >
            {defenseStages.map((stage, index) => (
              <article className="defense-step" key={stage.title}>
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

          <section className="service-faq" aria-labelledby="defense-faq-title">
            <h2 id="defense-faq-title">Common questions</h2>
            <div className="service-faq-list">
              {criminalDefenseFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Criminal-defense
            work depends on the facts, the stage of the case, the sections
            invoked, and the court before which the matter is listed.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss a criminal matter in confidence.</h3>
            <p>
              Share the FIR or complaint stage, next date, court, and what has
              already happened. A first conversation helps decide whether this
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
                <Link href="/cyber-crime-complaints">
                  Cyber Crime Complaints
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-dishonour">Cheque Dishonour</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/bail">Bail Applications</Link>
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
