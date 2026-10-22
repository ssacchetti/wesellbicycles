"use client";

// MOCK CHECKOUT – design reference for Shopify's branded hosted checkout.
// Sections follow Shopify's order (Contact → Delivery (ship / Melbourne
// pickup) → Address → Payment,
// summary alongside) so the look maps 1:1 onto Checkout branding settings
// later. Nothing is charged or sent anywhere: submit validates, writes a
// mock order to sessionStorage, empties the cart and shows the
// confirmation page.

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";
import CartLines from "@/components/CartLines";
import { Field, SelectField } from "@/components/FormFields";
import { placeOrder, useCart } from "@/lib/cart";
import { SHIPPING, formatPrice, type ShippingKey } from "@/lib/product";

const STATES = ["VIC", "NSW", "ACT", "QLD", "SA", "WA", "TAS", "NT"];

type FormState = {
  email: string;
  news: boolean;
  delivery: "ship" | "melbourne";
  first: string;
  last: string;
  address: string;
  apartment: string;
  suburb: string;
  state: string;
  postcode: string;
  phone: string;
  card: string;
  expiry: string;
  cvc: string;
  cardName: string;
};

const EMPTY: FormState = {
  email: "",
  news: false,
  delivery: "ship",
  first: "",
  last: "",
  address: "",
  apartment: "",
  suburb: "",
  state: "VIC",
  postcode: "",
  phone: "",
  card: "",
  expiry: "",
  cvc: "",
  cardName: "",
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) e.email = "Need a valid email";
  if (!f.first.trim()) e.first = "First name";
  if (!f.last.trim()) e.last = "Last name";
  if (!/^[\d\s+()-]{8,}$/.test(f.phone.trim())) e.phone = "So we can reach you";
  if (f.delivery === "ship") {
    if (!f.address.trim()) e.address = "Street address";
    if (!f.suburb.trim()) e.suburb = "Suburb";
    if (!/^\d{4}$/.test(f.postcode.trim())) e.postcode = "4 digits";
  }
  if (f.card.replace(/\s/g, "").length < 15) e.card = "Card number looks short";
  if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(f.expiry.trim())) e.expiry = "MM / YY";
  if (!/^\d{3,4}$/.test(f.cvc.trim())) e.cvc = "3 or 4 digits";
  if (!f.cardName.trim()) e.cardName = "As it's printed";
  return e;
}

/** "4242424242424242" → "4242 4242 4242 4242" */
function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})(?=.)/g, "$1 ");
}

function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)} / ${d.slice(2)}` : d;
}

export default function CheckoutForm() {
  const router = useRouter();
  const { lines, subtotal } = useCart();
  const [f, setF] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [placing, setPlacing] = useState(false);

  const hasBike = lines.some((l) => l.isBike);
  const deliveryKey: ShippingKey =
    f.delivery === "ship" ? (hasBike ? "bikeShip" : "ship") : f.delivery;
  const delivery = SHIPPING[deliveryKey];
  const total = subtotal + delivery.price;

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setF((p) => ({ ...p, [key]: value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }));
  };

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate(f);
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`c-${first}`)?.focus();
      return;
    }
    setPlacing(true);
    placeOrder({
      number: `WSB-${Math.floor(10000 + Math.random() * 90000)}`,
      email: f.email.trim(),
      name: f.first.trim(),
      lines,
      subtotal,
      delivery,
      pickup: f.delivery !== "ship",
      total,
    });
    router.push("/checkout/confirmation");
  }

  if (lines.length === 0 && !placing) {
    return (
      <div className="mx-auto max-w-page px-5 py-20 sm:px-8 lg:px-12">
        <p className="display-mega text-[clamp(3rem,9vw,6rem)]">
          Cart&apos;s <span className="highlight">empty</span>.
        </p>
        <p className="mt-5 max-w-prose text-[1.02rem] leading-relaxed text-ink/70">
          Nothing to check out yet. Pick something from the shop first.
        </p>
        <Link href="/shop" className="btn-primary mt-10">
          Browse the shop <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-page grid-cols-1 lg:grid-cols-12">
      {/* Summary first on phones (collapsed), right column on desktop */}
      <aside className="border-b-[1.5px] border-ink bg-ink/[0.03] px-5 lg:bg-transparent py-6 sm:px-8 lg:order-2 lg:col-span-5 lg:border-b-0 lg:border-l-[1.5px] lg:px-10 lg:py-12">
        <details className="group lg:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between">
            <span className="font-mono text-[0.72rem] uppercase tracking-cap">
              <span className="group-open:hidden">Show</span>
              <span className="hidden group-open:inline">Hide</span> order summary
            </span>
            <span className="numeral text-[1.6rem]">{formatPrice(total)}</span>
          </summary>
          <div className="mt-5">
            <Summary id="m" lines={lines} subtotal={subtotal} delivery={delivery} total={total} />
          </div>
        </details>
        <div className="hidden lg:sticky lg:top-24 lg:block">
          <Summary id="d" lines={lines} subtotal={subtotal} delivery={delivery} total={total} />
        </div>
      </aside>

      <form onSubmit={onSubmit} noValidate className="px-5 py-10 sm:px-8 lg:order-1 lg:col-span-7 lg:py-12 lg:pl-12 lg:pr-12">
        <p className="mb-8 border-[1.5px] border-ink bg-accent px-4 py-3 font-mono text-[0.7rem] uppercase leading-relaxed tracking-cap">
          ▮ Mockup – no payment is taken. Shopify&apos;s checkout handles this for real.
        </p>

        {/* Express pay placeholders */}
        <div>
          <p className="field-label text-center">Express checkout</p>
          <div className="grid grid-cols-3 gap-2">
            {["Shop Pay", "Apple Pay", "Google Pay"].map((n) => (
              <button
                key={n}
                type="button"
                className="border-[1.5px] border-ink bg-ink py-3 text-[0.85rem] font-semibold uppercase tracking-[0.04em] text-paper transition-colors hover:bg-accent hover:text-ink"
              >
                {n}
              </button>
            ))}
          </div>
          <p className="my-8 flex items-center gap-4 font-mono text-[0.66rem] uppercase tracking-cap text-ink/50">
            <span className="h-px flex-1 bg-rule" />
            Or pay by card
            <span className="h-px flex-1 bg-rule" />
          </p>
        </div>

        <Step n={1} title="Contact">
          <Field
            id="c-email"
            label="Email"
            type="email"
            required
            value={f.email}
            onChange={(v) => update("email", v)}
            error={errors.email}
            autoComplete="email"
            placeholder="you@example.com"
          />
          <label className="mt-1 flex cursor-pointer items-center gap-3 text-[0.92rem]">
            <input
              type="checkbox"
              checked={f.news}
              onChange={(e) => update("news", e.target.checked)}
              className="h-4 w-4 accent-ink"
            />
            Tell me when new bikes land
          </label>
        </Step>

        <Step n={2} title="Delivery">
          <div role="radiogroup" aria-label="Delivery method" className="grid grid-cols-1 border-l-[1.5px] border-t-[1.5px] border-ink sm:grid-cols-2">
            {(
              [
                ["ship", hasBike ? SHIPPING.bikeShip : SHIPPING.ship],
                ["melbourne", SHIPPING.melbourne],
              ] as const
            ).map(([key, opt]) => {
              const active = f.delivery === key;
              return (
                <label
                  key={key}
                  className={cn(
                    "relative flex cursor-pointer flex-col gap-1 border-b-[1.5px] border-r-[1.5px] border-ink p-4 transition-colors",
                    active ? "bg-ink text-paper" : "bg-paper hover:bg-accent/20"
                  )}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={key}
                    checked={active}
                    onChange={() => update("delivery", key)}
                    className="peer sr-only"
                  />
                  <span className="text-[0.92rem] font-semibold uppercase leading-tight tracking-[0.03em]">
                    {key === "ship" ? "Ship it" : opt.label.replace("Pick up – ", "Pick up ")}
                  </span>
                  <span className={cn("tabular text-[0.85rem]", active ? "text-accent" : "")}>
                    {opt.price === 0 ? "Free" : formatPrice(opt.price)}
                  </span>
                  <span className={cn("text-[0.78rem] leading-snug", active ? "text-paper/70" : "text-ink/60")}>
                    {opt.note}
                  </span>
                  <span className="pointer-events-none absolute inset-0 hidden outline-2 -outline-offset-4 outline-accent peer-focus-visible:block" />
                </label>
              );
            })}
          </div>
        </Step>

        <Step n={3} title={f.delivery === "ship" ? "Shipping address" : "Who's collecting"}>
          <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field id="c-first" label="First name" required value={f.first} onChange={(v) => update("first", v)} error={errors.first} autoComplete="given-name" />
            <Field id="c-last" label="Last name" required value={f.last} onChange={(v) => update("last", v)} error={errors.last} autoComplete="family-name" />
          </div>
          {f.delivery === "ship" && (
            <>
              <Field id="c-address" label="Address" required value={f.address} onChange={(v) => update("address", v)} error={errors.address} autoComplete="address-line1" />
              <Field id="c-apartment" label="Apartment, unit (optional)" value={f.apartment} onChange={(v) => update("apartment", v)} autoComplete="address-line2" />
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-[2fr_1fr_1fr]">
                <div className="col-span-2 sm:col-span-1">
                  <Field id="c-suburb" label="Suburb" required value={f.suburb} onChange={(v) => update("suburb", v)} error={errors.suburb} autoComplete="address-level2" />
                </div>
                <SelectField id="c-state" label="State" required value={f.state} onChange={(v) => update("state", v)} options={STATES} />
                <Field id="c-postcode" label="Postcode" required value={f.postcode} onChange={(v) => update("postcode", v)} error={errors.postcode} autoComplete="postal-code" inputMode="numeric" maxLength={4} />
              </div>
            </>
          )}
          <Field
            id="c-phone"
            label={f.delivery === "ship" ? "Phone (for the courier)" : "Mobile (we'll WhatsApp to book a time)"}
            type="tel"
            required
            value={f.phone}
            onChange={(v) => update("phone", v)}
            error={errors.phone}
            autoComplete="tel"
            inputMode="tel"
          />
        </Step>

        <Step n={4} title="Payment">
          <div className="space-y-4 border-[1.5px] border-ink p-4 sm:p-5">
            <p className="mb-4 flex items-center justify-between font-mono text-[0.68rem] uppercase tracking-cap text-ink/60">
              Credit card
              <span>Visa · Mastercard · Amex</span>
            </p>
            <Field id="c-card" label="Card number" required value={f.card} onChange={(v) => update("card", formatCard(v))} error={errors.card} autoComplete="cc-number" inputMode="numeric" placeholder="1234 5678 9012 3456" />
            <div className="grid grid-cols-2 gap-x-5 gap-y-4">
              <Field id="c-expiry" label="Expiry" required value={f.expiry} onChange={(v) => update("expiry", formatExpiry(v))} error={errors.expiry} autoComplete="cc-exp" inputMode="numeric" placeholder="MM / YY" />
              <Field id="c-cvc" label="Security code" required value={f.cvc} onChange={(v) => update("cvc", v.replace(/\D/g, "").slice(0, 4))} error={errors.cvc} autoComplete="cc-csc" inputMode="numeric" placeholder="CVC" />
            </div>
            <Field id="c-cardName" label="Name on card" required value={f.cardName} onChange={(v) => update("cardName", v)} error={errors.cardName} autoComplete="cc-name" />
          </div>
        </Step>

        <button type="submit" disabled={placing} className="btn-yellow mt-4 w-full text-[1.05rem]">
          {placing ? "Placing order…" : `Pay ${formatPrice(total)}`}
          {!placing && <span aria-hidden="true">→</span>}
        </button>
        <p className="mt-4 text-center text-[0.8rem] text-ink/60">
          By paying you agree to our terms. 7-day returns if it&apos;s not as described.
        </p>
        <Link href="/cart" className="btn-ghost mt-8">
          <span aria-hidden="true">←</span> Back to cart
        </Link>
      </form>
    </div>
  );
}

/** Numbered checkout section – the numbers are a real sequence here. */
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <fieldset className="mb-10 border-t-[1.5px] border-ink pt-5">
      <legend className="float-left mb-5 flex w-full items-baseline gap-3">
        <span className="numeral text-[2rem] text-ink/25">{String(n).padStart(2, "0")}</span>
        <span
          className="text-[1.5rem] uppercase leading-none"
          style={{ fontVariationSettings: '"wdth" 80, "opsz" 48', fontWeight: 800, letterSpacing: "-0.02em" }}
        >
          {title}
        </span>
      </legend>
      <div className="clear-both space-y-4">{children}</div>
    </fieldset>
  );
}

function Summary({
  id,
  lines,
  subtotal,
  delivery,
  total,
}: {
  id: string;
  lines: ReturnType<typeof useCart>["lines"];
  subtotal: number;
  delivery: { label: string; price: number };
  total: number;
}) {
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState("");
  return (
    <div>
      <CartLines lines={lines} compact readOnly />
      <form
        className="mt-5 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setCodeMsg(code.trim() ? "That code isn't valid" : "");
        }}
      >
        <label htmlFor={`discount-${id}`} className="sr-only">
          Discount code
        </label>
        <input
          id={`discount-${id}`}
          className="field-input py-3"
          placeholder="Discount code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button type="submit" className="btn-primary shrink-0 px-5 py-3">
          Apply
        </button>
      </form>
      {codeMsg && (
        <p className="field-error" data-show="true" role="alert">
          {codeMsg}
        </p>
      )}
      <dl className="mt-6 space-y-2.5 text-[0.95rem]">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd className="tabular">{formatPrice(subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>{delivery.label}</dt>
          <dd className="tabular">{delivery.price === 0 ? "Free" : formatPrice(delivery.price)}</dd>
        </div>
      </dl>
      <div className="mt-5 flex items-baseline justify-between border-t-[1.5px] border-ink pt-5">
        <span className="field-label mb-0">Total</span>
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[0.7rem] text-ink/60">AUD</span>
          <span className="numeral text-[2.6rem]">{formatPrice(total)}</span>
        </span>
      </div>
      <p className="mt-1 text-right text-[0.78rem] text-ink/60">
        Includes {formatPrice(total / 11)} GST
      </p>
    </div>
  );
}
