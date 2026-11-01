import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { statisticsContext, translatedGuides, guideUi, type GuideId, type TranslationLocale } from "@/content/localized-guides";
import { guideLinks } from "@/content/guide-links";
import { breadcrumbSchema, graphSchema } from "@/lib/jsonld";
import { localizedPageHeading, localizedMetadataAuditRows, type LocalizedPageKey } from "@/lib/localized-metadata";
import { labelForPath, localizedUrl } from "@/lib/localized-content";

export const primarySources = [
  { label: "BNSS 2023 · India Code", href: "https://www.indiacode.nic.in/handle/123456789/20099" },
  { label: "Negotiable Instruments Act 1881 · India Code", href: "https://www.indiacode.nic.in/handle/123456789/2189" },
  { label: "I4C · cybercrime.gov.in", href: "https://cybercrime.gov.in" },
];

export function TranslatedGuide({ id, locale }: { id: GuideId; locale: TranslationLocale }) {
  const copy = translatedGuides[locale][id];
  const ui = guideUi[locale];
  const path = `/${id}`;
  const key = localizedMetadataAuditRows().find(row => row.locale === locale && row.path === path)!.key as LocalizedPageKey;
  const heading = localizedPageHeading(key, locale);
  const links = [...new Set([...guideLinks[id], "/practice", "/resources", "/bail", "/criminal-defense"])].filter(href => href !== path && href !== "/contact");
  const crumbs = [
    { name: ui.home, url: localizedUrl("/", locale) },
    { name: ui.practice, url: localizedUrl("/practice", locale) },
    { name: heading, url: localizedUrl(path, locale) },
  ];
  return <main id="main" data-content-record={`${locale}:${id}`}>
    <JsonLd data={graphSchema([breadcrumbSchema(crumbs)])} />
    <section className="pd-hero">
      <nav className="crumb" aria-label={ui.breadcrumb}>
        <Link href="/">{ui.home}</Link><span aria-hidden="true">/</span>
        <Link href="/practice">{ui.practice}</Link><span aria-hidden="true">/</span>
        <span className="current">{heading}</span>
      </nav>
      <h1>{heading}</h1><p className="lede">{copy.intro}</p>
      <span className="pd-hero-mark" aria-hidden="true" />
    </section>
    <section className="pd-body">
      <div className="pd-content">
        <div className="legal-steps">
          {copy.sections.map((section, index) => <article className="legal-step" key={section.heading}>
            <span className="li-num" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h2>{section.heading}</h2><p>{section.body}</p>
            {section.items?.map(item => <p key={item}>{item}</p>)}
          </article>)}
        </div>
        {id === "legal-statistics-hyderabad" && <div className="statistics-context">
          <section id="cyber-crime"><h2>{ui.reported}</h2>
          <p><strong>15,297 · {ui.reported}</strong></p>
          <p><a href="https://www.pib.gov.in/PressReleasePage.aspx?PRID=2003505">NCRB / MHA · Crime in India 2022</a></p>
          </section>
          {statisticsContext[locale].map(section => <section key={section.id} id={section.id}><h2>{section.heading}</h2><p>{section.body}</p></section>)}
          <h2 id="sources">{ui.sources}</h2>
          <p><a href="https://njdg.ecourts.gov.in">NJDG</a></p>
        </div>}
        <section className="service-faq"><h2>{ui.questions}</h2><h3>{ui.question}</h3><p>{ui.answer}</p></section>
        <p className="pd-footnote">{ui.note}</p>
      </div>
      <aside className="pd-side" aria-label={ui.actions}>
        <div className="pd-cta"><h2>{ui.next}</h2><p>{ui.answer}</p>
          <SourceAwareContactLink className="pd-cta-link">{ui.enquiry} →</SourceAwareContactLink>
        </div>
        <nav className="pd-adj" aria-label={ui.related}><h2>{ui.related}</h2><ul>{links.map(href => <li key={href}><Link href={href as never}>{labelForPath(href, locale)}</Link></li>)}</ul></nav>
        {(/bail|criminal|cheque|cyber|statistics/.test(id)) && <div className="pd-adj"><h2>{ui.sources}</h2><ul>{primarySources.filter(source => /statistics/.test(id) || (/cheque/.test(id) ? /Negotiable/.test(source.label) : /cyber/.test(id) ? /I4C/.test(source.label) : /BNSS/.test(source.label))).map(source => <li key={source.href}><a href={source.href}>{source.label}</a></li>)}</ul></div>}
      </aside>
    </section>
  </main>;
}
