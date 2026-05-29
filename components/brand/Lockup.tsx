import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";
import { Mark } from "./Mark";
import { cn } from "@/lib/utils";

/**
 * Horizontal logo lockup: razorbill mark + wordmark + tagline.
 * Colors inherit from the parent via currentColor so the same component
 * works on dark (hero) and light (solid header / footer) backgrounds.
 */
export function Lockup({
  size = 36,
  className,
  showTag = true,
}: {
  size?: number;
  className?: string;
  showTag?: boolean;
}) {
  return (
    <Link href="/" className={cn("lockup", className)} aria-label={`${firm.name}, home`}>
      <Mark size={size} className="lockup-mark" />
      <span className="lockup-text">
        <span className="lockup-name">{firm.name}</span>
        {showTag && <span className="lockup-tag">{firm.tagline}</span>}
      </span>
    </Link>
  );
}
