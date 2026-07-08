import { memo, useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Instagram, Play } from "lucide-react";
import { instagramReels, INSTAGRAM_PROFILE_URL, type InstagramReel } from "@/lib/reels-data";

const AUTOPLAY_MS = 4500;

function useSlidesPerView() {
  const [count, setCount] = useState(4);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      if (width < 640) setCount(1);
      else if (width < 1024) setCount(2);
      else if (width < 1280) setCount(3);
      else setCount(4);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return count;
}

const ReelCard = memo(function ReelCard({ reel }: { reel: InstagramReel }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const video = videoRef.current;
    if (!card || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      },
      { threshold: 0.45 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <a
      ref={cardRef}
      href={reel.instagramUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Watch ${reel.title} on Instagram`}
      className="group reel-card block h-full"
    >
      <div className="relative h-full overflow-hidden rounded-[1.35rem] border border-white/30 bg-white/20 p-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] backdrop-blur-xl transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_60px_-18px_rgba(249,115,22,0.35)]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-900">
          {!videoFailed && (
            <video
              ref={videoRef}
              src={reel.previewVideo}
              poster={reel.poster}
              muted
              loop
              playsInline
              autoPlay
              preload="metadata"
              onLoadedData={() => setVideoReady(true)}
              onError={() => setVideoFailed(true)}
              className={`h-full w-full object-cover transition duration-700 group-hover:scale-105 ${
                videoReady ? "opacity-100" : "opacity-0"
              }`}
            />
          )}

          {(videoFailed || !videoReady) && (
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${reel.poster})` }}
              role="img"
              aria-label={reel.title}
            />
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md ring-1 ring-white/25">
            <Instagram className="h-4 w-4" aria-hidden />
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between gap-2">
            <p className="line-clamp-2 text-xs font-semibold text-white">{reel.title}</p>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg transition group-hover:scale-110">
              <Play className="h-3.5 w-3.5 fill-current" aria-hidden />
            </span>
          </div>
        </div>
      </div>
    </a>
  );
});

export function InstagramReelsSection() {
  const slidesPerView = useSlidesPerView();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const autoplayRef = useRef<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
    skipSnaps: false,
  });

  const slideSize = `${100 / slidesPerView}%`;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.reInit({ loop: true });
  }, [emblaApi, slidesPerView]);

  useEffect(() => {
    if (!emblaApi) return;

    const startAutoplay = () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
      autoplayRef.current = window.setInterval(() => {
        if (document.hidden) return;
        emblaApi.scrollNext();
      }, AUTOPLAY_MS);
    };

    startAutoplay();
    emblaApi.on("pointerDown", () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    });
    emblaApi.on("pointerUp", startAutoplay);

    return () => {
      if (autoplayRef.current) window.clearInterval(autoplayRef.current);
    };
  }, [emblaApi]);

  useEffect(() => {
    const viewport = emblaApi?.rootNode();
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      if (event.deltaY > 0) emblaApi.scrollNext();
      else emblaApi.scrollPrev();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi],
  );

  return (
    <section
      aria-labelledby="instagram-reels-heading"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          emblaApi?.scrollPrev();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          emblaApi?.scrollNext();
        }
      }}
      className="relative overflow-hidden border-t border-black/5 bg-[#efeeea] px-4 py-14 sm:px-6 md:px-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30"
    >
      <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-neutral-900/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div className="reels-header">
            <a
              href={INSTAGRAM_PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-neutral-700 shadow-sm ring-1 ring-black/5 backdrop-blur-md transition hover:bg-neutral-900 hover:text-white"
            >
              <Instagram className="h-4 w-4" aria-hidden />
              Follow us on Instagram
            </a>
            <h2
              id="instagram-reels-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl"
            >
              Luxury Reels
            </h2>
            <p className="reels-underline mt-2 max-w-xl text-sm text-neutral-600">
              Watch our latest luxury shoe drops — preview here, tap any reel to open on Instagram.
            </p>
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              disabled={!canScrollPrev}
              aria-label="Previous reels"
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              disabled={!canScrollNext}
              aria-label="Next reels"
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={emblaRef} className="overflow-hidden" role="region" aria-roledescription="carousel" aria-label="Instagram reels">
          <div className="flex touch-pan-y">
            {instagramReels.map((reel) => (
              <div
                key={reel.id}
                className="min-w-0 px-2"
                style={{ flex: `0 0 ${slideSize}` }}
              >
                <ReelCard reel={reel} />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous reels"
              className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/10"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next reels"
              className="grid h-10 w-10 place-items-center rounded-full bg-white ring-1 ring-black/10"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-2" role="tablist" aria-label="Reels pagination">
            {instagramReels.map((reel, index) => {
              const active = selectedIndex % instagramReels.length === index;
              return (
                <button
                  key={reel.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-label={`Go to reel ${index + 1}`}
                  onClick={() => scrollTo(index)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    active ? "w-8 bg-neutral-900" : "w-2.5 bg-neutral-300 hover:bg-neutral-500"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .reels-underline {
          position: relative;
          display: inline-block;
        }
        .reels-underline::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -8px;
          width: 72px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f97316, #171717);
          animation: reelsUnderline 2.4s ease-in-out infinite;
        }
        @keyframes reelsUnderline {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(1.35); opacity: 0.75; }
        }
        .reels-header {
          animation: reelsFadeUp 0.7s ease-out both;
        }
        .reel-card {
          animation: reelsFadeUp 0.7s ease-out both;
        }
        @keyframes reelsFadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
