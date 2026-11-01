import { guideUi } from "@/content/localized-guides";
import { labelForPath, localizedUrl } from "@/lib/localized-content";
import type { Locale } from "@/i18n/routing";
import { localizedPracticeAreas } from "@/content/localized-practice";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { ContactActions } from "@/components/legal/ContactActions";
import { routing } from "@/i18n/routing";
import {
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
import {
  localizedPracticeHeading,
  localizedPracticeMetadata,
} from "@/lib/localized-metadata";
import {
  practiceHubLinks,
  practiceResourceLinks,
} from "@/content/internal-links";

const focusedGuides: Partial<
  Record<PracticeSlug, Array<{ href: string; label: string }>>
> = {
  criminal: [
    {
      href: "/criminal-defense",
      label: "Criminal-defense guidance",
    },
    {
      href: "/cyber-crime-complaints",
      label: "Cyber-crime complaint guidance",
    },
    {
      href: "/cheque-dishonour",
      label: "Cheque-dishonour guidance",
    },
    {
      href: "/cheque-bounce-case-procedure-hyderabad",
      label: "Cheque-bounce procedure guide",
    },
    {
      href: "/continuity-of-counsel",
      label: "Continuity-of-counsel explainer",
    },
  ],
  civil: [
    {
      href: "/property-disputes",
      label: "Property-dispute guidance",
    },
    {
      href: "/property-dispute-courts-telangana",
      label: "Property court-stage guide",
    },
    {
      href: "/consumer-forum-complaints",
      label: "Consumer-forum complaint guidance",
    },
    {
      href: "/legal-notices",
      label: "Legal-notice guidance",
    },
    {
      href: "/tenancy-eviction",
      label: "Tenancy and eviction guidance",
    },
    {
      href: "/specific-performance",
      label: "Specific-performance guidance",
    },
    {
      href: "/injunction-interim-relief",
      label: "Injunction and interim-relief guidance",
    },
    {
      href: "/continuity-of-counsel",
      label: "Continuity-of-counsel explainer",
    },
  ],
  corporate: [
    {
      href: "/commercial-contracts",
      label: "Commercial-contract guidance",
    },
    {
      href: "/cheque-bounce-case-procedure-hyderabad",
      label: "Cheque-bounce procedure guide",
    },
    {
      href: "/consumer-forum-complaints",
      label: "Consumer-forum complaint guidance",
    },
    {
      href: "/legal-notices",
      label: "Legal-notice guidance",
    },
    {
      href: "/continuity-of-counsel",
      label: "Continuity-of-counsel explainer",
    },
  ],
  "will-succession": [
    {
      href: "/succession-probate",
      label: "Succession and probate guidance",
    },
    {
      href: "/continuity-of-counsel",
      label: "Continuity-of-counsel explainer",
    },
  ],
  "high-court": [
    {
      href: "/high-court-matters",
      label: "High Court guidance",
    },
    {
      href: "/continuity-of-counsel",
      label: "Continuity-of-counsel explainer",
    },
  ],
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    localizedPracticeAreas(locale).map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) return {};
  return localizedPracticeMetadata(area.slug, locale);
}

export default async function PracticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const areas = localizedPracticeAreas(locale);
  const ui = guideUi[locale as Locale];

  const area = areas.find(area => area.slug === slug);
  if (!area) notFound();

  const t = await getTranslations("practiceDetail");
  const adjacent = areas.filter((a) => a.slug !== area.slug);
  const guides = [
    ...(focusedGuides[area.slug] ?? []),
    ...(practiceResourceLinks[area.slug] ?? []),
    ...practiceHubLinks,
  ];
  // Dedupe by href while preserving order
  const seen = new Set<string>();
  const uniqueGuides = guides.filter((g) => {
    if (seen.has(g.href)) return false;
    seen.add(g.href);
    return true;
  });

  const ld = graphSchema([
    serviceSchema(area, locale),
    breadcrumbSchema([
      { name: ui.home, url: localizedUrl("/", locale) },
      { name: ui.practice, url: localizedUrl("/practice", locale) },
      { name: area.name, url: localizedUrl(`/practice/${area.slug}`, locale) },
    ]),
  ]);

  return (
    <main id="main">
      <JsonLd data={ld} />
      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="pd-hero" aria-labelledby="pd-title">
        <nav className="crumb" aria-label={ui.breadcrumb}>
          <Link href="/">{t("crumbHome")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/practice">{t("crumbPractice")}</Link>
          <span aria-hidden="true">/</span>
          <span className="current">{area.name}</span>
        </nav>
        <h1 id="pd-title">{localizedPracticeHeading(area.slug, locale)}</h1>
        <p className="lede">{area.oneLine}</p>
        {area.slug === "corporate" ? <ContactActions /> : null}
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

          {area.slug === "corporate" && locale === "en" ? (
            <section className="service-faq" aria-labelledby="business-starting-point">
              <h2 id="business-starting-point">Choose the starting point for your business matter</h2>
              <p>
                This overview helps founders and small-business owners identify
                the type of legal question. The next step depends on the parties,
                existing documents and any immediate deadline.
              </p>
              <ul className="consultation-checklist">
                <li>
                  <Link href="/commercial-contracts">Drafting or reviewing an agreement</Link>
                  {": prepare the current draft, proposed terms and signing date."}
                </li>
                <li>
                  Founder or shareholder questions: gather the ownership details,
                  existing agreements and the decision or disagreement involved.
                </li>
                <li>
                  <Link href="/legal-notices">A notice or payment dispute</Link>
                  {": keep the contract, invoices, correspondence and reply deadline together."}
                </li>
              </ul>
              <p>
                In your first enquiry, describe the business relationship and
                the decision you need to make. The advocate can confirm whether
                the matter fits the practice and discuss the scope and fees
                before work begins.
              </p>
            </section>
          ) : null}

          <div className="pd-handle">
            <h2>{t("handleHeading")}</h2>
            <ul>
              {area.handle.map((h) => (
                <li key={h}>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="pd-footnote">{t("footer")}</p>
        </div>

        <aside className="pd-side" aria-label={ui.actions}>
          <div className="pd-cta">
            <h3>
              {t("cta.headingPrefix")} {area.shortName.toLowerCase()}{" "}
              {t("cta.headingSuffix")}
            </h3>
            <p>{t("cta.body")}</p>
            <SourceAwareContactLink className="pd-cta-link">
              {t("cta.action")} <span aria-hidden="true">→</span>
            </SourceAwareContactLink>
          </div>

          {uniqueGuides.length > 0 ? (
            <div className="pd-adj">
              <h3>{ui.related}</h3>
              <ul>
                {uniqueGuides.map((guide) => (
                  <li key={guide.href}>
                    <Link href={guide.href as never}>{locale === "en" ? guide.label : labelForPath(guide.href, locale)}</Link>
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
