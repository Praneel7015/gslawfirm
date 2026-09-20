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
      <section className="pd-hero" aria-labelledby="resources-title">
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
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── BODY ── */}
      <section className="pd-body">
        <div className="pd-content">

          <p className="lede pd-lede">
            These guides explain general legal processes in Hyderabad and
            Telangana. They are not legal advice for any specific matter, and
            reading them does not create an advocate–client relationship.
          </p>

          {/* ── Article list using existing legal-steps pattern ── */}
          <div className="legal-steps" aria-label="Legal guides">
            {resourceArticles.map((article, index) => (
              <article className="legal-step" key={article.slug}>
                <span className="li-num">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2>
                  <Link href={`/resources/${article.slug}` as never}>
                    {article.title}
                  </Link>
                </h2>
                <p>{article.description}</p>
                <p className="pd-footnote" style={{ marginTop: "8px" }}>
                  <time dateTime={article.publishedAt}>
                    {new Date(article.publishedAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                    })}
                  </time>
                  {" · "}
                  {article.tags.slice(0, 2).join(", ")}
                </p>
              </article>
            ))}
          </div>

          <p className="pd-footnote">
            All guides are written for general public understanding. The law
            and procedures referenced reflect Telangana / Hyderabad context as
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
