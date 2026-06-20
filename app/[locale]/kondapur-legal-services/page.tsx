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
  title: `Kondapur Legal Services | ${firm.name} Hyderabad`,
  description:
    "Kondapur legal services information for GS Law Firm's office, nearby Hyderabad localities served, practice areas, and confidential enquiry path.",
  path: "/kondapur-legal-services",
});

const localSteps = [
  {
    title: "Office and locality context",
    body:
      "The firm is based at Sri Ramnagar Block C, Kondapur, Gachibowli, Hyderabad 500084. Many first conversations can start by phone, email, or the enquiry form before an office visit is discussed.",
  },
  {
    title: "Nearby Hyderabad localities",
    body:
      "The site names Kondapur, Gachibowli, Madhapur, Hi-Tech City, Kothaguda, Hafeezpet, Miyapur, Nallagandla, Serilingampally, Tellapur and nearby Hyderabad localities because those are the areas closest to the office surface.",
  },
  {
    title: "First confidential step",
    body:
      "A useful first note names the broad issue, court or notice stage, next date if there is one, and the papers available. The first conversation then decides whether this firm is the right fit for the matter.",
  },
] as const;

const localMatters = [
  "Criminal complaints, FIR review and bail stages",
  "Property papers, title questions and partition context",
  "Tenancy, eviction, rent and possession disputes",
  "Commercial contracts, notices and small-business documents",
  "Succession, probate and inheritance papers",
  "High Court petitions, revisions, appeals and order review",
] as const;

function kondapurLegalServiceSchema(locale: string) {
  const path =
    locale === "en"
      ? "/kondapur-legal-services"
      : `/${locale}/kondapur-legal-services`;

  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${SITE_URL}${path}#legalservice`,
    name: `${firm.name} - Kondapur legal services`,
    legalName: firm.name,
    description:
      "A solo-advocate legal practice in Kondapur, Hyderabad, serving nearby localities for criminal, civil, property, commercial, succession and High Court matters.",
    url: `${SITE_URL}${path}`,
    telephone: firm.phoneE164,
    email: firm.publicEmail,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${firm.address.line1}, ${firm.address.line2}`,
      addressLocality: firm.address.city,
      addressRegion: firm.address.region,
      postalCode: firm.address.postalCode,
      addressCountry: firm.address.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: firm.geo.lat,
      longitude: firm.geo.lng,
    },
    hasMap: firm.mapsUrl,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
      opens: "10:00",
      closes: "18:00",
    },
    areaServed: firm.areasServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    knowsAbout: localMatters,
  };
}

export default async function KondapurLegalServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedLocationUrl =
    locale === "en"
      ? `${SITE_URL}/kondapur-legal-services`
      : `${SITE_URL}/${locale}/kondapur-legal-services`;

  const ld = graphSchema([
    kondapurLegalServiceSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Kondapur Legal Services", url: localizedLocationUrl },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero location-hero"
        aria-labelledby="kondapur-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Kondapur Legal Services</span>
        </nav>
        <h1 id="kondapur-title">Kondapur legal services from GS Law Firm.</h1>
        <p className="lede">
          Office, nearby localities, practice areas, and the first confidential
          enquiry step for people looking for direct legal counsel in and around
          Kondapur, Hyderabad.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body location-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              GS Law Firm is a solo-advocate practice led by Adv. Aitha Sunitha
              in Kondapur, Hyderabad. This page keeps the local details in one
              place: where the office is, which nearby areas the site names, and
              what kinds of matters are usually discussed first.
            </span>
          </p>

          <p>
            The firm handles criminal, civil, property, commercial, succession
            and High Court matters. It is kept small so the advocate who reads
            the papers is also the person who discusses the next step and, if a
            matter is taken on, stays familiar with the file.
          </p>

          <div className="location-steps" aria-label="Kondapur local context">
            {localSteps.map((step, index) => (
              <article className="location-step" key={step.title}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{step.title}</h2>
                <p>{step.body}</p>
              </article>
            ))}
          </div>

          <div className="pd-handle">
            <h2>Practice areas connected to local enquiries</h2>
            <ul>
              {localMatters.map((item, index) => (
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
            className="location-localities"
            aria-labelledby="localities-title"
          >
            <h2 id="localities-title">Nearby localities named on the site</h2>
            <p>
              Localities are listed for office-access and local-search context.
              Whether the firm can discuss a specific matter depends on the
              papers, court stage, deadlines, and conflict checks.
            </p>
            <ul>
              {firm.areasServed.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </section>

          <p className="pd-footnote">
            This page is general information, not legal advice. Sending a note
            through the site does not create an advocate-client relationship,
            and no outcome can be assumed from the information here.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Start with a brief confidential note.</h3>
            <p>
              Share the broad issue, locality, current stage, next date if there
              is one, and the papers available. A first conversation helps
              decide whether this firm is the right fit for the matter.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Send an enquiry <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related pages</h3>
            <ul>
              <li>
                <Link href="/practice">Practice Areas</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/criminal-defense">Criminal Defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/bail">Bail Matters</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property Disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/tenancy-eviction">Tenancy and Eviction</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-dishonour">Cheque Dishonour</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/commercial-contracts">Commercial Contracts</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/succession-probate">
                  Succession and Probate
                </Link>
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
