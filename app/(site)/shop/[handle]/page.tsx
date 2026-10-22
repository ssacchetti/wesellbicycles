import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import { SITE_URL } from "@/lib/contact";
import {
  GRADES,
  SHIPPING,
  formatPrice,
  getProduct,
  getProducts,
  getRelated,
  isAvailable,
  price,
} from "@/lib/shop";

type Params = { params: Promise<{ handle: string }> };

export async function generateStaticParams() {
  return (await getProducts()).map((p) => ({ handle: p.handle }));
}

// Only the catalogue's handles exist; anything else is a 404 at build time.
export const dynamicParams = false;

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = await getProduct((await params).handle);
  if (!p) return {};
  return {
    title: `${p.vendor} ${p.title}${p.year ? ` (${p.year})` : ""} – ${formatPrice(price(p))}`,
    description: p.description,
    alternates: { canonical: `/shop/${p.handle}` },
    openGraph: { images: [{ url: p.featuredImage.url, width: 1200, height: 900 }] },
  };
}

export default async function ProductPage({ params }: Params) {
  const p = await getProduct((await params).handle);
  if (!p) notFound();

  const available = isAvailable(p);
  const related = await getRelated(p, 4);
  const compareAt = p.variants[0]?.compareAtPrice;
  const shipping = p.productType === "Bikes" ? SHIPPING.bikeShip : SHIPPING.ship;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.vendor} ${p.title}`,
    brand: { "@type": "Brand", name: p.vendor },
    description: p.description,
    image: `${SITE_URL}${p.featuredImage.url}`,
    itemCondition: "https://schema.org/UsedCondition",
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/shop/${p.handle}`,
      priceCurrency: "AUD",
      price: p.priceRange.minVariantPrice.amount,
      availability: available ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      seller: { "@id": `${SITE_URL}/#business` },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        // Built from our own catalogue data, no user input.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b-[1.5px] border-ink bg-paper">
        <div className="mx-auto max-w-page px-5 pb-16 pt-8 sm:px-8 sm:pb-20 sm:pt-10 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-6 font-mono text-[0.68rem] uppercase tracking-cap text-ink/60">
            <Link href="/shop" className="hover:text-ink">Shop</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/shop?category=${p.productType}`} className="hover:text-ink">
              {p.productType}
            </Link>
            <span aria-hidden="true"> / </span>
            <span className="text-ink" aria-current="page">{p.title}</span>
          </nav>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">
              <ProductGallery images={p.images} sold={!available} />
            </div>

            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-24">
                <p className="text-[1.05rem] font-medium text-ink/70">
                  {p.vendor}
                  {p.year && <span className="tabular ml-2 text-[0.85rem] text-ink/50">{p.year}</span>}
                </p>
                <h1 className="display-mega mt-1 text-[clamp(2.6rem,6vw,4.6rem)]">{p.title}</h1>

                <div className="mt-6 flex items-end justify-between gap-4 border-y-[1.5px] border-ink py-5">
                  <p className="flex flex-wrap items-baseline gap-x-3">
                    <span className={`numeral text-[clamp(2.6rem,5vw,3.4rem)] ${available ? "" : "text-ink/40 line-through"}`}>
                      {formatPrice(price(p))}
                    </span>
                    {compareAt && available && (
                      <span className="tabular text-[0.9rem] text-ink/50">
                        <span className="sr-only">Was </span>
                        <span className="line-through">{formatPrice(compareAt.amount)}</span> new
                      </span>
                    )}
                  </p>
                  <div className="flex items-center gap-3 text-right">
                    <span className="hidden text-[0.85rem] leading-tight text-ink/70 sm:block">
                      Grade
                      <br />
                      <span className="font-semibold text-ink">{GRADES[p.grade].label}</span>
                    </span>
                    <span className="numeral flex h-14 w-14 items-center justify-center border-[1.5px] border-ink bg-accent text-[2.2rem]">
                      <span className="sr-only">Condition grade </span>
                      {p.grade}
                    </span>
                  </div>
                </div>

                <p className="mt-6 text-[1.02rem] leading-relaxed text-ink/80">{p.description}</p>

                <div className="mt-8">
                  <AddToCart product={p} />
                </div>

                <dl className="mt-8 border-t-[1.5px] border-ink text-[0.92rem]">
                  {[
                    ["Pick up", "Free – Melbourne, by appointment"],
                    ["Delivery", `${formatPrice(shipping.price)} Australia-wide · ${shipping.note}`],
                    ["Returns", "7 days if it's not as described"],
                  ].map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-rule py-3">
                      <dt className="font-mono text-[0.68rem] uppercase leading-[1.6rem] tracking-cap text-ink/60">{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spec sheet + workshop note */}
      <section data-nav-bg="dark" className="border-b-[1.5px] border-ink bg-ink text-paper">
        <div className="mx-auto grid max-w-page grid-cols-1 gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-7">
            <span className="font-mono text-[0.7rem] uppercase tracking-cap text-accent">Spec sheet</span>
            <dl className="mt-5 border-t-[1.5px] border-paper/25">
              {p.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 border-b-[1.5px] border-paper/25 py-3.5 sm:grid-cols-[11rem_1fr]">
                  <dt className="font-mono text-[0.72rem] uppercase leading-[1.6rem] tracking-cap text-paper/55">{k}</dt>
                  <dd className="text-[1rem]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="lg:col-span-5">
            <span className="font-mono text-[0.7rem] uppercase tracking-cap text-accent">On the stand</span>
            <div className="mt-5 border-[1.5px] border-accent p-6">
              <p className="display-tight text-[1.6rem] text-accent">Workshop note</p>
              <p className="mt-3 text-[1rem] leading-relaxed text-paper/85">{p.workshopNote}</p>
              <p className="mt-6 border-t-[1.5px] border-paper/25 pt-4 text-[0.9rem] leading-relaxed text-paper/70">
                <span className="text-paper">Grade {p.grade} – {GRADES[p.grade].label}.</span>{" "}
                {GRADES[p.grade].blurb}
              </p>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="bg-paper">
          <div className="mx-auto max-w-page px-5 py-16 sm:px-8 sm:py-20 lg:px-12">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="display-mega text-[clamp(2.2rem,5vw,3.6rem)]">You might also like.</h2>
              <Link href="/shop" className="btn-ghost hidden shrink-0 sm:inline-flex">
                Shop all <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {related.map((r) => (
                <ProductCard key={r.handle} product={r} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
