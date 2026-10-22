# HANDOFF – start here

Updated 2026-10-22. Read this, then CLAUDE.md (conventions + gotchas), then ARCHITECTURE.md.

## Where this folder came from

- A copy of `~/Developer/webuybicycles` (the live webuybicycles.com.au), made 2026-10-22 for a
  rebuild. **Never modify `~/Developer/webuybicycles`** – it's still the production source.
- Full git history, `origin` removed, no `.vercel/`. Nothing pushes or deploys from here.

## What's been built (2026-10-22 session)

A complete **front-end mockup** of the new multi-page **We Sell Bicycles** site, in the original
design language, on mock data:

| Route | What |
| --- | --- |
| `/` | Home – "We Sell Bicycles." poster hero, shop marquee, Just in grid, category index, workshop/grades section, "we buy too" band |
| `/shop` | Listing – category tabs, filters (size, condition, price, brand, in stock), sort, URL state, mobile filter sheet |
| `/shop/[handle]` | Product – gallery, grade, size variants, add to cart, mobile sticky add bar, spec sheet, workshop note, related |
| `/cart` + drawer | Cart drawer (opens on add / nav button) and full cart page |
| `/checkout` | Mock checkout styled to map onto Shopify's: contact → delivery (ship / pickup Melb / pickup Geelong) → address → payment, summary, validation |
| `/checkout/confirmation` | "Sorted." + receipt |
| `/we-buy` | The original site, unchanged, form live |
| `/about` | Story / service areas / contact (**placeholder copy**) |

Also done:
- **Stack upgraded**: Next 14 → 16.4, React 18 → 19, Tailwind 3 → 4.3 (CSS-first `@theme`),
  ESLint 9 flat config installed (`npm run lint` is clean).
- **Fixed** the old review findings: faded colours (`text-ink/70` etc.) now render; the FAQ
  accordion animates; `scroll-padding-top` clears the paused nav strip.
- **Shared hooks** replaced the three copy-pasted `data-nav-bg` loops and the overlay mount logic.
- `PAUSED` set to **false** (the buy page shows the live form); toggling it still hides every
  buy-side CTA site-wide – verified.
- Rebrand bits: OG image / favicons say "We Sell", JSON-LD is a `BicycleStore` plus FAQ/Service
  on `/we-buy`, sitemap includes all products, robots disallows `/cart` + `/checkout`.

Verified: `npm run build` (29 static routes), lint clean, full purchase flow scripted in headless
Chrome at 1440px and 390px with no page errors, no horizontal overflow at 320px, reduced motion
disables marquee + parallax. Screenshot/flow scripts lived in the session scratchpad
(puppeteer-core + system Chrome) – not committed.

All of the above is committed on local `main` in six commits after `794e97b` (stack upgrade →
shared hooks → data layer → pages → checkout → docs). Only the last is verified to build on its
own. **No remote yet** – next step is a new GitHub repo.

## Not real yet / placeholders

- **All products** (`lib/catalogue.ts`) – names, specs, prices, grades, workshop notes invented.
- **Photos** – Unsplash (free licence), shown in colour; sold items greyed (colour on hover); source IDs listed in `lib/catalogue.ts`.
  Bike galleries reuse part photos as "detail" shots.
- **Checkout** takes no payment; shipping rates (`SHIPPING` in `lib/product.ts`: $29 parts,
  $99 boxed bike) and the "7-day returns" line are made up.
- **About page copy**, "New stock weekly", pickup-by-appointment wording – need confirming.
- `INSTAGRAM_URL` still points at `@webuybicycles`; `SITE_URL` assumes `wesellbicycles.com.au`.

## Next: wiring Shopify

1. Create/confirm the Shopify store; get a **Storefront API** public token. Add env vars
   (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`).
2. Products: implement `lib/shop.ts` functions with Storefront GraphQL (`products`, `product(handle)`),
   map to the existing `Product` type. Grade / year / specs / workshop note → **metafields**
   (`custom.condition_grade` etc.). Add `revalidate` (ISR) or on-demand revalidation via a Shopify
   webhook route. Drop `dynamicParams = false` once handles come from Shopify.
3. Cart: back `lib/cart.ts` with `cartCreate` / `cartLinesAdd` / `cartLinesUpdate` (keep the cart
   id in localStorage instead of lines); `checkoutHref()` returns `cart.checkoutUrl`.
4. Checkout: **Shopify-hosted**. Use `/checkout` + `/checkout/confirmation` as the visual spec in
   Shopify's checkout branding settings (colours, fonts, 0 radius), then delete both routes.
5. Create a new GitHub repo, add it as `origin`, push `main`; then a Vercel project and domain.

## Open decisions for the user

- Final brand handle/domain, Instagram.
- Real shipping rates, returns policy, pickup process.
- Whether the general WhatsApp contact should also hide while `PAUSED` (currently it stays).
