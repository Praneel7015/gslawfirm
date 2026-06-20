/**
 * Root layout, minimal pass-through.
 * The real <html>/<body> with locale + fonts lives in app/[locale]/layout.tsx
 * because next-intl needs the locale before rendering the document shell.
 */
import type { Metadata } from "next";

import "./globals.css";

import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
