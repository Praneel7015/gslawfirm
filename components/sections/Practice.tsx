import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { practiceAreas } from "@/content/practice-areas";
import { PracticeIcon } from "@/components/brand/practice-icons";

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
          For FIRs, bail stages, property papers, commercial documents,
          succession papers and High Court steps in Hyderabad, read the focused
          guidance before sending an enquiry.
        </p>
        <div className="practice-feature-links">
          <Link href="/criminal-defense" className="practice-feature-link">
            Read criminal-defense guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/bail" className="practice-feature-link">
            Read bail guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/property-disputes" className="practice-feature-link">
            Read property-dispute guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/commercial-contracts" className="practice-feature-link">
            Read commercial-contract guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/succession-probate" className="practice-feature-link">
            Read succession and probate guidance <span aria-hidden="true">→</span>
          </Link>
          <Link href="/high-court-matters" className="practice-feature-link">
            Read High Court guidance <span aria-hidden="true">→</span>
          </Link>
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
