import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { firm } from "@/content/firm";

export async function Location() {
  const t = await getTranslations("location");
  return (
    <section className="location" aria-labelledby="loc-title">
      <div className="map" aria-hidden="true">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4103.320794214401!2d78.34680497548479!3d17.460733183439118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcb930055175135%3A0x52aad47080e96964!2sGS%20Law%20Firm!5e1!3m2!1sen!2sin!4v1789882915076!5m2!1sen!2sin"
          width="100%"
          height="100%"
          style={{ border: 0, position: "absolute", inset: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          title="GS Law Firm office location on Google Maps"
        />
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
