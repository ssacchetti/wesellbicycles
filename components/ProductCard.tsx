// Classified-ad tile – colour photo; sold items grey out (colour on hover). Lives in a gapless grid whose parent draws the top +
// left rules; each card draws its own right + bottom rule, so the grid
// reads as one ruled sheet (same trick as HowItWorks' steps).

import Image from "next/image";
import Link from "next/link";
import {
  formatPrice,
  isAvailable,
  isJustIn,
  price,
  sizeOf,
  type Product,
} from "@/lib/product";

export default function ProductCard({
  product: p,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const available = isAvailable(p);
  const justIn = available && isJustIn(p);
  const compareAt = p.variants[0]?.compareAtPrice;
  const sizes = p.variants.map(sizeOf).filter(Boolean);
  const meta = [
    p.productType,
    sizes.length === 1 ? sizes[0] : sizes.length > 1 ? `${sizes.length} sizes` : null,
    p.year,
  ].filter(Boolean);

  return (
    <article className="group relative flex flex-col border-b-[1.5px] border-r-[1.5px] border-ink bg-paper transition-colors hover:bg-accent/15">
      <div className="relative aspect-[4/3] overflow-hidden border-b-[1.5px] border-ink bg-ink/5">
        <Image
          src={p.featuredImage.url}
          alt={p.featuredImage.altText}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, 50vw"
          quality={60}
          // In-stock photos show in full colour. Sold ones are greyed and
          // faded, and come back to colour on hover / keyboard focus.
          className={`object-cover transition-[filter,opacity] duration-500 ${
            available
              ? ""
              : "opacity-45 grayscale group-focus-within:opacity-100 group-focus-within:grayscale-0 group-hover:opacity-100 group-hover:grayscale-0"
          }`}
        />
        {justIn && (
          <span className="absolute left-0 top-2 border-y-[1.5px] border-r-[1.5px] border-ink bg-accent px-1.5 py-0.5 font-mono text-[0.58rem] uppercase tracking-cap text-ink sm:top-3 sm:px-2.5 sm:py-1 sm:text-[0.66rem]">
            Just in
          </span>
        )}
        {!available && (
          <span
            className="display-tight absolute inset-0 flex items-center justify-center text-[clamp(2.4rem,6vw,3.6rem)] text-ink"
            aria-hidden="true"
          >
            <span className="-rotate-6 border-[3px] border-ink bg-paper px-3 pb-0.5 pt-1.5 text-[1.8rem] sm:px-4 sm:pb-1 sm:pt-2 sm:text-[inherit]">Sold</span>
          </span>
        )}
        <span className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center border-[1.5px] border-ink bg-paper font-mono text-[0.68rem] text-ink sm:right-3 sm:top-3 sm:h-8 sm:w-8 sm:text-[0.78rem]">
          <span className="sr-only">Condition grade </span>
          {p.grade}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-3 sm:gap-4 sm:p-6">
        <div>
          <p className="truncate font-mono text-[0.58rem] uppercase tracking-[0.1em] text-ink/60 sm:text-[0.66rem] sm:tracking-cap">
            {meta.join(" · ")}
          </p>
          <h3 className="mt-2 leading-none">
            <span className="block text-[0.8rem] font-medium text-ink/70 sm:text-[0.95rem]">{p.vendor}</span>
            <Link
              href={`/shop/${p.handle}`}
              className="mt-1 block text-[1.1rem] uppercase leading-[0.95] after:absolute after:inset-0 after:content-[''] sm:text-[1.65rem]"
              style={{
                fontVariationSettings: '"wdth" 78, "opsz" 48',
                fontWeight: 800,
                letterSpacing: "-0.025em",
              }}
            >
              {p.title}
              {!available && <span className="sr-only"> (sold)</span>}
            </Link>
          </h3>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3">
          <p className="flex flex-wrap items-baseline gap-x-2">
            <span className={`numeral text-[1.35rem] sm:text-[1.9rem] ${available ? "" : "text-ink/45 line-through decoration-2"}`}>
              {formatPrice(price(p))}
            </span>
            {compareAt && available && (
              <span className="tabular text-[0.8rem] text-ink/50 line-through">
                {formatPrice(compareAt.amount)}
              </span>
            )}
          </p>
          <span
            aria-hidden="true"
            className="hidden h-9 w-9 shrink-0 items-center justify-center border-[1.5px] border-ink transition-colors group-hover:bg-ink group-hover:text-accent sm:flex"
          >
            <ArrowRight />
          </span>
        </div>
      </div>
    </article>
  );
}

function ArrowRight() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M2.5 7h9M7.5 3l4 4-4 4" />
    </svg>
  );
}
