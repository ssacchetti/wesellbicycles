"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { PAUSED } from "@/lib/site-status";
import { openCart, useCart } from "@/lib/cart";
import { useOnDark } from "@/lib/use-on-dark";
import { useEntered, useModal, useMounted } from "@/lib/use-transition";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/we-buy", label: "We buy bikes" },
  { href: "/about", label: "About" },
];

/**
 * Nav flips between dark and light treatments based on whether the section
 * beneath it is marked `data-nav-bg="dark"`. Mobile shows wordmark + cart +
 * a hamburger that opens a fullscreen overlay menu.
 *
 * iOS 26 Safari samples this sticky header's background for its top
 * toolbar tint – that's why the bg swaps paper/ink rather than going
 * translucent.
 */
export default function Nav() {
  const pathname = usePathname();
  const onDark = useOnDark(() => [0, 56], { key: pathname });
  const [menuOpen, setMenuOpen] = useState(false);
  // Keep the fullscreen overlay mounted just long enough to play its
  // fade-out, then unmount. While unmounted Safari (iOS 26) can't sample
  // its bg-ink for toolbar tinting – opacity:0 alone isn't enough there.
  const menuMounted = useMounted(menuOpen, 220);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useModal(menuOpen, closeMenu);

  const onWeBuy = pathname.startsWith("/we-buy");

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-colors duration-200",
          onDark
            ? "border-b-[1.5px] border-accent bg-ink text-paper"
            : "border-b-[1.5px] border-ink bg-paper text-ink"
        )}
      >
        <div className="mx-auto flex max-w-page items-center gap-3 px-5 py-3 sm:px-8 lg:px-12">
          {/* Wordmark */}
          <Link
            href="/"
            aria-label="We Sell Bicycles – home"
            className="font-display shrink-0 text-[1.1rem] uppercase leading-none sm:text-[1.4rem]"
            style={{
              fontVariationSettings: '"wdth" 75, "opsz" 96',
              fontWeight: 800,
              letterSpacing: "-0.025em",
            }}
          >
            We Sell Bicycles
            <span className="text-accent">.</span>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-auto hidden items-center gap-7 md:flex">
            {links.map((l) => {
              const active = pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "font-mono text-[0.72rem] uppercase tracking-cap transition-colors",
                    "decoration-accent decoration-[3px] underline-offset-[6px]",
                    active && "underline",
                    onDark
                      ? "text-paper/80 hover:text-accent"
                      : "text-ink/70 hover:text-ink",
                    active && (onDark ? "text-paper" : "text-ink")
                  )}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-4">
            <CartButton onDark={onDark} />
            {/* Mobile hamburger */}
            <button
              type="button"
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center border-[1.5px] transition-colors md:hidden",
                onDark
                  ? "border-paper text-paper hover:bg-paper hover:text-ink"
                  : "border-ink text-ink hover:bg-ink hover:text-paper"
              )}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              onClick={() => setMenuOpen(true)}
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {/* Pause status strip – only where it's relevant, on the buy page.
            Sits BELOW the wordmark row so the header's top edge – what iOS
            26 Safari samples for its top-bar tint – keeps the usual
            paper/ink swap. */}
        {PAUSED && onWeBuy && (
          <p className="border-t-[1.5px] border-ink bg-accent px-5 py-2 text-center font-mono text-[0.68rem] uppercase tracking-cap text-ink">
            <span aria-hidden="true">▮ </span>
            Paused – not buying bikes right now
          </p>
        )}
      </header>

      {/* Mobile fullscreen menu – only mounted while opening / open / fading out */}
      {menuMounted && (
        <MobileMenu open={menuOpen} onClose={closeMenu} pathname={pathname} />
      )}
    </>
  );
}

function CartButton({ onDark }: { onDark: boolean }) {
  const { count } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart, ${count} ${count === 1 ? "item" : "items"}`}
      className={cn(
        "relative flex h-10 items-center gap-2 border-[1.5px] px-3 transition-colors",
        onDark
          ? "border-paper text-paper hover:bg-paper hover:text-ink"
          : "border-ink text-ink hover:bg-ink hover:text-paper"
      )}
    >
      <BagIcon />
      <span className="hidden font-mono text-[0.72rem] uppercase tracking-cap sm:inline">
        Cart
      </span>
      <span
        aria-hidden="true"
        className={cn(
          "tabular min-w-[1.4rem] px-1 text-center text-[0.72rem] leading-[1.4rem]",
          count > 0 ? "bg-accent text-ink" : onDark ? "bg-paper/15" : "bg-ink/10"
        )}
      >
        {count}
      </span>
    </button>
  );
}

function MobileMenu({
  open,
  onClose,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  pathname: string;
}) {
  // `open` flips immediately when the user clicks, but on first mount the
  // CSS transition has nothing to animate from. Mirror it on the next
  // frame so opacity actually transitions 0 → 1.
  const entered = useEntered(open);
  const items = [{ href: "/", label: "Home" }, ...links];

  return (
    <div
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-ink text-paper transition-opacity duration-200 md:hidden",
        entered
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0"
      )}
    >
      <div className="flex items-center justify-between border-b-[1.5px] border-paper/20 px-5 py-3 sm:px-8">
        <span className="font-mono text-[0.7rem] uppercase tracking-cap text-paper/70">
          Menu
        </span>
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center border-[1.5px] border-paper text-paper transition-colors hover:bg-paper hover:text-ink"
          aria-label="Close menu"
          onClick={onClose}
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="flex flex-1 flex-col justify-center gap-2 px-6 sm:px-10">
        {items.map((l, i) => {
          const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
          return (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              aria-current={active ? "page" : undefined}
              className={cn(
                "block text-[clamp(2.6rem,9vw,4rem)] transition-colors hover:text-accent",
                active && "text-accent",
                entered ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
              )}
              style={{
                fontVariationSettings: '"wdth" 80, "opsz" 96',
                fontWeight: 800,
                letterSpacing: "-0.025em",
                textTransform: "uppercase",
                lineHeight: 1,
                transition: `opacity 320ms cubic-bezier(.16,1,.3,1) ${
                  entered ? 80 + i * 60 : 0
                }ms, transform 320ms cubic-bezier(.16,1,.3,1) ${
                  entered ? 80 + i * 60 : 0
                }ms, color 180ms`,
              }}
            >
              {l.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => {
            onClose();
            openCart();
          }}
          className="mt-6 inline-flex w-fit items-center gap-2 border-[1.5px] border-accent bg-accent px-5 py-3 text-[0.95rem] font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-paper hover:bg-paper"
        >
          View cart →
        </button>
      </nav>
    </div>
  );
}

function BagIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 6.5h13l-1 11h-11l-1-11z" />
      <path d="M7 6.5V5a3 3 0 0 1 6 0v1.5" />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M3 6h14M3 14h14" />
    </svg>
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
