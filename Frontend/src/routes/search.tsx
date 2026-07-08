import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/site-shell";
import { ProductFiltersPanel } from "@/components/product-filters";
import { useProductSearch, useBrands } from "@/hooks/use-products";
import { useStore, type Product } from "@/lib/store";
import { Heart, ShoppingBag } from "lucide-react";
import type { ProductFilters } from "@/lib/api";
import { buildPageMeta } from "@/lib/seo";

type SearchParams = {
  q?: string;
  category?: string;
  brand?: string;
  collection?: string;
};

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchParams => ({
    q: typeof s.q === "string" ? s.q : undefined,
    category: typeof s.category === "string" ? s.category : undefined,
    brand: typeof s.brand === "string" ? s.brand : undefined,
    collection: typeof s.collection === "string" ? s.collection : undefined,
  }),
  head: ({ match }) => {
    const { q, category, brand } = match.search as SearchParams;
    const label = brand
      ? `${brand} Luxury Shoes`
      : q
        ? `Luxury Shoes — ${q}`
        : category
          ? `${category} Luxury Shoes Collection`
          : "Shop All Luxury Shoes";

    return buildPageMeta({
      title: `${label} | Luxury Shoes`,
      description: `Browse ${label.toLowerCase()} at Luxury Shoes. Premium designer footwear with free shipping, easy returns and top brand quality.`,
      path: "/search",
    });
  },
  component: SearchPage,
});

const categoryNav: Record<string, string> = {
  Men: "male",
  Woman: "female",
  Children: "children",
  Popular: "popular",
};

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFav, isFav } = useStore();
  const fav = isFav(product.id);
  return (
    <div className="group flex h-full flex-col rounded-2xl bg-white p-3 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative rounded-xl bg-[#f4f4f4] p-4">
        <button
          onClick={() => toggleFav(product)}
          className="absolute right-3 bottom-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 ring-1 ring-black/10"
        >
          <Heart className={`h-4 w-4 ${fav ? "fill-red-500 text-red-500" : "text-neutral-500"}`} />
        </button>
        <Link to="/product/$id" params={{ id: product.id }}>
          <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Shoes</p>
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold line-clamp-1">{product.name}</p>
            <p className="text-sm font-bold">₹{product.price}</p>
          </div>
          <div className="mt-2 aspect-[4/3]">
            <img src={product.img} alt={product.name} className="h-full w-full object-contain" />
          </div>
        </Link>
      </div>
      <button
        onClick={() => addToCart(product)}
        className="mt-2 flex items-center justify-center gap-1 rounded-full bg-neutral-900 py-2 text-xs font-semibold text-white hover:bg-orange-500"
      >
        Add <ShoppingBag className="h-3 w-3" />
      </button>
    </div>
  );
}

function SearchPage() {
  const { q, category, brand, collection } = Route.useSearch();
  const [filters, setFilters] = useState<ProductFilters>({
    search: q,
    category: categoryNav[category ?? ""] ?? category,
    brand,
    collection,
  });

  const { data: products = [], isLoading } = useProductSearch(filters);
  const { data: brands = [] } = useBrands();

  const title = brand
    ? `${brand} Shoes`
    : q
      ? `Results for "${q}"`
      : category
        ? `${category} Collection`
        : "All Shoes";

  return (
    <Shell>
      <section className="px-6 pb-16 md:px-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {isLoading ? "Searching..." : `${products.length} products found`}
        </p>

        {brands.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {brands.map((b) => (
              <Link
                key={b.name}
                to="/search"
                search={{ brand: b.name }}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  brand === b.name
                    ? "bg-neutral-900 text-white"
                    : "bg-white text-neutral-700 ring-1 ring-black/10 hover:bg-neutral-900 hover:text-white"
                }`}
              >
                {b.name} ({b.count})
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
          <ProductFiltersPanel
            filters={filters}
            onChange={(f) =>
              setFilters({
                ...f,
                search: q,
                brand,
                collection: collection ?? f.collection,
                category: categoryNav[category ?? ""] ?? category ?? f.category,
              })
            }
          />
          <div>
            {isLoading ? (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="grid place-items-center rounded-3xl bg-[#f4f4f4] py-24 text-center">
                <p className="font-display text-xl font-bold">No shoes found</p>
                <p className="mt-1 text-sm text-neutral-500">Try adjusting your filters</p>
                <Link to="/" className="mt-4 text-sm font-semibold underline">
                  Back to shop
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </Shell>
  );
}
