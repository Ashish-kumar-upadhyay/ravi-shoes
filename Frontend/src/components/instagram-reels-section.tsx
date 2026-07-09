import { memo, useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight, Instagram, VolumeX, Volume2, Play } from "lucide-react";
import {
  cloudinaryPoster,
  optimizeCloudinaryVideo,
  reels,
  type ReelItem,
} from "@/lib/reels-data";

const AUTOPLAY_MS = 5000;

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

function useInView<T extends HTMLElement>(rootMargin = "120px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { rootMargin, threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

const ReelCard = memo(function ReelCard({ reel }: { reel: ReelItem }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Use raw URL without optimization to ensure it works
  const streamUrl = reel.videoUrl;
  const posterUrl = cloudinaryPoster(reel.videoUrl);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
    
    if (!video.muted && video.paused) {
      video.play().catch(() => undefined);
    }
  };

  const handleVideoClick = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (video.paused) {
      video.play().catch((err) => console.log("Play error:", err));
    } else {
      video.pause();
    }
  };

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = true;
    setIsMuted(true);
    video.playbackRate = 1.0; // Ensure normal speed
    video.play().catch((err) => console.log("Play error:", err));
  };

  const handleError = () => {
    console.error("Video failed to load:", reel.videoUrl);
    setHasError(true);
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const video = videoRef.current;
        if (!video) return;

        if (!entry.isIntersecting) {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      className="group reel-card h-full"
      aria-label={reel.title}
    >
      <div className="relative h-full overflow-hidden rounded-[1.35rem] border border-white/40 bg-white/25 p-2 shadow-[0_18px_45px_-22px_rgba(0,0,0,0.45)] backdrop-blur-xl transition duration-500 will-change-transform hover:-translate-y-1.5 hover:shadow-[0_26px_55px_-20px_rgba(249,115,22,0.38)]">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-neutral-900">
          <img
            src={posterUrl}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              isPlaying ? "opacity-0" : "opacity-100"
            }`}
          />

          {!hasError && (
            <video
              ref={videoRef}
              src={streamUrl}
              poster={posterUrl}
              muted={isMuted}
              loop
              playsInline
              preload="auto"
              onPlaying={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onError={handleError}
              onClick={handleVideoClick}
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.04] cursor-pointer"
            />
          )}
          
          {!isPlaying && !hasError && (
            <button
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition hover:bg-black/30"
              aria-label="Play video"
            >
              <div className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-neutral-900 shadow-lg backdrop-blur-sm transition hover:scale-110">
                <Play className="h-6 w-6 fill-current" />
              </div>
            </button>
          )}
          
          {hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 text-white">
              <p className="text-xs">Video unavailable</p>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />

          <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/20">
            <Instagram className="h-3.5 w-3.5" aria-hidden />
            Reel
          </div>

          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
            <p className="text-xs font-medium text-white/90">{reel.title}</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleMute();
              }}
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
});

export function InstagramReelsSection() {
  const slidesPerView = useSlidesPerView();
  const { ref: sectionRef, inView: sectionVisible } = useInView<HTMLElement>("80px");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const autoplayRef = useRef<number | null>(null);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true,
    dragFree: false,
    containScroll: "trimSnaps",
  });

  const slideSize = `${100 / slidesPerView}%`;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
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
    emblaApi.reInit({ loop: true, align: "start", containScroll: "trimSnaps" });
  }, [emblaApi, slidesPerView]);

  useEffect(() => {
    if (!emblaApi || !sectionVisible) return;

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
  }, [emblaApi, sectionVisible]);

  useEffect(() => {
    const viewport = emblaApi?.rootNode();
    if (!viewport) return;

    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      if (event.deltaY > 0) emblaApi?.scrollNext();
      else emblaApi?.scrollPrev();
    };

    viewport.addEventListener("wheel", onWheel, { passive: false });
    return () => viewport.removeEventListener("wheel", onWheel);
  }, [emblaApi]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="our-reels-heading"
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
      className={`relative overflow-hidden border-t border-black/5 bg-[#efeeea] px-4 py-14 transition-all duration-700 ease-out will-change-transform sm:px-6 md:px-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/20 ${
        sectionVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="pointer-events-none absolute -left-24 top-8 h-56 w-56 rounded-full bg-orange-400/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-neutral-900/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col items-start justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              Luxury Shoes
            </p>
            <h2
              id="our-reels-heading"
              className="font-display text-3xl font-extrabold tracking-tight text-neutral-900 md:text-4xl"
            >
              Our Reels
            </h2>
            <p className="reels-accent-line mt-3 max-w-lg text-sm leading-relaxed text-neutral-600">
              Scroll through our latest luxury footwear moments — smooth previews streamed in
              premium quality.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label="Previous reel"
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi?.scrollNext()}
              aria-label="Next reel"
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-neutral-900 shadow-lg ring-1 ring-black/10 transition hover:bg-neutral-900 hover:text-white"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={emblaRef}
          className="reels-viewport overflow-hidden"
          role="region"
          aria-roledescription="carousel"
          aria-label="Our reels carousel"
        >
          <div className="flex touch-pan-y snap-x snap-mandatory">
            {reels.map((reel, index) => (
              <div
                key={reel.id}
                className="min-w-0 snap-start px-2"
                style={{
                  flex: `0 0 ${slideSize}`,
                  animationDelay: `${index * 80}ms`,
                }}
              >
                <ReelCard reel={reel} />
              </div>
            ))}
          </div>
        </div>

        <div
          className="mt-6 flex items-center justify-center gap-2"
          role="tablist"
          aria-label="Reels pagination"
        >
          {reels.map((reel, index) => {
            const active = selectedIndex % reels.length === index;
            return (
              <button
                key={reel.id}
                type="button"
                role="tab"
                aria-selected={active}
                aria-label={`Go to reel ${index + 1}`}
                onClick={() => emblaApi?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  active ? "w-8 bg-neutral-900" : "w-2 bg-neutral-300 hover:bg-neutral-500"
                }`}
              />
            );
          })}
        </div>
      </div>

      <style>{`
        .reels-viewport {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        .reels-viewport::-webkit-scrollbar {
          display: none;
        }
        .reels-accent-line {
          position: relative;
          display: inline-block;
        }
        .reels-accent-line::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: -10px;
          width: 64px;
          height: 3px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f97316, #171717);
          animation: reelsLinePulse 2.6s ease-in-out infinite;
        }
        @keyframes reelsLinePulse {
          0%, 100% { transform: scaleX(1); opacity: 1; }
          50% { transform: scaleX(1.25); opacity: 0.72; }
        }
      `}</style>
    </section>
  );
}
