import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";
import { practiceAreas } from "@/content/practice-areas";
import { PracticeIcon } from "@/components/brand/practice-icons";

export const metadata: Metadata = {
  title: `Practice · ${firm.name}`,
  description:
    "Five areas, one advocate. Criminal, civil, corporate, succession and High Court matters in Hyderabad.",
};

export default async function PracticeIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("practiceIndex");

  return (
    <main id="main">
      <section className="pd-hero pd-index-hero" aria-labelledby="pi-title">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h1 id="pi-title">{t("heading")}</h1>
        <p className="lede">{t("lede")}</p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      <section className="pi-list" aria-label="Practice areas">
        {practiceAreas.map((a) => (
          <Link key={a.slug} href={`/practice/${a.slug}` as never} className="pi-row">
            <span className="pi-num">{a.num}</span>
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

      <section className="pi-foot">
        <p>{t("footnote")}</p>
        <Link href="/contact" className="pi-foot-link">
          Send a brief note <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}
