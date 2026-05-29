import Script from "next/script";

/**
 * Google Analytics 4, optional. Only renders if NEXT_PUBLIC_GA_ID
 * is set in env. Cloudflare Web Analytics is the primary; this is
 * available for clients who want GA4's deeper reporting too.
 *
 * Note: GA4 sets cookies, under India's DPDP Act 2023 you should
 * surface a consent notice before enabling it. We do NOT show a
 * banner today; only enable GA4 once a consent UX is in place.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  if (!id) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${id}', { anonymize_ip: true });`}
      </Script>
    </>
  );
}
