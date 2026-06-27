import { Link } from "@/i18n/routing";
import {
  focusedGuidanceIntro,
  focusedGuidanceLinks,
} from "@/content/focused-guidance";

type GuidanceLink = {
  href: string;
  label: string;
};

export function FocusedGuidance({
  extraLinks = [],
  intro = focusedGuidanceIntro,
}: {
  extraLinks?: readonly GuidanceLink[];
  intro?: string;
}) {
  const links: GuidanceLink[] = [...focusedGuidanceLinks, ...extraLinks];

  return (
    <div className="practice-feature">
      <div className="practice-feature-intro">
        <span>Focused guidance</span>
        <p>{intro}</p>
      </div>
      <div className="practice-feature-links">
        {links.map((link) => (
          <Link
            href={link.href as never}
            className="practice-feature-link"
            key={link.href}
          >
            <span>{link.label}</span>
            <span aria-hidden="true" className="practice-feature-arrow">
              →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
