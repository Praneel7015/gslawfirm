/**
 * QA: AI-visibility signals.
 *
 * Validates that the site emits the signals AI search engines and
 * LLM crawlers use for discovery and citation.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { legalServiceSchema, personSchema, websiteSchema } from "../lib/jsonld";
import { firm } from "../content/firm";

const ROOT = process.cwd();

// ── llms.txt files exist and are non-empty ─────────────────────────

const llmsTxtPath = join(ROOT, "public/llms.txt");
const llmsFullTxtPath = join(ROOT, "public/llms-full.txt");

if (!existsSync(llmsTxtPath)) {
  throw new Error("Missing public/llms.txt for AI discovery.");
}
if (readFileSync(llmsTxtPath, "utf8").trim().length < 100) {
  throw new Error("public/llms.txt appears too short to be useful.");
}

if (!existsSync(llmsFullTxtPath)) {
  throw new Error("Missing public/llms-full.txt for extended AI discovery.");
}
if (readFileSync(llmsFullTxtPath, "utf8").trim().length < 500) {
  throw new Error("public/llms-full.txt appears too short to be useful.");
}

// ── Homepage JSON-LD graph includes required schema types ──────────

const legalService = legalServiceSchema();
const person = personSchema();
const website = websiteSchema();

if (legalService["@type"] !== "LegalService") {
  throw new Error("legalServiceSchema must emit @type LegalService.");
}
if (person["@type"] !== "Person") {
  throw new Error("personSchema must emit @type Person.");
}
if (website["@type"] !== "WebSite") {
  throw new Error("websiteSchema must emit @type WebSite.");
}

// ── sameAs has at least the LinkedIn profile ───────────────────────

const sameAs = legalService.sameAs;
if (!Array.isArray(sameAs) || sameAs.length < 1) {
  throw new Error(
    "LegalService sameAs must have at least 1 entry (LinkedIn). " +
      "Add Google Business Profile URL to content/firm.ts when available.",
  );
}

// ── firm.areasServed has local coverage ─────────────────────────────

if (firm.areasServed.length < 5) {
  throw new Error(
    `Expected at least 5 areas served for local SEO, found ${firm.areasServed.length}.`,
  );
}

// ── llms.txt references the site URL ────────────────────────────────

const llmsContent = readFileSync(llmsTxtPath, "utf8");
if (!llmsContent.includes("sindhole.com") && !llmsContent.includes("gslawfirm.in")) {
  throw new Error("llms.txt must reference the site domain.");
}

console.log(
  "AI-visibility signals passed: llms.txt + llms-full.txt present, " +
    "homepage JSON-LD includes LegalService + Person + WebSite, " +
    `sameAs has ${(sameAs as string[]).length} entries, ` +
    `${firm.areasServed.length} areas served.`,
);
