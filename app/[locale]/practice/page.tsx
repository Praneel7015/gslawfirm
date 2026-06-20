import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { firm } from "@/content/firm";
import { practiceAreas } from "@/content/practice-areas";
import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Practice Areas | ${firm.name} Hyderabad`,
  description:
    "Criminal, civil, property, commercial, succession and High Court practice areas at GS Law Firm in Kondapur, Hyderabad.",
  path: "/practice",
});

export default async function PracticeIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("practiceIndex");

  const ld = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Practice", url: `${SITE_URL}/practice` },
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
        <div>
          <p>{t("footnote")}</p>
          <p className="pi-foot-note">
            Looking for criminal-defense, cyber-crime complaint, bail,
            bail-hearing procedure, cheque-dishonour, cheque-bounce procedure,
            consumer-forum complaint, legal-notice, property-dispute, property
            court-stage, tenancy and eviction, agreement-enforcement,
            injunction or interim-relief, commercial-contract, succession and
            probate, High Court, continuity of counsel, or Kondapur location
            context in Hyderabad? Start with the focused pages, then send a
            brief note if the matter needs a conversation.
          </p>
        </div>
        <div className="pi-foot-actions">
          <Link href="/criminal-defense" className="pi-foot-link">
            Read criminal-defense guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/cyber-crime-complaints" className="pi-foot-link">
            Read cyber-crime complaint guidance{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/bail" className="pi-foot-link">
            Read bail guidance <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/bail-hearing-procedure-hyderabad"
            className="pi-foot-link"
          >
            Read bail-hearing procedure guide{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/cheque-dishonour" className="pi-foot-link">
            Read cheque-dishonour guidance <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/cheque-bounce-case-procedure-hyderabad"
            className="pi-foot-link"
          >
            Read cheque-bounce procedure guide{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/property-disputes" className="pi-foot-link">
            Read property-dispute guidance <span aria-hidden="true">→</span>
          </Link>
          <Link
            href="/property-dispute-courts-telangana"
            className="pi-foot-link"
          >
            Read property court-stage guide{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/consumer-forum-complaints" className="pi-foot-link">
            Read consumer-forum complaint guidance{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/legal-notices" className="pi-foot-link">
            Read legal-notice guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/tenancy-eviction" className="pi-foot-link">
            Read tenancy and eviction guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/specific-performance" className="pi-foot-link">
            Read specific-performance guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/injunction-interim-relief" className="pi-foot-link">
            Read injunction and interim-relief guidance{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <Link href="/commercial-contracts" className="pi-foot-link">
            Read commercial-contract guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/succession-probate" className="pi-foot-link">
            Read succession and probate guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/high-court-matters" className="pi-foot-link">
            Read High Court guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/kondapur-legal-services" className="pi-foot-link">
            Read Kondapur legal-services page <span aria-hidden="true">→</span>
          </Link>
          <Link href="/continuity-of-counsel" className="pi-foot-link">
            Read continuity-of-counsel explainer{" "}
            <span aria-hidden="true">→</span>
          </Link>
          <SourceAwareContactLink className="pi-foot-link">
            Send a brief note <span aria-hidden="true">→</span>
          </SourceAwareContactLink>
        </div>
      </section>
    </main>
  );
}
