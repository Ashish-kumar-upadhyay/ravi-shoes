import { useState } from "react";
import { Star } from "lucide-react";
import type { ProductFilters } from "@/lib/api";

const COLORS = ["Crimson", "Amber", "Emerald", "Sky", "Violet"];
const SIZES = [40, 41, 42, 43, 44, 45];

type Props = {
  filters: ProductFilters;
  onChange: (f: ProductFilters) => void;
};

export function ProductFiltersPanel({ filters, onChange }: Props) {
  const [priceMin, setPriceMin] = useState(String(filters.minPrice ?? ""));
  const [priceMax, setPriceMax] = useState(String(filters.maxPrice ?? ""));

  const set = (patch: Partial<ProductFilters>) => onChange({ ...filters, ...patch });

  const applyPrice = () => {
    set({
      minPrice: priceMin ? Number(priceMin) : undefined,
      maxPrice: priceMax ? Number(priceMax) : undefined,
    });
  };

  return (
    <aside className="space-y-5 rounded-2xl bg-white p-5 ring-1 ring-black/5">
      <p className="font-display text-sm font-bold">Filters</p>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Price</p>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-neutral-900"
          />
          <input
            type="number"
            placeholder="Max"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full rounded-lg bg-neutral-100 px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-neutral-900"
          />
        </div>
        <button
          onClick={applyPrice}
          className="mt-2 w-full rounded-full bg-neutral-900 py-1.5 text-xs font-semibold text-white hover:bg-orange-500"
        >
          Apply
        </button>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Size</p>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => set({ size: filters.size === s ? undefined : s })}
              className={`h-9 w-10 rounded-lg text-xs font-semibold transition ${
                filters.size === s
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-800 hover:bg-neutral-200"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Color</p>
        <div className="flex flex-wrap gap-1.5">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => set({ color: filters.color === c ? undefined : c })}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filters.color === c
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">Rating</p>
        <div className="flex flex-wrap gap-1.5">
          {[4, 3].map((r) => (
            <button
              key={r}
              onClick={() => set({ minRating: filters.minRating === r ? undefined : r })}
              className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${
                filters.minRating === r
                  ? "bg-neutral-900 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {r}+ <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => {
          setPriceMin("");
          setPriceMax("");
          onChange({});
        }}
        className="w-full rounded-full py-2 text-xs font-semibold text-neutral-500 ring-1 ring-black/10 hover:bg-neutral-100"
      >
        Clear all filters
      </button>
    </aside>
  );
}
