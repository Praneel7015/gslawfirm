import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import { routing, type Locale } from "@/i18n/routing";
import { helveticaNeue } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import { firm } from "@/content/firm";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { DisclaimerModal } from "@/components/legal/DisclaimerModal";
import { WhatsAppFab } from "@/components/legal/WhatsAppFab";
import { MobileStickyBar } from "@/components/legal/MobileStickyBar";
import { CloudflareAnalytics } from "@/components/analytics/CloudflareAnalytics";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

function isLocale(value: string): value is Locale {
  return (routing.locales as readonly string[]).includes(value);
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${firm.name} · Adv. Aitha Sunitha (Sunitha Sindhole), Kondapur, Hyderabad`,
    template: `%s · ${firm.name}`,
  },
  description:
    "A solo-advocate practice in Kondapur, Hyderabad, led by Adv. Aitha Sunitha, also known as Sunitha Sindhole. Serving Kondapur, Gachibowli, Miyapur, Nallagandla and nearby Hyderabad localities.",
  alternates: {
    canonical: "/",
    languages: {
      "x-default": "/",
      en: "/",
      te: "/te",
      hi: "/hi",
    },
  },
  openGraph: {
    type: "website",
    siteName: firm.name,
    title: `${firm.name} · Adv. Aitha Sunitha (Sunitha Sindhole)`,
    description:
      "A solo-advocate practice in Kondapur, Hyderabad, led by Adv. Aitha Sunitha (Sunitha Sindhole).",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: `${firm.name} · Adv. Aitha Sunitha (Sunitha Sindhole)`,
    description: "A solo-advocate practice in Kondapur, Hyderabad, led by Adv. Aitha Sunitha (Sunitha Sindhole).",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
    shortcut: "/logo-mark.svg",
  },
  other: process.env.NEXT_PUBLIC_GSC_VERIFICATION
    ? { "google-site-verification": process.env.NEXT_PUBLIC_GSC_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  // next-intl 3.x: pass messages explicitly to the client provider.
  const messages = await getMessages();

  return (
    <html lang={locale} className={helveticaNeue.variable}>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          {children}
          <Footer />
          <WhatsAppFab />
          <MobileStickyBar />
          <DisclaimerModal />
        </NextIntlClientProvider>
        <CloudflareAnalytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
