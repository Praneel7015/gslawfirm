/**
 * Root layout, minimal pass-through.
 * The real <html>/<body> with locale + fonts lives in app/[locale]/layout.tsx
 * because next-intl needs the locale before rendering the document shell.
 */
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
