import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { practiceAreas } from "@/content/practice-areas";
import { PracticeIcon } from "@/components/brand/practice-icons";

const focusedGuidanceLinks = [
  { href: "/criminal-defense", label: "Criminal-defense guidance" },
  {
    href: "/cyber-crime-complaints",
    label: "Cyber-crime complaint guidance",
  },
  { href: "/bail", label: "Bail guidance" },
  { href: "/cheque-dishonour", label: "Cheque-dishonour guidance" },
  { href: "/property-disputes", label: "Property-dispute guidance" },
  {
    href: "/consumer-forum-complaints",
    label: "Consumer-forum complaint guidance",
  },
  { href: "/tenancy-eviction", label: "Tenancy and eviction guidance" },
  { href: "/specific-performance", label: "Specific-performance guidance" },
  {
    href: "/injunction-interim-relief",
    label: "Injunction and interim-relief guidance",
  },
  { href: "/commercial-contracts", label: "Commercial-contract guidance" },
  { href: "/succession-probate", label: "Succession and probate guidance" },
  { href: "/high-court-matters", label: "High Court guidance" },
] as const;

export async function Practice() {
  const t = await getTranslations("practice");
  const lines = t("heading").split("\n");

  return (
    <section className="practice" id="practice">
      <div className="section-head">
        <div>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h2>
            {lines.map((l, i) => (
              <span key={i} style={{ display: "block" }}>
                {l}
              </span>
            ))}
          </h2>
        </div>
        <p className="practice-lede">{t("lede")}</p>
      </div>
      <div className="practice-feature">
        <span>Focused guidance</span>
        <p>
          For FIRs, cyber-crime complaints, bail stages, cheque dishonour,
          consumer complaints, property and tenancy disputes, agreement
          enforcement, injunctions, commercial documents, succession papers and
          High Court steps in Hyderabad, read the focused guidance before
          sending an enquiry.
        </p>
        <div className="practice-feature-links">
          {focusedGuidanceLinks.map((link) => (
            <Link
              href={link.href}
              className="practice-feature-link"
              key={link.href}
            >
              <span>Read {link.label}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </div>
      <div className="practice-grid">
        {practiceAreas.map((a) => (
          <Link
            key={a.slug}
            href={`/practice/${a.slug}` as never}
            className="practice-card"
          >
            <span className="num">{a.num}</span>
            <span className="icon" aria-hidden="true">
              <PracticeIcon slug={a.slug} size={36} />
            </span>
            <h3>{a.shortName}</h3>
            <p>{a.oneLine}</p>
            <div className="learn">
              <span>{t("learnMore")}</span>
              <span aria-hidden="true">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
