import { INSTAGRAM_URL, SERVICE_AREAS, SITE_NAME, SITE_URL } from "@/lib/contact";

// Site-wide schema.org entity, rendered in the root layout's <head>.
// A BicycleStore (a LocalBusiness subtype) with no fixed trading address
// or phone – Melbourne pickups are by appointment, arranged on WhatsApp.
// areaServed covers both cities because the buying side collects in both. Product
// pages emit their own Product graph; /we-buy adds FAQPage + Service
// (components/BuyJsonLd.tsx), which point back here via @id.

const store = {
  "@context": "https://schema.org",
  "@type": "BicycleStore",
  "@id": `${SITE_URL}/#business`,
  name: SITE_NAME,
  description:
    "Used road bikes and parts, workshop-checked and priced straight. Pickup in Melbourne or shipped Australia-wide. We also buy road bikes for cash across Melbourne and Geelong.",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image`,
  priceRange: "$$",
  currenciesAccepted: "AUD",
  areaServed: SERVICE_AREAS,
  address: { "@type": "PostalAddress", addressRegion: "VIC", addressCountry: "AU" },
  sameAs: [INSTAGRAM_URL],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Static, server-rendered, no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(store) }}
    />
  );
}
