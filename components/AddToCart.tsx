"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { addLine, useCart } from "@/lib/cart";
import { formatPrice, sizeOf, type Product } from "@/lib/product";
import { useOnDark } from "@/lib/use-on-dark";
import { useMounted } from "@/lib/use-transition";

/**
 * Size picker + Add to cart, plus a mobile sticky bar that takes over once
 * the inline button scrolls out of view. Both share the selected variant.
 *
 * The sticky bar follows StickyMobileCTA's iOS 26 Safari rules: the fixed
 * wrapper has no background (Safari samples fixed elements' bg for its
 * toolbar tint), the visual bar is an absolute child, and the whole thing
 * unmounts when hidden.
 */
export default function AddToCart({ product: p }: { product: Product }) {
  const { lines } = useCart();
  const firstAvailable = p.variants.find((v) => v.availableForSale) ?? p.variants[0];
  const [variantId, setVariantId] = useState(firstAvailable.id);
  const variant = p.variants.find((v) => v.id === variantId) ?? firstAvailable;
  const hasSizes = p.variants.length > 1;
  const soldOut = !p.variants.some((v) => v.availableForSale);

  const inCart = lines.find((l) => l.variantId === variant.id)?.quantity ?? 0;
  const maxedOut = inCart >= variant.quantityAvailable;
  const disabled = !variant.availableForSale || maxedOut;
  const label = soldOut
    ? "Sold"
    : !variant.availableForSale
      ? "Size sold out"
      : maxedOut
        ? "In your cart"
        : "Add to cart";

  const add = () => {
    if (!disabled) addLine(p, variant);
  };

  // Sticky bar: show once the inline button is scrolled past.
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [past, setPast] = useState(false);
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) =>
      setPast(!e.isIntersecting && e.boundingClientRect.top < 0)
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  const showBar = past && !soldOut;
  const barMounted = useMounted(showBar, 320);
  const onDark = useOnDark(() => [window.innerHeight - 90, window.innerHeight]);

  return (
    <div>
      {hasSizes && (
        <fieldset className="mb-5">
          <legend className="field-label">Size</legend>
          <div className="radio-row">
            {p.variants.map((v) => (
              <label key={v.id} className="radio-tile">
                <input
                  type="radio"
                  name="variant"
                  value={v.id}
                  checked={v.id === variant.id}
                  onChange={() => setVariantId(v.id)}
                />
                <span className={cn(!v.availableForSale && "text-ink/35 line-through")}>
                  {sizeOf(v)}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <button
        ref={buttonRef}
        type="button"
        onClick={add}
        disabled={disabled}
        className={cn(
          "w-full",
          disabled ? "btn-primary pointer-events-none opacity-40" : "btn-yellow"
        )}
      >
        {label}
        {!disabled && <span aria-hidden="true">→</span>}
      </button>

      {!soldOut && (
        <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-cap text-ink/60">
          {variant.quantityAvailable === 1
            ? "One of one – no restocks"
            : `${variant.quantityAvailable} available`}
        </p>
      )}

      {barMounted && (
        <div
          aria-hidden={!showBar}
          className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 md:hidden ${
            showBar ? "translate-y-0" : "translate-y-[140%]"
          }`}
        >
          <div
            style={{ bottom: "max(env(safe-area-inset-bottom), 0.75rem)" }}
            className={cn(
              "pointer-events-auto absolute left-1/2 flex w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 items-center justify-between gap-3 border-[1.5px] py-1.5 pl-4 pr-1.5 transition-colors duration-200",
              onDark ? "border-accent bg-ink text-paper" : "border-ink bg-paper text-ink"
            )}
          >
            <span className="min-w-0">
              <span className="block truncate text-[0.8rem] font-semibold uppercase">
                {p.title}
                {hasSizes && ` · ${sizeOf(variant)}`}
              </span>
              <span className="tabular text-[0.8rem]">{formatPrice(variant.price.amount)}</span>
            </span>
            <button
              type="button"
              onClick={add}
              disabled={disabled}
              className="shrink-0 border-[1.5px] border-ink bg-accent px-4 py-2.5 text-[0.82rem] font-bold uppercase tracking-[0.04em] text-ink disabled:opacity-40"
            >
              {disabled ? label : "Add"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
