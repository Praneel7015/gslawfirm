/** Practice areas (per build-prompt §5). Criminal is primary. */
export type PracticeArea = {
  slug: PracticeSlug;
  num: string;
  name: string;
  shortName: string;
  priority: "primary" | "secondary" | "tertiary";
  /** One-line description used on cards. */
  oneLine: string;
  /** Two-paragraph plain-English explanation for the detail page. */
  paragraphs: readonly [string, string, ...string[]];
  /** 4–6 bullets of "what we handle". */
  handle: readonly string[];
};

export type PracticeSlug =
  | "criminal"
  | "civil"
  | "corporate"
  | "will-succession"
  | "high-court";

export const practiceAreas: readonly PracticeArea[] = [
  {
    slug: "criminal",
    num: "01",
    name: "Criminal Litigation",
    shortName: "Criminal",
    priority: "primary",
    oneLine:
      "Bail, anticipatory bail, trial representation and appeals across magistrate and sessions courts.",
    paragraphs: [
      "Most clients meet us at a particular kind of moment: a phone call, a notice, a knock at the door. The work that follows is rarely linear. We start by listening, then by reading what is already on file, and then by deciding, together, what the most measured next step looks like.",
      "The practice covers the routine and the unusual. Bail applications and anticipatory bail. Quashing petitions. Trial representation across magistrate and sessions courts. Cross-examination of witnesses where the file calls for it. Appeals and revisions when the verdict warrants further argument.",
      "We keep the room small. The same advocate who reads your brief is the one who appears for you, and the one you call afterwards. No rotating juniors. No surprise on counsel at the next date.",
    ],
    handle: [
      "Anticipatory & regular bail",
      "FIR quashing under § 482",
      "Sessions court trial representation",
      "Cross-examination of witnesses",
      "Criminal appeals & revisions",
      "Cheque dishonour (N.I. Act § 138)",
    ],
  },
  {
    slug: "civil",
    num: "02",
    name: "Civil & Property Disputes",
    shortName: "Civil",
    priority: "secondary",
    oneLine:
      "Property, tenancy, contractual and consumer disputes, district court through appellate stages.",
    paragraphs: [
      "Civil work is slower work. A property dispute can take years; a tenancy matter, months; a consumer complaint, weeks. We plan for the time the work actually takes, not the time anyone wishes it would take.",
      "The firm appears in district and city civil courts, with periodic matters before the High Court where appellate or writ relief is sought. We draft carefully, file deliberately, and avoid arguments we are not asked to make.",
    ],
    handle: [
      "Property & title disputes",
      "Partition & inheritance suits",
      "Tenancy & eviction",
      "Specific performance of contracts",
      "Consumer disputes",
      "Injunctions & interim relief",
    ],
  },
  {
    slug: "corporate",
    num: "03",
    name: "Corporate & Commercial",
    shortName: "Corporate",
    priority: "tertiary",
    oneLine:
      "Counsel on contracts, compliance, shareholder matters and commercial documentation for small firms.",
    paragraphs: [
      "The corporate practice is deliberately modest in scope. We work with founders and small-firm owners on the documents that matter, and on the questions that surface before the documents do.",
      "Common engagements include shareholder agreements, employment contracts, vendor and service agreements, and ongoing counsel on compliance posture. We try, where we can, to write contracts that read.",
    ],
    handle: [
      "Shareholder & founders' agreements",
      "Employment & contractor contracts",
      "Vendor & service agreements",
      "Commercial dispute resolution",
      "Regulatory & compliance counsel",
      "NDAs & IP assignments",
    ],
  },
  {
    slug: "will-succession",
    num: "04",
    name: "Wills, Trusts & Succession",
    shortName: "Will & Succession",
    priority: "tertiary",
    oneLine:
      "Drafting of wills, probate, letters of administration, and inheritance disputes handled with discretion.",
    paragraphs: [
      "Succession work asks for two things from counsel: precision in the paperwork and discretion in the room. Family matters are rarely only legal matters.",
      "We draft wills, obtain probate, file letters of administration, and represent parties in inheritance disputes. Where the situation permits, we encourage settlement; where it does not, we contest carefully.",
    ],
    handle: [
      "Will drafting & execution",
      "Probate applications",
      "Letters of administration",
      "Succession certificates",
      "Inheritance disputes",
      "Family settlement deeds",
    ],
  },
  {
    slug: "high-court",
    num: "05",
    name: "High Court Matters",
    shortName: "High Court",
    priority: "tertiary",
    oneLine:
      "Writ petitions, criminal and civil revisions, and matters before the High Court of Telangana.",
    paragraphs: [
      "High Court work is not the bulk of the practice, but it is regular. The firm appears periodically before the High Court of Telangana, primarily on writ petitions, criminal and civil revisions, and matters arising from district-court orders.",
      "We are selective about the matters we take to the High Court. The bar is higher than it appears in print, and not every grievance reads as a question of law.",
    ],
    handle: [
      "Writ petitions (Article 226)",
      "Criminal revisions",
      "Civil revisions & second appeals",
      "Quashing petitions",
      "Bail applications (High Court)",
    ],
  },
] as const;

export function getPracticeArea(slug: string): PracticeArea | undefined {
  return practiceAreas.find((a) => a.slug === slug);
}
