import { Link } from "@/i18n/routing";
import { SourceAwareContactLink } from "@/components/legal/SourceAwareContactLink";
import {
  practiceHubLinks,
  servicePageExtraLinks,
  type HubLink,
} from "@/content/internal-links";

type RelatedItem = HubLink & { contact?: boolean };

/**
 * Sidebar related-links list. Merges page-specific links with the
 * shared hub map (resources / statistics) so new hub pages stay
 * reachable from focused guidance pages.
 */
export function RelatedPagesNav({
  pagePath,
  links,
  heading = "Related pages",
}: {
  /** Current service route, e.g. "/bail" — used to pull hub extras. */
  pagePath?: string;
  links: RelatedItem[];
  heading?: string;
}) {
  const extras: RelatedItem[] = [
    ...(pagePath ? (servicePageExtraLinks[pagePath] ?? []) : []),
    ...practiceHubLinks,
  ];
  const seen = new Set<string>();
  const merged: RelatedItem[] = [];

  for (const item of [...links, ...extras]) {
    const key = item.contact ? "__contact__" : item.href;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  return (
    <div className="pd-adj">
      <h3>{heading}</h3>
      <ul>
        {merged.map((item) =>
          item.contact ? (
            <li key="contact">
              <SourceAwareContactLink>Contact the firm</SourceAwareContactLink>
              <span aria-hidden="true">→</span>
            </li>
          ) : (
            <li key={item.href}>
              <Link href={item.href as never}>{item.label}</Link>
              <span aria-hidden="true">→</span>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
