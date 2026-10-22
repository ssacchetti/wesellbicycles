# CLAUDE.md

> **Read `HANDOFF.md` first** for where the project is and what's next. This folder is a
> disconnected copy of `~/Developer/webuybicycles` (**never modify that one** – it's the live
> buy-only site). No git remote, no Vercel link.

## What this is

**We Sell Bicycles** – a multi-page shop for used road bikes and parts (pickup in Melbourne,
shipping Australia-wide; the buy side covers Melbourne + Geelong),
with the original "We Buy Bicycles" cash-for-bikes site living on as the `/we-buy` page.

It is currently a **front-end mockup**: real pages and interactions, **mock data**. The shop
reads from `lib/catalogue.ts` through `lib/shop.ts`; Shopify (Storefront API + hosted checkout)
is the planned backend but is **not wired up**. Checkout is an on-brand mock that takes no
payment. Still no database, no API routes, no auth, no env vars, no tests.

Stack: **Next.js 16.4 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4.3**, npm.
Every route is statically prerendered (product pages via `generateStaticParams`).

## Commands

```bash
npm run dev     # http://localhost:3000
npm run build   # production build – all routes static
npm run start   # serve the build
npm run lint    # eslint . (flat config, eslint-config-next) – should be clean
```

No test suite. Verify UI changes by building and looking at the pages (see HANDOFF.md for the
screenshot/flow scripts used so far).

## Routes

```
app/
  layout.tsx                 Fonts, default metadata (title template "%s | We Sell Bicycles"),
                             site-wide <JsonLd/> (BicycleStore), <Analytics/>
  (site)/layout.tsx          Nav + main + Footer + CartDrawer + ToolbarBottomTint
  (site)/page.tsx            Home: HomeHero → MarqueeStrip(shop items) → JustIn → Graded → SellBand
  (site)/shop/page.tsx       Listing; <ShopBrowser/> in <Suspense> (useSearchParams)
  (site)/shop/[handle]/      Product page, Product JSON-LD, dynamicParams = false
  (site)/cart/page.tsx       <CartView/>
  (site)/we-buy/page.tsx     The old site: Hero → Marquee → HowItWorks → WhatWeBuy → SellForm → FAQ
                             + StickyMobileCTA + BuyJsonLd (FAQPage + Service)
  (site)/about/page.tsx      Placeholder copy – flagged in the file
  (checkout)/layout.tsx      Stripped header only (wordmark + "Secure checkout"), like Shopify's
  (checkout)/checkout/       <CheckoutForm/>          (mock)
  (checkout)/checkout/confirmation/  <OrderConfirmation/>
  error.tsx, not-found.tsx, robots.ts (disallows /cart, /checkout), sitemap.ts (all routes +
  products), icon.tsx / apple-icon.tsx / opengraph-image.tsx (next/og, "WS" / "We Sell Bicycles.")
```

## lib/

- `shop.ts` – **the Shopify swap point** (`import "server-only"`). `getProducts`, `getProduct`,
  `getFeatured`, `getRelated`. Replace their bodies with Storefront fetches; callers don't change.
  Re-exports everything from `product.ts`.
- `product.ts` – Storefront-shaped types (`Product`, `ProductVariant`, `Money`, `Image`) and pure
  helpers (`price`, `isAvailable`, `isJustIn`, `sizeOf`, `formatPrice`, `sortProducts`), plus
  `CATEGORIES`, `GRADES` (A/B/C condition), `SORTS`, `SHIPPING` (mock flat rates).
  **Client components import from here, never from `shop.ts`.**
- `catalogue.ts` – 14 mock products built via a `product()` helper; Unsplash IDs for every photo.
- `cart.ts` (`"use client"`) – cart store: module-scope state + `useSyncExternalStore`, persisted
  to localStorage (`wsb-cart-v1`). `useCart()`, `addLine`, `setQuantity`, `removeLine`,
  `openCart`/`closeCart`, `checkoutHref()` (swap point → Shopify `checkoutUrl`), mock
  `placeOrder`/`readLastOrder` (sessionStorage). **Don't import values from it into server
  components** – they'd arrive as client references.
- `contact.ts` – `WHATSAPP_NUMBER`, `INSTAGRAM_URL` (TODO: still the old handle), `SITE_URL`,
  `SITE_NAME`, `SERVICE_AREAS`.
- `site-status.ts` – `PAUSED` (currently `false`). See Gotchas.
- `use-on-dark.ts` – `useOnDark(band, { onCompute, key })`: the shared `data-nav-bg` scroll probe.
- `use-transition.ts` – `useMounted(open, ms)`, `useEntered(open)`, `useModal(open, onClose)` for
  overlays (menu, cart drawer, filter sheet).
- `use-parallax.ts` – `useParallax()` returns `{ section, image, headline }` refs for the two heroes.
- `faqs.ts` (FAQ section + FAQPage JSON-LD), `utils.ts` (`cn()`).

## Conventions

- **Components:** `export default function Name()`, one per file in `components/`, small helpers
  (icons, sub-pieces) as unexported functions in the same file. Prop types are inline literals.
  Exception: `components/FormFields.tsx` exports `Field`, `SelectField`, `Req` – shared by
  `SellForm` and `CheckoutForm`.
- **Props:** page sections still take no props where they don't need data. Data-driven pieces
  take what they render (`ProductCard product`, `CartLines lines`, `MarqueeStrip items?`).
- **`"use client"` only where needed.** Server: ProductCard, JustIn, Graded, SellBand, JsonLd,
  BuyJsonLd, WhatWeBuy, MarqueeStrip, all `page.tsx` files. Note ProductCard also renders inside
  the client `ShopBrowser`, so it must stay free of server-only imports.
- **No React Context.** Shared state is either the cart store (`lib/cart.ts`) or the DOM
  (`data-nav-bg`).
- **Motion respects `prefers-reduced-motion`**: the global override in `globals.css`, a
  `motion-reduce:` variant, or a `matchMedia` check (`useParallax`).
- **Copy/config** sits in module-scope constants at the top of the file that uses it; shared
  values go in `lib/contact.ts`.

## Styling (Tailwind 4)

- Tokens live in `@theme` in `app/globals.css` – colours (`paper`, `ink`, `muted`, `accent`,
  `rule`), `tracking-cap`, `max-w-page`/`max-w-prose`, `animate-*` + keyframes. There is **no
  `tailwind.config.ts`**. Opacity modifiers (`text-ink/70`, `bg-accent/15`) work now; they
  generated nothing under the old Tailwind 3 setup.
- Custom classes (`.display-mega`, `.display-tight`, `.numeral`, `.tabular`, `.eyebrow`,
  `.btn-primary|yellow|ghost`, `.field-*`, `.radio-tile`, `.highlight`, `.reveal-fade`, …) are in
  `@layer components`, so **utilities override them** (`btn-ghost py-2` works).
- Language: white / near-black / `#EAFF00`, 1.5px ink rules, zero radius, condensed Bricolage
  (`fontVariationSettings` wdth/opsz) for display, JetBrains Mono for labels, gapless ruled grids
  (parent draws top+left border, cells draw right+bottom – see ProductCard / HowItWorks).
- A big `.display-mega` + `.highlight` headline needs `mt-6`+ below an eyebrow, or the yellow
  strap overlaps it.

## Gotchas

- **`PAUSED` now gates the buy side only.** When true: `/we-buy` shows the "Back soon." hero,
  locked form, nav strip (on `/we-buy` only); the home SellBand, hero "Sell us yours", footer and
  About "sell" links disappear. General WhatsApp contact (footer, About, confirmation) **stays**,
  because shop customers need it. Never pause via 503 / noindex / robots.
- **iOS 26 Safari toolbar tint.** Safari samples `position: fixed/sticky` backgrounds near the
  viewport edges. Hence: Nav swaps paper/ink instead of going translucent; `ToolbarBottomTint`
  is an invisible 12px strip; fixed overlays (mobile menu, cart drawer, filter sheet, sticky
  CTAs) **unmount** when hidden (`useMounted`), and sticky bars put their background on an
  `absolute` child of a transparent fixed wrapper (`StickyMobileCTA`, `AddToCart`).
- **`data-nav-bg="dark"`** on every full-bleed dark section (Footer, MarqueeStrip, WhatWeBuy,
  Graded, product spec sheet, About "Two cities"). `useOnDark` reads it; components that
  persist across navigations pass `key: pathname`.
- **WhatsApp message uses `\r\n`** (`buildMessage()` in SellForm – iOS drops bare LF), and
  `window.open` stays synchronous in the submit handler (iOS 26 activation window).
- **Images:** hero photos (`hero.jpg`, `home-hero.jpg`) are greyscale files. Product photos in
  `public/products/` are **colour** and shown in colour. Sold items get `grayscale` + faded
  (ProductCard and the product gallery); ProductCard restores colour on hover/focus.
- **Favicon is 192×192** on purpose (Google wants multiples of 48).
