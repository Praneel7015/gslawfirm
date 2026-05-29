/** Single source of truth for firm details (per build-prompt §5). */
export const firm = {
  name: "GS Law Firm",
  established: 2023,
  address: {
    line1: "Sri Ramnagar Block C",
    line2: "Kondapur, Gachibowli",
    city: "Hyderabad",
    region: "Telangana",
    postalCode: "500084",
    country: "IN",
    full: "Kondapur, Sri Ramnagar, Block C, Gachibowli, Hyderabad, Telangana 500084",
  },
  geo: { lat: 17.464, lng: 78.366 },
  phone: "+91 99638 47704",
  phoneE164: "+919963847704",
  whatsapp: "919963847704",
  email: "sunithags@gmail.com",
  publicEmail: "sunitha@sindhole.com",
  hours: "Monday–Saturday · 10:00 AM – 6:00 PM",
  hoursShort: "Mon–Sat · 10:00–18:00 IST",
  mapsUrl: "https://maps.app.goo.gl/HVwsKMdryv2yUWnn7",
  linkedin: "https://www.linkedin.com/in/sunitha-sindhole-074939212/",
  tagline: "For your peace of mind. Forever.",
  /**
   * Neighbourhoods we'll list under `areaServed` in LocalBusiness /
   * LegalService JSON-LD. Listed roughly in order of proximity to
   * Kondapur, Google parses this list for local-pack ranking and
   * "lawyers near me" intent matching.
   */
  areasServed: [
    "Kondapur",
    "Gachibowli",
    "Madhapur",
    "Hi-Tech City",
    "Kothaguda",
    "Manikonda",
    "Jubilee Hills",
    "Banjara Hills",
    "Nanakramguda",
    "Financial District",
    "Hyderabad",
    "Secunderabad",
  ],
} as const;

export type Firm = typeof firm;
