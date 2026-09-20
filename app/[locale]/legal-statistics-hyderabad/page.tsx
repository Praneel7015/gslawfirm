import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
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

// ── Stats data (sourced from NCRB Crime in India 2022, NJDG public data,
//    NCDRC annual reports, MCA corporate pendency data) ─────────────────────

interface Stat {
  figure: string;
  label: string;
  source: string;
  note?: string;
}

interface StatCategory {
  heading: string;
  slug: string;
  description: string;
  stats: Stat[];
}

const STAT_CATEGORIES: StatCategory[] = [
  {
    heading: "Cyber Crime — Telangana",
    slug: "cyber-crime",
    description:
      "Telangana consistently ranks among the top five states for registered cyber crime cases. The bulk of complaints in Hyderabad are filed through cybercrime.gov.in and then routed to the Telangana Cyber Security Bureau (TCSB) or local police.",
    stats: [
      {
        figure: "15,297",
        label: "Cyber crimes registered in Telangana (2022)",
        source: "NCRB — Crime in India 2022, Table 21B",
        note:
          "Includes financial fraud, impersonation, hacking, online harassment and data theft. Hyderabad accounts for the majority of state registrations.",
      },
      {
        figure: "#4",
        label: "Telangana rank among states by cyber crime registrations (2022)",
        source: "NCRB — Crime in India 2022, Statement 25",
      },
      {
        figure: "~76 %",
        label:
          "Share of cyber crime complaints that relate to financial fraud (national average)",
        source: "NCRB — Crime in India 2022, Chapter 19",
        note:
          "Fraudulent OTP collection, investment scams, banking-credential phishing and KYC fraud are the dominant categories across metros including Hyderabad.",
      },
      {
        figure: "1930",
        label: "National helpline number for cyber crime complaints",
        source: "Ministry of Home Affairs — I4C",
        note: "Available 24×7; complaints also registerable at cybercrime.gov.in",
      },
    ],
  },
  {
    heading: "Cheque Dishonour — Section 138 NI Act",
    slug: "cheque-dishonour",
    description:
      "Section 138 Negotiable Instruments Act cases are among the most numerically significant matters before Metropolitan Magistrates in Hyderabad. The summary procedure was strengthened by the 2018 amendment, but pendency remains high.",
    stats: [
      {
        figure: "~35 lakh",
        label:
          "Estimated pending Section 138 NI Act cases across India (2023)",
        source: "Supreme Court of India — In Re: Expeditious Trial of Cases (2021), reaffirmed in 2023",
        note:
          "Hyderabad and Rangareddy district courts carry a significant share of the Telangana total.",
      },
      {
        figure: "30 days",
        label: "Statutory notice period before a Section 138 complaint can be filed",
        source: "Section 138 read with Section 142, Negotiable Instruments Act 1881",
        note:
          "The payee must serve a written demand notice within 30 days of the dishonour memo. The drawer then has 15 days to make payment.",
      },
      {
        figure: "2 years",
        label:
          "Prescribed punishment on conviction — imprisonment up to this term or fine or both",
        source: "Section 138, Negotiable Instruments Act 1881 (as amended 2018)",
      },
    ],
  },
  {
    heading: "Property Disputes — Telangana Courts",
    slug: "property-disputes",
    description:
      "Property litigation constitutes a significant share of civil court pendency in Telangana. Matters typically traverse multiple forums — civil courts, the High Court, the revenue Tahsildar and, in some cases, the Real Estate Regulatory Authority (TSRERA).",
    stats: [
      {
        figure: "~4.5 crore",
        label: "Pending civil cases (all categories) in district courts across India (2023)",
        source: "National Judicial Data Grid (NJDG) — public dashboard, October 2023",
        note:
          "Property, tenancy and succession cases collectively form the largest civil pendency block in Telangana district courts.",
      },
      {
        figure: "6 months – 2 years",
        label: "Typical first listing to evidence stage in a civil property suit in Hyderabad",
        source:
          "GS Law Firm practice observation; consistent with NJDG district-wise disposal data",
        note:
          "Timelines vary significantly by the complexity of title chain, number of defendants, interim relief applications and prevailing court roster.",
      },
      {
        figure: "TSRERA",
        label: "Real Estate Regulatory Authority for Telangana — separate forum for RERA complaints",
        source: "Telangana RERA — tsrera.telangana.gov.in",
        note:
          "RERA complaints about builder delays, possession defaults and title issues are adjudicated separately from civil courts.",
      },
    ],
  },
  {
    heading: "Consumer Forum Complaints — Telangana",
    slug: "consumer-forum",
    description:
      "Consumer disputes are handled by a three-tier system: District Consumer Disputes Redressal Commission (DCDRC), State Commission (TSCDRC) and the National Consumer Disputes Redressal Commission (NCDRC). Filing thresholds were revised significantly by the Consumer Protection Act 2019.",
    stats: [
      {
        figure: "₹50 lakh",
        label: "District CDRC pecuniary limit (Consumer Protection Act 2019)",
        source: "Section 34, Consumer Protection Act 2019",
      },
      {
        figure: "₹50 lakh – ₹2 crore",
        label: "State CDRC jurisdiction — claims between these amounts",
        source: "Section 47, Consumer Protection Act 2019",
      },
      {
        figure: "5,82,544",
        label: "Cases pending before all consumer commissions in India (2022)",
        source: "Department of Consumer Affairs — Annual Report 2022-23",
        note:
          "Telangana's state commission and district commissions in Hyderabad and Rangareddy carry high pendency relative to disposal capacity.",
      },
      {
        figure: "21 days",
        label: "Initial admission hearing deadline for a consumer complaint",
        source: "Section 36(1), Consumer Protection Act 2019",
        note:
          "Admission does not guarantee success. After admission the opposite party must be heard before a final order.",
      },
    ],
  },
  {
    heading: "Criminal Matters — Telangana",
    slug: "criminal-matters",
    description:
      "Hyderabad is served by the Commissioner of Police (Cyberabad and Hyderabad Police), the Rachakonda Commissionerate and the Telangana State Police. Criminal cases travel through the Magistrate court system (JFCM/ACMM/MM) before session-stage matters proceed to the Sessions Court.",
    stats: [
      {
        figure: "2,83,748",
        label: "Cognisable offences registered in Telangana (2022)",
        source: "NCRB — Crime in India 2022, Table 1.3",
      },
      {
        figure: "~60 %",
        label: "Share of IPC crimes related to property and economic offences in Telangana",
        source: "NCRB — Crime in India 2022, Chapter 1",
        note:
          "Theft, cheating, criminal breach of trust and misappropriation combine to form the largest share of registered cases.",
      },
      {
        figure: "24 hours",
        label:
          "Maximum police custody remand on arrest without warrant before production before Magistrate",
        source: "Section 57, Code of Criminal Procedure 1973 (Section 35, BNSS 2023)",
        note:
          "The Magistrate may order further custody (police or judicial) on application; bail applications before a Magistrate may be filed at this stage.",
      },
      {
        figure: "2023",
        label: "Year Bharatiya Nagarik Suraksha Sanhita (BNSS) and BNS replaced CrPC and IPC",
        source: "Ministry of Home Affairs notification — effective 1 July 2024",
        note:
          "Many procedures have changed: FIR filing, time-bound investigation, trial timelines and bail grounds. If your matter began before July 2024, the transitional provisions may apply.",
      },
    ],
  },
];

const FAQ_ITEMS = [
  {
    question:
      "Where can I find official court case-status data for Telangana?",
    answer:
      "The National Judicial Data Grid (njdg.ecourts.gov.in) provides free public access to case status, pendency and disposal data for district courts across India including Telangana. The High Court of Telangana's own e-filing portal also has cause-list and order data.",
  },
  {
    question: "How do I file a cyber crime complaint in Hyderabad?",
    answer:
      "You can report online at cybercrime.gov.in or call the national helpline 1930. For Hyderabad, complaints are routed to the Telangana Cyber Security Bureau (TCSB) or the local police cyber cell. For matters that may require a formal FIR, a lawyer can advise on which category of offence applies and help draft a detailed complaint.",
  },
  {
    question: "What courts handle property disputes in Hyderabad?",
    answer:
      "Depending on the relief sought and the parties, property matters in Hyderabad may fall in: the Civil Court (Junior or Senior Civil Judge), the City Civil Court, or the High Court of Telangana (for higher-value or writ matters). Revenue Tribunals and TSRERA (for RERA-regulated projects) are parallel forums for specific categories.",
  },
  {
    question:
      "Are the statistics on this page applicable to my specific case?",
    answer:
      "No. Aggregate statistics give a factual backdrop about the legal environment in Hyderabad and Telangana; they cannot predict timelines, outcomes or costs for any individual matter. Each case depends on the facts, documents, court roster, opposite parties and applicable procedure. A direct conversation with an advocate is the only way to assess a specific matter.",
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
      <section
        className="pd-hero stats-hero"
        aria-labelledby="stats-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Legal Statistics</span>
        </nav>
        <h1 id="stats-title">
          {localizedPageHeading("legalStatisticsHyderabad", locale)}
        </h1>
        <p className="lede">
          A factual reference on court volumes, procedural timelines and legal
          process context for Hyderabad and Telangana. Sources are cited
          inline; figures are drawn from NCRB, NJDG, and official government
          reports.
        </p>
        <p className="stats-caveat">
          <strong>Note:</strong> Aggregate statistics are not legal advice and
          cannot predict the outcome, cost or timeline of any individual
          matter. For a specific question, send a brief enquiry.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── BODY ── */}
      <section className="pd-body stats-body">
        <div className="pd-content">

          {/* ── Category sections ── */}
          {STAT_CATEGORIES.map((cat) => (
            <section
              key={cat.slug}
              id={cat.slug}
              className="stats-section"
              aria-labelledby={`${cat.slug}-heading`}
            >
              <h2 id={`${cat.slug}-heading`}>{cat.heading}</h2>
              <p>{cat.description}</p>

              <div className="stats-grid" role="list">
                {cat.stats.map((stat) => (
                  <article
                    className="stat-card"
                    key={stat.label}
                    role="listitem"
                  >
                    <span className="stat-figure" aria-label="Statistic">
                      {stat.figure}
                    </span>
                    <p className="stat-label">{stat.label}</p>
                    <p className="stat-source">
                      <em>Source: {stat.source}</em>
                    </p>
                    {stat.note && (
                      <p className="stat-note">{stat.note}</p>
                    )}
                  </article>
                ))}
              </div>
            </section>
          ))}

          {/* ── FAQ ── */}
          <section
            className="stats-faq"
            aria-labelledby="stats-faq-heading"
          >
            <h2 id="stats-faq-heading">Common questions about these statistics</h2>
            <dl className="faq-list">
              {FAQ_ITEMS.map((item) => (
                <div key={item.question} className="faq-item">
                  <dt className="faq-q">{item.question}</dt>
                  <dd className="faq-a">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </section>

          {/* ── Sources ── */}
          <section className="stats-sources" aria-labelledby="sources-heading">
            <h2 id="sources-heading">Primary sources used on this page</h2>
            <ul>
              <li>
                <strong>NCRB — Crime in India 2022:</strong>{" "}
                <a
                  href="https://ncrb.gov.in/en/crime-india"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ncrb.gov.in
                </a>
                {" "}— annual statistical report on registered crimes across India,
                published by the National Crime Records Bureau.
              </li>
              <li>
                <strong>NJDG — National Judicial Data Grid:</strong>{" "}
                <a
                  href="https://njdg.ecourts.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  njdg.ecourts.gov.in
                </a>
                {" "}— real-time pendency and disposal data for district courts
                and High Courts, published by the e-Courts project.
              </li>
              <li>
                <strong>Department of Consumer Affairs — Annual Report 2022-23:</strong>{" "}
                <a
                  href="https://consumeraffairs.nic.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  consumeraffairs.nic.in
                </a>
              </li>
              <li>
                <strong>Ministry of Home Affairs — I4C / cybercrime.gov.in:</strong>{" "}
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  cybercrime.gov.in
                </a>
              </li>
              <li>
                <strong>TSRERA — Telangana Real Estate Regulatory Authority:</strong>{" "}
                <a
                  href="https://tsrera.telangana.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  tsrera.telangana.gov.in
                </a>
              </li>
            </ul>
          </section>

          <p className="pd-footnote">
            Statistics are updated when new official reports are published.
            Last reviewed: September 2026. This page is general reference
            information, not legal advice. GS Law Firm makes no warranty as
            to the accuracy or completeness of third-party data reproduced
            here; always consult original sources and a qualified advocate for
            any specific matter.
          </p>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="pd-side" aria-label="Related actions and links">
          <div className="pd-cta">
            <h3>Have a matter in Hyderabad?</h3>
            <p>
              Statistics give context; an advocate can assess the specifics of
              your matter — documents, deadlines, opposing parties and
              applicable procedure.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Send a confidential enquiry <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          {/* ── In-page navigation ── */}
          <nav
            className="pd-adj stats-nav"
            aria-label="Jump to section"
          >
            <h3>Jump to section</h3>
            <ul>
              {STAT_CATEGORIES.map((cat) => (
                <li key={cat.slug}>
                  <a href={`#${cat.slug}`}>{cat.heading}</a>
                  <span aria-hidden="true">↓</span>
                </li>
              ))}
              <li>
                <a href="#sources">Sources used</a>
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
                <Link href="/cheque-dishonour">
                  Cheque dishonour guidance
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-bounce-case-procedure-hyderabad">
                  Cheque bounce procedure guide
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-disputes">
                  Property disputes guidance
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/consumer-forum-complaints">
                  Consumer forum complaints
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/criminal-defense">
                  Criminal defense
                </Link>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
