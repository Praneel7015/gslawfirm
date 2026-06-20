import type { Metadata } from "next";

import { routing, type Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
import { firm } from "@/content/firm";

type MetadataCopy = {
  title: string;
  description: string;
};

type MetadataEntry = {
  path: string;
  copy: Record<Locale, MetadataCopy>;
};

const localizedMetadata = {
  home: {
    path: "/",
    copy: {
      en: {
        title: "GS Law Firm | Adv. Aitha Sunitha, Kondapur Hyderabad",
        description:
          "Solo-advocate practice in Kondapur, Hyderabad, led by Adv. Aitha Sunitha for criminal, civil, property, commercial and High Court matters.",
      },
      hi: {
        title: "GS Law Firm | एडवो. ऐथा सुनीता, कोंडापुर हैदराबाद",
        description:
          "कोंडापुर, हैदराबाद में एकल-अधिवक्ता प्रैक्टिस: आपराधिक, दीवानी, संपत्ति, वाणिज्यिक और हाई कोर्ट मामलों की जानकारी.",
      },
      te: {
        title: "GS Law Firm | అడ్వ. ఐతా సునీత, కొండాపూర్ హైదరాబాద్",
        description:
          "కొండాపూర్, హైదరాబాద్‌లో ఏకైక న్యాయవాది ప్రాక్టీస్: క్రిమినల్, సివిల్, ఆస్తి, వాణిజ్య మరియు హైకోర్టు విషయాల సమాచారం.",
      },
    },
  },
  practice: {
    path: "/practice",
    copy: {
      en: {
        title: `Practice Areas | ${firm.name} Hyderabad`,
        description:
          "Criminal, civil, property, commercial, succession and High Court practice areas at GS Law Firm in Kondapur, Hyderabad.",
      },
      hi: {
        title: `प्रैक्टिस क्षेत्र | ${firm.name} हैदराबाद`,
        description:
          "GS Law Firm, कोंडापुर हैदराबाद में आपराधिक, दीवानी, संपत्ति, वाणिज्यिक, उत्तराधिकार और हाई कोर्ट मामलों की जानकारी.",
      },
      te: {
        title: `ప్రాక్టీస్ రంగాలు | ${firm.name} హైదరాబాద్`,
        description:
          "GS Law Firm, కొండాపూర్ హైదరాబాద్‌లో క్రిమినల్, సివిల్, ఆస్తి, వాణిజ్య, వారసత్వ మరియు హైకోర్టు విషయాల సమాచారం.",
      },
    },
  },
  kondapurLegalServices: {
    path: "/kondapur-legal-services",
    copy: {
      en: {
        title: `Kondapur Legal Services | ${firm.name} Hyderabad`,
        description:
          "Kondapur legal services information for GS Law Firm's office, nearby Hyderabad localities served, practice areas, and confidential enquiry path.",
      },
      hi: {
        title: `कोंडापुर कानूनी सेवाएं | ${firm.name} हैदराबाद`,
        description:
          "GS Law Firm के कोंडापुर कार्यालय, नजदीकी हैदराबाद क्षेत्रों, प्रैक्टिस क्षेत्रों और गोपनीय पूछताछ के रास्ते की जानकारी.",
      },
      te: {
        title: `కొండాపూర్ న్యాయ సేవలు | ${firm.name} హైదరాబాద్`,
        description:
          "GS Law Firm కొండాపూర్ కార్యాలయం, సమీప హైదరాబాద్ ప్రాంతాలు, ప్రాక్టీస్ రంగాలు మరియు గోప్య విచారణ మార్గం గురించి సమాచారం.",
      },
    },
  },
  continuityOfCounsel: {
    path: "/continuity-of-counsel",
    copy: {
      en: {
        title: `Continuity of Counsel | ${firm.name} Hyderabad`,
        description:
          "Continuity-of-counsel explainer for GS Law Firm in Hyderabad: paper reading, hearing preparation, client communication and court-stage memory.",
      },
      hi: {
        title: `काउंसल की निरंतरता | ${firm.name} हैदराबाद`,
        description:
          "GS Law Firm में कागज पढ़ने, सुनवाई तैयारी, क्लाइंट संवाद और कोर्ट-स्टेज स्मृति पर काउंसल-निरंतरता की जानकारी.",
      },
      te: {
        title: `కౌన్సెల్ నిరంతరత | ${firm.name} హైదరాబాద్`,
        description:
          "GS Law Firmలో పత్రాల చదువు, విచారణ సిద్ధత, క్లయింట్ సంభాషణ మరియు కోర్ట్-దశ జ్ఞాపకంపై కౌన్సెల్ నిరంతరత సమాచారం.",
      },
    },
  },
  bail: {
    path: "/bail",
    copy: {
      en: {
        title: `Bail Applications in Hyderabad | ${firm.name}`,
        description:
          "Information on regular bail, anticipatory bail, remand, surety paperwork and criminal-court appearances in Hyderabad, from GS Law Firm in Kondapur.",
      },
      hi: {
        title: `हैदराबाद में बेल आवेदन | ${firm.name}`,
        description:
          "हैदराबाद में नियमित बेल, अग्रिम बेल, रिमांड, जमानती कागज और आपराधिक अदालत उपस्थिति पर सामान्य जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో బెయిల్ దరఖాస్తులు | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో రెగ్యులర్ బెయిల్, ముందస్తు బెయిల్, రిమాండ్, ష్యూరిటీ పత్రాలు మరియు క్రిమినల్ కోర్టు హాజరుపై సమాచారం.",
      },
    },
  },
  criminalDefense: {
    path: "/criminal-defense",
    copy: {
      en: {
        title: `Criminal Defense in Hyderabad | ${firm.name}`,
        description:
          "Criminal-defense information for FIRs, complaints, bail stages, remand, trial dates and High Court steps in Hyderabad, from GS Law Firm in Kondapur.",
      },
      hi: {
        title: `हैदराबाद में आपराधिक बचाव | ${firm.name}`,
        description:
          "हैदराबाद में FIR, शिकायत, बेल चरण, रिमांड, ट्रायल तारीखों और हाई कोर्ट कदमों पर आपराधिक-बचाव जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో క్రిమినల్ డిఫెన్స్ | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో FIRలు, ఫిర్యాదులు, బెయిల్ దశలు, రిమాండ్, ట్రయల్ తేదీలు మరియు హైకోర్టు చర్యలపై క్రిమినల్ డిఫెన్స్ సమాచారం.",
      },
    },
  },
  propertyDisputes: {
    path: "/property-disputes",
    copy: {
      en: {
        title: `Property Disputes in Hyderabad | ${firm.name}`,
        description:
          "Property-dispute information for title, partition, tenancy, injunction and civil-court steps in Hyderabad, from GS Law Firm in Kondapur.",
      },
      hi: {
        title: `हैदराबाद में संपत्ति विवाद | ${firm.name}`,
        description:
          "हैदराबाद में टाइटल, बंटवारा, किरायेदारी, injunction और दीवानी अदालत के चरणों पर संपत्ति-विवाद जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో ఆస్తి వివాదాలు | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో టైటిల్, పంచాయితీ, అద్దె, ఇంజంక్షన్ మరియు సివిల్ కోర్టు దశలపై ఆస్తి వివాద సమాచారం.",
      },
    },
  },
  commercialContracts: {
    path: "/commercial-contracts",
    copy: {
      en: {
        title: `Commercial Contracts in Hyderabad | ${firm.name}`,
        description:
          "Commercial-contract information for vendor, service, employment, contractor, founder, shareholder, NDA and dispute steps in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में वाणिज्यिक अनुबंध | ${firm.name}`,
        description:
          "हैदराबाद में विक्रेता, सेवा, रोजगार, ठेकेदार, NDA, IP असाइनमेंट, नोटिस और व्यापार-विवाद दस्तावेजों पर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో వాణిజ్య ఒప్పందాలు | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో విక్రేత, సేవ, ఉద్యోగ, కాంట్రాక్టర్, NDA, IP అసైన్‌మెంట్, నోటీసులు మరియు వ్యాపార వివాద పత్రాలపై సమాచారం.",
      },
    },
  },
  successionProbate: {
    path: "/succession-probate",
    copy: {
      en: {
        title: `Succession and Probate in Hyderabad | ${firm.name}`,
        description:
          "Succession and probate information for wills, letters of administration, succession papers, family settlement context and inheritance disputes in Hyderabad, from GS Law Firm in Kondapur.",
      },
      hi: {
        title: `हैदराबाद में उत्तराधिकार और प्रोबेट | ${firm.name}`,
        description:
          "हैदराबाद में वसीयत, probate, letters of administration, उत्तराधिकार कागज, विरासत विवाद और पारिवारिक समझौता संदर्भ पर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో వారసత్వం మరియు ప్రొబేట్ | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో విల్లు, ప్రొబేట్, letters of administration, వారసత్వ పత్రాలు, వారసత్వ వివాదాలు మరియు కుటుంబ ఒప్పంద సందర్భంపై సమాచారం.",
      },
    },
  },
  highCourtMatters: {
    path: "/high-court-matters",
    copy: {
      en: {
        title: `High Court Matters in Hyderabad | ${firm.name}`,
        description:
          "High Court matter information for writ petitions, revisions, quashing petitions, second appeals and bail applications in Telangana.",
      },
      hi: {
        title: `तेलंगाना हाई कोर्ट मामले | ${firm.name} हैदराबाद`,
        description:
          "तेलंगाना हाई कोर्ट में writ petition, revision, quashing, second appeal, bail और order review संदर्भ पर हैदराबाद की जानकारी.",
      },
      te: {
        title: `తెలంగాణ హైకోర్టు విషయాలు | ${firm.name} హైదరాబాద్`,
        description:
          "తెలంగాణ హైకోర్టులో writ petition, revision, quashing, second appeal, bail మరియు order review సందర్భంపై హైదరాబాద్ సమాచారం.",
      },
    },
  },
  chequeDishonour: {
    path: "/cheque-dishonour",
    copy: {
      en: {
        title: `Cheque Dishonour in Hyderabad | ${firm.name}`,
        description:
          "Cheque-dishonour information for N.I. Act Section 138 notices, complaints, summons, evidence, settlement and appeal context in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में चेक अनादर | ${firm.name}`,
        description:
          "N.I. Act Section 138 नोटिस, शिकायत, समन, साक्ष्य, समझौते और अपील संदर्भ पर हैदराबाद की चेक-अनादर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో చెక్ డిసానర్ | ${firm.name}`,
        description:
          "N.I. Act Section 138 నోటీసులు, ఫిర్యాదులు, సమన్లు, సాక్ష్యం, రాజీ మరియు అప్పీల్ సందర్భంపై చెక్ డిసానర్ సమాచారం.",
      },
    },
  },
  tenancyEviction: {
    path: "/tenancy-eviction",
    copy: {
      en: {
        title: `Tenancy and Eviction in Hyderabad | ${firm.name}`,
        description:
          "Tenancy and eviction information for lease papers, notices, rent or possession disputes, interim relief, evidence and appeal context in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में किरायेदारी और बेदखली | ${firm.name}`,
        description:
          "हैदराबाद में lease papers, नोटिस, किराया या कब्जा विवाद, injunction, evidence, execution, revision और appeal संदर्भ पर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో అద్దె మరియు ఎవిక్షన్ | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో lease papers, నోటీసులు, అద్దె లేదా స్వాధీనం వివాదాలు, ఇంజంక్షన్, సాక్ష్యం, execution, revision మరియు appeal సందర్భంపై సమాచారం.",
      },
    },
  },
  specificPerformance: {
    path: "/specific-performance",
    copy: {
      en: {
        title: `Specific Performance in Hyderabad | ${firm.name}`,
        description:
          "Specific-performance information for sale agreements, business-contract obligations, notices, pleadings, interim relief and execution in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में specific performance | ${firm.name}`,
        description:
          "हैदराबाद में sale agreement, संपत्ति या व्यापार contract, नोटिस, interim relief, evidence, execution और appeal संदर्भ पर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో specific performance | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో sale agreement, ఆస్తి లేదా business contract, నోటీసులు, interim relief, evidence, execution మరియు appeal సందర్భంపై సమాచారం.",
      },
    },
  },
  injunctionInterimRelief: {
    path: "/injunction-interim-relief",
    copy: {
      en: {
        title: `Injunction and Interim Relief in Hyderabad | ${firm.name}`,
        description:
          "Injunction and interim-relief information for possession, title, tenancy, contract restraint, notices, pleadings and urgency in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में injunction और interim relief | ${firm.name}`,
        description:
          "हैदराबाद में कब्जा, title, tenancy, contract restraint, documents, urgency और civil-court interim relief पर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో injunction మరియు interim relief | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో స్వాధీనం, title, tenancy, contract restraint, పత్రాలు, urgency మరియు civil-court interim relief పై సమాచారం.",
      },
    },
  },
  consumerForumComplaints: {
    path: "/consumer-forum-complaints",
    copy: {
      en: {
        title: `Consumer Forum Complaints in Hyderabad | ${firm.name}`,
        description:
          "Consumer-forum complaint information for defective goods, service deficiency, refund issues, builder records, notices, evidence and orders in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में consumer forum complaints | ${firm.name}`,
        description:
          "हैदराबाद में खराब goods, service deficiency, refund, builder records, notices, evidence और orders पर consumer-forum complaint जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో consumer forum complaints | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో defective goods, service deficiency, refund, builder records, notices, evidence మరియు ordersపై consumer-forum complaint సమాచారం.",
      },
    },
  },
  cyberCrimeComplaints: {
    path: "/cyber-crime-complaints",
    copy: {
      en: {
        title: `Cyber Crime Complaints in Hyderabad | ${firm.name}`,
        description:
          "Cyber-crime complaint information for online fraud, account misuse, harassment messages, transaction records, FIR and notice context in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में cyber crime complaints | ${firm.name}`,
        description:
          "हैदराबाद में online fraud, account misuse, harassment messages, complaint or FIR steps और digital evidence records पर cyber-crime जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో cyber crime complaints | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో online fraud, account misuse, harassment messages, complaint or FIR steps మరియు digital evidence records పై cyber-crime సమాచారం.",
      },
    },
  },
  legalNotices: {
    path: "/legal-notices",
    copy: {
      en: {
        title: `Legal Notices and Replies in Hyderabad | ${firm.name}`,
        description:
          "Legal-notice and reply information for property, contract, tenancy, injunction, specific-performance and civil-suit context in Hyderabad.",
      },
      hi: {
        title: `हैदराबाद में कानूनी नोटिस और जवाब | ${firm.name}`,
        description:
          "हैदराबाद में legal notices, replies, deadlines, documents, civil suit context और property, contract, tenancy overlap पर जानकारी.",
      },
      te: {
        title: `హైదరాబాద్‌లో legal notices మరియు replies | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో legal notices, replies, deadlines, documents, civil suit context మరియు property, contract, tenancy overlap పై సమాచారం.",
      },
    },
  },
  bailHearingProcedure: {
    path: "/bail-hearing-procedure-hyderabad",
    copy: {
      en: {
        title: `Bail Hearing Procedure in Hyderabad | ${firm.name}`,
        description:
          "General information on bail hearing procedure in Hyderabad: FIR or complaint papers, remand stage, surety context, court dates and order conditions.",
      },
      hi: {
        title: `हैदराबाद में बेल सुनवाई प्रक्रिया | ${firm.name}`,
        description:
          "हैदराबाद में बेल सुनवाई प्रक्रिया पर सामान्य जानकारी: FIR या शिकायत कागज, रिमांड चरण, जमानती संदर्भ, कोर्ट तारीखें और शर्तें.",
      },
      te: {
        title: `హైదరాబాద్‌లో బెయిల్ విచారణ ప్రక్రియ | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో బెయిల్ విచారణ ప్రక్రియపై సాధారణ సమాచారం: FIR లేదా ఫిర్యాదు పత్రాలు, రిమాండ్ దశ, ష్యూరిటీ, కోర్టు తేదీలు మరియు ఆర్డర్ షరతులు.",
      },
    },
  },
  propertyDisputeCourts: {
    path: "/property-dispute-courts-telangana",
    copy: {
      en: {
        title: `Property Dispute Courts in Telangana | ${firm.name}`,
        description:
          "Property-dispute court information for Hyderabad and Telangana: documents, possession, injunctions, tenancy, specific performance and later steps.",
      },
      hi: {
        title: `तेलंगाना में संपत्ति विवाद अदालतें | ${firm.name}`,
        description:
          "हैदराबाद और तेलंगाना में संपत्ति-विवाद अदालत जानकारी: दस्तावेज, कब्जा, injunction, किरायेदारी, specific performance और आगे के चरण.",
      },
      te: {
        title: `తెలంగాణలో ఆస్తి వివాద కోర్టులు | ${firm.name}`,
        description:
          "హైదరాబాద్ మరియు తెలంగాణలో ఆస్తి వివాద కోర్టు సమాచారం: పత్రాలు, స్వాధీనం, ఇంజంక్షన్, అద్దె, స్పెసిఫిక్ పర్ఫార్మెన్స్ మరియు తదుపరి దశలు.",
      },
    },
  },
  chequeBounceProcedure: {
    path: "/cheque-bounce-case-procedure-hyderabad",
    copy: {
      en: {
        title: `Cheque Bounce Case Procedure in Hyderabad | ${firm.name}`,
        description:
          "Cheque bounce case procedure information for Hyderabad: legal notice, payment-window context, complaint filing, summons, evidence and hearings.",
      },
      hi: {
        title: `हैदराबाद में चेक बाउंस केस प्रक्रिया | ${firm.name}`,
        description:
          "हैदराबाद में चेक बाउंस केस प्रक्रिया: लीगल नोटिस, भुगतान-खिड़की, शिकायत दाखिल, समन, साक्ष्य और सुनवाई.",
      },
      te: {
        title: `హైదరాబాద్‌లో చెక్ బౌన్స్ కేసు ప్రక్రియ | ${firm.name}`,
        description:
          "హైదరాబాద్‌లో చెక్ బౌన్స్ కేసు ప్రక్రియ: లీగల్ నోటీసు, చెల్లింపు గడువు, ఫిర్యాదు దాఖలు, సమన్లు, సాక్ష్యం మరియు విచారణలు.",
      },
    },
  },
} satisfies Record<string, MetadataEntry>;

export type LocalizedPageKey = keyof typeof localizedMetadata;

function safeLocale(locale: string): Locale {
  return (routing.locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : routing.defaultLocale;
}

export function localizedPageMetadata(
  key: LocalizedPageKey,
  locale: string,
): Metadata {
  const entry = localizedMetadata[key];
  const copy = entry.copy[safeLocale(locale)];
  return pageMetadata({
    title: copy.title,
    description: copy.description,
    path: entry.path,
  });
}

export function localizedMetadataAuditRows() {
  return Object.entries(localizedMetadata).flatMap(([key, entry]) =>
    routing.locales.map((locale) => ({
      key,
      locale,
      title: entry.copy[locale].title,
      titleLength: entry.copy[locale].title.length,
      description: entry.copy[locale].description,
      descriptionLength: entry.copy[locale].description.length,
      path: entry.path,
    })),
  );
}
