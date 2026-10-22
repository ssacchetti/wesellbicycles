import type { Metadata } from "next";
import { Suspense } from "react";
import Reveal from "@/components/Reveal";
import ShopBrowser from "@/components/ShopBrowser";
import { getProducts, isAvailable } from "@/lib/shop";

export const metadata: Metadata = {
  title: "Shop Used Road Bikes & Parts",
  description:
    "Used road bikes, framesets, wheels, groupsets and parts – workshop-checked, graded honestly, priced straight. Melbourne pickup or shipped Australia-wide.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const products = await getProducts();
  const inStock = products.filter(isAvailable).length;

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-page px-5 pb-20 pt-12 sm:px-8 sm:pb-24 sm:pt-16 lg:px-12 lg:pb-32">
        <Reveal>
          <header className="reveal-fade mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">§ Shop – {inStock} in stock</span>
              <h1 className="display-mega mt-6 text-[clamp(3rem,10vw,8rem)]">
                The <span className="highlight">shop</span>.
              </h1>
            </div>
            <p className="max-w-sm text-[0.98rem] leading-relaxed text-ink/70">
              Road bikes and the parts that keep them rolling. Everything&apos;s
              been on the workshop stand and carries an honest A, B or C grade.
            </p>
          </header>
        </Reveal>

        {/* useSearchParams needs a Suspense boundary to keep this page static. */}
        <Suspense fallback={<div className="h-[60vh]" />}>
          <ShopBrowser products={products} />
        </Suspense>
      </div>
    </section>
  );
}
