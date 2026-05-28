"use client";

import { useEffect, useRef } from "react";

/**
 * Cloudflare Turnstile widget. Loads the API script once, renders an
 * invisible managed challenge, and feeds the token back to the
 * caller via `onToken`.
 *
 * Renders nothing if NEXT_PUBLIC_TURNSTILE_SITE_KEY is unset. That
 * means Turnstile is purely additive — the form keeps working when
 * Cloudflare isn't configured. See lib/turnstile.ts for the matching
 * server-side stance.
 */

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          appearance?: "always" | "execute" | "interaction-only";
          size?: "normal" | "compact" | "flexible";
        },
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let scriptPromise: Promise<void> | null = null;
function loadScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src^="${SCRIPT_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("turnstile-load")));
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("turnstile-load"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export function TurnstileWidget({
  onToken,
  onError,
  onReady,
}: {
  onToken: (token: string | null) => void;
  onError?: () => void;
  /** Fires once when the widget has mounted (token may still be pending). */
  onReady?: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenRef = useRef(onToken);
  const onErrorRef = useRef(onError);
  const onReadyRef = useRef(onReady);

  useEffect(() => {
    onTokenRef.current = onToken;
    onErrorRef.current = onError;
    onReadyRef.current = onReady;
  });

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return;
    const host = ref.current;
    let cancelled = false;
    let observer: IntersectionObserver | null = null;

    const mount = () => {
      if (cancelled || !host) return;
      loadScript()
        .then(() => {
          if (cancelled || !host || !window.turnstile) return;
          widgetIdRef.current = window.turnstile.render(host, {
            sitekey: SITE_KEY!,
            theme: "light",
            size: "flexible",
            callback: (token) => onTokenRef.current(token),
            "expired-callback": () => onTokenRef.current(null),
            "error-callback": () => {
              onTokenRef.current(null);
              onErrorRef.current?.();
            },
          });
          onReadyRef.current?.();
        })
        .catch(() => onErrorRef.current?.());
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          observer?.disconnect();
          mount();
        }
      },
      { rootMargin: "240px 0px" },
    );
    observer.observe(host);

    return () => {
      cancelled = true;
      observer?.disconnect();
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, []);

  if (!SITE_KEY) return null;
  return (
    <div
      ref={ref}
      className="turnstile-widget"
      aria-label="Security check"
    />
  );
}

export function isTurnstileConfigured(): boolean {
  return Boolean(SITE_KEY);
}
