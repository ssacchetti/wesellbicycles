"use client";

// Shop listing: category tabs, filters, sort, ruled product grid.
//
// Filtering happens client-side over the full product list (the page itself
// stays statically prerendered); state lives in the URL so filtered views
// are shareable and the back button works. With Shopify this list comes
// from `products(first: 250)` at build/ISR time – fine at this catalogue
// size; switch to Storefront `search`/filters if it grows past a few hundred.

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard";
import { useEntered, useModal, useMounted } from "@/lib/use-transition";
import {
  CATEGORIES,
  GRADES,
  SORTS,
  isAvailable,
  price,
  sizeOf,
  sortProducts,
  type Grade,
  type Product,
  type Sort,
} from "@/lib/product";

const PRICE_BANDS = [
  { value: "u500", label: "Under $500", test: (n: number) => n < 500 },
  { value: "500-1500", label: "$500 – $1,500", test: (n: number) => n >= 500 && n <= 1500 },
  { value: "1500", label: "$1,500+", test: (n: number) => n > 1500 },
] as const;

type Filters = {
  category: string;
  sort: Sort;
  sizes: string[];
  brands: string[];
  grades: string[];
  price: string;
  inStock: boolean;
};

function readFilters(sp: URLSearchParams): Filters {
  const list = (k: string) => sp.get(k)?.split(",").filter(Boolean) ?? [];
  const sort = sp.get("sort");
  return {
    category: sp.get("category") ?? "",
    sort: SORTS.some((s) => s.value === sort) ? (sort as Sort) : "newest",
    sizes: list("size"),
    brands: list("brand"),
    grades: list("grade"),
    price: sp.get("price") ?? "",
    inStock: sp.get("instock") === "1",
  };
}

export default function ShopBrowser({ products }: { products: Product[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const f = readFilters(sp);
  const [sheetOpen, setSheetOpen] = useState(false);

  const update = useCallback(
    (patch: Partial<Filters>) => {
      const next = { ...readFilters(new URLSearchParams(sp.toString())), ...patch };
      const q = new URLSearchParams();
      if (next.category) q.set("category", next.category);
      if (next.sort !== "newest") q.set("sort", next.sort);
      if (next.sizes.length) q.set("size", next.sizes.join(","));
      if (next.brands.length) q.set("brand", next.brands.join(","));
      if (next.grades.length) q.set("grade", next.grades.join(","));
      if (next.price) q.set("price", next.price);
      if (next.inStock) q.set("instock", "1");
      const qs = q.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [router, pathname, sp]
  );

  const inCategory = useMemo(
    () => (f.category ? products.filter((p) => p.productType === f.category) : products),
    [products, f.category]
  );

  // Filter options come from the current category, so a "Wheels" view
  // doesn't offer frame sizes that can't match anything.
  const options = useMemo(() => {
    const sizes = new Set<string>();
    const brands = new Set<string>();
    inCategory.forEach((p) => {
      brands.add(p.vendor);
      p.variants.forEach((v) => {
        const s = sizeOf(v);
        if (s) sizes.add(s);
      });
    });
    return {
      sizes: [...sizes].sort((a, b) => parseFloat(a) - parseFloat(b)),
      brands: [...brands].sort(),
    };
  }, [inCategory]);

  const results = useMemo(() => {
    const band = PRICE_BANDS.find((b) => b.value === f.price);
    return sortProducts(
      inCategory.filter(
        (p) =>
          (!f.sizes.length || p.variants.some((v) => f.sizes.includes(sizeOf(v) ?? ""))) &&
          (!f.brands.length || f.brands.includes(p.vendor)) &&
          (!f.grades.length || f.grades.includes(p.grade)) &&
          (!band || band.test(price(p))) &&
          (!f.inStock || isAvailable(p))
      ),
      f.sort
    );
  }, [inCategory, f.sizes, f.brands, f.grades, f.price, f.inStock, f.sort]);

  const activeCount =
    f.sizes.length + f.brands.length + f.grades.length + (f.price ? 1 : 0) + (f.inStock ? 1 : 0);
  const clearFilters = () =>
    update({ sizes: [], brands: [], grades: [], price: "", inStock: false });

  const filterPanel = (
    <FilterPanel f={f} options={options} update={update} activeCount={activeCount} onClear={clearFilters} />
  );

  return (
    <>
      {/* Category tabs – one ruled row, scrolls sideways on phones */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <div role="tablist" aria-label="Category" className="flex min-w-max border-[1.5px] border-ink sm:min-w-0">
          {["", ...CATEGORIES].map((c, i) => {
            const active = f.category === c;
            const count = c ? products.filter((p) => p.productType === c).length : products.length;
            return (
              <button
                key={c || "all"}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => update({ category: c, sizes: [], brands: [] })}
                className={cn(
                  "flex flex-1 items-center justify-center gap-2 whitespace-nowrap px-4 py-3.5 text-[0.9rem] font-medium uppercase tracking-[0.04em] transition-colors",
                  i > 0 && "border-l-[1.5px] border-ink",
                  active ? "bg-ink text-paper" : "bg-paper hover:bg-accent/30"
                )}
              >
                {c || "All"}
                <span className={cn("tabular text-[0.7rem]", active ? "text-accent" : "text-ink/50")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-b-[1.5px] border-ink pb-4">
        <p className="font-mono text-[0.72rem] uppercase tracking-cap text-ink/70" aria-live="polite">
          <span className="text-ink">{results.length}</span>{" "}
          {results.length === 1 ? "result" : "results"}
        </p>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSheetOpen(true)}
            className="inline-flex h-11 items-center gap-2 border-[1.5px] border-ink px-3.5 text-[0.85rem] font-medium uppercase tracking-[0.04em] transition-colors hover:bg-ink hover:text-paper lg:hidden"
          >
            Filters
            {activeCount > 0 && (
              <span className="tabular bg-accent px-1.5 text-[0.7rem] text-ink">{activeCount}</span>
            )}
          </button>
          <label className="sr-only" htmlFor="sort">
            Sort
          </label>
          <select
            id="sort"
            value={f.sort}
            onChange={(e) => update({ sort: e.target.value as Sort })}
            className="field-select h-11 w-auto py-0 text-[0.85rem] uppercase tracking-[0.04em]"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[15rem_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">
          <div className="sticky top-24">{filterPanel}</div>
        </aside>

        {results.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 self-start sm:gap-5 xl:grid-cols-3">
            {results.map((p, i) => (
              <ProductCard key={p.handle} product={p} priority={i < 2} />
            ))}
          </div>
        ) : (
          <div className="border-[1.5px] border-ink px-6 py-16 text-center">
            <p className="display-mega text-[clamp(2.4rem,6vw,4rem)]">
              Nothing <span className="highlight">matches</span>.
            </p>
            <p className="mx-auto mt-4 max-w-sm text-[0.98rem] leading-relaxed text-ink/70">
              New stock lands most weeks. Loosen a filter, or check back soon.
            </p>
            <button type="button" onClick={clearFilters} className="btn-primary mt-8">
              Clear filters
            </button>
          </div>
        )}
      </div>

      <FilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        resultCount={results.length}
      >
        {filterPanel}
      </FilterSheet>
    </>
  );
}

function FilterPanel({
  f,
  options,
  update,
  activeCount,
  onClear,
}: {
  f: Filters;
  options: { sizes: string[]; brands: string[] };
  update: (patch: Partial<Filters>) => void;
  activeCount: number;
  onClear: () => void;
}) {
  const toggle = (list: string[], v: string) =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <span className="field-label mb-0">Filter</span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="font-mono text-[0.66rem] uppercase tracking-cap text-ink/60 underline underline-offset-4 hover:text-ink"
          >
            Clear all
          </button>
        )}
      </div>

      <label className="flex cursor-pointer items-center justify-between gap-3 border-[1.5px] border-ink px-3.5 py-3">
        <span className="text-[0.9rem] font-medium uppercase tracking-[0.04em]">In stock only</span>
        <input
          type="checkbox"
          checked={f.inStock}
          onChange={(e) => update({ inStock: e.target.checked })}
          className="h-5 w-5 accent-ink"
        />
      </label>

      {options.sizes.length > 0 && (
        <FilterGroup legend="Size">
          <div className="flex flex-wrap gap-2">
            {options.sizes.map((s) => (
              <Chip key={s} active={f.sizes.includes(s)} onClick={() => update({ sizes: toggle(f.sizes, s) })}>
                {s}
              </Chip>
            ))}
          </div>
        </FilterGroup>
      )}

      <FilterGroup legend="Condition">
        <div className="flex flex-wrap gap-2">
          {(Object.keys(GRADES) as Grade[]).map((g) => (
            <Chip key={g} active={f.grades.includes(g)} onClick={() => update({ grades: toggle(f.grades, g) })}>
              {g} · {GRADES[g].label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup legend="Price">
        <div className="flex flex-col gap-2">
          {PRICE_BANDS.map((b) => (
            <Chip
              key={b.value}
              active={f.price === b.value}
              onClick={() => update({ price: f.price === b.value ? "" : b.value })}
              wide
            >
              {b.label}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup legend="Brand">
        <ul className="space-y-2">
          {options.brands.map((b) => (
            <li key={b}>
              <label className="flex cursor-pointer items-center gap-3 text-[0.95rem]">
                <input
                  type="checkbox"
                  checked={f.brands.includes(b)}
                  onChange={() => update({ brands: toggle(f.brands, b) })}
                  className="h-4 w-4 accent-ink"
                />
                {b}
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="border-t-[1.5px] border-ink pt-4">
      <legend className="field-label float-left mb-3 w-full">{legend}</legend>
      <div className="clear-both">{children}</div>
    </fieldset>
  );
}

function Chip({
  active,
  onClick,
  wide = false,
  children,
}: {
  active: boolean;
  onClick: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "border-[1.5px] border-ink px-3 py-2 text-[0.82rem] font-medium uppercase tracking-[0.04em] transition-colors",
        wide && "text-left",
        active ? "bg-ink text-paper" : "bg-paper hover:bg-accent/30"
      )}
    >
      {children}
    </button>
  );
}

/** Fullscreen filter sheet for phones/tablets. Unmounts when closed (iOS 26). */
function FilterSheet({
  open,
  onClose,
  resultCount,
  children,
}: {
  open: boolean;
  onClose: () => void;
  resultCount: number;
  children: React.ReactNode;
}) {
  const mounted = useMounted(open, 220);
  const entered = useEntered(open);
  useModal(open, onClose);
  if (!mounted) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Filters"
      className={cn(
        "fixed inset-0 z-50 flex flex-col bg-paper text-ink transition-[opacity,transform] duration-200 lg:hidden",
        entered ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="flex items-center justify-between border-b-[1.5px] border-ink px-5 py-3">
        <span className="font-mono text-[0.7rem] uppercase tracking-cap">Filters</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close filters"
          className="flex h-10 w-10 items-center justify-center border-[1.5px] border-ink transition-colors hover:bg-ink hover:text-paper"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
            <path d="M5 5l10 10M15 5L5 15" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-6">{children}</div>
      <div className="border-t-[1.5px] border-ink px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-4">
        <button type="button" onClick={onClose} className="btn-yellow w-full">
          Show {resultCount} {resultCount === 1 ? "result" : "results"}
        </button>
      </div>
    </div>
  );
}
