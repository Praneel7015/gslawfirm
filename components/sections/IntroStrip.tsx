import { getTranslations } from "next-intl/server";

export async function IntroStrip() {
  const t = await getTranslations("intro");
  return (
    <section className="intro" id="about">
      <div className="intro-tag">{t("tag")}</div>
      <h2>{t("body")}</h2>
    </section>
  );
}
