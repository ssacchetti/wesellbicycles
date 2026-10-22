import type { Metadata } from "next";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import HowItWorks from "@/components/HowItWorks";
import WhatWeBuy from "@/components/WhatWeBuy";
import SellForm from "@/components/SellForm";
import FAQ from "@/components/FAQ";
import StickyMobileCTA from "@/components/StickyMobileCTA";
import BuyJsonLd from "@/components/BuyJsonLd";

// The original We Buy Bicycles site, now one page of the shop. Sections are
// unchanged; their #how-it-works / #what-we-buy / #sell / #faq anchors are
// page-local.

export const metadata: Metadata = {
  title: "Sell Your Road Bike for Cash – Melbourne & Geelong",
  description:
    "Sell your used road bike for cash across Melbourne and Geelong. Message us on WhatsApp, get a fair offer in under 12 hours, pickup at your door. No haggling, no consignment.",
  alternates: { canonical: "/we-buy" },
};

export default function WeBuyPage() {
  return (
    <>
      <BuyJsonLd />
      <Hero />
      <MarqueeStrip />
      <HowItWorks />
      <WhatWeBuy />
      <SellForm />
      <FAQ />
      <StickyMobileCTA />
    </>
  );
}
