"use client";

import Link from "next/link";
import { checkoutHref, closeCart, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/product";
import { useEntered, useModal, useMounted } from "@/lib/use-transition";
import CartLines from "@/components/CartLines";

/**
 * Slide-out cart. Opened from the Nav cart button or by adding an item.
 * Fully unmounts when closed (after its 280ms exit) – same iOS 26 Safari
 * rule as the mobile menu: a fixed element left in the DOM gets sampled
 * for toolbar tinting even when invisible.
 */
export default function CartDrawer() {
  const { lines, open, count, subtotal } = useCart();
  const mounted = useMounted(open, 280);
  const entered = useEntered(open);
  useModal(open, closeCart);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Cart">
      <button
        type="button"
        aria-label="Close cart"
        tabIndex={-1}
        onClick={closeCart}
        className={`absolute inset-0 h-full w-full bg-ink/50 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      <aside
        className={`absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l-[1.5px] border-ink bg-paper text-ink transition-transform duration-300 ease-[cubic-bezier(.16,1,.3,1)] ${
          entered ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between border-b-[1.5px] border-ink px-5 py-3 sm:px-6">
          <p
            className="text-[1.6rem] uppercase leading-none"
            style={{
              fontVariationSettings: '"wdth" 75, "opsz" 96',
              fontWeight: 800,
              letterSpacing: "-0.025em",
            }}
          >
            Cart<span className="text-accent">.</span>{" "}
            <span className="tabular align-middle text-[0.8rem] font-normal tracking-normal text-ink/60">
              ({count})
            </span>
          </p>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center border-[1.5px] border-ink transition-colors hover:bg-ink hover:text-paper"
            aria-label="Close cart"
            onClick={closeCart}
            autoFocus
          >
            <CloseIcon />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col justify-center px-6">
            <p className="display-mega text-[3.4rem]">
              Nothing <span className="highlight">here</span> yet.
            </p>
            <p className="mt-4 text-[0.98rem] leading-relaxed text-ink/70">
              Every bike&apos;s one of a kind, so if you see it, grab it.
            </p>
            <Link href="/shop" onClick={closeCart} className="btn-primary mt-8 self-start">
              Browse the shop
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto overscroll-contain px-5 sm:px-6">
              <CartLines lines={lines} compact />
            </div>

            <footer className="border-t-[1.5px] border-ink px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)] pt-5 sm:px-6">
              <div className="flex items-baseline justify-between">
                <span className="field-label mb-0">Subtotal</span>
                <span className="numeral text-[2rem]">{formatPrice(subtotal)}</span>
              </div>
              <p className="mt-1 text-[0.82rem] text-ink/60">
                Shipping or free pickup – sorted at checkout.
              </p>
              <div className="mt-5 grid gap-3">
                <Link href={checkoutHref()} onClick={closeCart} className="btn-yellow w-full">
                  Checkout
                  <span aria-hidden="true">→</span>
                </Link>
                <Link href="/cart" onClick={closeCart} className="btn-ghost justify-center self-center py-2">
                  View full cart
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 5l10 10M15 5L5 15" />
    </svg>
  );
}
