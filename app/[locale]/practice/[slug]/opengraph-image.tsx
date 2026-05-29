import { ImageResponse } from "next/og";

import { firm } from "@/content/firm";
import { getPracticeArea, practiceAreas } from "@/content/practice-areas";

/**
 * Per-area OG image, overrides the root default for each of the 5
 * practice detail pages. Generates at build time for all 5 areas ×
 * 3 locales (the area number + name are the only differentiators).
 */

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateImageMetadata({ params }: { params: { slug: string } }) {
  const area = getPracticeArea(params.slug);
  return [
    {
      id: params.slug,
      alt: `${area?.name ?? "Practice"} · ${firm.name}`,
      size,
      contentType,
    },
  ];
}

export async function generateStaticParams() {
  return practiceAreas.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: { slug: string } }) {
  const area = getPracticeArea(params.slug);
  const title = area?.name ?? "Practice";
  const num = area?.num ?? "-";
  const lede = area?.oneLine ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0a0a",
          color: "#ffffff",
          padding: "80px",
          fontFamily: "Helvetica, Arial, sans-serif",
        }}
      >
        {/* top, eyebrow + crumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "rgba(255,255,255,0.55)",
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          <span style={{ display: "block", width: 56, height: 1, background: "rgba(255,255,255,0.5)" }} />
          <span>{firm.name} · Practice · {num}</span>
        </div>

        {/* middle, area name + lede */}
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              fontSize: 108,
              lineHeight: 0.95,
              letterSpacing: -3,
              fontWeight: 300,
              maxWidth: 1000,
            }}
          >
            {title}.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              lineHeight: 1.4,
              color: "rgba(255,255,255,0.7)",
              maxWidth: 900,
            }}
          >
            {lede}
          </div>
        </div>

        {/* bottom, URL row */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", height: 2, width: 80, background: "#6B0F1A" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              fontSize: 22,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: 2,
            }}
          >
            <span>sunitha.sindhole.com/practice/{params.slug}</span>
            <span>Adv. Aitha Sunitha</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
