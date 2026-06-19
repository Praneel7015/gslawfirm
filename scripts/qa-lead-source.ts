import assert from "node:assert/strict";

import { leadSchema } from "../lib/lead-schema";
import { renderLeadHtml, renderLeadText } from "../lib/resend";

const baseLead = {
  name: "Aitha Client",
  phone: "9963847704",
  email: "client@example.com",
  message: "I need to discuss a tenancy matter next week.",
  website: "",
};

const legacyLead = leadSchema.parse(baseLead);
assert.equal(legacyLead.source.pagePath, undefined);

const blankSourceLead = leadSchema.parse({
  ...baseLead,
  source: { pagePath: "   ", pageTitle: "", referrer: "" },
});
assert.equal(blankSourceLead.source.pagePath, undefined);
assert.equal(blankSourceLead.source.pageTitle, undefined);
assert.equal(blankSourceLead.source.referrer, undefined);

const sourcedLead = leadSchema.parse({
  ...baseLead,
  source: {
    pagePath: "/tenancy-eviction?utm_source=google",
    pageTitle: "Tenancy and Eviction in Hyderabad | GS Law Firm",
    referrer: "https://www.google.com/search?q=tenancy+lawyer+hyderabad",
  },
});

assert.equal(sourcedLead.source.pagePath, "/tenancy-eviction?utm_source=google");
assert.equal(
  sourcedLead.source.pageTitle,
  "Tenancy and Eviction in Hyderabad | GS Law Firm",
);
assert.equal(
  sourcedLead.source.referrer,
  "https://www.google.com/search?q=tenancy+lawyer+hyderabad",
);

assert.equal(
  leadSchema.safeParse({
    ...baseLead,
    source: { pagePath: "https://example.com/tenancy-eviction" },
  }).success,
  false,
);

assert.equal(
  leadSchema.safeParse({
    ...baseLead,
    source: { pagePath: `/${"x".repeat(240)}` },
  }).success,
  false,
);

assert.equal(
  leadSchema.safeParse({
    ...baseLead,
    source: { referrer: "javascript:alert(1)" },
  }).success,
  false,
);

const meta = {
  ip: "127.0.0.1",
  userAgent: "qa-lead-source",
  submittedAt: new Date("2026-06-19T00:00:00.000Z"),
};

const text = renderLeadText(sourcedLead, meta);
assert.match(text, /Source:/);
assert.match(text, /Tenancy and Eviction in Hyderabad \| GS Law Firm/);
assert.match(text, /\/tenancy-eviction\?utm_source=google/);
assert.match(text, /https:\/\/www\.google\.com\/search/);

const html = renderLeadHtml(sourcedLead, meta);
assert.match(html, /Source/);
assert.match(html, /Tenancy and Eviction in Hyderabad \| GS Law Firm/);
assert.match(html, /\/tenancy-eviction\?utm_source=google/);

console.log("Lead source QA OK");
