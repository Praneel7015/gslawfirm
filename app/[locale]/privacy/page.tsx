import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { firm } from "@/content/firm";

export const metadata: Metadata = {
  title: `Privacy · ${firm.name}`,
  description: "Privacy notice for visitors to gslawfirm.in.",
};

/** Stub — full privacy policy text lands in M5. */
export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <section className="page-hero">
        <span className="eyebrow">Privacy · {firm.name}</span>
        <h1>Privacy notice.</h1>
        <p className="lede">We collect only what is necessary to respond to your enquiry. Full privacy notice text lands in M5 — reach us at {firm.publicEmail} with any concerns in the meantime.</p>
      </section>
    </main>
  );
}
