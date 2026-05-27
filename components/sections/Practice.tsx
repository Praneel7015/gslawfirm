import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { practiceAreas, type PracticeSlug } from "@/content/practice-areas";

const ICONS: Record<PracticeSlug, React.ReactNode> = {
  criminal: (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="square">
      <line x1="6" y1="4" x2="6" y2="32" />
      <line x1="14" y1="4" x2="14" y2="32" />
      <line x1="22" y1="4" x2="22" y2="32" />
      <line x1="30" y1="4" x2="30" y2="32" />
      <line x1="3" y1="22" x2="33" y2="14" strokeWidth="1.2" />
    </svg>
  ),
  civil: (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M4 30 C 12 6, 24 6, 32 30" />
      <path d="M4 30 C 14 26, 22 26, 32 30" opacity=".55" />
      <circle cx="18" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
  corporate: (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="4" y="6" width="28" height="2" />
      <rect x="4" y="14" width="28" height="2" />
      <rect x="4" y="22" width="28" height="2" />
      <line x1="4" y1="30" x2="32" y2="30" />
      <line x1="14" y1="2" x2="14" y2="34" opacity=".4" />
      <line x1="22" y1="2" x2="22" y2="34" opacity=".4" />
    </svg>
  ),
  "will-succession": (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M18 4 L18 32" />
      <path d="M10 12 C 14 14, 22 14, 26 12" />
      <path d="M8 20 C 13 23, 23 23, 28 20" opacity=".7" />
      <path d="M6 28 C 12 32, 24 32, 30 28" opacity=".4" />
    </svg>
  ),
  "high-court": (
    <svg viewBox="0 0 36 36" width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M18 2 L18 34" />
      <path d="M18 6 L12 14 L18 22 L24 14 Z" opacity=".7" />
      <line x1="6" y1="14" x2="30" y2="14" opacity=".4" />
      <circle cx="18" cy="14" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  ),
};

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
      <div className="practice-grid">
        {practiceAreas.map((a) => (
          <Link
            key={a.slug}
            href={`/practice/${a.slug}` as never}
            className="practice-card"
          >
            <span className="num">{a.num}</span>
            <span className="icon" aria-hidden="true">
              {ICONS[a.slug]}
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
