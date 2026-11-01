interface ArticleSection {
  heading: string;
  body: string;
  items?: readonly string[];
}

export interface ArticleData {
  intro: string;
  sections: readonly ArticleSection[];
  howToSteps?: readonly { name: string; text: string }[];
  closingNote: string;
}

export const englishArticles = {
  "what-to-do-after-receiving-legal-notice-hyderabad": {
    intro: "Receiving a legal notice can be unsettling. The envelope, the formal language, the name of a law firm: all of it is designed to feel serious. And it is. But the worst thing you can do is ignore it. The second worst is to reply impulsively without reading carefully.",
    sections: [
      {
        heading: "Read the notice in full without panicking",
        body: "Most people scan a legal notice, see words like 'legal action', 'compensation' or 'criminal complaint' and stop reading. Read the entire notice: who sent it, on behalf of whom, what relief is claimed, under what law, and what deadline is stated. Note the date on the envelope (speed-post or registered post) and the date of the notice itself: both matter for calculating response windows.",
      },
      {
        heading: "Identify the legal basis of the claim",
        body: "A legal notice has no binding legal force by itself: it is a pre-litigation communication. However, the legal provision cited tells you what kind of matter it is. Section 138 Negotiable Instruments Act means a cheque dishonour. Section 106/107 Transfer of Property Act suggests a tenancy or eviction dispute. A reference to the Consumer Protection Act 2019 points to a consumer complaint. Understanding the legal basis tells you which forum the sender can approach next.",
      },
      {
        heading: "Check the deadline",
        body: "Some notices prescribe a response window: commonly 7 days, 15 days or 30 days. Others are silent on a deadline. In cheque dishonour notices (Section 138 NI Act), the drawer must pay within 15 days of receiving the notice or the payee can file a complaint. Missing this window can make your position significantly harder. Note the deadline carefully.",
      },
      {
        heading: "Do not reply without legal advice in most cases",
        body: "An emotional or hasty reply can inadvertently admit facts, waive defences or create a paper trail that works against you. At the same time, a bare denial that addresses nothing rarely helps either. For notices involving property, employment, cheque dishonour, money claims or a criminal allegation, seek advice before sending a reply. A small amount alone does not make a notice safe to ignore.",
      },
      {
        heading: "Gather your documents",
        body: "Before speaking to an advocate, collect every document relevant to the subject. The quality of your response often depends on what you can prove.",
        items: [
          "The notice itself: keep the envelope and postage receipt",
          "The original agreement, contract or deed being disputed",
          "All payment records: bank statements, receipts, UPI screenshots",
          "Any prior written communication on the same subject",
          "Identity documents (in land or succession matters)",
          "Any court papers if related proceedings are already running",
        ],
      },
      {
        heading: "Draft and send a considered reply",
        body: "A good reply states the facts clearly, refers to the relevant documents, denies unsubstantiated allegations specifically (not generally), and is proportionate in tone. It should not threaten or make admissions. Send it by registered post (AD) or speed-post and retain a copy. The date of posting matters.",
      },
      {
        heading: "When can you safely ignore a legal notice?",
        body: "Legally, ignoring a notice is not itself a crime. However, some notices: particularly Section 138 NI Act notices: have specific consequences if the underlying payment is not made within the prescribed time. A notice from a government body (income tax, GST, RERA, labour tribunal) should never be ignored. When in doubt, a 30-minute consultation is far cheaper than the cost of inaction.",
      },
    ],
    howToSteps: [
      {
        name: "Read the full notice and note the date",
        text: "Read every word of the notice. Note the sender, the law cited, the relief claimed and any deadline. Keep the envelope.",
      },
      {
        name: "Identify the legal basis",
        text: "Find the specific law or provision cited. This tells you which forum is being threatened (civil court, consumer forum, Magistrate court, etc.).",
      },
      {
        name: "Check your deadline",
        text: "Calculate any response window mentioned. For Section 138 NI Act notices, the payment deadline is 15 days from receipt of the notice.",
      },
      {
        name: "Consult an advocate before replying",
        text: "Seek advice on the notice, documents and deadline before replying, particularly for property, employment, cheque dishonour or criminal allegations. A hasty reply can waive defences.",
      },
      {
        name: "Gather all supporting documents",
        text: "Collect the agreement, payment records, correspondence, receipts and any government record. Bring physical or digital copies to the consultation.",
      },
      {
        name: "Send a measured, documented reply",
        text: "Reply by registered post (AD) or speed-post. State facts clearly, deny unsubstantiated allegations specifically, and keep a copy of everything sent.",
      },
    ],
    closingNote: "A legal notice is a signal, not a verdict. How you respond in the first 7–15 days often shapes the entire trajectory of the matter. If you have received a notice and are not sure what it means or how to reply, send a brief note through the enquiry form and we will tell you whether and how the firm can help.",
  },

  "understanding-bail-in-hyderabad-courts": {
    intro: "Bail is one of the most time-sensitive matters in criminal law. Whether you are helping a family member who has been arrested, facing an anticipated arrest, or trying to understand what your advocate is advising: understanding the three main types of bail in India helps you ask the right questions and make faster decisions.",
    sections: [
      {
        heading: "What bail actually is",
        body: "Bail is the release of a person from custody in exchange for a guarantee (either personal or through sureties) that they will appear before the court when required. It is not an acquittal. Bail does not mean the case is over: it means the accused is released from physical custody while the case proceeds.",
      },
      {
        heading: "Regular bail: BNSS Sections 478, 480 and 483",
        body: "Regular bail is sought after a person has been arrested. Applications are made before the Magistrate (for bailable or non-bailable offences at the Magistrate stage). For serious offences triable by the Sessions Court, bail may be sought under Section 439 CrPC (now Section 483 BNSS). The relevant Magistrate or Sessions Court depends on territorial jurisdiction, the offence and the existing proceedings; an address in the Hyderabad area alone does not identify the court. Documents typically needed:",
        items: [
          "FIR copy and charge sheet (if filed)",
          "Arrest memo and custody remand papers",
          "Identity proof of the accused",
          "Surety details: property documents or identity proof of surety",
          "Previous bail orders if any prior applications were made",
        ],
      },
      {
        heading: "Anticipatory bail: BNSS Section 482 / CrPC Section 438",
        body: "Anticipatory bail is sought by a person who reasonably apprehends arrest: it is a pre-arrest remedy. Only the High Court or Sessions Court can grant it; a Magistrate cannot. In Hyderabad, anticipatory bail applications before the High Court of Telangana are heard on the criminal side. The court considers the nature of the offence, the applicant's antecedents, the possibility of flight, and whether the application is being used to obstruct investigation.",
      },
      {
        heading: "Interim bail: temporary relief while the main application is pending",
        body: "When a bail application cannot be heard urgently, courts may grant interim bail: a temporary release for a short fixed period. This is discretionary and is used when health, family circumstances or other pressing reasons justify brief release.",
      },
      {
        heading: "How courts decide bail: key factors",
        body: "Depending on the applicable law and facts, bail submissions may address:",
        items: [
          "Nature and gravity of the accusation",
          "Antecedents of the accused: prior convictions or pending cases",
          "Possibility of fleeing justice: roots in the community, employment, family",
          "Danger of evidence tampering or witness intimidation",
          "Stage of the case: charge sheet filed or investigation pending",
          "Medical condition or personal circumstances",
          "Whether co-accused were granted bail on similar facts",
        ],
      },
      {
        heading: "What changes under BNSS 2023",
        body: "The Bharatiya Nagarik Suraksha Sanhita 2023 came into force on 1 July 2024. Section 479 addresses maximum undertrial detention subject to its conditions and exclusions. Bail provisions and their application must be read in full; this guide does not promise a fixed hearing or release period. If your matter began before July 2024, the transitional position under the BNSS may apply: your advocate should advise on which procedural code governs your specific matter.",
      },
    ],
    howToSteps: [
      {
        name: "Determine the stage: arrest or apprehended arrest",
        text: "If an arrest has already happened, you need regular bail. If you apprehend arrest, seek anticipatory bail from the High Court or Sessions Court.",
      },
      {
        name: "Identify the correct court",
        text: "Identify the competent court from the offence, territorial jurisdiction and procedural stage. Anticipatory bail is sought before the Sessions Court or High Court, subject to statutory exclusions.",
      },
      {
        name: "Collect documents before approaching an advocate",
        text: "Gather the FIR, arrest memo, remand papers, charge sheet (if filed), surety details and identity proofs.",
      },
      {
        name: "Brief an advocate on the factual background",
        text: "Give a candid account of the facts, your relationship with the complainant, any prior cases, and your personal circumstances.",
      },
      {
        name: "File and attend the hearing",
        text: "Confirm filing requirements and listing with the competent court. Hearing dates depend on the roster, record and any directions; no standard number of days is promised.",
      },
    ],
    closingNote: "Bail timing matters. In serious offence cases where the police have opposed bail or an earlier application was rejected, a further application or another available remedy may need review. If you have an urgent bail matter in Hyderabad, call the firm directly at +91 99638 47704: bail applications are time-sensitive.",
  },

  "property-title-verification-hyderabad": {
    intro: "Purchasing property in Hyderabad is one of the most significant financial decisions most people make. Yet property title verification is often treated as a formality rather than a substantive exercise. Title defects: gaps in the ownership chain, undisclosed encumbrances, forged documents: surface years after a purchase and can result in litigation that is far more expensive than the verification would have been.",
    sections: [
      {
        heading: "What title verification means in Hyderabad",
        body: "Title verification is the process of confirming that the person selling property actually owns it, that no third party has a prior or superior claim, that the property is free of encumbrances (loans, mortgages, attachments), and that all revenue records are consistent with the title documents. In Telangana, this involves reviewing records from the Sub-Registrar's office, the applicable Telangana land-record portal and local government records.",
      },
      {
        heading: "Documents reviewed in a typical title search",
        body: "The exact documents depend on whether the property is an apartment, an agricultural land parcel or a plot in a layout. A typical residential title search in Hyderabad looks at:",
        items: [
          "Sale deeds for at least 30 years: the chain of title",
          "Encumbrance Certificate (EC) from the Sub-Registrar: shows all registered transactions",
          "Pahani / Adangal records and Record of Rights (ROR) from current Telangana land-record system",
          "Link documents: prior sale deeds, partition deeds, gift deeds, court decrees, succession certificates",
          "Building plan approval and occupancy certificate: for flats and constructed buildings",
          "GHMC or local body tax receipts: verifies municipal recognition",
          "Layout approval: for plots in layouts",
          "Power of Attorney if the seller is acting through an agent",
          "NOC from bank if property was mortgaged and loan discharged",
        ],
      },
      {
        heading: "What an Encumbrance Certificate (EC) reveals",
        body: "The EC from the Sub-Registrar lists all registered encumbrances: mortgages, sale agreements, court attachments, lis pendens (notice of pending suit): for a specified period. In Telangana, the applicable registration office or official portal should be consulted for the search available for that property. However, ECs only capture registered transactions. Oral family arrangements, unregistered agreements, or inherited ownership claims will not appear in an EC.",
      },
      {
        heading: "Land records and their limitations",
        body: "Revenue and registration records serve different purposes. Portal names and procedures change; verify the current system and search scope with the relevant office. An advocate familiar with Telangana revenue records can identify inconsistencies, slot errors and mutation gaps that a layperson reviewing portal data alone may miss.",
      },
      {
        heading: "Red flags an advocate looks for",
        body: "Beyond document collection, the value of legal title verification lies in spotting defects that are not obvious to non-lawyers:",
        items: [
          "Break in the chain of title: gap years where ownership is not documented",
          "Duplicate survey numbers or conflicting patta details",
          "Property in the name of a deceased person without succession documents",
          "Earlier agreements or third-party claims requiring separate review",
          "Attachment orders from a court or tax authority",
          "Property classified as government, endowment, forest or scheduled-tribe land",
          "Joint ownership: all co-owners must consent to the sale",
          "Pending probate or succession dispute involving the seller's family",
          "HMDA / GHMC violations affecting the occupancy certificate",
        ],
      },
      {
        heading: "How long does verification take?",
        body: "The scope and time depend on the title chain, availability of original and certified records, property type and any disputed entries. Agree the scope, missing documents and expected next update with the advocate after an initial review. A clear EC alone does not determine how long the full review will take.",
      },
    ],
    howToSteps: [
      {
        name: "Request all title documents from the seller",
        text: "Ask for all sale deeds (complete chain for at least 30 years), Encumbrance Certificate, Pahani / ROR from the relevant revenue office or current state portal, link documents and building approvals if a flat.",
      },
      {
        name: "Apply for an independent Encumbrance Certificate",
        text: "Do not rely solely on the EC provided by the seller. Apply independently at the Sub-Registrar's office or through the Telangana registration portal.",
      },
      {
        name: "Check current land portal and revenue records",
        text: "Confirm the current official state portal and relevant revenue office. Review available entries and mutation records, and cross-check the survey number, boundaries and physical possession.",
      },
      {
        name: "Verify building approvals with GHMC / HMDA",
        text: "For apartments or constructed buildings, confirm building plan approval, occupancy certificate and compliance with layout conditions at the local municipal office.",
      },
      {
        name: "Brief an advocate for a full title opinion",
        text: "Provide all collected documents to a property advocate. The advocate will review the chain of title, identify defects, advise on missing documents and give a written title opinion before you commit to the purchase.",
      },
    ],
    closingNote: "Title verification is not expensive relative to the cost of a property dispute that drags through courts for years. If you are buying property in Hyderabad: apartment, plot, agricultural land or commercial space: a pre-purchase title check is worth the time and fee. Send a brief note through the enquiry form with the property details and we will tell you what the verification process would involve.",
  },
};
