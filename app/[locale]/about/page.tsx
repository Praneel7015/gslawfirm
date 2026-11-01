import { labelForPath, localizedUrl } from "@/lib/localized-content";
import { guideUi } from "@/content/localized-guides";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Founder } from "@/components/sections/Founder";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, graphSchema, personSchema, profilePageSchema } from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("about", locale);
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ui = guideUi[locale as Locale];
  const ta = await getTranslations("approach");
  const t = await getTranslations("about");

  const ld = graphSchema([
    personSchema(),
    profilePageSchema(),
    breadcrumbSchema([
      { name: ui.home, url: localizedUrl("/", locale) },
      { name: labelForPath("/about", locale), url: localizedUrl("/about", locale) },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="about-hero" aria-labelledby="about-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="about-title">{t("heading")}</h1>
      </section>

      {/* ── SYMBOL (razorbill metaphor) ────────────────────────── */}
      <section className="about-symbol" aria-label={t("symbol.eyebrow")}>
        <div className="mark-big" aria-hidden="true" />
        <div className="text">
          <span className="eyebrow">{t("symbol.eyebrow")}</span>
          <h2>{t("symbol.heading")}</h2>
          <p>{t("symbol.body1")}</p>
          <p>{t("symbol.body2")}</p>
        </div>
      </section>

      {/* ── STORY (founding, 4 paragraphs with drop cap) ───────── */}
      <section className="about-story" aria-label={t("story.label")}>
        <div className="col-label">{t("story.label")}</div>
        <div className="about-story-content">
          <p>{t("story.p1")}</p>
          <p>{t("story.p2")}</p>
          <p>{t("story.p3")}</p>
          <p>{t("story.p4")}</p>
          <div className="about-story-link">
            <span>{ta("continuityExplainer.label")}</span>
            <p>
              {ta("continuityExplainer.body")}
            </p>
            <Link href="/continuity-of-counsel">
              {ta("continuityExplainer.link")} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOUNDER (reused from home) ─────────────────────────── */}
      <Founder />
    </main>
  );
}
