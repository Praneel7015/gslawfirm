import { ImageResponse } from "next/og";

import { firm } from "@/content/firm";

/**
 * Default OG image — applies to every page that doesn't ship its own
 * `opengraph-image.tsx`. Generated at request time via @vercel/og
 * (built into Next 15). Black background, white type, oxblood accent
 * — matches the design language.
 */

export const runtime = "nodejs";
export const alt = `${firm.name} · Advocate in Kondapur, Hyderabad`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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
        {/* top — eyebrow line + firm */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
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
            <span>{firm.name} · Est. {firm.established}</span>
          </div>
          <div style={{ fontSize: 24, color: "rgba(255,255,255,0.65)", letterSpacing: 2 }}>
            Kondapur · Hyderabad · India
          </div>
        </div>

        {/* middle — display heading */}
        <div
          style={{
            display: "flex",
            fontSize: 92,
            lineHeight: 1.02,
            letterSpacing: -2,
            fontWeight: 300,
            maxWidth: 1000,
          }}
        >
          Counsel that stays with you beyond the verdict.
        </div>

        {/* bottom — URL row with oxblood underline */}
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
            <span>sunitha.sindhole.com</span>
            <span>Adv. Sunitha Sindhole · Sole Advocate</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
