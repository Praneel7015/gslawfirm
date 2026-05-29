import { cn } from "@/lib/utils";

/**
 * Razorbill mark, uses CSS mask-image so we recolor via currentColor.
 * Same technique as the Claude Design canvas.
 */
export function Mark({
  size = 36,
  className,
  style,
}: {
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("mark", className)}
      style={{ width: size, height: size, ...style }}
    />
  );
}
