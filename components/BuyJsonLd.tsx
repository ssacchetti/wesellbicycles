import { faqs } from "@/lib/faqs";
import { SERVICE_AREAS, SITE_URL } from "@/lib/contact";

// Rendered on /we-buy only. Two schema.org graphs in one <script> tag:
//   - FAQPage  (uses the same source-of-truth FAQ list as the FAQ section)
//   - Service  ("used bicycle buying", provided by the site-wide store
//              entity that components/JsonLd.tsx emits)
// While PAUSED the page still renders this – the FAQ and the service
// description stay true; nothing here promises an intake is open.

const faqPage = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/we-buy#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const service = {
  "@type": "Service",
  "@id": `${SITE_URL}/we-buy#service`,
  name: "Used bicycle buying",
  serviceType: "Used bicycle purchase",
  description:
    "We buy used road bikes, frames, and high-end components for cash. Free pickup across the Melbourne and Geelong metros.",
  provider: { "@id": `${SITE_URL}/#business` },
  areaServed: SERVICE_AREAS,
  offers: {
    "@type": "Offer",
    description: "Free assessment, fair cash offer within 12 hours, free pickup.",
    priceCurrency: "AUD",
  },
};

export default function BuyJsonLd() {
  const graph = { "@context": "https://schema.org", "@graph": [faqPage, service] };
  return (
    <script
      type="application/ld+json"
      // Schema graphs are static, server-rendered, and contain no user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
