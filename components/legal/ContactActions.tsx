import { getTranslations } from "next-intl/server";
import { firm } from "@/content/firm";
import { SourceAwareContactLink } from "./SourceAwareContactLink";

/** Put a source-aware enquiry and a direct call within reach of the page introduction. */
export async function ContactActions() {
  const t = await getTranslations("contactActions");
  return (
    <nav className="page-contact-actions" aria-label={t("label")}>
      <SourceAwareContactLink>{t("enquire")}</SourceAwareContactLink>
      <a href={`tel:${firm.phoneE164}`}>{t("call")}</a>
    </nav>
  );
}
