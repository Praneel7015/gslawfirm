import { localizedResourceBody, localizedArticles, articleUi } from "@/content/localized-resources";
import { labelForPath, localizedUrl } from "@/lib/localized-content";
import { articleSchema } from "@/lib/jsonld";
import type { Locale } from "@/i18n/routing";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { routing } from "@/i18n/routing";
import { breadcrumbSchema, graphSchema, howToSchema } from "@/lib/jsonld";
import { localizedResourceMetadata } from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";
import { resourceArticles, getResourceArticle } from "@/content/resources";

// ── Article content ────────────────────────────────────────────────────────

// ── Static params ─────────────────────────────────────────────────────────

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    resourceArticles.map((a) => ({ locale, slug: a.slug }))
  );
}

// ── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getResourceArticle(slug);
  if (!article) return {};
  const metadata = localizedResourceMetadata(slug, locale);
  return {
    ...metadata,
    keywords: article.tags,
    openGraph: {
      ...metadata.openGraph,
      type: "article",
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
    },
  };
}

// ── Page ─────────────────────────────────────────────────────────────────

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const article = localizedArticles(locale).find(article => article.slug === slug);
  if (!article) notFound();
  const ui = articleUi[locale as Locale];
  const content = localizedResourceBody(slug, locale);
  if (!content) notFound();

  const articleUrl =
    locale === "en"
      ? `${SITE_URL}/resources/${slug}`
     : `${SITE_URL}/${locale}/resources/${slug}`;

  const ld = graphSchema([
    articleSchema(article, locale),
    breadcrumbSchema([
      { name: ui.home, url: localizedUrl("/", locale) },
      { name: ui.resources, url: localizedUrl("/resources", locale) },
      { name: article.title, url: articleUrl },
    ]),
    ...(content.howToSteps
      ? [
          howToSchema({
            name: article.title,
            description: article.description,
            steps: content.howToSteps,
          }),
        ]
     : []),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />

      {/* ── HERO ── */}
      <section className="pd-hero" aria-labelledby="article-title">
        <nav className="crumb" aria-label={ui.breadcrumb}>
          <Link href="/">{ui.home}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/resources">{ui.resources}</Link>
          <span aria-hidden="true">/</span>
          <span className="current">{article.title}</span>
        </nav>
        <h1 id="article-title">{article.title}</h1>
        <p className="lede">{article.description}</p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── BODY ── */}
      <section className="pd-body">
        <div className="pd-content">

          {/* ── Intro ── */}
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug={article.icon} size={36} />
            </span>
            <span>{content.intro}</span>
          </p>

          {/* ── Note ── */}
          <p>
            <em>
              {ui.note}{" "}
              <time dateTime={article.updatedAt}>
                {ui.updated}{" "}
                {new Date(article.updatedAt).toLocaleDateString(`${locale}-IN`, {
                  year: "numeric",
                  month: "long",
                })}
              </time>
            </em>
          </p>

          {/* ── Sections: single legal-steps wrapper, sequential order.
               Extra <p> children are safe: CSS keeps them in column 2. ── */}
          <div className="legal-steps">
            {content.sections.map((section, index) => (
              <article className="legal-step" key={section.heading}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>{section.heading}</h2>
                <p>{section.body}</p>
                {section.items?.map((item) => (
                  <p key={item}>{item}</p>
                ))}
              </article>
            ))}
          </div>

          {/* ── Closing note ── */}
          <section className="service-faq" aria-labelledby="closing-heading">
            <h2 id="closing-heading">{ui.start}</h2>
            <p>{content.closingNote}</p>
          </section>

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

          {article.relatedSlugs && article.relatedSlugs.length > 0 && (
            <div className="pd-adj">
              <h3>{ui.related}</h3>
              <ul>
                {article.relatedSlugs.map((href) => (
                  <li key={href}>
                    <Link href={href as never}>{labelForPath(href, locale)}</Link>
                    <span aria-hidden="true">→</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="pd-adj">
            <h3>{ui.resources}</h3>
            <ul>
              {localizedArticles(locale)
                .filter((a) => a.slug !== slug)
                .map((a) => (
                  <li key={a.slug}>
                    <Link href={`/resources/${a.slug}` as never}>
                      {a.title}
                    </Link>
                    <span aria-hidden="true">→</span>
                  </li>
                ))}
              <li>
                <Link href="/resources">{ui.resources}</Link>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
