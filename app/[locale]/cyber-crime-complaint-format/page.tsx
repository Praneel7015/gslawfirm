import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { firm } from "@/content/firm";
import { cyberCrimeComplaintFormatFaqs } from "@/content/service-faqs";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, faqPageSchema, graphSchema } from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("cyberCrimeComplaintFormat", locale);
}

const complaintSections = [
  {
    title: "Complainant and contact details",
    body: "Give the name, address, phone number and email used for the complaint. If a business account or another affected person is involved, identify that connection without sharing passwords, PINs or one-time codes.",
  },
  {
    title: "Short subject line",
    body: "Name the event plainly, such as an unauthorized UPI transfer, impersonation through a messaging account, social-media harassment or misuse of an online account. Avoid conclusions that the available record cannot yet support.",
  },
  {
    title: "Dated sequence of events",
    body: "Set out when contact began, what was represented, which account or number was used, what action followed, when money or access was lost, and when the bank, platform, portal or police were contacted.",
  },
  {
    title: "Identifiers and transaction details",
    body: "List the relevant phone numbers, email addresses, usernames, profile links, website addresses, UPI IDs, account details, transaction IDs, dates and amounts. Mask unrelated financial information in copies where appropriate.",
  },
  {
    title: "Evidence list",
    body: "Number the screenshots, messages, email headers, bank records, platform notices, call logs, URLs, device alerts and earlier complaint acknowledgements. Keep original files separately rather than relying only on images pasted into the complaint.",
  },
  {
    title: "Action already taken and request",
    body: "Record calls to 1930, portal acknowledgements, bank or wallet complaint numbers, platform reports and police visits. End with a factual request that the complaint be received and examined under the applicable process.",
  },
] as const;

const evidenceChecklist = [
  "A one-page chronology with exact dates and approximate times",
  "Screenshots that show the full screen, sender and timestamp",
  "Transaction IDs, bank or wallet messages, statements and complaint numbers",
  "Phone numbers, email addresses, usernames, profile links and website URLs",
  "Original emails with headers, messages, call logs and downloaded files",
  "Portal, police, bank, platform or telecom acknowledgements already received",
  "FIR, notice, summons or court papers if the matter has moved further",
] as const;

function complaintFormatWebPageSchema(locale: string) {
  const path =
    locale === "en"
      ? "/cyber-crime-complaint-format"
      : `/${locale}/cyber-crime-complaint-format`;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Cyber crime complaint format guide for Hyderabad",
    description:
      "A practical cyber crime complaint structure covering chronology, identifiers, transaction details, evidence preservation and official reporting routes in India.",
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
    about: [
      "Cyber crime complaint format",
      "Digital evidence",
      "Online financial fraud reporting",
      "National Cyber Crime Reporting Portal",
      "Hyderabad cyber-crime complaints",
    ],
  };
}

export default async function CyberCrimeComplaintFormatPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const localizedGuideUrl =
    locale === "en"
      ? `${SITE_URL}/cyber-crime-complaint-format`
      : `${SITE_URL}/${locale}/cyber-crime-complaint-format`;

  const ld = graphSchema([
    complaintFormatWebPageSchema(locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      {
        name: "Cyber Crime Complaints",
        url: `${SITE_URL}/cyber-crime-complaints`,
      },
      { name: "Cyber Crime Complaint Format", url: localizedGuideUrl },
    ]),
    faqPageSchema(cyberCrimeComplaintFormatFaqs),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section
        className="pd-hero cyber-hero"
        aria-labelledby="complaint-format-title"
      >
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">Practice</Link>
          <span aria-hidden="true">/</span>
          <Link href="/cyber-crime-complaints">Cyber Crime Complaints</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Complaint Format</span>
        </nav>
        <h1 id="complaint-format-title">
          Cyber crime complaint format: a Hyderabad guide.
        </h1>
        <p className="lede">
          A practical structure for recording what happened, preserving digital
          evidence and using the official reporting routes without mistaking a
          sample complaint for legal advice on a specific matter.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pd-body cyber-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="criminal" size={36} />
            </span>
            <span>
              A useful cyber crime complaint is a clear record, not a dramatic
              narrative. Dates, identifiers, transaction details, original files
              and earlier complaint numbers make the event easier to follow.
            </span>
          </p>

          <p>
            People often search for a cyber crime complaint format after a
            payment, account, message or profile has already caused concern.
            Start by securing the affected account where possible, contacting
            the bank or platform through its verified channel, and preserving
            the records. Do not wait for a polished written complaint when money
            is still moving.
          </p>

          <p>
            For immediate cyber financial fraud reporting in India, the National
            Cyber Crime Reporting Portal directs people to call 1930.
            Cyber-crime complaints can also be reported at{" "}
            <a href="https://www.cybercrime.gov.in/" rel="noreferrer">
              cybercrime.gov.in
            </a>
            . In an emergency, contact the local police or the national police
            helpline 112. These are official reporting routes; this page does
            not replace them.
          </p>

          <section className="service-faq" aria-labelledby="format-title">
            <h2 id="format-title">A practical cyber crime complaint format</h2>
            <p>
              Use short paragraphs and numbered attachments. The six sections
              below are a preparation framework, not fixed wording for every
              complaint.
            </p>
            <div className="service-faq-list">
              {complaintSections.map((section, index) => (
                <article className="service-faq-item" key={section.title}>
                  <h3>
                    {String(index + 1).padStart(2, "0")}. {section.title}
                  </h3>
                  <p>{section.body}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="service-faq" aria-labelledby="sample-opening">
            <h2 id="sample-opening">A neutral opening you can adapt</h2>
            <p>
              “I am submitting this complaint regarding [brief description of
              the incident]. The relevant events occurred between [first date]
              and [latest date]. The identifiers, transactions and supporting
              records presently available are listed below.”
            </p>
            <p>
              Follow that opening with the chronology, identifiers and numbered
              evidence. State what you observed and what the records show. Avoid
              guessing who controls an account, promising proof you do not have,
              or copying legal sections from an unrelated sample.
            </p>
          </section>

          <div className="pd-handle">
            <h2>Evidence to place beside the complaint</h2>
            <ul>
              {evidenceChecklist.map((item, index) => (
                <li key={item}>
                  <span className="li-num">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <section className="service-faq" aria-labelledby="preserve-evidence">
            <h2 id="preserve-evidence">Preserve the original digital record</h2>
            <div className="service-faq-list">
              <article className="service-faq-item">
                <h3>Keep originals as well as screenshots</h3>
                <p>
                  A cropped screenshot may hide the sender, URL, date or time.
                  Keep the original message, email, file, account alert or
                  statement where possible, and note the device or account from
                  which it came.
                </p>
              </article>
              <article className="service-faq-item">
                <h3>Do not edit the evidence file</h3>
                <p>
                  Make a working copy for annotations or redactions and retain
                  the original separately. Record how the file was received and
                  who had access to it.
                </p>
              </article>
              <article className="service-faq-item">
                <h3>Protect accounts without destroying the trail</h3>
                <p>
                  Use verified bank, platform and telecom channels to secure
                  affected access. Before deleting a conversation or account,
                  preserve the identifiers, timestamps and complaint record that
                  may be needed later.
                </p>
              </article>
            </div>
          </section>

          <section className="service-faq" aria-labelledby="after-reporting">
            <h2 id="after-reporting">What to record after reporting</h2>
            <p>
              Keep every acknowledgement number, the date and channel used, the
              name or designation of the office contacted, and any next step
              communicated by the bank, portal, platform or police. If an FIR,
              notice, summons or court paper follows, place it beside the
              original chronology rather than starting the story again from
              memory.
            </p>
          </section>

          <section
            className="service-faq"
            aria-labelledby="complaint-format-faq"
          >
            <h2 id="complaint-format-faq">Common questions</h2>
            <div className="service-faq-list">
              {cyberCrimeComplaintFormatFaqs.map((item) => (
                <article className="service-faq-item" key={item.question}>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <p className="pd-footnote">
            This guide is general information, not legal advice or a
            filing-ready complaint for a specific event. The appropriate wording
            and next step depend on the records, loss, parties, platform or bank
            response, complaint stage, police papers and any later court
            process.
          </p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Discuss the complaint record in confidence.</h3>
            <p>
              Share the chronology, identifiers, screenshots, transaction
              records, acknowledgement numbers and any FIR, notice or summons. A
              first conversation can identify what should be read before a legal
              next step is considered.
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              Request a consultation <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>Related pages</h3>
            <ul>
              <li>
                <Link href="/cyber-crime-complaints">
                  Cyber Crime Complaints
                </Link>
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
                <SourceAwareContactLink>
                  Contact the firm
                </SourceAwareContactLink>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
