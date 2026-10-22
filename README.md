# We Sell Bicycles

Used road bikes and parts, workshop-checked and priced straight – Melbourne & Geelong pickup or
shipped Australia-wide. The original **We Buy Bicycles** cash-for-bikes site lives on at `/we-buy`.

**Status:** front-end mockup on mock data. Shopify is the planned backend (see `HANDOFF.md`).

## Run locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build

```bash
npm run build    # every route prerenders statically
npm run start
npm run lint
```

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4. Deploy target is Vercel (no
project linked to this folder yet).

## Paused mode

**File:** `lib/site-status.ts` → `export const PAUSED = false;`

Set it to `true` to stop *buying* bikes while the shop keeps selling:

- `/we-buy` hero becomes "Back soon.", its form is blurred and locked, a "Paused" strip shows in
  the nav on that page, and the sticky "Sell your bike" pill and "send it anyway" nudges go.
- Every link into the buy side elsewhere disappears: the home "We buy, too" band, the home
  hero's "Sell us yours", footer and About "sell" links.
- The general WhatsApp contact (footer, About) stays – shop customers still need it.

Status code, titles, robots and sitemap don't change. Google's advice for a pause is to keep the
site up with reduced functionality rather than 503 / noindex
([Google: pause your online business](https://developers.google.com/search/docs/crawling-indexing/pause-online-business)).

## What to change, and where

| Thing | Where |
| --- | --- |
| Products (mock) | `lib/catalogue.ts` – replaced by Shopify via `lib/shop.ts` |
| Shipping rates (mock) | `SHIPPING` in `lib/product.ts` |
| Condition grade wording | `GRADES` in `lib/product.ts` |
| WhatsApp number, Instagram, domain | `lib/contact.ts` |
| Brand colours, type scale, buttons, fields | `app/globals.css` (`@theme` + `@layer components`) |
| Fonts | `app/layout.tsx` (next/font) + `public/fonts/` for OG images |
| Home sections | `components/HomeHero`, `JustIn`, `Graded`, `SellBand`; marquee items in `app/(site)/page.tsx` |
| Buy-page copy | `components/Hero`, `HowItWorks`, `WhatWeBuy`, `SellForm`, `lib/faqs.ts` |
| About copy (placeholder) | `app/(site)/about/page.tsx` |
| Hero photos | `public/home-hero.jpg` (home), `public/hero.jpg` (/we-buy) |
| Product photos | `public/products/<handle>.jpg` – 1200×900, colour |

### Images

All photos are Unsplash (free licence), self-hosted. The hero photos are saved **greyscale**.
Product photos are saved and shown in **colour**; sold items are greyed and faded with CSS and
come back to colour on hover. Source IDs are listed at the top of `lib/catalogue.ts`.

### Structured data

`components/JsonLd.tsx` (site-wide `BicycleStore`), `components/BuyJsonLd.tsx` (FAQPage +
Service on `/we-buy`), and an inline `Product` graph on each product page.

## Project structure

See `CLAUDE.md` for the route map, `lib/` modules, conventions and gotchas, and
`ARCHITECTURE.md` for how the pieces fit.

## Design direction

A loud hi-vis classified ad: pure white, near-black, one acid yellow (`#EAFF00`). Bricolage
Grotesque on its variable `wdth`/`opsz` axes – condensed and huge for display, normal width for
body – with JetBrains Mono for labels and SKU-style meta. 1.5px ink rules, zero radius, gapless
ruled grids, a yellow "highlighter" strap on one word of a headline, greyscale hero photography
with colour product shots.
