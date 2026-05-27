import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";
import { practiceAreas } from "@/content/practice-areas";

export const metadata: Metadata = {
  title: `Practice · ${firm.name}`,
  description: "Five areas, one advocate. Criminal, civil, corporate, succession and High Court matters.",
};

/** Stub index — full detail pages live in M4. */
export default async function PracticeIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return (
    <main id="main">
      <section className="page-hero">
        <span className="eyebrow">Practice · {firm.name}</span>
        <h1>Areas of work.</h1>
        <p className="lede">Five areas, one advocate. Each matter receives the same attention from first hearing to final order.</p>
        <ul className="coming-soon" style={{ listStyle: "none", padding: 0, marginTop: 60 }}>
          {practiceAreas.map((a) => (
            <li key={a.slug} style={{ padding: "18px 0", borderTop: "1px solid var(--color-hair)" }}>
              <Link href={`/practice/${a.slug}` as never} style={{ textDecoration: "none" }}>
                {a.num} · {a.name} →
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
