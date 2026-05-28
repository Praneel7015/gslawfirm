import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Future move: when client procures gslawfirm.in, only NEXT_PUBLIC_SITE_URL
  // changes; canonical URLs and the sitemap pick it up automatically.
  images: {
    formats: ["image/avif", "image/webp"],
  },
  typedRoutes: true,
};

export default withNextIntl(nextConfig);
