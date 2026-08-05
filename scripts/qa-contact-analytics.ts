import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  CONTACT_EVENT_NAMES,
  ENQUIRY_FAILURE_EVENT_NAME,
  SECURITY_CHECK_TIMEOUT_EVENT_NAME,
  buildContactEventPayload,
  buildEnquiryFailureEventPayload,
  buildSecurityCheckTimeoutEventPayload,
  contactCaptureEndpoint,
  consentSafeSourcePage,
  contactChannelFromHref,
  isDuplicateContactCapture,
  localeFromPathname,
} from "../lib/contact-analytics";

assert.equal(contactChannelFromHref("tel:+919963847704"), "call");
assert.equal(contactChannelFromHref("mailto:sunitha@sindhole.com"), "email");
assert.equal(
  contactChannelFromHref("https://wa.me/919963847704?text=Hello"),
  "whatsapp",
);
assert.equal(contactChannelFromHref("https://example.com/contact"), undefined);

assert.equal(localeFromPathname("/"), "en");
assert.equal(localeFromPathname("/hi/contact"), "hi");
assert.equal(localeFromPathname("/te"), "te");

assert.equal(consentSafeSourcePage("/contact?source=/bail"), "/contact");
assert.equal(consentSafeSourcePage("/contact", "/hi/bail?private=1"), "/hi/bail");
assert.equal(consentSafeSourcePage("/contact", "https://example.com"), "/");

const first = { key: "click_call:en:/", timestamp: 1_000 };
assert.equal(isDuplicateContactCapture(first, first.key, 2_499), true);
assert.equal(isDuplicateContactCapture(first, first.key, 2_500), false);
assert.equal(
  isDuplicateContactCapture(first, "click_email:en:/", 1_100),
  false,
);

assert.deepEqual(CONTACT_EVENT_NAMES, {
  call: "click_call",
  whatsapp: "click_whatsapp",
  email: "click_email",
  form: "submit_enquiry_success",
});
assert.equal(ENQUIRY_FAILURE_EVENT_NAME, "submit_enquiry_failure");
assert.equal(SECURITY_CHECK_TIMEOUT_EVENT_NAME, "security_check_timeout");

assert.equal(
  contactCaptureEndpoint("https://us.i.posthog.com"),
  "https://us.i.posthog.com/i/v0/e/",
);
assert.equal(contactCaptureEndpoint("not a host"), undefined);

assert.deepEqual(
  buildContactEventPayload("public-key", "call", {
    channel: "call",
    locale: "en",
    source_page: "/contact",
  }),
  {
    api_key: "public-key",
    event: "click_call",
    properties: {
      distinct_id: "anonymous-contact-choice",
      channel: "call",
      locale: "en",
      source_page: "/contact",
      $geoip_disable: true,
      $process_person_profile: false,
    },
  },
);

assert.deepEqual(
  buildEnquiryFailureEventPayload("public-key", {
    failure_reason: "validation",
    locale: "te",
    source_page: "/te/contact",
  }),
  {
    api_key: "public-key",
    event: "submit_enquiry_failure",
    properties: {
      distinct_id: "anonymous-contact-choice",
      failure_reason: "validation",
      locale: "te",
      source_page: "/te/contact",
      $geoip_disable: true,
      $process_person_profile: false,
    },
  },
);

assert.deepEqual(
  buildSecurityCheckTimeoutEventPayload("public-key", {
    locale: "hi",
    source_page: "/hi/contact",
  }),
  {
    api_key: "public-key",
    event: "security_check_timeout",
    properties: {
      distinct_id: "anonymous-contact-choice",
      locale: "hi",
      source_page: "/hi/contact",
      $geoip_disable: true,
      $process_person_profile: false,
    },
  },
);

const contactForm = readFileSync(
  join(process.cwd(), "components/sections/ContactForm.tsx"),
  "utf8",
);
const passiveTimeout = contactForm.match(
  /window\.setTimeout\(\(\) => \{([\s\S]*?)\}, 12000\)/,
);
assert.ok(passiveTimeout, "contact form keeps the 12-second security timeout");
const passiveTimeoutBody = passiveTimeout[1];
assert.ok(passiveTimeoutBody);
assert.match(passiveTimeoutBody, /captureSecurityCheckTimeout\(originPath\)/);
assert.doesNotMatch(passiveTimeoutBody, /captureEnquiryFailure/);

assert.match(
  contactForm,
  /if \(turnstileRequired && !turnstileToken\) \{[\s\S]*?captureEnquiryFailure\("challenge", originPath\)/,
  "submit-time security rejection remains an enquiry failure",
);
assert.match(
  contactForm,
  /onSubmit=\{handleSubmit\(onSubmit, \(\) => \{\s*captureEnquiryFailure\("validation", originPath\)/,
  "validation failures remain enquiry failures",
);
assert.match(contactForm, /captureEnquiryFailure\("rate_limit", originPath\)/);
assert.match(contactForm, /captureEnquiryFailure\("generic", originPath\)/);

console.log("Contact analytics QA OK");
