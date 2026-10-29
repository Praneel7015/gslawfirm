import type { Metadata } from "next";

import { firm } from "@/content/firm";
import { resourceArticles, type ResourceArticle } from "@/content/resources";
import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type ResourceCopy = { title: string; description: string };

// Search summaries are translated; the full guides still require legal translation review.
const summaries: Record<string, Record<Locale, ResourceCopy>> = {
  "what-to-do-after-receiving-legal-notice-hyderabad": {
    en: {
      title: "Received a Legal Notice in Hyderabad? A Practical Guide",
      description: "Received a legal notice in Hyderabad? Learn how to check deadlines, gather documents and prepare a considered response with an advocate's advice.",
    },
    hi: {
      title: "हैदराबाद में कानूनी नोटिस मिलने पर क्या करें",
      description: "हैदराबाद में कानूनी नोटिस मिलने पर समय सीमा कैसे जांचें, कौन से दस्तावेज जुटाएं और अधिवक्ता की सलाह से जवाब कैसे तैयार करें, इस मार्गदर्शिका में जानें।",
    },
    te: {
      title: "హైదరాబాద్‌లో లీగల్ నోటీసు వస్తే ఏం చేయాలి",
      description: "హైదరాబాద్‌లో లీగల్ నోటీసు అందితే గడువులు ఎలా తనిఖీ చేయాలి, ఏ పత్రాలు సేకరించాలి, న్యాయవాది సలహాతో సమాధానం ఎలా సిద్ధం చేయాలో ఈ మార్గదర్శినిలో తెలుసుకోండి.",
    },
  },
  "understanding-bail-in-hyderabad-courts": {
    en: {
      title: "Bail in Hyderabad: Regular, Anticipatory and Interim Bail",
      description: "Understand regular, anticipatory and interim bail in Hyderabad courts: the application process, documents to prepare and factors affecting a decision.",
    },
    hi: {
      title: "हैदराबाद में नियमित, अग्रिम और अंतरिम जमानत",
      description: "हैदराबाद की अदालतों में नियमित, अग्रिम और अंतरिम जमानत के बीच अंतर जानें: आवेदन की प्रक्रिया, जरूरी दस्तावेज और फैसले को प्रभावित करने वाले कारक।",
    },
    te: {
      title: "హైదరాబాద్‌లో సాధారణ, ముందస్తు, మధ్యంతర బెయిల్",
      description: "హైదరాబాద్ కోర్టుల్లో సాధారణ, ముందస్తు, మధ్యంతర బెయిల్ మధ్య తేడాలు తెలుసుకోండి: దరఖాస్తు ప్రక్రియ, సిద్ధం చేయాల్సిన పత్రాలు, నిర్ణయాన్ని ప్రభావితం చేసే అంశాలు.",
    },
  },
  "property-title-verification-hyderabad": {
    en: {
      title: "Property Title Verification in Hyderabad: Document Guide",
      description: "Buying property in Hyderabad? Understand title deeds, encumbrance certificates, revenue records and warning signs to discuss with a property advocate.",
    },
    hi: {
      title: "हैदराबाद में संपत्ति के स्वामित्व की जांच: दस्तावेज",
      description: "हैदराबाद में संपत्ति खरीदने से पहले स्वामित्व दस्तावेज, भार प्रमाणपत्र, राजस्व रिकॉर्ड और अधिवक्ता से चर्चा करने योग्य जोखिमों की जानकारी लें।",
    },
    te: {
      title: "హైదరాబాద్‌లో ఆస్తి యాజమాన్య తనిఖీ: పత్రాల వివరాలు",
      description: "హైదరాబాద్‌లో ఆస్తి కొనుగోలుకు ముందు యాజమాన్య పత్రాలు, ఎన్‌కంబ్రెన్స్ సర్టిఫికెట్, రెవెన్యూ రికార్డులు, న్యాయవాదితో చర్చించాల్సిన ప్రమాద సంకేతాల గురించి తెలుసుకోండి.",
    },
  },
};

export function resourceMetadataCopy(article: ResourceArticle, locale: Locale) {
  const copy = summaries[article.slug]?.[locale];
  if (!copy) throw new Error(`Missing resource metadata: ${locale}:${article.slug}`);
  return { title: `${copy.title} | ${firm.name}`, description: copy.description };
}

export function resourcePageMetadata(article: ResourceArticle, locale: Locale): Metadata {
  const copy = resourceMetadataCopy(article, locale);
  const metadata = pageMetadata({
    ...copy,
    path: `/resources/${article.slug}`,
    locale,
  });
  return {
    ...metadata,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

export function resourceMetadataAuditRows() {
  return resourceArticles.flatMap((article) =>
    routing.locales.map((locale) => {
      const copy = resourceMetadataCopy(article, locale);
      return {
        key: `resource:${article.slug}`,
        locale,
        ...copy,
        titleLength: copy.title.length,
        descriptionLength: copy.description.length,
        path: `/resources/${article.slug}`,
        metadata: resourcePageMetadata(article, locale),
      };
    }),
  );
}
