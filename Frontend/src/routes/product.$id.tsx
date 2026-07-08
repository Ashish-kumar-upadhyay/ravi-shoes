import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Minus, Plus } from "lucide-react";
import { Shell } from "@/components/site-shell";
import { useStore, useAuth } from "@/lib/store";
import { useProductDetail, useProductReviews, useSubmitReview } from "@/hooks/use-products";
import { productColors, productSizes } from "@/lib/products";
import { api } from "@/lib/api";
import { buildPageMeta, breadcrumbSchema, jsonLdScript, productSchema } from "@/lib/seo";

export const Route = createFileRoute("/product/$id")({
  loader: async ({ params }) => {
    try {
      return await api.getProduct(params.id);
    } catch {
      return null;
    }
  },
  head: ({ loaderData, params }) => {
    const product = loaderData?.product;
    if (!product) {
      return buildPageMeta({
        title: "Luxury Shoes — Product Not Found",
        description: "Browse our full collection of premium luxury shoes online.",
        path: `/product/${params.id}`,
        noindex: true,
      });
    }

    const slug = product.slug || product.id;
    const title = `${product.name} — Luxury Shoes | ₹${product.price}`;
    const description =
      product.description?.slice(0, 155) ||
      `Buy ${product.name} online at Luxury Shoes. Premium luxury footwear at ₹${product.price} with free shipping and easy returns.`;

    const page = buildPageMeta({
      title,
      description,
      path: `/product/${slug}`,
      image: product.img,
      type: "product",
    });

    return {
      ...page,
      scripts: [
        jsonLdScript(productSchema(product)),
        jsonLdScript(
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Luxury Shoes", path: "/search" },
            { name: product.name, path: `/product/${slug}` },
          ]),
        ),
      ],
    };
  },
  component: ProductDetail,
  notFoundComponent: () => (
    <Shell>
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <p className="font-display text-3xl font-bold">Product not found</p>
          <Link to="/" className="mt-4 inline-block text-sm underline">Back to shop</Link>
        </div>
      </div>
    </Shell>
  ),
});

function ProductDetail() {
  const { id } = Route.useParams();
  const router = useRouter();
  const { data, isLoading, isError } = useProductDetail(id);
  const { data: reviews = [] } = useProductReviews(id);
  const { addToCart, toggleFav, isFav } = useStore();
  const { user } = useAuth();
  const submitReview = useSubmitReview(id);

  const [color, setColor] = useState(productColors[0].hex);
  const [size, setSize] = useState<number | null>(42);
  const [qty, setQty] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  if (isLoading) {
    return (
      <Shell>
        <div className="mx-4 animate-pulse space-y-6 p-10 md:mx-10">
          <div className="h-8 w-32 rounded bg-neutral-200" />
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-96 rounded-3xl bg-neutral-200" />
            <div className="h-96 rounded-3xl bg-neutral-200" />
          </div>
        </div>
      </Shell>
    );
  }

  if (isError || !data) {
    return (
      <Shell>
        <div className="grid min-h-[60vh] place-items-center px-6 text-center">
          <div>
            <p className="font-display text-3xl font-bold">Product not found</p>
            <Link to="/" className="mt-4 inline-block text-sm underline">Back to shop</Link>
          </div>
        </div>
      </Shell>
    );
  }

  const { product, related } = data;
  const colors = product.colors?.length ? product.colors : productColors;
  const sizes = product.sizes?.length ? product.sizes : productSizes;
  const fav = isFav(product.id);
  const avgRating = product.rating ?? 4.7;

  return (
    <Shell>
      <div className="mx-4 mb-8 sm:mx-6 md:mx-10">
        <button
          onClick={() => router.history.back()}
          className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-neutral-600 transition hover:text-neutral-900"
        >
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </button>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
          <div className="relative overflow-hidden rounded-3xl bg-[#f4f4f4] p-6 md:p-10">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Shoes</p>
            <p className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{product.name}</p>
            <div className="relative mt-4 grid min-h-[320px] place-items-center md:min-h-[440px]">
              <img
                key={color}
                src={product.img}
                alt={product.name}
                className="w-[85%] max-w-[520px] drop-shadow-2xl animate-[fadeIn_0.5s_ease-out]"
                style={{ animation: "floaty 6s ease-in-out infinite" }}
              />
              <p
                className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-display text-5xl font-extrabold text-neutral-200/70 md:text-7xl lg:text-8xl"
                aria-hidden
              >
                {product.name.split(" ")[0].toUpperCase()}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              {related.slice(0, 4).map((r) => (
                <Link
                  key={r.id}
                  to="/product/$id"
                  params={{ id: r.id }}
                  className="grid h-16 w-16 place-items-center rounded-xl bg-white ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-md"
                >
                  <img src={r.img} alt={r.name} className="h-12 w-12 object-contain" />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5 rounded-3xl bg-white p-6 ring-1 ring-black/5 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">New Arrival</p>
                <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight md:text-4xl">{product.name}</h1>
                <div className="mt-2 flex items-center gap-2 text-xs text-neutral-600">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                    ))}
                  </div>
                  <span>{avgRating} · {product.reviewCount ?? reviews.length} reviews</span>
                </div>
              </div>
              <button
                onClick={() => toggleFav({ id: product.id, name: product.name, price: product.price, img: product.img })}
                aria-label="Toggle favorite"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:scale-110"
              >
                <Heart className={`h-4 w-4 transition ${fav ? "fill-red-500 text-red-500" : "text-neutral-500"}`} />
              </button>
            </div>

            <p className="font-display text-3xl font-black">₹{product.price}</p>

            <p className="text-sm leading-relaxed text-neutral-600">
              {product.description ||
                "Step into all-day comfort with responsive foam cushioning, breathable knit upper, and a grip-tuned rubber outsole."}
            </p>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-700">Color</p>
                <p className="text-xs text-neutral-500">{colors.find((c) => c.hex === color)?.name}</p>
              </div>
              <div className="flex gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    onClick={() => setColor(c.hex)}
                    aria-label={c.name}
                    className={`h-8 w-8 rounded-full ring-1 transition hover:scale-110 ${color === c.hex ? "ring-2 ring-neutral-900 ring-offset-2" : "ring-black/10"}`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-neutral-700">Size (EU)</p>
                <button className="text-xs text-neutral-500 underline">Size guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-11 w-14 rounded-xl text-sm font-semibold transition ${
                      size === s
                        ? "bg-neutral-900 text-white"
                        : "bg-[#f4f4f4] text-neutral-800 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 rounded-full bg-[#f4f4f4] p-1">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-8 w-8 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, img: product.img }, qty)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
              >
                Add to Bag <ShoppingBag className="h-4 w-4" />
              </button>
              <Link
                to="/cart"
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, img: product.img }, qty)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Buy Now
              </Link>
            </div>

            <div className="mt-2 grid grid-cols-3 gap-3 border-t border-black/5 pt-4">
              {[
                { icon: Truck, label: "Free shipping" },
                { icon: RotateCcw, label: "30-day return" },
                { icon: Shield, label: "2-year warranty" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center text-[11px] text-neutral-600">
                  <Icon className="h-4 w-4" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        <section className="mt-10 rounded-3xl bg-[#f4f4f4] p-6 md:p-10">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold md:text-3xl">Customer Reviews</h2>
              <p className="text-xs text-neutral-500">{reviews.length} verified reviews</p>
            </div>
            {user && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-500"
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </button>
            )}
          </div>

          {showReviewForm && user && (
            <div className="mb-6 rounded-2xl bg-white p-5 ring-1 ring-black/5">
              <p className="mb-3 text-sm font-semibold">Your Rating</p>
              <div className="mb-4 flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewRating(i + 1)}
                    className="transition hover:scale-110"
                  >
                    <Star className={`h-6 w-6 ${i < reviewRating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                  </button>
                ))}
              </div>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience with this product..."
                className="w-full rounded-xl bg-neutral-100 p-3 text-sm outline-none focus:ring-1 focus:ring-neutral-900"
                rows={4}
              />
              <button
                onClick={() => {
                  if (reviewText.trim()) {
                    submitReview.mutate({ rating: reviewRating, text: reviewText });
                    setReviewText("");
                    setReviewRating(5);
                    setShowReviewForm(false);
                  }
                }}
                disabled={submitReview.isPending || !reviewText.trim()}
                className="mt-3 rounded-full bg-neutral-900 px-5 py-2 text-xs font-semibold text-white transition hover:bg-orange-500 disabled:opacity-50"
              >
                {submitReview.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-3">
            {reviews.map((r) => (
              <div key={r.id} className="rounded-2xl bg-white p-5 ring-1 ring-black/5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-[11px] text-neutral-500">
                    {new Date(r.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-1 flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`} />
                  ))}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-neutral-600">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-4 font-display text-2xl font-bold md:text-3xl">You Might Also Like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((r) => (
              <Link
                key={r.id}
                to="/product/$id"
                params={{ id: r.id }}
                className="group flex flex-col rounded-2xl bg-white p-3 ring-1 ring-black/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="rounded-xl bg-[#f4f4f4] p-4">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-neutral-500">Shoes</p>
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-neutral-900 line-clamp-1">{r.name}</p>
                    <p className="text-sm font-bold">₹{r.price}</p>
                  </div>
                  <div className="mt-2 aspect-[4/3] overflow-hidden">
                    <img
                      src={r.img}
                      alt={r.name}
                      loading="lazy"
                      className="h-full w-full object-contain transition duration-500 group-hover:scale-110 group-hover:-rotate-6"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </Shell>
  );
}
