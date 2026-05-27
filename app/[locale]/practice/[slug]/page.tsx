import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { firm } from "@/content/firm";
import { practiceAreas, getPracticeArea } from "@/content/practice-areas";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    practiceAreas.map((a) => ({ locale, slug: a.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const area = getPracticeArea(slug);
  if (!area) return {};
  return {
    title: `${area.name} · ${firm.name}`,
    description: area.oneLine,
  };
}

/** Stub — full detail template (paragraphs, "what we handle", side CTA) lands in M4. */
export default async function PracticeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const area = getPracticeArea(slug);
  if (!area) notFound();

  return (
    <main id="main">
      <section className="page-hero">
        <span className="eyebrow">Practice · {area.num}</span>
        <h1>{area.name}.</h1>
        <p className="lede">{area.oneLine}</p>
        <p className="coming-soon">Full detail (paragraphs, what we handle, side CTA, adjacent areas) lands in M4.</p>
      </section>
    </main>
  );
}
