import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { firm } from "@/content/firm";

export const metadata: Metadata = {
  title: `About · ${firm.name}`,
  description: "A small practice, kept small on purpose. Founded 2023 in Kondapur, Hyderabad.",
};

/** Stub — full content lands in M5. */
export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <section className="page-hero">
        <span className="eyebrow">About · {firm.name}</span>
        <h1>A small practice, kept small on purpose.</h1>
        <p className="lede">Founded in 2023 in Kondapur, Hyderabad. The firm undertakes criminal and civil matters as a solo-advocate practice — quietly, attentively, and with the same hand on every brief.</p>
        <p className="coming-soon">Full About copy — including founding story and the razorbill symbolism — lands in M5.</p>
      </section>
    </main>
  );
}
