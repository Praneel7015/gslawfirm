import { readFile } from "node:fs/promises";
import { join } from "node:path";

const DEFAULT_BASE =
  process.argv[2]?.replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "https://sunitha.sindhole.com";

const EXPECTED_CONTACT_MARKERS = [
  { label: "name field", pattern: /id="f-name"/ },
  { label: "phone field", pattern: /id="f-phone"/ },
  { label: "email field", pattern: /id="f-email"/ },
  { label: "message field", pattern: /id="f-message"/ },
  { label: "call link", pattern: /href="tel:\+919963847704/ },
  { label: "email link", pattern: /href="mailto:sunitha@sindhole\.com/ },
  { label: "WhatsApp link", pattern: /href="https:\/\/wa\.me\/919963847704/ },
];

async function assertLeadRouteGuard() {
  const routePath = join(process.cwd(), "app/api/lead/route.ts");
  const route = await readFile(routePath, "utf8");

  const parseIndex = route.indexOf("const parsed = leadSchema.safeParse");
  const validationIndex = route.indexOf("if (!parsed.success)");
  const leadIndex = route.indexOf("const lead = parsed.data");
  const rateLimitIndex = route.indexOf("const rl = await rateLimit");
  const turnstileIndex = route.indexOf("const tsVerify = await verifyTurnstile");
  const sendIndex = route.indexOf("const result = await sendLeadEmail");

  const ordered =
    parseIndex >= 0 &&
    validationIndex > parseIndex &&
    leadIndex > validationIndex &&
    rateLimitIndex > leadIndex &&
    turnstileIndex > rateLimitIndex &&
    sendIndex > turnstileIndex;

  if (!ordered) {
    throw new Error(
      "Lead API guard check failed: validation no longer clearly happens before rate-limit, Turnstile, and email send.",
    );
  }

  console.log("✓ Lead API guard: invalid payloads fail before rate-limit, Turnstile, or email send");
}

async function assertContactPage(baseUrl: string) {
  const url = `${baseUrl}/contact`;
  const res = await fetch(url, {
    redirect: "follow",
    headers: {
      "User-Agent": "gs-law-firm-no-pro-heartbeat/1.0",
    },
  });

  if (!res.ok) {
    throw new Error(`Contact page failed: ${res.status} ${url}`);
  }

  const html = await res.text();
  const missing = EXPECTED_CONTACT_MARKERS.filter(({ pattern }) => !pattern.test(html));

  if (missing.length > 0) {
    throw new Error(
      `Contact page missing expected marker(s): ${missing
        .map(({ label }) => label)
        .join(", ")}`,
    );
  }

  console.log(`✓ Contact page alive: ${res.status} ${url}`);
  console.log("✓ Contact page markers: form fields, call, email, and WhatsApp links present");
}

async function assertLeadApiValidation(baseUrl: string) {
  const url = `${baseUrl}/api/lead`;
  const invalidLead = {
    name: "",
    phone: "heartbeat-not-a-phone",
    email: "not-an-email",
    message: "short",
    website: "",
    source: {
      pagePath: "/contact",
      pageTitle: "Heartbeat probe",
      originPath: "/contact",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "gs-law-firm-no-pro-heartbeat/1.0",
    },
    body: JSON.stringify(invalidLead),
  });

  const text = await res.text();
  const validationStatus = res.status === 400 || res.status === 422;

  if (!validationStatus) {
    throw new Error(
      `Lead API invalid probe returned ${res.status}, expected 400 or 422 validation failure. Body: ${text.slice(0, 240)}`,
    );
  }

  if (!/"ok"\s*:\s*false/.test(text)) {
    throw new Error(
      `Lead API invalid probe did not return an explicit ok:false body. Body: ${text.slice(0, 240)}`,
    );
  }

  console.log(`✓ Lead API alive: invalid no-submit probe returned ${res.status}`);
}

async function main() {
  const baseUrl = DEFAULT_BASE;

  await assertLeadRouteGuard();
  await assertContactPage(baseUrl);
  await assertLeadApiValidation(baseUrl);

  console.log(
    "\nHeartbeat passed. This proves the public contact path and lead API validation route are alive; it does not prove that a real enquiry email would be delivered.",
  );
}

main().catch((err) => {
  console.error("Lead-path heartbeat failed.");
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
