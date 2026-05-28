"use client";

import dynamic from "next/dynamic";

/**
 * Deferred client chrome — keeps Turnstile, modal, and FAB JS off the
 * critical path for LCP on content pages.
 */
export const ClientChrome = dynamic(
  () =>
    import("@/components/layout/ClientChrome").then((m) => ({
      default: m.ClientChrome,
    })),
  { ssr: false },
);
