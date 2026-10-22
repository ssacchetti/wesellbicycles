"use client";

import Image from "next/image";
import Link from "next/link";
import { closeCart, removeLine, setQuantity, type CartLine } from "@/lib/cart";
import { formatPrice } from "@/lib/product";

/**
 * Line items, shared by the cart drawer and the /cart page. `compact`
 * tightens spacing for the drawer; `readOnly` drops the steppers for the
 * checkout summary.
 */
export default function CartLines({
  lines,
  compact = false,
  readOnly = false,
}: {
  lines: CartLine[];
  compact?: boolean;
  readOnly?: boolean;
}) {
  return (
    <ul className={compact ? "" : "border-t-[1.5px] border-ink"}>
      {lines.map((l) => (
        <li
          key={l.variantId}
          className={`grid grid-cols-[5.5rem_1fr_auto] gap-4 border-b-[1.5px] border-ink ${
            compact ? "py-4" : "py-5 sm:grid-cols-[8rem_1fr_auto] sm:gap-6 sm:py-6"
          }`}
        >
          <Link
            href={`/shop/${l.handle}`}
            onClick={closeCart}
            className="relative block aspect-[4/3] self-start overflow-hidden border-[1.5px] border-ink"
            tabIndex={-1}
            aria-hidden="true"
          >
            <Image src={l.image} alt="" fill sizes="8rem" quality={50} className="object-cover" />
          </Link>

          <div className="min-w-0">
            <p className="text-[0.85rem] text-ink/65">{l.vendor}</p>
            <Link
              href={`/shop/${l.handle}`}
              onClick={closeCart}
              className="block text-[1.15rem] uppercase leading-[1] hover:underline hover:decoration-accent hover:decoration-[3px] hover:underline-offset-4"
              style={{
                fontVariationSettings: '"wdth" 80, "opsz" 48',
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              {l.title}
            </Link>
            {l.variantTitle && (
              <p className="mt-1.5 font-mono text-[0.66rem] uppercase tracking-cap text-ink/60">
                Size {l.variantTitle}
              </p>
            )}

            {readOnly ? (
              <p className="mt-2 font-mono text-[0.7rem] uppercase tracking-cap text-ink/60">
                Qty {l.quantity}
              </p>
            ) : (
              <div className="mt-3 flex items-center gap-4">
                <Stepper line={l} />
                <button
                  type="button"
                  onClick={() => removeLine(l.variantId)}
                  className="font-mono text-[0.66rem] uppercase tracking-cap text-ink/60 underline-offset-4 hover:text-ink hover:underline"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          <p className="tabular text-right text-[0.95rem]">
            {formatPrice(l.price * l.quantity)}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Stepper({ line: l }: { line: CartLine }) {
  // One-of-a-kind items (every bike) can't go above 1 – show that plainly
  // rather than a dead + button.
  if (l.max <= 1) {
    return (
      <span className="font-mono text-[0.66rem] uppercase tracking-cap text-ink/60">
        One of one
      </span>
    );
  }
  const btn =
    "flex h-8 w-8 items-center justify-center text-[1rem] transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30";
  return (
    <div className="inline-flex items-center border-[1.5px] border-ink">
      <button
        type="button"
        className={btn}
        aria-label={`Decrease quantity of ${l.title}`}
        onClick={() => setQuantity(l.variantId, l.quantity - 1)}
      >
        −
      </button>
      <span className="tabular w-8 border-x-[1.5px] border-ink text-center text-[0.85rem] leading-8" aria-live="polite">
        {l.quantity}
      </span>
      <button
        type="button"
        className={btn}
        aria-label={`Increase quantity of ${l.title}`}
        disabled={l.quantity >= l.max}
        onClick={() => setQuantity(l.variantId, l.quantity + 1)}
      >
        +
      </button>
    </div>
  );
}
