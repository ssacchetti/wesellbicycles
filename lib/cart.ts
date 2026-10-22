"use client";

// Cart store. No React Context (per codebase convention) – a tiny module-
// scope store read through useSyncExternalStore, persisted to localStorage.
//
// Shopify later: lines map 1:1 onto Storefront `cartLinesAdd` inputs
// (merchandiseId = variantId). `checkoutHref()` is the swap point – it
// becomes `cartCreate` → `cart.checkoutUrl` (Shopify-hosted checkout).

import { useSyncExternalStore } from "react";
import type { Product, ProductVariant } from "@/lib/product";

export type CartLine = {
  variantId: string;
  handle: string;
  title: string;
  vendor: string;
  /** Whole bikes ship boxed at a higher flat rate. */
  isBike: boolean;
  /** e.g. "56cm"; empty for one-size items. */
  variantTitle: string;
  price: number;
  image: string;
  quantity: number;
  /** quantityAvailable at add time – caps the stepper. */
  max: number;
};

type State = { lines: CartLine[]; open: boolean };

const KEY = "wsb-cart-v1";
const EMPTY: State = { lines: [], open: false };

let state: State = EMPTY;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) state = { lines: JSON.parse(raw) as CartLine[], open: false };
  } catch {
    // Private mode / blocked storage – start empty.
  }
}

function set(next: Partial<State>) {
  state = { ...state, ...next };
  if (next.lines) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state.lines));
    } catch {
      // Non-fatal: the cart still works for this page view.
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

function getSnapshot() {
  load();
  return state;
}

function getServerSnapshot() {
  return EMPTY;
}

export function useCart() {
  const s = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const count = s.lines.reduce((n, l) => n + l.quantity, 0);
  const subtotal = s.lines.reduce((n, l) => n + l.price * l.quantity, 0);
  return { lines: s.lines, open: s.open, count, subtotal };
}

export function addLine(p: Product, v: ProductVariant, quantity = 1) {
  load();
  const existing = state.lines.find((l) => l.variantId === v.id);
  const lines = existing
    ? state.lines.map((l) =>
        l.variantId === v.id
          ? { ...l, quantity: Math.min(l.max, l.quantity + quantity) }
          : l
      )
    : [
        ...state.lines,
        {
          variantId: v.id,
          handle: p.handle,
          title: p.title,
          vendor: p.vendor,
          isBike: p.productType === "Bikes",
          variantTitle: v.title === "Default Title" ? "" : v.title,
          price: Number(v.price.amount),
          image: p.featuredImage.url,
          quantity: Math.min(v.quantityAvailable, quantity),
          max: v.quantityAvailable,
        },
      ];
  set({ lines, open: true });
}

export function setQuantity(variantId: string, quantity: number) {
  const lines = state.lines
    .map((l) =>
      l.variantId === variantId
        ? { ...l, quantity: Math.max(0, Math.min(l.max, quantity)) }
        : l
    )
    .filter((l) => l.quantity > 0);
  set({ lines });
}

export function removeLine(variantId: string) {
  set({ lines: state.lines.filter((l) => l.variantId !== variantId) });
}

export function clearCart() {
  set({ lines: [] });
}

export function openCart() {
  set({ open: true });
}

export function closeCart() {
  set({ open: false });
}

/** Where "Checkout" goes. Shopify: return `cart.checkoutUrl` instead. */
export function checkoutHref() {
  return "/checkout";
}

/* -------------------------------------------------------------------------- */
/*  Mock order hand-off: checkout → confirmation page (sessionStorage).        */
/*  Shopify replaces all of this with its own order status page.              */
/* -------------------------------------------------------------------------- */
export type Order = {
  number: string;
  email: string;
  name: string;
  lines: CartLine[];
  subtotal: number;
  delivery: { label: string; price: number; note: string };
  pickup: boolean;
  total: number;
};

const ORDER_KEY = "wsb-last-order";
// In-memory copy so readLastOrder returns a stable object (it's read
// through useSyncExternalStore) and reflects the newest order immediately.
let lastOrder: Order | null | undefined;

export function placeOrder(order: Order) {
  lastOrder = order;
  try {
    window.sessionStorage.setItem(ORDER_KEY, JSON.stringify(order));
  } catch {
    // Confirmation falls back to a generic message.
  }
  set({ lines: [] });
}

export function readLastOrder(): Order | null {
  if (lastOrder !== undefined) return lastOrder;
  try {
    const raw = window.sessionStorage.getItem(ORDER_KEY);
    lastOrder = raw ? (JSON.parse(raw) as Order) : null;
  } catch {
    lastOrder = null;
  }
  return lastOrder;
}
