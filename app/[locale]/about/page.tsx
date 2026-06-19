import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { firm } from "@/content/firm";
import { Founder } from "@/components/sections/Founder";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, graphSchema, personSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `About Adv. Aitha Sunitha | ${firm.name}`,
  description:
    "A small practice, kept small on purpose. Founded 2023 in Kondapur, Hyderabad, by Adv. Aitha Sunitha, also known as Sunitha Sindhole.",
  path: "/about",
});

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");

  const ld = graphSchema([
    personSchema(),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "About", url: `${SITE_URL}/about` },
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
      <section className="about-symbol" aria-label="On the mark">
        <div className="mark-big" aria-hidden="true" />
        <div className="text">
          <span className="eyebrow">{t("symbol.eyebrow")}</span>
          <h2>{t("symbol.heading")}</h2>
          <p>{t("symbol.body1")}</p>
          <p>{t("symbol.body2")}</p>
        </div>
      </section>

      {/* ── STORY (founding, 4 paragraphs with drop cap) ───────── */}
      <section className="about-story" aria-label="Founding story">
        <div className="col-label">{t("story.label")}</div>
        <div className="about-story-content">
          <p>{t("story.p1")}</p>
          <p>{t("story.p2")}</p>
          <p>{t("story.p3")}</p>
          <p>{t("story.p4")}</p>
          <div className="about-story-link">
            <span>Continuity of counsel</span>
            <p>
              The continuity explainer describes how one advocate reading the
              papers and staying familiar with the file helps keep the next
              court-stage discussion clear.
            </p>
            <Link href="/continuity-of-counsel">
              Read the explainer <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOUNDER (reused from home) ─────────────────────────── */}
      <Founder />
    </main>
  );
}
