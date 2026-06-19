import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";

export async function Location() {
  const t = await getTranslations("location");
  return (
    <section className="location" aria-labelledby="loc-title">
      <div className="map" aria-hidden="true">
        <div className="map-grid" />
        <div className="map-roads">
          <svg viewBox="0 0 600 540" preserveAspectRatio="none">
            <path d="M0,140 Q200,180 400,120 T600,160" stroke="rgba(255,255,255,.18)" strokeWidth="1.2" fill="none" />
            <path d="M0,320 Q150,280 300,340 T600,300" stroke="rgba(255,255,255,.14)" strokeWidth="1" fill="none" />
            <path d="M0,460 Q200,420 400,500 T600,440" stroke="rgba(255,255,255,.10)" strokeWidth=".8" fill="none" />
            <path d="M120,0 Q160,200 100,420 T140,540" stroke="rgba(255,255,255,.10)" strokeWidth=".8" fill="none" />
            <path d="M320,0 Q280,180 360,360 T300,540" stroke="rgba(255,255,255,.14)" strokeWidth="1" fill="none" />
            <path d="M500,0 Q460,250 520,420 T480,540" stroke="rgba(255,255,255,.10)" strokeWidth=".8" fill="none" />
          </svg>
        </div>
        <a
          className="map-pin"
          href={firm.mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-hidden="true"
          tabIndex={-1}
        >
          <div className="ring" />
          <div className="ring r2" />
          <div className="dot" />
          <div className="label">{t("pinLabel")}</div>
        </a>
        <div className="map-attr">17.464°N · 78.366°E · Kondapur</div>
      </div>
      <div className="address">
        <span className="eyebrow">{t("eyebrow")}</span>
        <h3 id="loc-title">{t("heading")}</h3>
        <address className="addr-block">
          {firm.address.line1},
          <br />
          {firm.address.line2},
          <br />
          {firm.address.city}, {firm.address.region} {firm.address.postalCode}, India
        </address>
        <div className="address-row">
          <span className="k">{t("phone")}</span>
          <a className="v" href={`tel:${firm.phoneE164}`}>
            {firm.phone}
          </a>
        </div>
        <div className="address-row">
          <span className="k">{t("email")}</span>
          <a className="v" href={`mailto:${firm.publicEmail}`}>
            {firm.publicEmail}
          </a>
        </div>
        <div className="address-row">
          <span className="k">{t("hours")}</span>
          <span className="v">{firm.hoursShort}</span>
        </div>
        <div className="served-block" aria-label="Nearby areas served">
          <p className="served-copy">
            Serving Kondapur, Gachibowli, Madhapur, Miyapur, Nallagandla,
            Serilingampally, Hafeezpet, Tellapur, and nearby Hyderabad localities.
          </p>
          <ul className="served-list">
            {firm.areasServed.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <Link href="/kondapur-legal-services" className="served-link">
            Read about Kondapur legal services <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
