import { setRequestLocale, getTranslations } from "next-intl/server";

/**
 * M2 home stub — the real Hero / IntroStrip / Practice / Approach / Founder /
 * Location / ContactForm sections land in M3.
 *
 * For now we render a dark hero-shaped block so the transparent header sits
 * over white text correctly (which is what M3 will replace).
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
    <main id="main">
      <section
        style={{
          background: "#000",
          color: "#fff",
          minHeight: "100vh",
          padding: "160px 80px 100px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.55)",
            margin: 0,
            marginBottom: 48,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <span style={{ width: 48, height: 1, background: "rgba(255,255,255,.4)" }} />
          {t("hero.eyebrow")}
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 300,
            fontSize: "clamp(40px, 7vw, 84px)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            margin: "0 0 56px",
            maxWidth: 1100,
          }}
        >
          <span style={{ display: "block" }}>{t("hero.line1")}</span>
          <span style={{ display: "block" }}>{t("hero.line2")}</span>
          <span style={{ display: "block", marginTop: "0.2em" }}>
            <span style={{ fontWeight: 600 }}>{t("hero.emphasis")}</span>
          </span>
        </h1>
        <p
          style={{
            fontSize: 11,
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,.45)",
            fontFamily: "ui-monospace, monospace",
            margin: 0,
            marginTop: 80,
          }}
        >
          M2 SCAFFOLD · Shell wired · locale: {locale.toUpperCase()} · Hero proper lands in M3
        </p>
      </section>
    </main>
  );
}
