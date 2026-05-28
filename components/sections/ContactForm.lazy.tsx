"use client";

import dynamic from "next/dynamic";

/** Home-page contact block — below the fold; skip SSR to defer form + Turnstile JS. */
export const HomeContactForm = dynamic(
  () =>
    import("@/components/sections/ContactForm").then((m) => ({
      default: m.ContactForm,
    })),
  { ssr: false },
);
