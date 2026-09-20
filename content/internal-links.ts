/**
 * Shared internal-link maps so practice, resources and statistics
 * pages stay cross-linked (no orphan SEO pages).
 */

export type HubLink = { href: string; label: string };

/** Human labels for resource article paths used in sidebars. */
export const resourceLinkLabels: Record<string, string> = {
  "/resources": "Resources and legal guides",
  "/resources/what-to-do-after-receiving-legal-notice-hyderabad":
    "What to do after a legal notice",
  "/resources/understanding-bail-in-hyderabad-courts":
    "Understanding bail in Hyderabad courts",
  "/resources/property-title-verification-hyderabad":
    "Property title verification in Hyderabad",
  "/legal-statistics-hyderabad": "Legal statistics for Hyderabad",
  "/legal-statistics-hyderabad#criminal-matters":
    "Criminal statistics for Telangana",
  "/legal-statistics-hyderabad#property-disputes":
    "Property dispute statistics",
  "/legal-statistics-hyderabad#cheque-dishonour":
    "Cheque dishonour statistics",
  "/legal-statistics-hyderabad#cyber-crime":
    "Cyber crime statistics for Telangana",
  "/legal-statistics-hyderabad#consumer-forum": "Consumer forum statistics",
  "/practice/criminal": "Criminal litigation",
  "/practice/civil": "Civil and property disputes",
  "/practice/corporate": "Corporate and commercial",
  "/practice/will-succession": "Wills and succession",
  "/practice/high-court": "High Court practice",
  "/legal-notices": "Legal notices and replies",
  "/legal-notice-reply-format": "Legal-notice reply format",
  "/bail": "Bail applications",
  "/bail-hearing-procedure-hyderabad": "Bail hearing procedure",
  "/criminal-defense": "Criminal defense",
  "/property-disputes": "Property disputes",
  "/property-dispute-courts-telangana": "Property dispute courts",
  "/succession-probate": "Succession and probate",
  "/commercial-contracts": "Commercial contracts",
};

export function labelForHref(href: string): string {
  return (
    resourceLinkLabels[href] ??
    href
      .replace(/^\//, "")
      .replace(/-/g, " ")
      .replace(/^\w/, (c) => c.toUpperCase())
  );
}

/** Hub links appended to every practice-detail sidebar. */
export const practiceHubLinks: HubLink[] = [
  { href: "/resources", label: "Resources and legal guides" },
  {
    href: "/legal-statistics-hyderabad",
    label: "Legal statistics for Hyderabad",
  },
];

/** Topic-specific resource links by practice slug. */
export const practiceResourceLinks: Record<string, HubLink[]> = {
  criminal: [
    {
      href: "/resources/understanding-bail-in-hyderabad-courts",
      label: "Understanding bail in Hyderabad courts",
    },
    {
      href: "/legal-statistics-hyderabad#criminal-matters",
      label: "Criminal statistics for Telangana",
    },
  ],
  civil: [
    {
      href: "/resources/property-title-verification-hyderabad",
      label: "Property title verification in Hyderabad",
    },
    {
      href: "/resources/what-to-do-after-receiving-legal-notice-hyderabad",
      label: "What to do after a legal notice",
    },
    {
      href: "/legal-statistics-hyderabad#property-disputes",
      label: "Property dispute statistics",
    },
  ],
  corporate: [
    {
      href: "/resources/what-to-do-after-receiving-legal-notice-hyderabad",
      label: "What to do after a legal notice",
    },
    {
      href: "/legal-statistics-hyderabad#cheque-dishonour",
      label: "Cheque dishonour statistics",
    },
  ],
  "will-succession": [
    {
      href: "/resources/property-title-verification-hyderabad",
      label: "Property title verification in Hyderabad",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "high-court": [
    {
      href: "/resources/understanding-bail-in-hyderabad-courts",
      label: "Understanding bail in Hyderabad courts",
    },
    {
      href: "/legal-statistics-hyderabad",
      label: "Legal statistics for Hyderabad",
    },
  ],
};

/** Extra related links to inject into focused service-page sidebars. */
export const servicePageExtraLinks: Record<string, HubLink[]> = {
  "/bail": [
    {
      href: "/resources/understanding-bail-in-hyderabad-courts",
      label: "Understanding bail in Hyderabad courts",
    },
    {
      href: "/legal-statistics-hyderabad#criminal-matters",
      label: "Criminal statistics for Telangana",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/bail-hearing-procedure-hyderabad": [
    {
      href: "/resources/understanding-bail-in-hyderabad-courts",
      label: "Understanding bail in Hyderabad courts",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/criminal-defense": [
    {
      href: "/resources/understanding-bail-in-hyderabad-courts",
      label: "Understanding bail in Hyderabad courts",
    },
    {
      href: "/legal-statistics-hyderabad#criminal-matters",
      label: "Criminal statistics for Telangana",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/legal-notices": [
    {
      href: "/resources/what-to-do-after-receiving-legal-notice-hyderabad",
      label: "What to do after a legal notice",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/legal-notice-reply-format": [
    {
      href: "/resources/what-to-do-after-receiving-legal-notice-hyderabad",
      label: "What to do after a legal notice",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/property-disputes": [
    {
      href: "/resources/property-title-verification-hyderabad",
      label: "Property title verification in Hyderabad",
    },
    {
      href: "/legal-statistics-hyderabad#property-disputes",
      label: "Property dispute statistics",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/property-dispute-courts-telangana": [
    {
      href: "/resources/property-title-verification-hyderabad",
      label: "Property title verification in Hyderabad",
    },
    {
      href: "/legal-statistics-hyderabad#property-disputes",
      label: "Property dispute statistics",
    },
  ],
  "/cheque-dishonour": [
    {
      href: "/legal-statistics-hyderabad#cheque-dishonour",
      label: "Cheque dishonour statistics",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/cheque-bounce-case-procedure-hyderabad": [
    {
      href: "/legal-statistics-hyderabad#cheque-dishonour",
      label: "Cheque dishonour statistics",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/cyber-crime-complaints": [
    {
      href: "/legal-statistics-hyderabad#cyber-crime",
      label: "Cyber crime statistics for Telangana",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/cyber-crime-complaint-format": [
    {
      href: "/legal-statistics-hyderabad#cyber-crime",
      label: "Cyber crime statistics for Telangana",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/consumer-forum-complaints": [
    {
      href: "/legal-statistics-hyderabad#consumer-forum",
      label: "Consumer forum statistics",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/commercial-contracts": [
    {
      href: "/resources/what-to-do-after-receiving-legal-notice-hyderabad",
      label: "What to do after a legal notice",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
  "/succession-probate": [
    {
      href: "/resources/property-title-verification-hyderabad",
      label: "Property title verification in Hyderabad",
    },
    { href: "/resources", label: "Resources and legal guides" },
  ],
};
