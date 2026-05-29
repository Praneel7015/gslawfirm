import localFont from "next/font/local";

/**
 * Helvetica Neue, verbatim from the Claude Design bundle.
 * Light 300, Regular 400, Bold 700, plus italics.
 *
 * Exposed as a CSS variable so Tailwind's @theme can resolve
 * `--font-display` / `--font-body` against it.
 */
export const helveticaNeue = localFont({
  src: [
    {
      path: "../public/fonts/HelveticaNeue-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/HelveticaNeue-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-helvetica",
  display: "swap",
  fallback: ["Helvetica", "Arial", "system-ui", "sans-serif"],
  preload: true,
});
