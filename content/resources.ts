/**
 * content/resources.ts
 *
 * Central registry for all blog/resources articles.
 * Add a new entry here and create the matching page component under
 * app/[locale]/resources/[slug]/page.tsx to publish a new article.
 */

export interface ResourceArticle {
  /** URL-safe slug (used in the route and sitemap) */
  slug: string;
  /** Article title */
  title: string;
  /** One-sentence description — used in meta description and listing card */
  description: string;
  /** SEO keywords helping surface the article for the right queries */
  tags: string[];
  /** ISO 8601 date this article was first published */
  publishedAt: string;
  /** ISO 8601 date of last substantive edit */
  updatedAt: string;
  /** Related practice area or guide slug (for sidebar cross-links) */
  relatedSlugs?: string[];
}

export const resourceArticles: ResourceArticle[] = [
  {
    slug: "what-to-do-after-receiving-legal-notice-hyderabad",
    title:
      "What to Do After Receiving a Legal Notice in Hyderabad — A Practical Checklist",
    description:
      "Step-by-step guidance on reading, verifying and responding to a legal notice in Hyderabad: timelines, what not to ignore and when to call an advocate.",
    tags: [
      "legal notice",
      "legal notice Hyderabad",
      "reply to legal notice",
      "legal notice response",
      "advocate Hyderabad",
    ],
    publishedAt: "2026-09-20",
    updatedAt: "2026-09-20",
    relatedSlugs: [
      "/legal-notices",
      "/legal-notice-reply-format",
      "/commercial-contracts",
    ],
  },
  {
    slug: "understanding-bail-in-hyderabad-courts",
    title:
      "Understanding Bail in Hyderabad Courts — Regular Bail, Anticipatory Bail and Interim Bail Explained",
    description:
      "A plain-language explainer on the three types of bail applications in Hyderabad: which court, what documents, what timelines and how the decision is made.",
    tags: [
      "bail Hyderabad",
      "anticipatory bail Hyderabad",
      "regular bail",
      "bail application India",
      "criminal advocate Hyderabad",
    ],
    publishedAt: "2026-09-20",
    updatedAt: "2026-09-20",
    relatedSlugs: [
      "/bail",
      "/bail-hearing-procedure-hyderabad",
      "/criminal-defense",
    ],
  },
  {
    slug: "property-title-verification-hyderabad",
    title:
      "Property Title Verification in Hyderabad — Why It Matters and What Documents Are Checked",
    description:
      "How property title verification works in Hyderabad: documents reviewed, encumbrance certificates, revenue records, and red flags an advocate looks for before a purchase or dispute.",
    tags: [
      "property title verification Hyderabad",
      "encumbrance certificate Telangana",
      "property documents Hyderabad",
      "property advocate Hyderabad",
      "buy property Hyderabad legal check",
    ],
    publishedAt: "2026-09-20",
    updatedAt: "2026-09-20",
    relatedSlugs: [
      "/property-disputes",
      "/property-dispute-courts-telangana",
      "/succession-probate",
    ],
  },
];

/** Look up a single article by slug. Returns undefined if not found. */
export function getResourceArticle(
  slug: string
): ResourceArticle | undefined {
  return resourceArticles.find((a) => a.slug === slug);
}
