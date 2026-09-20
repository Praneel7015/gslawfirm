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
    heading: "Cyber crime: Telangana",
    slug: "cyber-crime",
    icon: "criminal",
    description: "Telangana consistently ranks among the top five states for registered cyber crime cases. The bulk of complaints in Hyderabad are filed through cybercrime.gov.in and then routed to the Telangana Cyber Security Bureau (TCSB) or local police.",
    stats: [
      {
        figure: "15,297",
        label: "Cyber crimes registered in Telangana (2022)",
        source: "NCRB: Crime in India 2022, Table 21B",
        note: "Includes financial fraud, impersonation, hacking, online harassment and data theft. Hyderabad accounts for the majority of state registrations.",
      },
      {
        figure: "#4",
        label: "Telangana rank among states by cyber crime registrations (2022)",
        source: "NCRB: Crime in India 2022, Statement 25",
      },
      {
        figure: "~76 %",
        label: "Share of cyber crime complaints relating to financial fraud (national average)",
        source: "NCRB: Crime in India 2022, Chapter 19",
        note: "Fraudulent OTP collection, investment scams, banking-credential phishing and KYC fraud are the dominant categories.",
      },
      {
        figure: "1930",
        label: "National helpline for cyber crime complaints: available 24×7",
        source: "Ministry of Home Affairs: I4C",
        note: "Complaints also registerable at cybercrime.gov.in",
      },
    ],
  },
  {
    heading: "Cheque dishonour: Section 138 NI Act",
    slug: "cheque-dishonour",
    icon: "corporate",
    description: "Section 138 Negotiable Instruments Act cases are among the most numerically significant matters before Metropolitan Magistrates in Hyderabad. Pendency remains high across India.",
    stats: [
      {
        figure: "~35 lakh",
        label: "Estimated pending Section 138 NI Act cases across India (2023)",
        source: "Supreme Court: In Re: Expeditious Trial of Cases (2021), reaffirmed 2023",
        note: "Hyderabad and Rangareddy district courts carry a significant share of the Telangana total.",
      },
      {
        figure: "30 days",
        label: "Statutory notice period before a Section 138 complaint can be filed",
        source: "Section 138 read with Section 142, Negotiable Instruments Act 1881",
        note: "The payee must serve a written demand notice within 30 days of the dishonour memo. The drawer then has 15 days to make payment.",
      },
      {
        figure: "2 years",
        label: "Prescribed maximum imprisonment on conviction (or fine or both)",
        source: "Section 138, Negotiable Instruments Act 1881 (as amended 2018)",
      },
    ],
  },
  {
    heading: "Property disputes: Telangana courts",
    slug: "property-disputes",
    icon: "civil",
    description: "Property litigation constitutes a significant share of civil court pendency in Telangana. Matters typically traverse civil courts, the High Court, the revenue Tahsildar and, in some cases, TSRERA.",
    stats: [
      {
        figure: "~4.5 crore",
        label: "Pending civil cases in district courts across India (2023)",
        source: "National Judicial Data Grid: public dashboard, Oct 2023",
        note: "Property, tenancy and succession cases collectively form the largest civil pendency block in Telangana district courts.",
      },
      {
        figure: "6 months – 2 years",
        label: "Typical first listing to evidence stage in a civil property suit in Hyderabad",
        source: "GS Law Firm practice observation; consistent with NJDG district-wise disposal data",
        note: "Timelines vary by complexity of title chain, number of defendants, interim relief applications and prevailing court roster.",
      },
      {
        figure: "TSRERA",
        label: "Telangana Real Estate Regulatory Authority: separate forum for RERA complaints",
        source: "TSRERA: tsrera.telangana.gov.in",
        note: "Builder delays, possession defaults and title issues under RERA are adjudicated separately from civil courts.",
      },
    ],
  },
  {
    heading: "Consumer forum complaints: Telangana",
    slug: "consumer-forum",
    icon: "will-succession",
    description: "Consumer disputes are handled by a three-tier system: District CDRC, State CDRC (TSCDRC) and NCDRC. Filing thresholds were substantially revised by the Consumer Protection Act 2019.",
    stats: [
      {
        figure: "₹50 lakh",
        label: "District CDRC upper pecuniary limit (Consumer Protection Act 2019)",
        source: "Section 34, Consumer Protection Act 2019",
      },
      {
        figure: "₹50 lakh – ₹2 crore",
        label: "State CDRC jurisdiction: claims between these amounts",
        source: "Section 47, Consumer Protection Act 2019",
      },
      {
        figure: "5,82,544",
        label: "Cases pending before all consumer commissions in India (2022)",
        source: "Department of Consumer Affairs: Annual Report 2022-23",
        note: "Telangana's state commission and district commissions in Hyderabad and Rangareddy carry high pendency relative to disposal capacity.",
      },
      {
        figure: "21 days",
        label: "Deadline for initial admission hearing on a consumer complaint",
        source: "Section 36(1), Consumer Protection Act 2019",
        note: "Admission does not guarantee success. The opposite party must be heard before a final order.",
      },
    ],
  },
  {
    heading: "Criminal matters: Telangana",
    slug: "criminal-matters",
    icon: "high-court",
    description: "Hyderabad is served by the Hyderabad, Cyberabad and Rachakonda Commissionerates. Criminal cases travel through Magistrate courts before session-stage matters proceed to the Sessions Court.",
    stats: [
      {
        figure: "2,83,748",
        label: "Cognisable offences registered in Telangana (2022)",
        source: "NCRB: Crime in India 2022, Table 1.3",
      },
      {
        figure: "~60 %",
        label: "Share of IPC crimes related to property and economic offences in Telangana",
        source: "NCRB: Crime in India 2022, Chapter 1",
        note: "Theft, cheating, criminal breach of trust and misappropriation combine to form the largest share.",
      },
      {
        figure: "24 hours",
        label: "Maximum police custody before production before a Magistrate (on arrest without warrant)",
        source: "Section 57, CrPC 1973 / Section 35, BNSS 2023",
        note: "The Magistrate may order further custody on application; bail applications may be filed at this stage.",
      },
      {
        figure: "1 July 2024",
        label: "Date Bharatiya Nagarik Suraksha Sanhita (BNSS) replaced the CrPC",
        source: "Ministry of Home Affairs notification",
        note: "FIR filing, time-bound investigation, trial timelines and bail grounds have all changed. If your matter began before this date, transitional provisions may apply.",
      },
    ],
  },
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
    answer: "Depending on the relief sought and the parties, property matters may fall before: the Civil Court (Junior or Senior Civil Judge), the City Civil Court, or the High Court of Telangana for higher-value or writ matters. Revenue tribunals and TSRERA are parallel forums for specific categories.",
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
                  name: "NCRB: Crime in India 2022",
                  url: "https://ncrb.gov.in/en/crime-india",
                  note: "Annual statistical report on registered crimes across India, published by the National Crime Records Bureau.",
                },
                {
                  name: "NJDG: National Judicial Data Grid",
                  url: "https://njdg.ecourts.gov.in",
                  note: "Real-time pendency and disposal data for district courts and High Courts.",
                },
                {
                  name: "Department of Consumer Affairs: Annual Report 2022-23",
                  url: "https://consumeraffairs.nic.in",
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
            Statistics are updated when new official reports are published.
            Last reviewed: September 2026. This page is general reference
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
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
