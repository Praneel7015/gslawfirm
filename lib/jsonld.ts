/**
 * Typed JSON-LD schema builders (schema.org vocabulary).
 *
 * Each builder returns a plain object that the <JsonLd /> component
 * serialises into a <script type="application/ld+json"> tag. The
 * shapes here follow schema.org's published types loosely, schema.org
 * is open-world (extra keys are fine; missing ones degrade gracefully)
 * so we don't enforce strict typing beyond what Google's Rich Results
 * test cares about.
 *
 * Build-prompt §6 specifies the required schemas; this module covers:
 *   - LegalService (home)
 *   - LocalBusiness with @type LegalService (home, ties into Google Business Profile)
 *   - Person (founder)
 *   - Service (each practice detail page)
 *   - BreadcrumbList (where applicable)
 *
 * All `@id` values are absolute URLs so different schemas on different
 * pages can cross-reference the same canonical entity (the firm, the
 * founder).
 */

import { firm } from "@/content/firm";
import { founder } from "@/content/founder";
import { SITE_URL } from "@/lib/site";
import type { PracticeArea } from "@/content/practice-areas";

const ORG_ID = `${SITE_URL}/#organization`;
const PERSON_ID = `${SITE_URL}/about#founder`;
const PLACE_ID = `${SITE_URL}/#place`;
const SITE_ID = `${SITE_URL}/#website`;

type JsonLd = Record<string, unknown>;

// ── Postal address (reused by every business-level schema) ──────────
function postalAddress(): JsonLd {
  return {
    "@type": "PostalAddress",
    streetAddress: `${firm.address.line1}, ${firm.address.line2}`,
    addressLocality: firm.address.city,
    addressRegion: firm.address.region,
    postalCode: firm.address.postalCode,
    addressCountry: firm.address.country,
  };
}

function geoCoordinates(): JsonLd {
  return {
    "@type": "GeoCoordinates",
    latitude: firm.geo.lat,
    longitude: firm.geo.lng,
  };
}

function openingHoursSpecification(): JsonLd {
  return {
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
  };
}

// ── Person (founder) ────────────────────────────────────────────────
export function personSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: founder.shortName,
    alternateName: [founder.name, "Sunitha Sindhole"],
    honorificPrefix: "Adv.",
    jobTitle: "Advocate",
    alumniOf: {
      "@type": "EducationalOrganization",
      name: founder.education,
    },
    knowsLanguage: founder.languages,
    worksFor: { "@id": ORG_ID },
    url: `${SITE_URL}/about`,
    sameAs: [firm.linkedin],
  };
}

// ── LocalBusiness ⊂ LegalService (home) ─────────────────────────────
//
// Per build-prompt: "LocalBusiness with @type LegalService, important
// for Google Business Profile linking." We emit a single combined
// node typed as LegalService (LegalService inherits from LocalBusiness
// in schema.org's tree), which Google parses identically.
export function legalServiceSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": ORG_ID,
    name: firm.name,
    alternateName: firm.alternateNames,
    legalName: firm.name,
    description:
      "A solo-advocate practice in Kondapur, Hyderabad. Criminal, civil, corporate, succession and High Court matters since 2023.",
    foundingDate: String(firm.established),
    url: SITE_URL,
    logo: `${SITE_URL}/logo-square.jpeg`,
    image: `${SITE_URL}/logo-banner.jpeg`,
    telephone: firm.phoneE164,
    email: firm.publicEmail,
    priceRange: "₹₹",
    currenciesAccepted: "INR",
    paymentAccepted: "Cash, Bank Transfer, UPI",
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: firm.mapsUrl,
    openingHoursSpecification: openingHoursSpecification(),
    areaServed: firm.areasServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    founder: { "@id": PERSON_ID },
    employee: { "@id": PERSON_ID },
    knowsAbout: [
      "Criminal Litigation",
      "Civil Litigation",
      "Property Disputes",
      "Corporate Law",
      "Commercial Contracts",
      "Wills and Succession",
      "Probate",
      "High Court Matters",
      "Writ Petitions",
    ],
    sameAs: [firm.linkedin],
  };
}

// ── WebSite (home, enables Google sitelinks search box if added later) ─
export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: firm.name,
    alternateName: firm.alternateNames,
    publisher: { "@id": ORG_ID },
    inLanguage: ["en", "te", "hi"],
  };
}

// ── Place (used for contact page) ───────────────────────────────────
export function placeSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Place",
    "@id": PLACE_ID,
    name: `${firm.name} office`,
    address: postalAddress(),
    geo: geoCoordinates(),
    hasMap: firm.mapsUrl,
  };
}

// ── Service (per practice page) ─────────────────────────────────────
export function serviceSchema(area: PracticeArea, locale: string): JsonLd {
  const url =
    locale === "en"
      ? `${SITE_URL}/practice/${area.slug}`
      : `${SITE_URL}/${locale}/practice/${area.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: area.name,
    name: area.name,
    description: area.oneLine,
    url,
    provider: { "@id": ORG_ID },
    areaServed: firm.areasServed.map((name) => ({
      "@type": "Place",
      name,
    })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${area.name}, what we handle`,
      itemListElement: area.handle.map((h, i) => ({
        "@type": "Offer",
        position: i + 1,
        itemOffered: {
          "@type": "Service",
          name: h,
        },
      })),
    },
  };
}

// ── BreadcrumbList ──────────────────────────────────────────────────
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>,
): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// ── @graph wrapper, multiple schemas in one script tag ─────────────
export function graphSchema(nodes: JsonLd[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.map((n) => {
      // Strip per-node @context inside @graph, schema.org spec.
      const { "@context": _unused, ...rest } = n as { "@context"?: string };
      void _unused;
      return rest;
    }),
  };
}
