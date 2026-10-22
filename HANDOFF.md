# HANDOFF – start here

Last updated **2026-10-22** (end of session 1). Read this, then `CLAUDE.md` (conventions +
gotchas), then `ARCHITECTURE.md`.

## TL;DR

- **We Sell Bicycles** – a multi-page shop mockup (home, shop, product, cart, checkout,
  confirmation, about) plus the original buy site at `/we-buy`. Same hi-vis design as before.
- **Mock data only.** No Shopify yet, no payments. All 14 products are invented.
- **Live preview:** https://wesellbicycles.vercel.app – auto-deploys on every push to `main`.
- **Repo:** https://github.com/ssacchetti/wesellbicycles (public). In sync with GitHub except
  this rewritten HANDOFF.md, left uncommitted at end of session 1 – commit it with the next change.
- **Next big job:** wire up Shopify (plan below). Smaller open items further down.

## Where everything lives

| What | Where |
| --- | --- |
| This project | `~/Developer/wesellbicycles` |
| GitHub | `ssacchetti/wesellbicycles` – **public**. `ssacchetti` = the client's personal account; you push as collaborator **bwarren85** (`gh` CLI logged in, HTTPS). Repo-local git identity `bwarren85 <bwarren85@icloud.com>`; no global git identity is set on this Mac. |
| Vercel | Project `we-buy-bicycles-projects/wesellbicycles`, client's **Hobby** plan. Share `wesellbicycles.vercel.app`; `…-git-main-…vercel.app` links sit behind Vercel login. |
| Live old site | `ssacchetti/webuybicycles` / `~/Developer/webuybicycles` → webuybicycles.com.au. **Never touch it.** |

**Why the repo is public:** Vercel Hobby blocks deploys of commits by anyone other than the
account owner on *private* repos ("Deployment Blocked … Hobby Plan does not support
collaboration for private repositories"). Public fixed it.
- Going private later is fine **if nothing else needs pushing**: the live deployment keeps
  serving. New pushes by bwarren85 would be blocked; the owner can still Redeploy / Create
  Deployment from the Vercel dashboard.
- Before real orders: move to **Vercel Pro** (Hobby is non-commercial only). Pro + adding
  bwarren85 as a member also makes private-repo pushes deploy.

## Running it

```bash
npm run dev     # note: port 3000 was taken by something else last session – dev ran on 3001
npm run build   # 29 static routes; product pages prerendered
npm run lint    # clean
```

After replacing an image file under the same name, clear the image caches or you'll see the
old one: `rm -rf .next/dev/cache/images .next/cache/images`, restart dev, hard-refresh.

## What's built

| Route | What |
| --- | --- |
| `/` | "We Sell Bicycles." poster hero (parallax), shop marquee, Just in grid, category index, workshop/grades (dark), "we buy too" yellow band |
| `/shop` | Category tabs, filters (size, condition, price, brand, in stock), sort; state in the URL; mobile filter sheet; 2-up tiles on phones |
| `/shop/[handle]` | Gallery, A/B/C grade, size variants, add to cart + mobile sticky add bar, spec sheet, workshop note, related, Product JSON-LD |
| `/cart` + drawer | Slide-out drawer (opens on add / nav button) and full cart page |
| `/checkout` | Mock, laid out like Shopify's: contact → delivery (**Ship it / Pick up Melbourne**) → address → payment; summary; validation. Banner says no payment is taken. Header: logo → home, "← Cart" link |
| `/checkout/confirmation` | "Sorted." + receipt (sessionStorage mock order) |
| `/we-buy` | The original buy site, unchanged, WhatsApp form live (`PAUSED = false`) |
| `/about` | Story, service areas, contact – **placeholder copy** |

## Everything changed this session (git log, oldest first)

1. `6bca073` **Stack upgrade** – Next 14 → 16.4, React 19, Tailwind 3 → 4.3 (`@theme` in
   `globals.css`, no tailwind.config), ESLint 9. Fixed: faded colours (`text-ink/70` etc. never
   rendered on TW3), FAQ accordion animation, scroll padding under the paused nav strip.
   `next.config.mjs` lists `images.qualities` – Next 16 otherwise forces quality 75.
2. `c600a3d` **Shared hooks/config** – `useOnDark`, `useMounted/useEntered/useModal`,
   `useParallax`, `FormFields`, `lib/contact.ts`.
3. `0f20a14` **Data layer** – `lib/product.ts` (types/helpers, client-safe), `lib/shop.ts`
   (server-only swap point), `lib/catalogue.ts` (mock), `lib/cart.ts` (store), photos.
4. `cd8e257` **Pages** – home, shop, product, cart, about, /we-buy move, Nav/Footer, rebrand
   (OG, favicons "WS", JSON-LD, sitemap, robots).
5. `e052d44` **Checkout + confirmation.**
6. `acadd71` **Docs rewrite.**
7. *(part of 3–4)* **Product images in colour** – in-stock tiles/gallery/cart show colour;
   **sold** items are greyscale + faded and colourise on hover. Hero photos stay greyscale.
8. `3afb932` **Page-change scroll fix** – `<html data-scroll-behavior="smooth">` so Next jumps
   to the top on navigation (logo used to land mid-page in Safari).
9. `669c7df` **Melbourne-only pickup** for shop orders. Buy side still covers Melbourne + Geelong.
10. `906168f` **Checkout logo → home**, plus "← Cart" link.
11. `c4c3b1d` + this file – repo/Vercel notes.

Verified along the way with headless Chrome (puppeteer-core in the session scratchpad – not
kept): full purchase flow at 1440px and 390px with no page errors, no overflow at 320px,
reduced motion respected, PAUSED on/off hides/shows every buy-side CTA.

## Placeholders – not real yet

- **Products** (`lib/catalogue.ts`): names, specs, prices, grades, workshop notes – invented.
- **Photos**: Unsplash (free licence), IDs at top of `lib/catalogue.ts`. Bike galleries reuse part
  photos as "detail" shots. Four are nearly colourless even in colour (Acelane frameset, Zipp
  bars, SRAM crankset, Giant Contend) – optional swap for livelier shots.
- **Shipping** (`SHIPPING` in `lib/product.ts`): $29 parts, $99 when the cart has a whole bike,
  free Melbourne pickup. Framesets currently get **$29** (they're not "Bikes") – user agreed that's
  wrong-ish but parked it; real rates TBD.
- **Copy**: About page, "7-day returns", "New stock weekly", pickup-by-appointment wording.
- `INSTAGRAM_URL` still `@webuybicycles`; `SITE_URL` assumes `wesellbicycles.com.au` (no domain yet).

## Next: wiring Shopify

1. Client creates/confirms the Shopify store; get a **Storefront API** public token. Env vars
   (`SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_TOKEN`) – locally in `.env.local`, and in Vercel.
2. Products: implement the functions in `lib/shop.ts` with Storefront GraphQL, mapped to the
   existing `Product` type. Grade / year / specs / workshop note → **metafields**
   (e.g. `custom.condition_grade`). Keep product updates deploy-free: ISR `revalidate` and/or a
   Shopify webhook → on-demand revalidation route. Drop `dynamicParams = false`.
3. Cart: back `lib/cart.ts` with `cartCreate` / `cartLinesAdd` / `cartLinesUpdate` (store the cart
   id, not lines); `checkoutHref()` returns `cart.checkoutUrl`.
4. Checkout: **Shopify-hosted**. Use `/checkout` + `/checkout/confirmation` as the visual spec for
   Shopify's checkout branding (colours, fonts, zero radius), then delete both routes.

## Open decisions for the user

- Real shipping rates (incl. framesets / wheelsets), returns policy, pickup process.
- Brand handle + domain, Instagram.
- Whether general WhatsApp contact should also hide while `PAUSED` (currently stays visible –
  shop customers need it; PAUSED only gates the buy side now).
- Swap the four dull product photos? (optional, mockup only)
- Vercel Pro timing (needed before taking real orders).
