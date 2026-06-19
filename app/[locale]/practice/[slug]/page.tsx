import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { firm } from "@/content/firm";
import {
  practiceAreas,
  getPracticeArea,
  type PracticeSlug,
} from "@/content/practice-areas";
import { PracticeIcon } from "@/components/brand/practice-icons";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  breadcrumbSchema,
  graphSchema,
  serviceSchema,
} from "@/lib/jsonld";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

const focusedGuides: Partial<
  Record<PracticeSlug, Array<{ href: string; label: string }>>
> = {
  criminal: [
    {
      href: "/criminal-defense",
      label: "Criminal-defense guidance",
    },
    {
      href: "/cheque-dishonour",
      label: "Cheque-dishonour guidance",
    },
  ],
  civil: [
    {
      href: "/property-disputes",
      label: "Property-dispute guidance",
    },
    {
      href: "/tenancy-eviction",
      label: "Tenancy and eviction guidance",
    },
  ],
  corporate: [
    {
      href: "/commercial-contracts",
      label: "Commercial-contract guidance",
    },
  ],
  "will-succession": [
    {
      href: "/succession-probate",
      label: "Succession and probate guidance",
    },
  ],
  "high-court": [
    {
      href: "/high-court-matters",
      label: "High Court guidance",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    practiceAreas.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) return {};
  return pageMetadata({
    title: `${area.name} in Hyderabad | ${firm.name}`,
    description: `${area.oneLine} Serving Kondapur, Gachibowli, Miyapur, Nallagandla and nearby Hyderabad localities.`,
    path: `/practice/${area.slug}`,
  });
}

export default async function PracticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const area = getPracticeArea(slug);
  if (!area) notFound();

  const t = await getTranslations("practiceDetail");
  const adjacent = practiceAreas.filter((a) => a.slug !== area.slug);
  const guides = focusedGuides[area.slug] ?? [];

  const ld = graphSchema([
    serviceSchema(area, locale),
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Practice", url: `${SITE_URL}/practice` },
      { name: area.name, url: `${SITE_URL}/practice/${area.slug}` },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="pd-hero" aria-labelledby="pd-title">
        <nav className="crumb" aria-label="Breadcrumb">
          <Link href="/">{t("crumbHome")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">{t("crumbPractice")}</Link>
          <span aria-hidden="true">/</span>
          <span className="current">{area.name}</span>
        </nav>
        <h1 id="pd-title">{area.name}.</h1>
        <p className="lede">{area.oneLine}</p>
        <span className="pd-hero-mark" aria-hidden="true" />
      </section>

      {/* ── BODY ────────────────────────────────────────────────── */}
      <section className="pd-body">
        <div className="pd-content">
          <p className="lede pd-lede">
            <span className="pd-lede-icon" aria-hidden="true">
              <PracticeIcon slug={area.slug} size={36} />
            </span>
            <span>{area.paragraphs[0]}</span>
          </p>

          {area.paragraphs.slice(1).map((p, i) => (
            <p key={i}>{p}</p>
          ))}

          <div className="pd-handle">
            <h2>{t("handleHeading")}</h2>
            <ul>
              {area.handle.map((h, i) => (
                <li key={h}>
                  <span className="li-num">{String(i + 1).padStart(2, "0")}</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="pd-footnote">{t("footer")}</p>
        </div>

        <aside className="pd-side" aria-label="Related actions">
          <div className="pd-cta">
            <h3>
              {t("cta.headingPrefix")} {area.shortName.toLowerCase()}{" "}
              {t("cta.headingSuffix")}
            </h3>
            <p>{t("cta.body")}</p>
            <Link href="/contact" className="pd-cta-link">
              {t("cta.action")} <span aria-hidden="true">→</span>
            </Link>
          </div>

          {guides.length > 0 ? (
            <div className="pd-adj">
              <h3>Focused guidance</h3>
              <ul>
                {guides.map((guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href as never}>{guide.label}</Link>
                    <span aria-hidden="true">→</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="pd-adj">
            <h3>{t("adjacent")}</h3>
            <ul>
              {adjacent.map((a) => (
                <li key={a.slug}>
                  <Link href={`/practice/${a.slug}` as never}>{a.name}</Link>
                  <span aria-hidden="true">→</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
