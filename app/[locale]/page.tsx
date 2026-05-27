import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";
import { founder } from "@/content/founder";

/**
 * M1 home page stub — proves the shell wires up:
 *  • next-intl messages resolve
 *  • Helvetica Neue + tokens apply (no React components yet)
 *  • Locale routing renders /en, /te, /hi
 *
 * Real sections (Hero, Practice grid, Approach, Founder, Location,
 * ContactForm, Footer) land in M2 + M3.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <main id="main" style={{ padding: "120px 32px", maxWidth: 960, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 48 }}>
        <span
          className="mark"
          aria-hidden="true"
          style={{ width: 36, height: 36, color: "#0c0c0c" }}
        />
        <span style={{ display: "flex", flexDirection: "column", lineHeight: 1 }}>
          <span style={{ fontWeight: 300, fontSize: 16, letterSpacing: ".04em" }}>
            {firm.name}
          </span>
          <span
            style={{
              marginTop: 5,
              fontSize: 9,
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--color-muted)",
            }}
          >
            {firm.tagline}
          </span>
        </span>
      </header>

      <p
        style={{
          fontSize: 11,
          letterSpacing: ".18em",
          textTransform: "uppercase",
          color: "var(--color-muted)",
          margin: 0,
        }}
      >
        {t("intro.tag")} · Locale: {locale.toUpperCase()}
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 300,
          fontSize: 64,
          lineHeight: 0.9,
          letterSpacing: "-0.04em",
          margin: "16px 0 28px",
          maxWidth: 820,
        }}
      >
        {t("hero.line1")}
        <br />
        {t("hero.line2")}
        <br />
        <span style={{ fontWeight: 600 }}>{t("hero.emphasis")}</span>
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.55, color: "var(--color-muted)", maxWidth: 680 }}>
        {t("intro.body")}
      </p>

      <hr style={{ border: 0, borderTop: "1px solid var(--color-hair)", margin: "48px 0" }} />

      <p
        style={{
          fontSize: 12,
          letterSpacing: ".06em",
          color: "var(--color-muted)",
          fontFamily: "ui-monospace, monospace",
        }}
      >
        M1 SCAFFOLD · Next.js 15 · Tailwind v4 · next-intl · {founder.name}
      </p>
    </main>
  );
}
