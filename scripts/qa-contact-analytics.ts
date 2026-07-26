import assert from "node:assert/strict";

import {
  CONTACT_EVENT_NAMES,
  buildContactEventPayload,
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

console.log("Contact analytics QA OK");
