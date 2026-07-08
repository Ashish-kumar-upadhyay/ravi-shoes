import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ArrowLeft, Truck, Clock, Award, Heart, ShoppingBag } from "lucide-react";

import heroShoe from "@/assets/hero-shoe.png";
import shoeRed from "@/assets/shoe-red.png";
import shoeWhite from "@/assets/shoe-white.png";
import shoeGreen from "@/assets/shoe-green.png";
import shoeRed2 from "@/assets/shoe-red2.png";
import shoeYellow from "@/assets/shoe-yellow.png";
import shoeFlame from "@/assets/shoe-flame.png";
import shoeRetro from "@/assets/shoe-retro.png";
import shoeBlue from "@/assets/shoe-blue.png";
import shoeGreen2 from "@/assets/shoe-green2.png";
import shoeMint from "@/assets/shoe-mint.png";
import formalShoes from "@/assets/formal-shoes.png";
import collection1 from "@/assets/collection-1.jpg";
import collection2 from "@/assets/collection-2.jpg";
import collection3 from "@/assets/collection-3.jpg";
import { Shell } from "@/components/site-shell";
import { useStore, type Product } from "@/lib/store";
import { useProducts, useBestsellers, useNewArrivals } from "@/hooks/use-products";

export const Route = createFileRoute("/")({
  component: Index,
});

const categoryMap: Record<string, string> = {
  "All Arrivals": "all",
  Popular: "popular",
  Male: "male",
  FEMALE: "female",
  CHILDREN: "children",
};

const dots = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleFav, isFav } = useStore();
  const fav = isFav(product.id);
  return (
    <div className="group flex h-full flex-col rounded-xl bg-white p-2 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:rounded-2xl sm:p-3">
      <div className="relative flex flex-1 flex-col rounded-lg bg-[#f4f4f4] p-2 sm:rounded-xl sm:p-4">
        <button
          onClick={() => toggleFav(product)}
          aria-label="Toggle favorite"
          className="absolute right-2 bottom-2 z-10 grid h-7 w-7 place-items-center rounded-full bg-white/90 ring-1 ring-black/10 transition hover:scale-110 sm:right-3 sm:bottom-3 sm:h-8 sm:w-8"
        >
          <Heart
            className={`h-3.5 w-3.5 transition sm:h-4 sm:w-4 ${fav ? "fill-red-500 text-red-500" : "text-neutral-500"}`}
          />
        </button>
        <Link to="/product/$id" params={{ id: product.id }} className="block flex-1">
          <p className="text-[9px] font-medium uppercase tracking-wider text-neutral-500 sm:text-[10px]">Shoes</p>
          <div className="flex items-start justify-between gap-1">
            <p className="text-xs font-semibold text-neutral-900 line-clamp-1 sm:text-sm">{product.name}</p>
            <p className="text-xs font-bold text-neutral-900 sm:text-sm">₹{product.price}</p>
          </div>
          <div className="relative mt-1 aspect-[4/3] overflow-hidden sm:mt-2">
            <img
              src={product.img}
              alt={product.name}
              loading="lazy"
              className="h-full w-full object-contain transition duration-500 group-hover:scale-110 group-hover:rotate-[-6deg]"
            />
          </div>
        </Link>
        <div className="mt-1.5 flex gap-1 sm:mt-2 sm:gap-1.5">
          {dots.map((c) => (
            <span
              key={c}
              className="h-2 w-2 rounded-full ring-1 ring-black/10 transition hover:scale-125 sm:h-2.5 sm:w-2.5"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex items-center justify-between px-0.5 py-1 text-[10px] text-neutral-600 sm:mt-2 sm:px-1 sm:py-1.5 sm:text-[11px]">
        <span>42 43 44</span>
        <button
          onClick={() => addToCart(product)}
          className="flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-1 text-[9px] font-semibold text-white transition hover:bg-orange-500 hover:scale-105 sm:px-3 sm:py-1.5 sm:text-[10px]"
        >
          Add <ShoppingBag className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

const slides = [
  {
    tag: "AIR FORCE",
    title: ["STEP INTO", "SHOES STYLE"],
    caption: "Step into a world where fashion meets function, and walk with confidence in every step!",
    watermark: "OWN THE WALK",
    img: heroShoe,
    era: "2025 – PRESENT",
    variants: ["AIR FORCE", "SKY STRIKER", "AERO STEP"],
  },
  {
    tag: "SKY STRIKER",
    title: ["FLY HIGH", "RUN FREE"],
    caption: "Lightweight cushioning built for the streets — every step feels like the first.",
    watermark: "CHASE THE SKY",
    img: shoeGreen,
    era: "SS 2026",
    variants: ["SKY STRIKER", "AIR FORCE", "AERO STEP"],
  },
  {
    tag: "AERO STEP",
    title: ["OWN THE", "MOMENTUM"],
    caption: "Bold, red, unstoppable. Made for the players who never look back.",
    watermark: "PURE ENERGY",
    img: shoeRed,
    era: "LIMITED DROP",
    variants: ["AERO STEP", "AIR FORCE", "SKY STRIKER"],
  },
];

function PromoBanners() {
  const target = new Date();
  target.setDate(target.getDate() + 3);
  const [tl, setTl] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTl({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const box = (v: number, label: string) => (
    <div className="flex flex-col items-center rounded-lg bg-white/10 px-2 py-1.5 backdrop-blur-sm ring-1 ring-white/15 min-w-[46px]">
      <span className="font-display text-base font-extrabold leading-none text-white sm:text-lg">
        {String(v).padStart(2, "0")}
      </span>
      <span className="mt-0.5 text-[9px] uppercase tracking-widest text-white/60">{label}</span>
    </div>
  );

  return (
    <section className="px-6 pb-10 md:px-10">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
        {/* Left banner */}
        <div className="group relative overflow-hidden rounded-[24px] bg-gradient-to-br from-neutral-950 via-neutral-900 to-black p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.35)] sm:p-8">
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl transition-all duration-700 group-hover:scale-125" />
          <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl" />
          <div className="relative z-10 grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-orange-500/20 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-orange-400 ring-1 ring-orange-500/30">
                Limited Deal
              </span>
              <h3 className="mt-3 font-display text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                UP TO <span className="text-orange-500">50% OFF</span>
              </h3>
              <p className="mt-1 text-xs text-white/60 sm:text-sm">On selected items only</p>
              <div className="mt-4 flex gap-1.5">
                {box(tl.d, "Days")}
                {box(tl.h, "Hrs")}
                {box(tl.m, "Min")}
                {box(tl.s, "Sec")}
              </div>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-orange-500/30 transition hover:scale-105 hover:bg-orange-600 sm:text-sm">
                Shop Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <img
              src={shoeFlame}
              alt="Promo sneaker"
              className="w-28 shrink-0 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:w-40 md:w-48"
            />
          </div>
        </div>

        {/* Right banner */}
        <div className="group relative overflow-hidden rounded-[24px] bg-gradient-to-br from-orange-500 via-orange-600 to-neutral-900 p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.45)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.15),transparent_50%)]" />
          <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-black/30 blur-3xl transition-all duration-700 group-hover:scale-125" />
          <div className="relative z-10 grid grid-cols-[1fr_auto] gap-4 items-center">
            <div className="min-w-0">
              <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white ring-1 ring-white/30 backdrop-blur-sm">
                New Season
              </span>
              <h3 className="mt-3 font-display text-2xl font-black leading-tight text-white sm:text-3xl md:text-4xl">
                FOR EVERY <br />
                <span className="text-neutral-900">MOVE</span>
              </h3>
              <p className="mt-1 text-xs text-white/80 sm:text-sm">Style. Comfort. Performance.</p>
              <button className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-neutral-900 shadow-lg transition hover:scale-105 hover:bg-neutral-100 sm:text-sm">
                Explore Collection
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <img
              src={shoeWhite}
              alt="Collection sneaker"
              className="w-28 shrink-0 object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 sm:w-40 md:w-48"
            />
          </div>
        </div>
      </div>
    </section>
  );
}


function Index() {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState<"right" | "left">("right");
  const [activeCategory, setActiveCategory] = useState("All Arrivals");
  const category = categoryMap[activeCategory] ?? "all";
  const { data: products = [], isLoading: productsLoading } = useProducts(category);
  const { data: bestSellers = [], isLoading: bestsellersLoading } = useBestsellers();
  const { data: newArrivals = [], isLoading: newArrivalsLoading } = useNewArrivals();
  const slide = slides[idx];
  const next = () => { setDir("right"); setIdx((v) => (v + 1) % slides.length); };
  const prev = () => { setDir("left"); setIdx((v) => (v - 1 + slides.length) % slides.length); };
  const goTo = (k: number) => { setDir(k >= idx ? "right" : "left"); setIdx(k); };

  const shoeAnim = dir === "right" ? "shoeInRight" : "shoeInLeft";
  const textAnim = dir === "right" ? "textInRight" : "textInLeft";

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    loop: true,
  });

  return (
    <Shell>
      {/* Hero */}
      <div className="mx-4 mb-8 overflow-hidden rounded-3xl bg-[#f4f4f4] sm:mx-6 md:mx-10">
        <div className="relative grid min-h-[300px] grid-cols-1 gap-4 p-4 sm:min-h-[320px] sm:p-5 md:min-h-[340px] md:grid-cols-[200px_minmax(0,1fr)_200px] md:gap-4 md:p-6 lg:min-h-[380px]">
          <div className="z-10 flex flex-col justify-between gap-5 md:gap-6">
            <div key={"v" + idx} className="space-y-1.5 font-display md:space-y-2" style={{ animation: `${textAnim} 0.6s cubic-bezier(0.22,1,0.36,1)` }}>
              {slide.variants.map((v, k) => (
                <p
                  key={v}
                  className={`text-xl font-extrabold tracking-tight md:text-2xl ${k === 0 ? "text-neutral-900" : "text-neutral-400"}`}
                >
                  {v}
                </p>
              ))}
            </div>
            <p className="text-[11px] font-semibold tracking-widest text-neutral-500">{slide.era}</p>
          </div>

          <div className="relative flex min-h-[180px] flex-col items-center justify-center sm:min-h-[200px] md:min-h-[240px] lg:min-h-[300px]">
            <h1
              key={"t" + idx}
              className="pointer-events-none z-10 text-center font-display text-2xl font-extrabold leading-[0.95] tracking-tight sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl"
              style={{ animation: `${textAnim} 0.6s cubic-bezier(0.22,1,0.36,1) both` }}
            >
              {slide.title[0]}
              <br />
              {slide.title[1]}
            </h1>
            <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 mx-auto w-[65%] max-w-[260px] -translate-y-1/2 sm:max-w-[300px] md:max-w-[340px] lg:max-w-[380px]">
              <div
                key={"i" + idx}
                style={{ animation: `${shoeAnim} 0.8s cubic-bezier(0.22,1,0.36,1) both` }}
              >
                <img
                  src={slide.img}
                  alt="Featured sneaker"
                  width={1200}
                  height={900}
                  className="w-full drop-shadow-2xl"
                  style={{ animation: "floaty 6s ease-in-out infinite" }}
                />
              </div>
            </div>

          </div>




          <div className="z-10 flex flex-col items-start gap-4 md:items-end md:justify-between md:gap-6">
            <div className="flex gap-2 md:order-none">
              <button
                onClick={prev}
                aria-label="Previous slide"
                className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white active:scale-95"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <button
                onClick={next}
                aria-label="Next slide"
                className="grid h-9 w-9 place-items-center rounded-full bg-white ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white active:scale-95"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-3 md:text-right">
              <p key={"c" + idx} className="max-w-xs text-xs text-neutral-600 animate-[fadeIn_0.5s_ease-out]">
                {slide.caption}
              </p>
            <div className="flex items-center gap-2 md:justify-end">
              {slides.map((s, k) => (
                <button
                  key={k}
                  onClick={() => goTo(k)}
                  aria-label={`Go to slide ${k + 1}`}
                  className={`group relative h-10 w-10 overflow-hidden rounded-lg ring-1 transition-all ${k === idx ? "ring-neutral-900" : "ring-black/10 opacity-70 hover:opacity-100"}`}
                >
                  <img
                    src={s.img}
                    alt={s.tag}
                    className="h-full w-full object-contain transition group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
              <button className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white">
                Start Shopping
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          <p
            key={"w" + idx}
            className="pointer-events-none absolute inset-x-0 bottom-4 text-center font-display text-5xl font-extrabold text-neutral-200/70 animate-[fadeIn_0.6s_ease-out] sm:text-6xl md:bottom-6 md:text-8xl lg:text-[128px]"
            aria-hidden
          >
            {slide.watermark}
          </p>
        </div>
      </div>


      {/* Trusted brands */}
      <section className="px-6 pb-10 md:px-10">
        <h2 className="text-center font-display text-2xl font-bold md:text-3xl">Trusted By Top Brands</h2>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-neutral-500">
          Curated partners powering our shelves with the best in footwear.
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {[
            { name: "Nike", cls: "italic font-black tracking-tighter text-2xl" },
            { name: "adidas", cls: "font-black lowercase tracking-tight text-2xl" },
            { name: "PUMA", cls: "font-black tracking-[0.15em] text-xl" },
            { name: "FILA", cls: "font-black tracking-[0.25em] text-xl" },
            { name: "VANS", cls: "font-black italic tracking-tight text-2xl" },
            { name: "New Balance", cls: "font-serif italic font-bold text-lg" },
            { name: "Reebok", cls: "font-black tracking-tight text-xl" },
            { name: "UNDER ARMOUR", cls: "font-black tracking-[0.2em] text-xs" },
          ].map((b) => (
            <Link
              key={b.name}
              to="/search"
              search={{ brand: b.name }}
              className="group grid h-24 place-items-center rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-black/10"
            >
              <span
                className={`${b.cls} font-display text-neutral-400 grayscale transition-all duration-300 group-hover:scale-110 group-hover:text-neutral-900 group-hover:grayscale-0`}
              >
                {b.name}
              </span>
            </Link>
          ))}
        </div>
      </section>


      {/* Explore */}
      <section className="px-6 pb-10 md:px-10">
        <h2 className="text-center font-display text-3xl font-bold">Explore Our Latest Collection</h2>
        <div className="mt-6 flex flex-wrap justify-center gap-6 text-sm">
          {Object.keys(categoryMap).map((label) => (
            <label key={label} className="flex cursor-pointer items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveCategory(label)}
                className="flex items-center gap-2"
              >
                <span
                  className={`grid h-4 w-4 place-items-center rounded-full ring-1 transition ${
                    activeCategory === label ? "bg-neutral-900 ring-neutral-900" : "bg-white ring-neutral-400"
                  }`}
                >
                  {activeCategory === label && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                </span>
                <span className={activeCategory === label ? "font-semibold" : "text-neutral-600"}>
                  {label}
                </span>
              </button>
            </label>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {productsLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
            ))
          ) : (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </section>

      {/* Promo banners */}
      <PromoBanners />


      {/* Coupon marquee */}
      <section className="mx-6 mb-10 overflow-hidden rounded-2xl bg-[#f4f4f4] md:mx-10">
        <div className="flex animate-[scroll_25s_linear_infinite] gap-10 whitespace-nowrap py-4 font-display text-2xl font-extrabold text-neutral-800">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="flex items-center gap-4">
              GET 50% OFF COUPON "PACEPRO50"
              <img src={shoeFlame} alt="" className="h-8 w-12 object-contain" />
            </span>
          ))}
        </div>
      </section>

      {/* Best selling */}
      <section className="px-6 pb-10 md:px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Best Selling Shoes</h2>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>1/8</span>
            <button className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {bestsellersLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
            ))
          ) : (
            bestSellers.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </section>

      {/* New Arrivals */}
      <section className="px-6 pb-10 md:px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">New Arrivals</h2>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-6 overflow-hidden" ref={emblaRef}>
          <div className="flex gap-3">
            {newArrivalsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-1">
                  <div className="h-64 animate-pulse rounded-2xl bg-neutral-200" />
                </div>
              ))
            ) : (
              newArrivals.map((p) => (
                <div key={p.id} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] px-1">
                  <ProductCard product={p} />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* We supported by */}
      <section className="px-6 pb-10 md:px-10">
        <h2 className="text-center font-display text-2xl font-bold">We Supported By</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Truck, title: "FAST & FREE SHIPPING", desc: "Every shoe order ships for free." },
            { icon: Clock, title: "30 DAYS RETURNS POLICY", desc: "Returns accepted within 30 days." },
            { icon: Award, title: "TOP QUALITY PRODUCTS", desc: "We always provide high quality shoes." },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex items-center gap-4 rounded-2xl bg-[#f4f4f4] p-5 transition hover:-translate-y-1 hover:bg-white hover:shadow-lg hover:ring-1 hover:ring-black/5"
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white ring-1 ring-black/10">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-sm font-bold">{title}</p>
                <p className="mt-1 text-xs text-neutral-600">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top Collection */}
      <section className="px-6 pb-10 md:px-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Top Collection List</h2>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span>1/6</span>
            <button className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="grid h-8 w-8 place-items-center rounded-full ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { img: shoeRed, label: "Sneaker Shoes", bg: "from-orange-500/20 to-red-500/20" },
            { img: shoeGreen, label: "Running Shoes", bg: "from-green-500/20 to-emerald-500/20" },
            { img: formalShoes, label: "Formal Shoes", bg: "from-neutral-500/20 to-neutral-700/20" },
          ].map((c) => (
            <div key={c.label} className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 p-8 transition duration-500 hover:shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} opacity-50 transition duration-500 group-hover:opacity-70`} />
              <div className="relative flex flex-col items-center">
                <img
                  src={c.img}
                  alt={c.label}
                  loading="lazy"
                  className="h-48 w-full object-contain transition duration-500 group-hover:scale-110 group-hover:-rotate-6 drop-shadow-2xl"
                />
                <p className="mt-4 font-display text-xl font-bold text-neutral-900 drop-shadow-sm">
                  {c.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Shell>
  );
}
