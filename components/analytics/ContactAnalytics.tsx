"use client";

import { useEffect } from "react";

import {
  captureContactChoice,
  contactChannelFromHref,
} from "@/lib/contact-analytics";

export function ContactAnalytics() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest<HTMLAnchorElement>("a[href]");
      const channel = contactChannelFromHref(anchor?.getAttribute("href"));
      if (channel) captureContactChoice(channel);
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
