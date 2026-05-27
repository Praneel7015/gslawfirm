import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { firm } from "@/content/firm";

export const metadata: Metadata = {
  title: `Disclaimer · ${firm.name}`,
  description: "Bar Council of India advertising disclaimer for visitors to this site.",
};

/** Full BCI disclaimer text, mirroring the first-visit modal. */
export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("disclaimer");

  return (
    <main id="main">
      <section className="page-hero">
        <span className="eyebrow">{t("noticeEyebrow")}</span>
        <h1>{t("heading")}</h1>
        <div style={{ maxWidth: 720, marginTop: 32 }}>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--color-muted)", margin: "0 0 16px" }}>
            {t("body1")}
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "var(--color-muted)", margin: "0 0 16px" }}>
            {t("body2")}
          </p>
        </div>
      </section>
    </main>
  );
}
