import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, ArrowRight } from "lucide-react";
import { Shell } from "@/components/site-shell";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Favorites — Treadly" }] }),
  component: FavPage,
});

function FavPage() {
  const { favs, toggleFav, addToCart } = useStore();
  return (
    <Shell>
      <section className="px-6 pb-16 md:px-10">
        <h1 className="font-display text-4xl font-extrabold tracking-tight">Your Favorites</h1>
        <p className="mt-1 text-sm text-neutral-500">
          {favs.length === 0 ? "No favorites yet — tap the heart on any shoe." : `${favs.length} saved.`}
        </p>

        {favs.length === 0 ? (
          <div className="mt-10 grid place-items-center rounded-3xl bg-[#f4f4f4] py-24">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-white ring-1 ring-black/10">
              <Heart className="h-6 w-6" />
            </div>
            <p className="mt-4 font-display text-xl font-bold">Nothing saved yet</p>
            <Link
              to="/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
            >
              Explore Shoes <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favs.map((p) => (
              <div
                key={p.id}
                className="group rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative rounded-xl bg-[#f4f4f4] p-4">
                  <button
                    onClick={() => toggleFav(p)}
                    className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 ring-1 ring-black/10 transition hover:scale-110"
                    aria-label="Remove favorite"
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </button>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                    Shoes
                  </p>
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-sm font-bold">${p.price}</p>
                  </div>
                  <div className="mt-2 aspect-[4/3]">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
                    />
                  </div>
                </div>
                <button
                  onClick={() => addToCart(p)}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-neutral-900 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-500"
                >
                  Add to Bag <ShoppingBag className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </Shell>
  );
}
