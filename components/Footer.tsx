"use client";

import { track } from "@vercel/analytics";
import Link from "next/link";
import { PAUSED } from "@/lib/site-status";
import { INSTAGRAM_URL, WHATSAPP_NUMBER } from "@/lib/contact";

const navigate = [
  { href: "/shop", label: "Shop all" },
  { href: "/shop?category=Bikes", label: "Bikes" },
  { href: "/shop?category=Parts", label: "Parts" },
  { href: "/we-buy", label: "Sell us your bike" },
  { href: "/about", label: "About" },
  { href: "/cart", label: "Cart" },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer data-nav-bg="dark" className="bg-ink text-paper">
      <div className="mx-auto max-w-page px-5 pb-24 pt-16 sm:px-8 sm:pt-20 md:pb-0 lg:px-12 lg:pt-24">
        {/* Massive footer lock-up – last big chance to leave a mark */}
        <p className="display-mega text-[clamp(2.6rem,10.5vw,9.5rem)]">
          We Sell Bicycles
          <span className="text-accent">.</span>
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 border-t-[1.5px] border-paper/25 pt-10 md:grid-cols-12 md:gap-6">
          <div className="md:col-span-5">
            <p className="max-w-md text-[1rem] leading-relaxed text-paper/75">
              Used road bikes and parts, workshop-checked and priced
              straight. Pickup in Melbourne, or shipped
              Australia-wide.
            </p>
            <p className="mt-4 max-w-md text-[0.78rem] leading-relaxed text-paper/55">
              {PAUSED
                ? "We're not buying bikes right now – back soon."
                : "Got one to sell? We buy road bikes for cash, too."}
            </p>
          </div>

          <div className="md:col-span-3">
            <span className="font-mono text-[0.7rem] uppercase tracking-cap text-accent">
              Get in touch
            </span>
            <ul className="mt-3 space-y-2 text-[0.95rem]">
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                >
                  WhatsApp us →
                </a>
              </li>
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="We Sell Bicycles on Instagram"
                  onClick={() => track("instagram_click")}
                  className="inline-flex items-center gap-2 transition-colors hover:text-accent"
                >
                  <InstagramIcon />
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <span className="font-mono text-[0.7rem] uppercase tracking-cap text-accent">
              Navigate
            </span>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-[0.95rem]">
              {navigate.map((l) =>
                l.href === "/we-buy" && PAUSED ? null : (
                  <li key={l.href}>
                    <Link href={l.href} className="text-paper/85 hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-3 border-t border-paper/15 py-6 text-[0.74rem] text-paper/55 sm:flex-row sm:items-center">
          <span className="font-mono uppercase tracking-cap">
            © {year} We Sell Bicycles · Melbourne, AU
          </span>
          <span className="font-mono uppercase tracking-cap">
            wesellbicycles.com.au
          </span>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}
