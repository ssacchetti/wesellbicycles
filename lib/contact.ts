// Contact details shared by SellForm, the About page and app/error.tsx.
// WhatsApp: international format, no '+', spaces or hyphens.
export const WHATSAPP_NUMBER = "61422880536";

// TODO: confirm the We Sell Bicycles handle – this is the old We Buy one.
export const INSTAGRAM_URL = "https://www.instagram.com/webuybicycles";

export const SITE_URL = "https://wesellbicycles.com.au";
export const SITE_NAME = "We Sell Bicycles";

// Two service areas – Melbourne metro and Geelong metro. A single radius
// from Melbourne can't cover Geelong without also sweeping in far-north
// suburbs we don't service, so each city gets its own GeoCircle. Used by
// both JSON-LD graphs (the store and the buying service).
export const SERVICE_AREAS = [
  {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: -37.8136, longitude: 144.9631 },
    geoRadius: 50000,
    description: "Greater Melbourne metropolitan area",
  },
  {
    "@type": "GeoCircle",
    geoMidpoint: { "@type": "GeoCoordinates", latitude: -38.1499, longitude: 144.3617 },
    geoRadius: 25000,
    description: "Greater Geelong and Bellarine area",
  },
];
