"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import CartLines from "@/components/CartLines";
import { readLastOrder } from "@/lib/cart";
import { formatPrice } from "@/lib/product";
import { WHATSAPP_NUMBER } from "@/lib/contact";

// The last order doesn't change while this page is open, so a no-op
// subscribe is enough; readLastOrder returns a cached, stable object.
const noop = () => () => {};

export default function OrderConfirmation() {
  const order = useSyncExternalStore(noop, readLastOrder, () => null);

  const steps = order?.pickup
    ? [
        ["Check your inbox", `Receipt's on its way to ${order.email}.`],
        ["We'll WhatsApp you", "Within a few hours, to lock in a pickup time."],
        ["Come and get it", "We'll have it ready, tyres pumped. Bring nothing but yourself."],
      ]
    : [
        ["Check your inbox", order ? `Receipt's on its way to ${order.email}.` : "Your receipt's on its way."],
        ["We box it up", "Packed properly, usually within two business days."],
        ["Tracking lands", "You'll get a tracking link the moment it ships."],
      ];

  return (
    <div className="mx-auto max-w-page px-5 py-14 sm:px-8 sm:py-20 lg:px-12">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <span className="eyebrow">§ Order placed{order ? ` – ${order.number}` : ""}</span>
          <h1 className="display-mega mt-8 text-[clamp(3.6rem,13vw,10rem)]">
            <span className="block animate-fade-up opacity-0 [animation-delay:150ms]">
              <span className="highlight">Sorted</span>.
            </span>
          </h1>
          <p className="mt-6 max-w-prose text-[1.1rem] leading-relaxed text-ink/80">
            {order ? `Thanks ${order.name} – that one's yours.` : "Thanks – that one's yours."}{" "}
            Here&apos;s what happens next.
          </p>

          <ol className="mt-10 border-t-[1.5px] border-ink">
            {steps.map(([t, b], i) => (
              <li key={t} className="grid grid-cols-[3.5rem_1fr] gap-4 border-b-[1.5px] border-ink py-5">
                <span className="numeral text-[2.6rem] text-ink/25">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p
                    className="text-[1.3rem] uppercase leading-none"
                    style={{ fontVariationSettings: '"wdth" 80, "opsz" 48', fontWeight: 800 }}
                  >
                    {t}
                  </p>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-ink/70">{b}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/shop" className="btn-primary">
              Keep shopping <span aria-hidden="true">→</span>
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Questions? WhatsApp us
            </a>
          </div>
        </div>

        {/* Receipt */}
        {order && (
          <aside className="lg:col-span-5">
            <div className="border-[1.5px] border-ink bg-paper p-6 shadow-[8px_8px_0_var(--color-ink)]">
              <div className="flex items-baseline justify-between border-b-[1.5px] border-dashed border-ink pb-4">
                <span className="field-label mb-0">Receipt</span>
                <span className="tabular text-[0.85rem]">{order.number}</span>
              </div>
              <div className="mt-4">
                <CartLines lines={order.lines} compact readOnly />
              </div>
              <dl className="tabular mt-5 space-y-2 text-[0.88rem]">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatPrice(order.subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>{order.delivery.label}</dt>
                  <dd>{order.delivery.price === 0 ? "Free" : formatPrice(order.delivery.price)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex items-baseline justify-between border-t-[1.5px] border-dashed border-ink pt-4">
                <span className="field-label mb-0">Paid</span>
                <span className="numeral text-[2.4rem]">{formatPrice(order.total)}</span>
              </div>
              <p className="mt-3 font-mono text-[0.66rem] uppercase tracking-cap text-ink/50">
                Mock order – nothing was charged
              </p>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
