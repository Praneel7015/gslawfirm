import { TranslatedGuide } from "@/components/sections/TranslatedGuide";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { JsonLd } from "@/components/seo/JsonLd";
import type { PracticeSlug } from "@/content/practice-areas";
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
  return localizedPageMetadata("legalStatisticsHyderabad", locale);
}

// ── Stats data ─────────────────────────────────────────────────────────────
// Sources: NCRB Crime in India 2022, NJDG public dashboard, Department of
// Consumer Affairs Annual Report 2022-23, MHA I4C, statutory provisions.

interface StatItem {
  figure: string;
  label: string;
  source: string;
  note?: string;
}

interface StatCategory {
  heading: string;
  slug: string;
  icon: PracticeSlug;
  description: string;
  stats: StatItem[];
}

const STAT_CATEGORIES: StatCategory[] = [
  {
    "heading": "Cyber crime: Telangana",
    "slug": "cyber-crime",
    "icon": "criminal",
    "description": "Historical registered-case figures for 2022, as reproduced by the Ministry of Home Affairs on 7 February 2024. These are registrations, not all portal complaints or a forecast.",
    "stats": [
      {
        "figure": "15,297",
        "label": "Cyber crime cases registered in Telangana (2022)",
        "source": "NCRB Crime in India 2022; MHA parliamentary reply, 7 February 2024",
        "note": "Reporting year: 2022. The figure is not a current annual total."
      },
      {
        "figure": "1930",
        "label": "Helpline for assistance reporting financial cyber fraud",
        "source": "Ministry of Home Affairs: I4C",
        "note": "Report promptly to your bank and through cybercrime.gov.in. Reporting does not assure recovery."
      }
    ]
  },
  {
    "heading": "Cheque dishonour: Section 138 NI Act",
    "slug": "cheque-dishonour",
    "icon": "corporate",
    "description": "Statutory deadlines are different from case-volume statistics. The notice and complaint windows must be calculated from the correct event.",
    "stats": [
      {
        "figure": "30 days",
        "label": "Window to give a written demand notice after receiving bank information of dishonour",
        "source": "Negotiable Instruments Act 1881, Section 138 proviso (b)"
      },
      {
        "figure": "15 days",
        "label": "Payment opportunity from receipt of the demand notice",
        "source": "Negotiable Instruments Act 1881, Section 138 proviso (c)"
      },
      {
        "figure": "One month",
        "label": "General complaint window after the cause of action arises",
        "source": "Negotiable Instruments Act 1881, Section 142",
        "note": "One calendar month is not always 30 days. Statutory conditions, service and any delay require individual review."
      }
    ]
  },
  {
    "heading": "Property disputes: Telangana courts",
    "slug": "property-disputes",
    "icon": "civil",
    "description": "Property, title, possession and revenue-record questions can require different relief and forums. Court pendency cannot establish a timeline for an individual suit.",
    "stats": [
      {
        "figure": "NJDG",
        "label": "Consult dated court pendency and disposal data at the source",
        "source": "National Judicial Data Grid",
        "note": "No undated national civil-case total or local hearing-duration estimate is reproduced here."
      }
    ]
  },
  {
    "heading": "Consumer forum complaints: Telangana",
    "slug": "consumer-forum",
    "icon": "will-succession",
    "description": "Consumer disputes use district, state and national commissions. Eligibility, jurisdiction and limitation depend on the transaction and current rules.",
    "stats": [
      {
        "figure": "2022–23",
        "label": "Historical reporting period previously referenced for consumer pendency",
        "source": "Department of Consumer Affairs annual reporting",
        "note": "The earlier total has not been independently verified and is withheld. Check the original dated report before comparison."
      }
    ]
  },
  {
    "heading": "Criminal matters: Telangana",
    "slug": "criminal-matters",
    "icon": "high-court",
    "description": "Case stage, alleged offence and territorial jurisdiction determine the relevant court. Aggregate registrations do not predict bail or trial outcomes.",
    "stats": [
      {
        "figure": "BNSS 2023",
        "label": "Bail and criminal procedure provisions must be identified precisely",
        "source": "India Code: Bharatiya Nagarik Suraksha Sanhita 2023",
        "note": "Regular bail provisions include Sections 478, 480 and 483. Section 482 concerns anticipatory bail; Section 528 preserves High Court inherent powers. Transitional cases require review."
      }
    ]
  }
];

const FAQ_ITEMS = [
  {
    question: "Where can I find official court case-status data for Telangana?",
    answer: "The National Judicial Data Grid (njdg.ecourts.gov.in) provides free public access to case status, pendency and disposal data for district courts across India including Telangana. The High Court of Telangana's own e-filing portal also carries cause-list and order data.",
  },
  {
    question: "How do I file a cyber crime complaint in Hyderabad?",
    answer: "Report online at cybercrime.gov.in or call the national helpline 1930. For Hyderabad, complaints are routed to the Telangana Cyber Security Bureau (TCSB) or the local police cyber cell. For matters requiring a formal FIR, an advocate can advise on the correct offence category and help draft a detailed complaint.",
  },
  {
    question: "What courts handle property disputes in Hyderabad?",
    answer: "Depending on the relief sought and the parties, property matters may fall before: the Civil Court (Junior or Senior Civil Judge), the City Civil Court, or the High Court of Telangana where an available appellate or writ remedy applies. Revenue tribunals and TSRERA are parallel forums for specific categories.",
  },
  {
    question: "Are the statistics on this page applicable to my specific case?",
    answer: "No. Aggregate statistics give a factual backdrop about the legal environment in Hyderabad and Telangana; they cannot predict timelines, outcomes or costs for any individual matter. Each case depends on the facts, documents, court roster, opposite parties and applicable procedure. A direct conversation with an advocate is the only way to assess a specific matter.",
  },
];

export default async function LegalStatisticsHyderabadPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  if (locale === "hi" || locale === "te") return <TranslatedGuide id="legal-statistics-hyderabad" locale={locale} />;

  const pageUrl =
    locale === "en"
      ? `${SITE_URL}/legal-statistics-hyderabad`
     : `${SITE_URL}/${locale}/legal-statistics-hyderabad`;

  const ld = graphSchema([
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Legal Statistics Hyderabad", url: pageUrl },
    ]),
    faqPageSchema(FAQ_ITEMS),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />

      {/* ── HERO ── */}
      <section className="pd-hero" aria-labelledby="stats-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Legal Statistics</span>
        </nav>
        <h1 id="stats-title">
          {localizedPageHeading("legalStatisticsHyderabad", locale)}
        </h1>
        <p className="lede">
          A factual reference on court volumes, case-pendency figures and
          procedural-timeline context for Hyderabad and Telangana. Sources are
          cited inline; figures are drawn from NCRB, NJDG and official
          government reports.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── BODY ── */}
      <section className="pd-body">
        <div className="pd-content">

          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="corporate" size={36} />
            </span>
            <span>
              Aggregate statistics give factual context. They cannot predict the
              outcome, cost or timeline of any individual matter: for a
              specific question, a brief enquiry to the firm is the right
              starting point.
            </span>
          </p>

          {/* ── Category sections ── */}
          {STAT_CATEGORIES.map((cat) => (
            <section
              key={cat.slug}
              id={cat.slug}
              className="service-faq"
              aria-labelledby={`${cat.slug}-heading`}
            >
              <h2 id={`${cat.slug}-heading`} className="stats-cat-heading">
                <span className="pd-lede-icon" aria-hidden="true">
                  <PracticeIcon slug={cat.icon} size={28} />
                </span>
                {cat.heading}
              </h2>
              <p>{cat.description}</p>

              {/* Each stat uses service-faq-item: multi-paragraph content
                  (figure label + source + note) does not fit the legal-step
                  contract of li-num + h2 + one p. */}
              <div className="service-faq-list">
                {cat.stats.map((stat) => (
                  <article className="service-faq-item" key={stat.label}>
                    <h3>
                      {stat.figure}: {stat.label}
                    </h3>
                    <p>
                      <em>Source: {stat.source}</em>
                      {stat.note ? ` ${stat.note}` : ""}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}

          {/* ── FAQ ── */}
          <section className="service-faq" aria-labelledby="stats-faq-heading">
            <h2 id="stats-faq-heading">
              Common questions about these statistics
            </h2>
            <div className="service-faq-list">
              {FAQ_ITEMS.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          {/* ── Sources ── */}
          <div className="pd-handle" id="sources">
            <h2>Primary sources used on this page</h2>
            <ul>
              {[
                {
                  name: "MHA: Crime in India 2022 figures, parliamentary reply",
                  url: "https://www.pib.gov.in/PressReleasePage.aspx?PRID=2003505",
                  note: "Annual statistical report on registered crimes across India, published by the National Crime Records Bureau.",
                },
                {
                  name: "NJDG: National Judicial Data Grid",
                  url: "https://njdg.ecourts.gov.in",
                  note: "Real-time pendency and disposal data for district courts and High Courts.",
                },
                {
                  name: "India Code: Negotiable Instruments Act 1881",
                  url: "https://www.indiacode.nic.in/bitstream/123456789/2189/1/a1881-26.pdf",
                  note: "",
                },
                {
                  name: "Ministry of Home Affairs: I4C / cybercrime.gov.in",
                  url: "https://cybercrime.gov.in",
                  note: "",
                },
                {
                  name: "TSRERA: Telangana Real Estate Regulatory Authority",
                  url: "https://tsrera.telangana.gov.in",
                  note: "",
                },
              ].map((src) => (
                <li key={src.name}>
                  <span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {src.name}
                    </a>
                    {src.note ? `: ${src.note}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="pd-footnote">
            Historical reporting years remain attached to the figures.
            Source check: 1 November 2026. This page is general reference
            information, not legal advice. GS Law Firm makes no warranty as
            to the accuracy or completeness of third-party data reproduced
            here; always consult the original sources and a qualified advocate
            for any specific matter.
          </p>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="pd-side" aria-label="Related actions and links">
          <div className="pd-cta">
            <h3>Have a matter in Hyderabad?</h3>
            <p>
              Statistics give context; an advocate can assess the specifics: documents, deadlines, opposing parties and applicable procedure.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Send a confidential enquiry <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <nav className="pd-adj" aria-label="Jump to section">
            <h3>Jump to section</h3>
            <ul>
              {STAT_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <a href={`#${cat.slug}`}>{cat.heading}</a>
                  <span aria-hidden="true">↓</span>
                </li>
              ))}
              <li>
                <a href="#sources">Sources</a>
                <span aria-hidden="true">↓</span>
              </li>
            </ul>
          </nav>

          <div className="pd-adj">
            <h3>Related focused guides</h3>
            <ul>
              <li>
                <Link href="/cyber-crime-complaints">
                  Cyber crime complaints
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cyber-crime-complaint-format">
                  Cyber crime complaint format
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-dishonour">Cheque dishonour</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-bounce-case-procedure-hyderabad">
                  Cheque bounce procedure
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">Property disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/consumer-forum-complaints">
                  Consumer forum complaints
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/criminal-defense">Criminal defense</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/resources">Resources &amp; guides</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/resources/understanding-bail-in-hyderabad-courts">
                  Understanding bail in Hyderabad courts
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/resources/property-title-verification-hyderabad">
                  Property title verification
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/resources/what-to-do-after-receiving-legal-notice-hyderabad">
                  After receiving a legal notice
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/criminal">Criminal litigation</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">Civil and property disputes</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice">All practice areas</Link>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
