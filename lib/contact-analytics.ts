"use client";

export const CONTACT_EVENT_NAMES = {
  call: "click_call",
  whatsapp: "click_whatsapp",
  email: "click_email",
  form: "submit_enquiry_success",
} as const;

export const ENQUIRY_FAILURE_EVENT_NAME = "submit_enquiry_failure";

export type ContactChannel = keyof typeof CONTACT_EVENT_NAMES;
export type ContactLocale = "en" | "hi" | "te";
export type EnquiryFailureReason =
  | "validation"
  | "challenge"
  | "rate_limit"
  | "generic";

type ConsentSafeEventProperties = {
  locale: ContactLocale;
  source_page: string;
};

type ContactEventProperties = ConsentSafeEventProperties & {
  channel: ContactChannel;
};

type EnquiryFailureEventProperties = ConsentSafeEventProperties & {
  failure_reason: EnquiryFailureReason;
};

type ContactEventPayload = {
  api_key: string;
  event: (typeof CONTACT_EVENT_NAMES)[ContactChannel];
  properties: ContactEventProperties & {
    distinct_id: "anonymous-contact-choice";
    $geoip_disable: true;
    $process_person_profile: false;
  };
};

type EnquiryFailureEventPayload = {
  api_key: string;
  event: typeof ENQUIRY_FAILURE_EVENT_NAME;
  properties: EnquiryFailureEventProperties & {
    distinct_id: "anonymous-contact-choice";
    $geoip_disable: true;
    $process_person_profile: false;
  };
};

const DEDUPE_WINDOW_MS = 1_500;
export type LastContactCapture = { key: string; timestamp: number };
let lastCapture: LastContactCapture | undefined;

export function isDuplicateContactCapture(
  previous: LastContactCapture | undefined,
  key: string,
  now: number,
) {
  return (
    previous?.key === key &&
    now - previous.timestamp < DEDUPE_WINDOW_MS
  );
}

export function contactChannelFromHref(
  href: string | null | undefined,
): Exclude<ContactChannel, "form"> | undefined {
  if (!href) return undefined;

  const normalized = href.trim().toLowerCase();
  if (normalized.startsWith("tel:")) return "call";
  if (normalized.startsWith("mailto:")) return "email";

  try {
    const url = new URL(href, "https://sunitha.sindhole.com");
    if (
      url.hostname === "wa.me" ||
      url.hostname === "www.wa.me" ||
      url.hostname === "api.whatsapp.com" ||
      url.hostname === "web.whatsapp.com"
    ) {
      return "whatsapp";
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function localeFromPathname(pathname: string): ContactLocale {
  if (pathname === "/hi" || pathname.startsWith("/hi/")) return "hi";
  if (pathname === "/te" || pathname.startsWith("/te/")) return "te";
  return "en";
}

export function consentSafeSourcePage(
  pathname: string,
  explicitSource?: string,
) {
  const candidate = explicitSource?.trim() || pathname.trim();
  if (!candidate.startsWith("/") || candidate.startsWith("//")) return "/";

  const pathOnly = candidate.split(/[?#]/, 1)[0] || "/";
  return pathOnly.length > 160 ? pathOnly.slice(0, 160) : pathOnly;
}

export function contactCaptureEndpoint(host: string) {
  try {
    return new URL("/i/v0/e/", host).toString();
  } catch {
    return undefined;
  }
}

export function buildContactEventPayload(
  apiKey: string,
  channel: ContactChannel,
  properties: ContactEventProperties,
): ContactEventPayload {
  return {
    api_key: apiKey,
    event: CONTACT_EVENT_NAMES[channel],
    properties: {
      distinct_id: "anonymous-contact-choice",
      ...properties,
      $geoip_disable: true,
      $process_person_profile: false,
    },
  };
}

export function buildEnquiryFailureEventPayload(
  apiKey: string,
  properties: EnquiryFailureEventProperties,
): EnquiryFailureEventPayload {
  return {
    api_key: apiKey,
    event: ENQUIRY_FAILURE_EVENT_NAME,
    properties: {
      distinct_id: "anonymous-contact-choice",
      ...properties,
      $geoip_disable: true,
      $process_person_profile: false,
    },
  };
}

function sendEvent(
  payload: ContactEventPayload | EnquiryFailureEventPayload,
) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const endpoint = host ? contactCaptureEndpoint(host) : undefined;
  if (!key || !endpoint) return false;

  const body = JSON.stringify(payload);

  if (typeof navigator.sendBeacon === "function") {
    return navigator.sendBeacon(
      endpoint,
      new Blob([body], { type: "application/json" }),
    );
  }

  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  });
  return true;
}

function captureOnce(
  channel: ContactChannel,
  sourcePage?: string,
  now = Date.now(),
) {
  if (typeof window === "undefined") return false;

  const properties: ContactEventProperties = {
    channel,
    locale: localeFromPathname(window.location.pathname),
    source_page: consentSafeSourcePage(
      window.location.pathname,
      sourcePage,
    ),
  };
  const key = `${CONTACT_EVENT_NAMES[channel]}:${properties.locale}:${properties.source_page}`;

  if (isDuplicateContactCapture(lastCapture, key, now)) {
    return false;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return false;
  if (!sendEvent(buildContactEventPayload(apiKey, channel, properties))) {
    return false;
  }

  lastCapture = { key, timestamp: now };
  return true;
}

export function captureContactChoice(
  channel: Exclude<ContactChannel, "form">,
) {
  return captureOnce(channel);
}

export function captureSuccessfulEnquiry(sourcePage?: string) {
  return captureOnce("form", sourcePage);
}

export function captureEnquiryFailure(
  failureReason: EnquiryFailureReason,
  sourcePage?: string,
  now = Date.now(),
) {
  if (typeof window === "undefined") return false;

  const properties: EnquiryFailureEventProperties = {
    failure_reason: failureReason,
    locale: localeFromPathname(window.location.pathname),
    source_page: consentSafeSourcePage(
      window.location.pathname,
      sourcePage,
    ),
  };
  const key = `${ENQUIRY_FAILURE_EVENT_NAME}:${properties.failure_reason}:${properties.locale}:${properties.source_page}`;

  if (isDuplicateContactCapture(lastCapture, key, now)) {
    return false;
  }

  const apiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!apiKey) return false;
  if (!sendEvent(buildEnquiryFailureEventPayload(apiKey, properties))) {
    return false;
  }

  lastCapture = { key, timestamp: now };
  return true;
}
