export type ServiceFaq = {
  question: string;
  answer: string;
};

export const bailFaqs: readonly ServiceFaq[] = [
  {
    question: "What should I bring for a first bail discussion?",
    answer:
      "Bring any FIR, complaint, notice, remand paper, earlier order, next-date details, and any condition or surety information already available. If papers are missing, note the police station, crime number, court, and current stage.",
  },
  {
    question: "Can this page tell me whether bail will be granted?",
    answer:
      "No. Bail depends on facts, sections invoked, case stage, prior orders, and the court hearing the application. This page explains the documents and stages usually reviewed before advice is given.",
  },
  {
    question: "What can a first conversation cover?",
    answer:
      "It can cover the case stage, available papers, immediate deadline, and whether regular bail, anticipatory bail, condition compliance, or another court step needs to be discussed.",
  },
] as const;

export const criminalDefenseFaqs: readonly ServiceFaq[] = [
  {
    question: "What details help at the first criminal-defense discussion?",
    answer:
      "The complaint or FIR, notices, sections invoked, court name, next date, prior orders, and a short chronology of what has happened are useful.",
  },
  {
    question: "Is this page legal advice for my case?",
    answer:
      "No. It is general information. Advice depends on reading the papers, hearing the facts, and checking the current court stage.",
  },
  {
    question: "When might High Court steps be discussed?",
    answer:
      "High Court steps may be discussed when the papers raise a question around quashing, revision, appeal, bail, or an order from a lower court. Whether that is appropriate depends on the file.",
  },
] as const;

export const propertyDisputesFaqs: readonly ServiceFaq[] = [
  {
    question: "What property papers are useful for the first discussion?",
    answer:
      "Sale deeds, link documents, settlement or gift deeds, partition papers, encumbrance records, tax receipts, municipal or revenue records, notices, and any case papers are useful if available.",
  },
  {
    question: "Does a property dispute always need a civil suit?",
    answer:
      "Not always. The next step can be a notice, reply, document review, settlement discussion, interim application, suit, appeal, or execution step depending on the documents and current stage.",
  },
  {
    question: "What can be discussed before sharing original documents?",
    answer:
      "You can discuss the property location, relationship between parties, possession, documents available, notices received, court stage, and immediate deadlines. Originals can be handled later if needed.",
  },
] as const;

export const consumerForumComplaintsFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers help for a consumer complaint discussion?",
    answer:
      "Bills, receipts, order records, warranty papers, service records, complaint numbers, emails, messages, platform responses, photographs, notices, replies, and any forum papers are useful if available.",
  },
  {
    question: "Does every consumer complaint go before a consumer commission?",
    answer:
      "No. The next step depends on the transaction, documents, limitation, value involved, parties, forum, prior complaint record, and whether another legal route needs to be discussed.",
  },
  {
    question: "Can builder-service issues be discussed on this page?",
    answer:
      "They can be discussed when the papers show a consumer-service relationship, payment record, promised service, delay, defect, notice, reply, or pending forum stage. The correct forum depends on the file.",
  },
] as const;

export const specificPerformanceFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers help for a specific-performance discussion?",
    answer:
      "The agreement, payment receipts, bank records, notices, replies, emails or messages, possession or delivery papers, earlier case papers, orders, and next-date details are useful if available.",
  },
  {
    question: "Does every broken agreement lead to specific performance?",
    answer:
      "No. The next step depends on the contract, facts, limitation, conduct of the parties, available remedies, forum and court stage. The papers have to be read first.",
  },
  {
    question: "Can interim relief be discussed with a specific-performance matter?",
    answer:
      "It can be discussed when the agreement, possession or delivery context, urgency, documents and current court stage are clear. Whether any interim step is suitable depends on the file.",
  },
] as const;

export const injunctionInterimReliefFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers help for an injunction or interim-relief discussion?",
    answer:
      "Property or contract papers, notices, replies, photographs, messages, possession details, prior orders, pleadings, affidavits, and next-date details are useful if available.",
  },
  {
    question: "Does every civil dispute support interim relief?",
    answer:
      "No. The next step depends on the facts, documents, possession, urgency, limitation, relief sought, current forum and court stage. The file has to be read first.",
  },
  {
    question: "Can this be discussed before a suit is filed?",
    answer:
      "Yes. A first conversation can cover the papers, what has changed, immediate deadlines, and whether any notice, reply, suit, interim application, or another step needs to be discussed.",
  },
] as const;

export const commercialContractsFaqs: readonly ServiceFaq[] = [
  {
    question: "What should I bring for a contract review discussion?",
    answer:
      "Bring the draft contract, earlier versions, emails or messages about the deal, invoices or purchase orders if available, and a short note on what worries you in the document.",
  },
  {
    question: "Can a first conversation happen before a draft exists?",
    answer:
      "Yes. You can discuss the business arrangement, payment terms, delivery obligations, confidentiality, ownership of work, termination, and dispute forum before a draft is prepared.",
  },
  {
    question: "Does every commercial dispute need a court case?",
    answer:
      "Not always. The next step may be a notice, reply, negotiation, settlement document, interim application, suit, arbitration-related step, or appeal depending on the contract and current stage.",
  },
] as const;

export const successionProbateFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers are useful for a succession discussion?",
    answer:
      "A will, death certificate, family tree or legal-heir papers, property papers, bank or investment records, notices, and earlier case papers are useful if available.",
  },
  {
    question: "Does every succession matter need probate?",
    answer:
      "No. The next step depends on the document, assets, family members involved, objections, and the forum or authority before which the matter may need to be placed.",
  },
  {
    question: "Can this page decide inheritance shares?",
    answer:
      "No. This page is general information. Shares, objections, family arrangements, and court steps depend on the papers, facts, family history, and applicable law.",
  },
] as const;

export const highCourtMattersFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers help for a High Court discussion?",
    answer:
      "The order under challenge, lower-court or authority papers, pleadings, FIR or complaint if relevant, notices, certified copies, next-date details, and filing deadlines are useful if available.",
  },
  {
    question: "Does every adverse order go to the High Court?",
    answer:
      "No. Whether a High Court step can be discussed depends on the order, forum below, limitation, facts, available remedy, and the question that can properly be raised.",
  },
  {
    question: "When might quashing, revision or writ steps be discussed?",
    answer:
      "They may be discussed when the papers raise a question around jurisdiction, procedure, public-authority action, criminal proceedings, or an order from a lower forum. The file has to be read first.",
  },
] as const;

export const chequeDishonourFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers help for a cheque-dishonour discussion?",
    answer:
      "The cheque, bank return memo, demand notice, postal or delivery proof, transaction papers, invoices, messages, replies, summons, complaint copy, and next-date details are useful if available.",
  },
  {
    question: "Does this page decide whether a complaint can be filed?",
    answer:
      "No. Filing depends on the cheque, return reason, notice timeline, documents, limitation, and facts. The papers have to be read before a next step can be discussed.",
  },
  {
    question: "Can settlement be discussed in a cheque-dishonour matter?",
    answer:
      "It can be discussed when the parties' positions, payment history, court stage, and documents are clear. Settlement or compounding depends on the matter and cannot be assumed from this page.",
  },
] as const;

export const tenancyEvictionFaqs: readonly ServiceFaq[] = [
  {
    question: "What papers help for a tenancy or eviction discussion?",
    answer:
      "The lease or tenancy papers, rent receipts, payment records, notices, replies, messages, property papers, photographs, case papers, orders, and next-date details are useful if available.",
  },
  {
    question: "Is this page only for landlords or only for tenants?",
    answer:
      "No. This page is general information for either side of a tenancy or possession dispute. Advice depends on the papers, facts, notices, possession, court stage, and applicable law.",
  },
  {
    question: "Does every tenancy dispute need a court filing?",
    answer:
      "Not always. The next step may be a notice, reply, discussion, interim application, suit, execution, revision, or appeal depending on the documents and current stage.",
  },
] as const;
