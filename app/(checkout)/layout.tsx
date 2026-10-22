import Link from "next/link";

// Checkout gets a stripped-back frame like Shopify's hosted checkout: the
// wordmark (home, same as everywhere else), a way back to the cart, and a
// secure note. No nav, footer or cart drawer to pull people out mid-purchase.
export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="sticky top-0 z-40 border-b-[1.5px] border-ink bg-paper">
        <div className="mx-auto flex max-w-page items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
          <Link
            href="/"
            aria-label="We Sell Bicycles – home"
            className="font-display text-[1.1rem] uppercase leading-none sm:text-[1.4rem]"
            style={{
              fontVariationSettings: '"wdth" 75, "opsz" 96',
              fontWeight: 800,
              letterSpacing: "-0.025em",
            }}
          >
            We Sell Bicycles<span className="text-accent">.</span>
          </Link>
          <div className="flex items-center gap-5">
            <Link
              href="/cart"
              className="font-mono text-[0.68rem] uppercase tracking-cap text-ink/70 underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              <span aria-hidden="true">← </span>Cart
            </Link>
            <span className="hidden items-center gap-2 font-mono text-[0.68rem] uppercase tracking-cap text-ink/70 sm:inline-flex">
              <LockIcon />
              Secure checkout
            </span>
          </div>
        </div>
      </header>
      <main className="min-h-[100svh] bg-paper">{children}</main>
    </>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <rect x="4" y="9" width="12" height="8.5" />
      <path d="M7 9V6.5a3 3 0 0 1 6 0V9" />
    </svg>
  );
}
