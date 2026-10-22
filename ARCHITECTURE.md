# ARCHITECTURE.md

How the We Sell Bicycles mockup fits together. Conventions and gotchas are in `CLAUDE.md`.

## Request flow

Everything is static. `next build` prerenders every route; product pages come from
`generateStaticParams` over `getProducts()`. There is no server at runtime beyond static file
serving – the client does filtering, the cart and the mock checkout.

```
app/layout.tsx            fonts · metadata · <JsonLd/> · <Analytics/>
├─ (site)/layout.tsx      <Nav/> <main>{page}</main> <Footer/> <CartDrawer/> <ToolbarBottomTint/>
│   ├─ page.tsx           server: awaits getFeatured/getProducts inside <JustIn/>
│   ├─ shop/page.tsx      server: getProducts() → <ShopBrowser products/> (client, URL state)
│   ├─ shop/[handle]      server: getProduct/getRelated → <ProductGallery/> <AddToCart/> (client)
│   ├─ cart, we-buy, about
└─ (checkout)/layout.tsx  minimal header
    ├─ checkout           <CheckoutForm/> (client) → placeOrder() → router.push(confirmation)
    └─ checkout/confirmation  <OrderConfirmation/> reads readLastOrder()
```

## Data

**Products** – `lib/product.ts` defines a trimmed Shopify Storefront shape:

```
Product { id, handle, title, vendor, productType: Category, tags, description,
          featuredImage, images[], priceRange.minVariantPrice, variants[],
          grade: "A"|"B"|"C", year, specs: [label, value][], workshopNote, listedAt }
ProductVariant { id, title, availableForSale, quantityAvailable, price, compareAtPrice,
                 selectedOptions: [{ name: "Size", value }] }
```

`grade`, `year`, `specs`, `workshopNote`, `listedAt` are flattened stand-ins for Shopify
metafields (`listedAt` ≈ `publishedAt`). Bikes have one variant with quantity 1; parts can have
size variants or quantities > 1.

`lib/shop.ts` (server-only) is the only module that knows where products come from. Today:
`lib/catalogue.ts`. Later: Storefront GraphQL with ISR.

**Cart** – `lib/cart.ts`. Module-scope `{ lines, open }` read through `useSyncExternalStore`
(server snapshot is empty, so SSR markup shows an empty cart and hydrates to the stored one).
Lines persist to localStorage. Each line carries `max` (quantity available at add time) to cap
the stepper and `isBike` to pick the boxed-bike shipping rate.

**Order (mock)** – `placeOrder` stashes an `Order` in sessionStorage (+ memory) and clears the
cart; the confirmation page reads it back. Shopify replaces this with its own order status page.

## Key abstractions

- `useOnDark(band, { onCompute, key })` – one rAF-throttled scroll listener that reports whether
  a `[data-nav-bg="dark"]` section overlaps a viewport band. Nav (top 56px), ToolbarBottomTint
  (bottom 8px), StickyMobileCTA and AddToCart's sticky bar (bottom ~80–90px).
- `useMounted` / `useEntered` / `useModal` – overlay lifecycle: mount → next-frame enter class →
  exit transition → unmount; body scroll lock + Esc.
- `useParallax()` – two-layer hero parallax, no-op under reduced motion.
- `ProductCard` – the ruled classified-ad tile used everywhere products appear.
- `CartLines` – line items for drawer (`compact`), cart page, checkout and receipt (`readOnly`).
- `FormFields` – `Field` / `SelectField` / `Req` with the yellow error strap.

## Third-party

- **Vercel Analytics** – `<Analytics/>` in the root layout; custom events `whatsapp_open`,
  `sticky_cta_tap`, `instagram_click`.
- **Radix Accordion** – FAQ.
- **WhatsApp** `wa.me` deep links – buy-side intake and general contact.
- **Shopify** – planned, not integrated.

## Environment variables

None yet. Shopify will need a store domain and a Storefront API token.

## Tech debt / notes

- Filtering is client-side over the full product list – fine for dozens of products; switch to
  Storefront search/filters if the catalogue grows to hundreds.
- `isJustIn` is evaluated at build time; with ISR it refreshes on revalidate.
- Heading/label typography repeats inline `fontVariationSettings` styles in several components
  (inherited pattern); a couple more `.display-*` utilities in `globals.css` would tidy it.
- `cn()` is used in newer components; older ones use template strings. Either is fine.
