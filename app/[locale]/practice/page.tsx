import { guideUi } from "@/content/localized-guides";
import { localizedUrl } from "@/lib/localized-content";
import type { Locale } from "@/i18n/routing";
import { localizedPracticeAreas } from "@/content/localized-practice";
import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { practiceIndexExtraLinks, practiceIndexIntro } from "@/content/focused-guidance";
import { PracticeIcon } from "@/components/brand/practice-icons";
import { FocusedGuidance } from "@/components/sections/FocusedGuidance";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { localizedPageMetadata } from "@/lib/localized-metadata";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("practice", locale);
}

export default async function PracticeIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const areas = localizedPracticeAreas(locale);
  const ui = guideUi[locale as Locale];
  const t = await getTranslations("practiceIndex");

  const ld = breadcrumbSchema([
    { name: ui.home, url: localizedUrl("/", locale) },
    { name: ui.practice, url: localizedUrl("/practice", locale) },
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      <section className="pd-hero pd-index-hero" aria-labelledby="pi-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="pi-title">{t("heading")}</h1>
        <p className="lede">{t("lede")}</p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pi-list" aria-label={ui.practice}>
        {areas.map((a) => (
          <Link key={a.slug} href={`/practice/${a.slug}` as never} className="pi-row">
            <span className="pi-icon" aria-hidden="true">
              <PracticeIcon slug={a.slug} size={32} />
            </span>
            <div className="pi-text">
              <h2>{a.name}</h2>
              <p>{a.oneLine}</p>
            </div>
            <span className="pi-arrow" aria-hidden="true">
              →
            </span>
          </Link>
        ))}
      </section>

      <section className="pi-focused" aria-label={ui.related}>
        <FocusedGuidance
          extraLinks={practiceIndexExtraLinks}
          intro={practiceIndexIntro}
        />
      </section>
    </main>
  );
}
