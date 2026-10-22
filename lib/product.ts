// Product types and pure helpers – safe to import from client components.
// Types mirror the Shopify Storefront API's Product / ProductVariant shape
// (trimmed to what the UI reads). Data access lives in lib/shop.ts.


export type Money = { amount: string; currencyCode: "AUD" };

export type Image = { url: string; altText: string; width: number; height: number };

export type SelectedOption = { name: string; value: string };

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: SelectedOption[];
};

/** Shop categories. In Shopify this is `productType`. */
export const CATEGORIES = ["Bikes", "Framesets", "Wheels", "Groupsets", "Parts"] as const;
export type Category = (typeof CATEGORIES)[number];

/** Condition grade – a metafield in Shopify (`custom.condition_grade`). */
export type Grade = "A" | "B" | "C";

export const GRADES: Record<Grade, { label: string; blurb: string }> = {
  A: { label: "Like new", blurb: "Barely used. No marks worth mentioning." },
  B: { label: "Ridden", blurb: "Light wear, honest marks. Mechanically spot on." },
  C: { label: "Character", blurb: "Visible wear and history. Rides properly." },
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: Category;
  tags: string[];
  description: string;
  featuredImage: Image;
  images: Image[];
  priceRange: { minVariantPrice: Money };
  variants: ProductVariant[];
  // Metafields – flattened here; `metafield(namespace, key)` in Storefront.
  grade: Grade;
  year: number | null;
  /** Ordered spec rows for the spec sheet. */
  specs: [label: string, value: string][];
  /** One-line workshop note: what we checked or replaced. */
  workshopNote: string;
  /** ISO date it was listed – drives "Just in". */
  listedAt: string;
};

export type Sort = "newest" | "price-asc" | "price-desc";

export const SORTS: { value: Sort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low–high" },
  { value: "price-desc", label: "Price, high–low" },
];

const JUST_IN_DAYS = 14;

export function price(p: Product): number {
  return Number(p.priceRange.minVariantPrice.amount);
}

export function isAvailable(p: Product): boolean {
  return p.variants.some((v) => v.availableForSale);
}

export function isJustIn(p: Product, now = Date.now()): boolean {
  return now - Date.parse(p.listedAt) < JUST_IN_DAYS * 86_400_000;
}

/** "Size" option values, e.g. frame sizes. Empty for one-size parts. */
export function sizeOf(v: ProductVariant): string | undefined {
  return v.selectedOptions.find((o) => o.name === "Size")?.value;
}

const aud = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD",
  maximumFractionDigits: 0,
});

export function formatPrice(amount: number | string): string {
  return aud.format(Number(amount));
}

export function sortProducts(list: Product[], sort: Sort): Product[] {
  const out = [...list];
  if (sort === "price-asc") out.sort((a, b) => price(a) - price(b));
  else if (sort === "price-desc") out.sort((a, b) => price(b) - price(a));
  else out.sort((a, b) => Date.parse(b.listedAt) - Date.parse(a.listedAt));
  // Sold items always sink to the bottom.
  return out.sort((a, b) => Number(isAvailable(b)) - Number(isAvailable(a)));
}

/** Flat-rate mock shipping. Shopify calculates this at checkout. */
export const SHIPPING = {
  ship: { label: "Ship Australia-wide", price: 29, note: "3–6 business days" },
  bikeShip: { label: "Ship Australia-wide (boxed bike)", price: 99, note: "5–8 business days" },
  melbourne: { label: "Pick up – Melbourne", price: 0, note: "Free, by appointment – address sent on WhatsApp" },
  geelong: { label: "Pick up – Geelong", price: 0, note: "Free, by appointment – address sent on WhatsApp" },
} as const;
export type ShippingKey = keyof typeof SHIPPING;
