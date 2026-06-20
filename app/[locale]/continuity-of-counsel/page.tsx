import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, graphSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Continuity of Counsel | ${firm.name} Hyderabad`,
  description:
    "Continuity-of-counsel explainer for GS Law Firm in Hyderabad: paper reading, hearing preparation, client communication and court-stage memory.",
  path: "/continuity-of-counsel",
});

const continuitySteps = [
  {
    title: "The first reading stays attached to the matter",
    body:
      "A legal file is more than a set of papers. Dates, omissions, notices, replies, photographs, orders and what changed on the ground all need to be read together before any next step is discussed.",
  },
  {
    title: "Court-stage memory matters",
    body:
      "A matter can move from a notice to a reply, filing, interim application, evidence, hearing, appeal or revision. Continuity means the same file memory is carried into those discussions instead of being rebuilt each time.",
  },
  {
    title: "Communication has one responsible listener",
    body:
      "Clients should not have to retell the basic facts at every stage. A small practice can keep the conversation closer to the advocate reading the papers and discussing the next court step.",
  },
] as const;

const continuityPoints = [
  "Paper reading and chronology review",
  "Fewer handoffs while the matter is being understood",
  "Hearing and filing preparation with the same file memory",
  "Client communication tied to the current court stage",
  "Clear limits on what a website can explain",
  "A confidential first enquiry before any fit is discussed",
] as const;

function continuityWebPageSchema(locale: string) {
  const path =
    locale === "en"
      ? "/continuity-of-counsel"
      : `/${locale}/continuity-of-counsel`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Continuity of counsel at GS Law Firm",
    description:
      "Information on why one advocate reading, discussing and staying familiar with a matter can matter for legal clients in Hyderabad.",
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
    about: continuityPoints,
  };
}

export default async function ContinuityOfCounselPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedContinuityUrl =
    locale === "en"
      ? `${SITE_URL}/continuity-of-counsel`
      : `${SITE_URL}/${locale}/continuity-of-counsel`;

  const ld = graphSchema([
    continuityWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "About", url: `${SITE_URL}/about` },
      { name: "Continuity of Counsel", url: localizedContinuityUrl },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero continuity-hero"
        aria-labelledby="continuity-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/about">About</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Continuity of Counsel</span>
        </nav>
        <h1 id="continuity-title">
          Continuity of counsel at a small Hyderabad practice.
        </h1>
        <p className="lede">
          Why it matters when the advocate who reads the papers also discusses
          the hearing, filing, communication, and next court-stage question.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body continuity-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              Continuity of counsel means the file is not treated as a fresh
              story at every step. The papers, chronology, court stage and
              client communication stay close to the advocate who is discussing
              the next move.
            </span>
          </p>

          <p>
            GS Law Firm is kept small on purpose. For a client, that means the
            first reading of the papers, the practical questions before a
            hearing, and the next conversation are all meant to stay with one
            advocate rather than moving through layers of handoff.
          </p>

          <div className="continuity-steps" aria-label="Continuity explained">
            {continuitySteps.map((step, index) => (
              <article className="continuity-step" key={step.title}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="pd-handle">
            <h2>What continuity means here</h2>
            <ul>
              {continuityPoints.map((item, index) => (
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
            className="continuity-limits"
            aria-labelledby="continuity-limits-title"
          >
            <h2 id="continuity-limits-title">What this page cannot decide</h2>
            <p>
              This page cannot say whether GS Law Firm can take a particular
              matter, what the next legal step should be, or what result is
              possible. Those questions depend on conflict checks, documents,
              limitation, court stage, urgency, and the facts that are shared in
              a confidential first conversation.
            </p>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Reading it or
            sending an enquiry through the site does not create an
            advocate-client relationship.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Start with the stage and the papers.</h3>
            <p>
              A useful first note names the broad issue, current court or notice
              stage, next date if there is one, and the papers available. The
              first conversation decides whether this firm is the right fit.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Send an enquiry <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related pages</h3>
            <ul>
              <li>
                <Link href="/about">About Adv. Aitha Sunitha</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/criminal-defense">Criminal Defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
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
