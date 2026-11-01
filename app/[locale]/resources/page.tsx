import { localizedArticles, articleUi } from "@/content/localized-resources";
import { labelForPath, localizedUrl } from "@/lib/localized-content";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { breadcrumbSchema, graphSchema } from "@/lib/jsonld";
import {
  localizedPageHeading,
  localizedPageMetadata,
} from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return localizedPageMetadata("resourcesIndex", locale);
}

export default async function ResourcesIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ui = articleUi[locale as Locale];
  const articles = localizedArticles(locale);

  const pageUrl =
    locale === "en"
      ? `${SITE_URL}/resources`
     : `${SITE_URL}/${locale}/resources`;

  const ld = graphSchema([
    breadcrumbSchema([
      { name: ui.home, url: localizedUrl("/", locale) },
      { name: ui.resources, url: pageUrl },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />

      {/* ── HERO ── */}
      <section className="pd-hero" aria-labelledby="resources-title">
        <nav className="crumb" aria-label={ui.breadcrumb}>
          <Link href="/">{ui.home}</Link>
          <span aria-hidden="true">/</span>
          <span className="current">{ui.resources}</span>
        </nav>
        <h1 id="resources-title">
          {localizedPageHeading("resourcesIndex", locale)}
        </h1>
        <p className="lede">
          {ui.intro}
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── BODY ── */}
      <section className="pd-body">
        <div className="pd-content">

          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug="civil" size={36} />
            </span>
            <span>
              {ui.note}
            </span>
          </p>

          {/* ── Article list: each card is clearly tappable on mobile ── */}
          <div className="legal-steps resources-list" aria-label={ui.resources}>
            {articles.map((article, index) => (
              <article className="legal-step resources-card" key={article.slug}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>
                  <Link
                    href={`/resources/${article.slug}` as never}
                    className="resources-card-link"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p>{article.description}</p>
                <Link
                  href={`/resources/${article.slug}` as never}
                  className="resources-card-cta"
                >
                  {ui.read} <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>

          <p className="pd-footnote">
            {ui.note}
          </p>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="pd-side" aria-label={ui.actions}>
          <div className="pd-cta">
            <h3>{ui.enquiryHeading}</h3>
            <p>
              {ui.enquiryBody}
            </p>
            <SourceAwareContactLink className="pd-cta-link">
              {ui.enquiry} <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          <div className="pd-adj">
            <h3>{ui.related}</h3>
            <ul>
              <li>
                <Link href="/legal-notice-reply-format">{labelForPath("/legal-notice-reply-format", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cyber-crime-complaint-format">{labelForPath("/cyber-crime-complaint-format", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-bounce-case-procedure-hyderabad">{labelForPath("/cheque-bounce-case-procedure-hyderabad", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/bail-hearing-procedure-hyderabad">{labelForPath("/bail-hearing-procedure-hyderabad", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-dispute-courts-telangana">{labelForPath("/property-dispute-courts-telangana", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/legal-statistics-hyderabad">{labelForPath("/legal-statistics-hyderabad", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/criminal">{labelForPath("/practice/criminal", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice/civil">{labelForPath("/practice/civil", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/practice">{labelForPath("/practice", locale)}</Link>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
