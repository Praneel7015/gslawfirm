/**
 * Verify that every localized sitemap page has one specific, local H1.
 *
 * Usage: pnpm qa:h1 [baseUrl]
 * Default base: NEXT_PUBLIC_SITE_URL or https://sunitha.sindhole.com
 */

export {};

const H1_BASE =
  process.argv[2]?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";

type Locale = "en" | "hi" | "te";

const H1_LOCALES: ReadonlyArray<{ locale: Locale; prefix: string }> = [
  { locale: "en", prefix: "" },
  { locale: "hi", prefix: "/hi" },
  { locale: "te", prefix: "/te" },
];

const ROUTE_INTENT: Record<string, Record<Locale, RegExp>> = {
  "": {
    en: /criminal|civil/i,
    hi: /आपराधिक|दीवानी/i,
    te: /క్రిమినల్|సివిల్/i,
  },
  "/bail": { en: /bail/i, hi: /बेल/i, te: /బెయిల్/i },
  "/bail-hearing-procedure-hyderabad": {
    en: /bail hearing/i,
    hi: /बेल सुनवाई/i,
    te: /బెయిల్ విచారణ/i,
  },
  "/criminal-defense": {
    en: /criminal defense/i,
    hi: /आपराधिक बचाव/i,
    te: /క్రిమినల్ డిఫెన్స్/i,
  },
  "/cyber-crime-complaints": {
    en: /cyber.?crime complaints/i,
    hi: /cyber crime complaints/i,
    te: /cyber crime complaints/i,
  },
  "/property-disputes": {
    en: /property disputes/i,
    hi: /संपत्ति विवाद/i,
    te: /ఆస్తి వివాదాలు/i,
  },
  "/property-dispute-courts-telangana": {
    en: /property dispute courts/i,
    hi: /संपत्ति विवाद अदालतें/i,
    te: /ఆస్తి వివాద కోర్టులు/i,
  },
  "/consumer-forum-complaints": {
    en: /consumer forum complaints/i,
    hi: /consumer forum complaints/i,
    te: /consumer forum complaints/i,
  },
  "/legal-notices": {
    en: /legal notices and replies/i,
    hi: /कानूनी नोटिस और जवाब/i,
    te: /legal notices.*replies/i,
  },
  "/commercial-contracts": {
    en: /commercial contracts/i,
    hi: /वाणिज्यिक अनुबंध/i,
    te: /వాణిజ్య ఒప్పందాలు/i,
  },
  "/succession-probate": {
    en: /succession and probate/i,
    hi: /उत्तराधिकार और प्रोबेट/i,
    te: /వారసత్వం మరియు ప్రొబేట్/i,
  },
  "/high-court-matters": {
    en: /high court matters/i,
    hi: /हाई कोर्ट मामले/i,
    te: /హైకోర్టు విషయాలు/i,
  },
  "/cheque-dishonour": {
    en: /cheque dishonour/i,
    hi: /चेक अनादर/i,
    te: /చెక్ డిసానర్/i,
  },
  "/cheque-bounce-case-procedure-hyderabad": {
    en: /cheque bounce case procedure/i,
    hi: /चेक बाउंस केस प्रक्रिया/i,
    te: /చెక్ బౌన్స్ కేసు ప్రక్రియ/i,
  },
  "/tenancy-eviction": {
    en: /tenancy and eviction/i,
    hi: /किरायेदारी और बेदखली/i,
    te: /అద్దె మరియు ఎవిక్షన్/i,
  },
  "/specific-performance": {
    en: /specific performance/i,
    hi: /specific performance/i,
    te: /specific performance/i,
  },
  "/injunction-interim-relief": {
    en: /injunction and interim relief/i,
    hi: /injunction और interim relief/i,
    te: /injunction మరియు interim relief/i,
  },
  "/continuity-of-counsel": {
    en: /continuity of counsel/i,
    hi: /काउंसल की निरंतरता/i,
    te: /కౌన్సెల్ నిరంతరత/i,
  },
  "/kondapur-legal-services": {
    en: /legal services/i,
    hi: /कानूनी सेवाएं/i,
    te: /న్యాయ సేవలు/i,
  },
  "/about": {
    en: /legal practice/i,
    hi: /कानूनी प्रैक्टिस/i,
    te: /న్యాయ ప్రాక్టీస్/i,
  },
  "/practice": {
    en: /legal practice areas/i,
    hi: /कानूनी कार्य क्षेत्र/i,
    te: /న్యాయ ప్రాక్టీస్ రంగాలు/i,
  },
  "/practice/criminal": {
    en: /criminal litigation/i,
    hi: /आपराधिक मुकदमे/i,
    te: /క్రిమినల్ లిటిగేషన్/i,
  },
  "/practice/civil": {
    en: /civil and property disputes/i,
    hi: /दीवानी और संपत्ति विवाद/i,
    te: /సివిల్ మరియు ఆస్తి వివాదాలు/i,
  },
  "/practice/corporate": {
    en: /corporate and commercial matters/i,
    hi: /कॉर्पोरेट और वाणिज्यिक मामले/i,
    te: /కార్పొరేట్ మరియు వాణిజ్య విషయాలు/i,
  },
  "/practice/will-succession": {
    en: /wills, trusts and succession/i,
    hi: /वसीयत, ट्रस्ट और उत्तराधिकार/i,
    te: /విల్లు, ట్రస్టులు మరియు వారసత్వం/i,
  },
  "/practice/high-court": {
    en: /telangana high court practice/i,
    hi: /तेलंगाना हाई कोर्ट प्रैक्टिस/i,
    te: /తెలంగాణ హైకోర్టు ప్రాక్టీస్/i,
  },
  "/contact": {
    en: /contact gs law firm/i,
    hi: /GS Law Firm से संपर्क करें/i,
    te: /GS Law Firmను సంప్రదించండి/i,
  },
  "/privacy": {
    en: /privacy notice/i,
    hi: /गोपनीयता सूचना/i,
    te: /గోప్యతా నోటీసు/i,
  },
  "/disclaimer": {
    en: /website disclaimer/i,
    hi: /वेबसाइट का अस्वीकरण/i,
    te: /వెబ్‌సైట్ నిరాకరణ/i,
  },
};

const LOCAL_REFERENCE: Record<Locale, RegExp> = {
  en: /Hyderabad|Kondapur|Telangana/i,
  hi: /हैदराबाद|कोंडापुर|तेलंगाना/i,
  te: /హైదరాబాద్|కొండాపూర్|తెలంగాణ/i,
};

const LOCAL_SCRIPT: Partial<Record<Locale, RegExp>> = {
  hi: /[\u0900-\u097F]/,
  te: /[\u0C00-\u0C7F]/,
};

function textContent(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

async function runH1Audit() {
  const failures: string[] = [];
  let checked = 0;

  for (const { locale, prefix } of H1_LOCALES) {
    for (const [route, intents] of Object.entries(ROUTE_INTENT)) {
      const url = `${H1_BASE}${prefix}${route || "/"}`;
      const response = await fetch(url, { redirect: "follow" });

      if (!response.ok) {
        failures.push(`${url}: returned ${response.status}`);
        continue;
      }

      const html = await response.text();
      const headings = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(
        (match) => textContent(match[1]!),
      );
      checked++;

      if (headings.length !== 1) {
        failures.push(`${url}: expected 1 H1, found ${headings.length}`);
        continue;
      }

      const heading = headings[0]!;
      if (!LOCAL_REFERENCE[locale].test(heading)) {
        failures.push(
          `${url}: H1 has no Hyderabad, Kondapur or Telangana reference: "${heading}"`,
        );
      }
      if (LOCAL_SCRIPT[locale] && !LOCAL_SCRIPT[locale]?.test(heading)) {
        failures.push(
          `${url}: H1 is not localized for ${locale}: "${heading}"`,
        );
      }
      if (!intents[locale].test(heading)) {
        failures.push(`${url}: H1 does not name the page intent: "${heading}"`);
      }
    }
  }

  if (failures.length > 0) {
    for (const failure of failures) console.error(`✗ ${failure}`);
    console.error(
      `\n${failures.length} H1 violation(s) across ${checked} pages.`,
    );
    process.exit(1);
  }

  console.log(
    `✓ ${checked} localized pages each have one specific, locally qualified H1.`,
  );
}

runH1Audit().catch((error) => {
  console.error(error);
  process.exit(1);
});
