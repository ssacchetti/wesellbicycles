"use client";

import Link from "next/link";
import CartLines from "@/components/CartLines";
import { checkoutHref, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/product";

export default function CartView() {
  const { lines, count, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="border-t-[1.5px] border-ink py-16 sm:py-24">
        <p className="display-mega text-[clamp(3rem,9vw,6.5rem)]">
          Nothing <span className="highlight">here</span> yet.
        </p>
        <p className="mt-5 max-w-prose text-[1.02rem] leading-relaxed text-ink/70">
          Every bike in the shop is one of one – if you see the right one,
          don&apos;t sit on it.
        </p>
        <Link href="/shop" className="btn-primary mt-10">
          Browse the shop
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
      <div className="lg:col-span-8">
        <CartLines lines={lines} />
        <Link href="/shop" className="btn-ghost mt-6">
          <span aria-hidden="true">←</span> Keep shopping
        </Link>
      </div>

      <aside className="lg:col-span-4">
        <div className="border-[1.5px] border-ink p-6 lg:sticky lg:top-24">
          <p className="field-label">Order summary</p>
          <dl className="mt-4 space-y-3 text-[0.95rem]">
            <div className="flex justify-between">
              <dt>Items ({count})</dt>
              <dd className="tabular">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink/70">
              <dt>Delivery</dt>
              <dd>Free pickup or from $29</dd>
            </div>
          </dl>
          <div className="mt-5 flex items-baseline justify-between border-t-[1.5px] border-ink pt-5">
            <span className="field-label mb-0">Subtotal</span>
            <span className="numeral text-[2.4rem]">{formatPrice(subtotal)}</span>
          </div>
          <p className="mt-1 text-[0.8rem] text-ink/60">AUD, GST included. Delivery chosen at checkout.</p>
          <Link href={checkoutHref()} className="btn-yellow mt-6 w-full">
            Checkout
            <span aria-hidden="true">→</span>
          </Link>
          <ul className="mt-6 space-y-2 border-t border-rule pt-5 text-[0.85rem] text-ink/75">
            {[
              "Workshop checked before it ships",
              "Free pickup in Melbourne or Geelong",
              "7-day returns if it's not as described",
            ].map((t) => (
              <li key={t} className="flex gap-3">
                <span aria-hidden="true" className="mt-[0.5em] h-[0.45em] w-[0.45em] shrink-0 bg-accent" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
