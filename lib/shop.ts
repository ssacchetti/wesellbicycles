// The shop's single data swap point (server-side).
//
// Wiring Shopify in later means replacing the bodies of the async functions
// below with Storefront GraphQL fetches (+ ISR revalidation) – nothing that
// imports from here should need to change. Right now every function
// resolves from the mock catalogue in lib/catalogue.ts.
//
// Client components import types/helpers from lib/product.ts instead, so
// fetch code (and the Storefront token) never reaches the browser bundle.

import "server-only";
import { catalogue } from "@/lib/catalogue";
import { isAvailable, sortProducts, type Product, type Sort } from "@/lib/product";

export * from "@/lib/product";

export async function getProducts(sort: Sort = "newest"): Promise<Product[]> {
  return sortProducts(catalogue, sort);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  return catalogue.find((p) => p.handle === handle);
}

/** Newest available stock, for the home page "Just in" grid. */
export async function getFeatured(limit = 4): Promise<Product[]> {
  return (await getProducts("newest")).filter(isAvailable).slice(0, limit);
}

/** Same category first, then anything else available. */
export async function getRelated(p: Product, limit = 4): Promise<Product[]> {
  const rest = (await getProducts("newest")).filter(
    (x) => x.handle !== p.handle && isAvailable(x)
  );
  const same = rest.filter((x) => x.productType === p.productType);
  const other = rest.filter((x) => x.productType !== p.productType);
  return [...same, ...other].slice(0, limit);
}
