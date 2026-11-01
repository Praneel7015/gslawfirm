import { getLocale } from "next-intl/server";
import { labelForPath } from "@/lib/localized-content";
import { guideUi } from "@/content/localized-guides";
import type { Locale } from "@/i18n/routing";
import { Link } from "@/i18n/routing";
import {
  focusedGuidanceIntro,
  focusedGuidanceLinks,
} from "@/content/focused-guidance";

type GuidanceLink = {
  href: string;
  label: string;
};

export async function FocusedGuidance({
  extraLinks = [],
  intro = focusedGuidanceIntro,
}: {
  extraLinks?: readonly GuidanceLink[];
  intro?: string;
}) {
  const locale = await getLocale() as Locale;
  const ui = guideUi[locale];
  const links: GuidanceLink[] = [...focusedGuidanceLinks, ...extraLinks];

  return (
    <div className="practice-feature">
      <div className="practice-feature-intro">
        <span>{ui.related}</span>
        <p>{locale === "en" ? intro : ui.answer}</p>
      </div>
      <div className="practice-feature-links">
        {links.map((link) => (
          <Link
            href={link.href as never}
            className="practice-feature-link"
            key={link.href}
          >
            <span>{locale === "en" ? link.label : labelForPath(link.href, locale)}</span>
            <span aria-hidden="true" className="practice-feature-arrow">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
