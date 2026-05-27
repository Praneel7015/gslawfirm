import { getTranslations } from "next-intl/server";
import { firm } from "@/content/firm";

/**
 * Sticky bottom bar visible below 768px (display rule lives in globals.css).
 * Three equal-width tap targets: Call · WhatsApp · Email.
 */
export async function MobileStickyBar() {
  const t = await getTranslations("mbar");
  return (
    <nav className="mbar" aria-label="Quick contact">
      <a href={`tel:${firm.phoneE164}`} aria-label={t("call")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
        <span>{t("call")}</span>
      </a>
      <a
        href={`https://wa.me/${firm.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("chat")}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.6 6.32A7.85 7.85 0 0 0 12.05 4 7.94 7.94 0 0 0 4.1 11.94a7.84 7.84 0 0 0 1.06 3.97L4 20l4.2-1.1a7.93 7.93 0 0 0 3.84.98h.01a7.94 7.94 0 0 0 7.94-7.94 7.85 7.85 0 0 0-2.32-5.62zm-5.55 12.21h-.01a6.6 6.6 0 0 1-3.36-.92l-.24-.14-2.5.65.67-2.44-.16-.25a6.59 6.59 0 0 1-1.01-3.51 6.6 6.6 0 0 1 11.27-4.66 6.55 6.55 0 0 1 1.93 4.66 6.6 6.6 0 0 1-6.6 6.61z" />
        </svg>
        <span>{t("chat")}</span>
      </a>
      <a href={`mailto:${firm.publicEmail}`} aria-label={t("email")}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <rect x="3" y="5" width="18" height="14" rx="1" />
          <path d="m3 7 9 6 9-6" />
        </svg>
        <span>{t("email")}</span>
      </a>
    </nav>
  );
}
