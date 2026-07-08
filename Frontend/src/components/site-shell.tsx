import { Link, useNavigate } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Footprints, LogOut, Shield } from "lucide-react";
import { useAuth, useStore } from "@/lib/store";
import { NotificationsPanel } from "@/components/notifications-panel";
import { lazy, Suspense, useState } from "react";

const InstagramReelsSection = lazy(() =>
  import("@/components/instagram-reels-section").then((module) => ({
    default: module.InstagramReelsSection,
  })),
);

const nav = ["Men", "Woman", "Children", "New Collection", "Popular"];

const categoryMap: Record<string, string> = {
  Men: "male",
  Woman: "female",
  Children: "children",
  "New Collection": "popular",
  Popular: "popular",
};

function IconBtn({
  to,
  onClick,
  children,
  count,
  ariaLabel,
}: {
  to?: string;
  onClick?: () => void;
  children: React.ReactNode;
  count?: number;
  ariaLabel: string;
}) {
  const cls =
    "relative grid h-10 w-10 place-items-center rounded-full ring-1 ring-black/10 bg-white transition hover:bg-neutral-900 hover:text-white hover:-translate-y-0.5";
  const badge = count && count > 0 ? (
    <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white shadow">
      {count}
    </span>
  ) : null;
  if (to)
    return (
      <Link to={to} aria-label={ariaLabel} className={cls}>
        {children}
        {badge}
      </Link>
    );
  return (
    <button aria-label={ariaLabel} onClick={onClick} className={cls}>
      {children}
      {badge}
    </button>
  );
}

function Pill({ children, active = false, to, search }: { children: React.ReactNode; active?: boolean; to?: string; search?: Record<string, unknown> }) {
  const cls = `shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
    active
      ? "bg-neutral-900 text-white"
      : "bg-white text-neutral-800 ring-1 ring-black/10 hover:bg-neutral-900 hover:text-white"
  }`;
  if (to) return <Link to={to} search={search} className={cls}>{children}</Link>;
  return <button className={cls}>{children}</button>;
}

export function SiteHeader() {
  const { cartCount, favCount } = useStore();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate({ to: "/search", search: { q: searchQuery } });
    }
  };

  return (
    <>
      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-10">
        <IconBtn to="/admin-login" ariaLabel="Admin login">
          <Shield className="h-4 w-4" />
        </IconBtn>
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-bold md:col-start-2 md:justify-self-center">
          <Footprints className="h-4 w-4" />
          Luxury Shoes
        </Link>
        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <IconBtn to="/favorites" ariaLabel="Favorites" count={favCount}>
            <Heart className="h-4 w-4" />
          </IconBtn>
          <IconBtn to="/cart" ariaLabel="Cart" count={cartCount}>
            <ShoppingBag className="h-4 w-4" />
          </IconBtn>
          {user && <NotificationsPanel />}
          {user ? (
            <IconBtn
              onClick={() => {
                signOut();
                navigate({ to: "/" });
              }}
              ariaLabel="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </IconBtn>
          ) : (
            <IconBtn to="/login" ariaLabel="Sign in">
              <User className="h-4 w-4" />
            </IconBtn>
          )}
        </div>
      </header>

      <nav aria-label="Main navigation" className="flex min-w-0 flex-col gap-2 px-4 pb-4 sm:px-6 sm:pb-6 md:flex-row md:flex-wrap md:items-center md:px-10">
        {/* Search + About + FAQ (first on mobile, inline on desktop) */}
        <div className="order-1 flex min-w-0 items-center gap-2 md:order-2 md:flex-1">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 transition focus-within:bg-white focus-within:ring-1 focus-within:ring-neutral-900">
            <input
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-neutral-500"
            />
            <button 
              onClick={handleSearch}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-neutral-900 text-white transition hover:scale-110"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
          <Pill to="/about">About</Pill>
          <Pill to="/faq">FAQ's</Pill>
        </div>
        {/* Category pills (wrap on mobile, inline on desktop) */}
        <div className="order-2 flex min-w-0 w-full flex-wrap items-center gap-2 md:order-1 md:w-auto">
          {nav.map((n) => (
            <Pill 
              key={n} 
              to="/search" 
              search={{ category: n }}
              active={false}
            >
              {n === "New Collection" ? (
                <>
                  <span className="sm:hidden">New</span>
                  <span className="hidden sm:inline">New Collection</span>
                </>
              ) : (
                n
              )}
            </Pill>
          ))}
        </div>
      </nav>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 px-6 py-10 md:px-10">
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
        <div className="col-span-2 sm:col-span-3 lg:col-span-2">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <Footprints className="h-4 w-4" />
            Luxury Shoes
          </div>
          <p className="mt-3 max-w-xs text-xs text-neutral-600">
            India&apos;s trusted online store for premium luxury shoes, designer sneakers and formal
            footwear from top global brands.
          </p>
        </div>
        {[
          {
            title: "Shop",
            links: [
              { label: "Men's Luxury Shoes", to: "/search" as const, search: { category: "Men" } },
              { label: "Women's Luxury Shoes", to: "/search" as const, search: { category: "Woman" } },
              { label: "Children's Shoes", to: "/search" as const, search: { category: "Children" } },
              { label: "Popular Collection", to: "/search" as const, search: { category: "Popular" } },
            ],
          },
          {
            title: "Help",
            links: [
              { label: "FAQ", to: "/faq" as const },
              { label: "About Us", to: "/about" as const },
              { label: "Contact", to: "/faq" as const },
            ],
          },
          {
            title: "Brands",
            links: [
              { label: "Nike Luxury Shoes", to: "/search" as const, search: { brand: "Nike" } },
              { label: "Adidas Shoes", to: "/search" as const, search: { brand: "adidas" } },
              { label: "PUMA Shoes", to: "/search" as const, search: { brand: "PUMA" } },
            ],
          },
          {
            title: "Company",
            links: [
              { label: "About Luxury Shoes", to: "/about" as const },
              { label: "Privacy Policy", to: "/about" as const },
              { label: "Terms", to: "/about" as const },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <p className="font-display text-sm font-bold">{col.title}</p>
            <ul className="mt-3 space-y-2 text-xs text-neutral-600">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} search={"search" in l ? l.search : undefined} className="transition hover:text-neutral-900">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-black/10 pt-6 text-xs text-neutral-500 md:flex-row">
        <p>Copyright © 2026 Luxury Shoes. All Rights Reserved.</p>
        <Link to="/about" className="transition hover:text-neutral-900">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#efeeea] font-sans text-neutral-900">
      <div className="bg-white">
        <SiteHeader />
        <main className="animate-[fadeIn_0.4s_ease-out]">{children}</main>
        <Suspense
          fallback={
            <div className="border-t border-black/5 bg-[#efeeea] px-6 py-14 md:px-10">
              <div className="mx-auto h-72 max-w-7xl animate-pulse rounded-3xl bg-neutral-200/70" />
            </div>
          }
        >
          <InstagramReelsSection />
        </Suspense>
        <SiteFooter />
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        /* floaty defined in styles.css */

        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
