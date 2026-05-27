import { getTranslations } from "next-intl/server";
import { firm } from "@/content/firm";
import { founder } from "@/content/founder";

export async function Founder() {
  const t = await getTranslations("founder");
  return (
    <section className="founder" id="founder">
      <div className="founder-portrait">
        <div className="founder-monogram">
          <div className="mono-meta">
            <span>Sole Advocate</span>
            <span>Hyderabad, IN</span>
          </div>
          <div className="mono-letters" aria-hidden="true">
            {founder.initials}
          </div>
          <div className="mono-tag">{t("portraitTag")}</div>
        </div>
      </div>
      <div className="founder-body">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h2>{founder.name}</h2>
        <div className="creds">{founder.credentials}</div>
        {founder.bioParagraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <dl className="founder-meta">
          <dt>{t("meta.barCouncil")}</dt>
          <dd>Telangana · Enrolment ANE/####/2014</dd>
          <dt>{t("meta.education")}</dt>
          <dd>{founder.education}</dd>
          <dt>{t("meta.languages")}</dt>
          <dd>{founder.languages.join(" · ")}</dd>
          <dt>{t("meta.profile")}</dt>
          <dd>
            <a href={firm.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn ↗
            </a>
          </dd>
        </dl>
      </div>
    </section>
  );
}
