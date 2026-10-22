// Home: newest available stock as a ruled 4-up sheet, plus a category
// index that reads like the section headings of a classifieds page.

import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES, getFeatured, getProducts, isAvailable } from "@/lib/shop";

export default async function JustIn() {
  const [featured, all] = await Promise.all([getFeatured(4), getProducts()]);
  const inStock = all.filter(isAvailable);
  const counts = CATEGORIES.map((c) => ({
    name: c,
    count: inStock.filter((p) => p.productType === c).length,
  }));

  return (
    <section className="relative border-b-[1.5px] border-ink bg-paper">
      <div className="mx-auto max-w-page px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-32">
        <Reveal>
          <header className="reveal-fade mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="eyebrow">§ 01 – Just in</span>
              <h2 className="display-mega mt-3 max-w-3xl text-[clamp(2.6rem,7.5vw,6rem)]">
                Fresh off <span className="text-muted">the stand.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[0.98rem] leading-relaxed text-ink/70">
              Every bike is one of one. When it&apos;s gone, it&apos;s gone –
              new stock lands most weeks.
            </p>
          </header>
        </Reveal>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.handle} product={p} priority={i < 2} />
          ))}
        </div>

        <div className="mt-8 flex justify-end">
          <Link href="/shop" className="btn-ghost">
            See all {inStock.length} in stock
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Category index */}
        <nav aria-label="Shop by category" className="mt-20 sm:mt-24">
          <span className="eyebrow">Shop by category</span>
          <ul className="mt-4 border-t-[1.5px] border-ink">
            {counts.map((c) => (
              <li key={c.name} className="border-b-[1.5px] border-ink">
                <Link
                  href={`/shop?category=${c.name}`}
                  className="group flex items-center justify-between gap-6 px-1 py-4 transition-colors hover:bg-accent sm:py-5"
                >
                  <span
                    className="text-[clamp(2rem,6vw,4rem)] uppercase leading-none"
                    style={{
                      fontVariationSettings: '"wdth" 75, "opsz" 96',
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {c.name}
                  </span>
                  <span className="flex items-center gap-4">
                    <span className="tabular text-[0.8rem] uppercase tracking-cap text-ink/60 group-hover:text-ink">
                      {c.count} in stock
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-[1.6rem] transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
