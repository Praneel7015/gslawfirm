/**
 * Renders one or more schema.org objects as a JSON-LD <script>.
 *
 * Always pass an object (or @graph wrapper) — never a JSX child.
 * Renders nothing if `data` is falsy so it's safe to spread
 * conditionally rendered nodes.
 */
export function JsonLd({ data }: { data: Record<string, unknown> | null }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      // schema.org strings are trusted (we author them); React's escaper
      // would mangle the @context URLs. dangerouslySetInnerHTML is the
      // standard pattern for JSON-LD in React.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
