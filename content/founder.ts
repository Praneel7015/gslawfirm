/** Founder profile (per build-prompt §5). BCI-compliant prose only. */
export const founder = {
  name: "Adv. Sunitha Sindhole",
  shortName: "Sunitha Sindhole",
  initials: "SS",
  credentials: "LL.M · LL.B · M.Sc · B.Sc",
  experienceYears: 10,
  education: "Padala Ram Reddy College of Law",
  barCouncil: "Enrolled with the Bar Council of Telangana — Reg. No. [PLACEHOLDER]",
  languages: ["English", "Telugu", "Hindi"] as const,
  // Two restrained paragraphs — see content/copy/founder-bio.ts for long-form locale variants.
  bioParagraphs: [
    "Ten-plus years of practice across criminal and civil matters in Hyderabad, with periodic appearances before the High Court of Telangana. Graduate of Padala Ram Reddy College of Law, enrolled with the Bar Council of Telangana.",
    "She founded the firm in 2023 to keep one promise plainly: to be the person you can call in the second year, and the fifth, and the tenth — not only on the day of your first hearing. The razorbill in the firm's mark returns to the same cliff colony year after year; the metaphor was chosen with intent.",
  ],
} as const;

export type Founder = typeof founder;
