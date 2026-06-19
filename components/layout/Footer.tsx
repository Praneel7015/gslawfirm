import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import { Lockup } from "@/components/brand/Lockup";
import { firm } from "@/content/firm";
import { practiceAreas } from "@/content/practice-areas";

export async function Footer() {
  const t = await getTranslations("footer");
  const year = new Date().getFullYear();

  return (
    <footer className="foot">
      <div className="foot-top">
        <div className="foot-col foot-brand">
          <Lockup />
          <p>{t("blurb")}</p>
        </div>

        <div className="foot-col">
          <h3>{t("columns.practice")}</h3>
          <ul>
            {practiceAreas.map((a) => (
              <li key={a.slug}>
                <Link href={`/practice/${a.slug}` as never}>{a.shortName}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="foot-col">
          <h3>{t("columns.firm")}</h3>
          <ul>
            <li>
              <Link href="/about">{t("links.about")}</Link>
            </li>
            <li>
              <Link href="/about#approach">{t("links.approach")}</Link>
            </li>
            <li>
              <SourceAwareContactLink>{t("links.contact")}</SourceAwareContactLink>
            </li>
            <li>
              <Link href="/disclaimer">{t("links.disclaimer")}</Link>
            </li>
            <li>
              <a href={firm.linkedin} target="_blank" rel="noopener noreferrer">
                {t("links.linkedin")}
              </a>
            </li>
          </ul>
        </div>

        <div className="foot-col">
          <h3>{t("columns.office")}</h3>
          <ul>
            <li>{firm.address.line1}</li>
            <li>
              {firm.address.line2}, {firm.address.postalCode}
            </li>
            <li>
              <a href={`tel:${firm.phoneE164}`}>{firm.phone}</a>
            </li>
            <li>
              <a href={`mailto:${firm.publicEmail}`}>{firm.publicEmail}</a>
            </li>
            <li>{firm.hoursShort}</li>
          </ul>
        </div>
      </div>

      <div className="foot-bot">
        <div className="foot-disc">{t("disclaim")}</div>
        <div>© {year} · {firm.name}</div>
      </div>
    </footer>
  );
}
