import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { JsonLd } from "@/components/seo/JsonLd";
import { Link } from "@/i18n/routing";
import { breadcrumbSchema, graphSchema } from "@/lib/jsonld";
import {
  localizedPageHeading,
  localizedPageMetadata,
} from "@/lib/localized-metadata";
import { SITE_URL } from "@/lib/site";
import { resourceArticles } from "@/content/resources";

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

  const pageUrl =
    locale === "en"
      ? `${SITE_URL}/resources`
      : `${SITE_URL}/${locale}/resources`;

  const ld = graphSchema([
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Resources", url: pageUrl },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />

      {/* ── HERO ── */}
      <section className="pd-hero resources-hero" aria-labelledby="resources-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="current">Resources</span>
        </nav>
        <h1 id="resources-title">
          {localizedPageHeading("resourcesIndex", locale)}
        </h1>
        <p className="lede">
          Plain-language guides on legal processes, document formats and
          practical steps for people dealing with court matters, notices,
          property, contracts and criminal questions in Hyderabad, Telangana.
        </p>
        <p className="stats-caveat">
          <strong>Note:</strong> Guides on this site are general information,
          not legal advice for any specific matter. Reading a guide does not
          create an advocate–client relationship.
        </p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── ARTICLE LIST ── */}
      <section className="pd-body resources-body">
        <div className="pd-content">
          <ul className="resources-list" role="list">
            {resourceArticles.map((article) => (
              <li key={article.slug} className="resource-card" role="listitem">
                <article>
                  <h2 className="resource-card-title">
                    <Link href={`/resources/${article.slug}` as never}>
                      {article.title}
                    </Link>
                  </h2>
                  <p className="resource-card-desc">{article.description}</p>
                  <footer className="resource-card-meta">
                    <time dateTime={article.publishedAt}>
                      {new Date(article.publishedAt).toLocaleDateString(
                        "en-IN",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </time>
                    <span aria-hidden="true"> · </span>
                    <span>
                      {article.tags.slice(0, 3).join(", ")}
                    </span>
                  </footer>
                </article>
              </li>
            ))}
          </ul>

          <p className="pd-footnote">
            All guides are written for general public understanding. The law
            and procedures referenced reflect Telangana/Hyderabad context as
            of the dates shown. Send a brief enquiry if you have a specific
            matter.
          </p>
        </div>

        {/* ── SIDEBAR ── */}
        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>Have a specific matter?</h3>
            <p>
              Guides give general context. For your specific situation —
              documents, deadlines and opposing parties — a direct conversation
              is the right starting point.
            </p>
            <Link href="/contact" className="pd-cta-link">
              Contact the firm <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="pd-adj">
            <h3>Focused guidance pages</h3>
            <ul>
              <li>
                <Link href="/legal-notice-reply-format">
                  Legal notice reply format
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cyber-crime-complaint-format">
                  Cyber crime complaint format
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/cheque-bounce-case-procedure-hyderabad">
                  Cheque bounce procedure
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/bail-hearing-procedure-hyderabad">
                  Bail hearing procedure
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/property-dispute-courts-telangana">
                  Property dispute courts
                </Link>
                <span aria-hidden="true">→</span>
              </li>
              <li>
                <Link href="/legal-statistics-hyderabad">
                  Legal statistics for Hyderabad
                </Link>
                <span aria-hidden="true">→</span>
              </li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
