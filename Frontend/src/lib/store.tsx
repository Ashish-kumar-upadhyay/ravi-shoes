import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
  type ReactNode,
} from "react";
import { api, setToken, toProduct, type ApiCartItem } from "./api";

export type Product = {
  id: string;
  name: string;
  price: number;
  img: string;
};

type CartItem = Product & { qty: number };

type StoreCtx = {
  cart: CartItem[];
  favs: Product[];
  addToCart: (p: Product, qty?: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  toggleFav: (p: Product) => void;
  isFav: (id: string) => boolean;
  cartCount: number;
  favCount: number;
  cartTotal: number;
  loading: boolean;
};

const Ctx = createContext<StoreCtx | null>(null);

const read = <T,>(k: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;
  try {
    const v = window.localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};

function mapCartItems(items: ApiCartItem[]): CartItem[] {
  return items.map((i) => ({ id: i.id, name: i.name, price: i.price, img: i.img, qty: i.qty }));
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<Product[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const syncedFor = useRef<string | null>(null);

  useEffect(() => {
    setCart(read<CartItem[]>("treadly.cart", []));
    setFavs(read<Product[]>("treadly.favs", []));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!user) syncedFor.current = null;
  }, [user]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      localStorage.setItem("treadly.cart", JSON.stringify(cart));
      localStorage.setItem("treadly.favs", JSON.stringify(favs));
      return;
    }

    (async () => {
      setLoading(true);
      try {
        const localCart = read<CartItem[]>("treadly.cart", []);
        const localFavs = read<Product[]>("treadly.favs", []);
        const needsSync = syncedFor.current !== user.email;

        if (needsSync && (localCart.length > 0 || localFavs.length > 0)) {
          if (localCart.length > 0) {
            const res = await api.syncCart(
              localCart.map((item) => ({ productId: item.id, qty: item.qty })),
            );
            setCart(mapCartItems(res.items));
          }
          for (const f of localFavs) {
            try {
              await api.addFavorite(f.id);
            } catch {
              /* already favorited */
            }
          }
          localStorage.removeItem("treadly.cart");
          localStorage.removeItem("treadly.favs");
        }

        const [cartRes, favRes] = await Promise.all([api.getCart(), api.getFavorites()]);
        setCart(mapCartItems(cartRes.items));
        setFavs(favRes.favorites.map(toProduct));
        syncedFor.current = user.email;
      } catch {
        /* keep local state on error */
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email, hydrated]);

  const addToCart = useCallback(
    (p: Product, qty = 1) => {
      if (user) {
        api.addToCart(p.id, qty).then((res) => setCart(mapCartItems(res.items))).catch(() => {
          setCart((c) => {
            const ex = c.find((i) => i.id === p.id);
            if (ex) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
            return [...c, { ...p, qty }];
          });
        });
        return;
      }
      setCart((c) => {
        const ex = c.find((i) => i.id === p.id);
        if (ex) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + qty } : i));
        return [...c, { ...p, qty }];
      });
    },
    [user],
  );

  const removeFromCart = useCallback(
    (id: string) => {
      if (user) {
        api.removeFromCart(id).then(() =>
          setCart((c) => c.filter((i) => i.id !== id)),
        );
        return;
      }
      setCart((c) => c.filter((i) => i.id !== id));
    },
    [user],
  );

  const clearCart = useCallback(() => {
    if (user) {
      api.clearCart().then(() => setCart([])).catch(() => setCart([]));
      return;
    }
    setCart([]);
  }, [user]);

  const toggleFav = useCallback(
    (p: Product) => {
      const isCurrentlyFav = favs.some((i) => i.id === p.id);
      if (user) {
        const action = isCurrentlyFav ? api.removeFavorite(p.id) : api.addFavorite(p.id);
        action
          .then(() =>
            setFavs((f) =>
              isCurrentlyFav ? f.filter((i) => i.id !== p.id) : [...f, p],
            ),
          )
          .catch(() => {
            setFavs((f) =>
              isCurrentlyFav ? f.filter((i) => i.id !== p.id) : [...f, p],
            );
          });
        return;
      }
      setFavs((f) => (isCurrentlyFav ? f.filter((i) => i.id !== p.id) : [...f, p]));
    },
    [user, favs],
  );

  const value = useMemo<StoreCtx>(
    () => ({
      cart,
      favs,
      addToCart,
      removeFromCart,
      clearCart,
      toggleFav,
      isFav: (id) => favs.some((i) => i.id === id),
      cartCount: cart.reduce((a, b) => a + b.qty, 0),
      favCount: favs.length,
      cartTotal: cart.reduce((a, b) => a + b.qty * b.price, 0),
      loading,
    }),
    [cart, favs, addToCart, removeFromCart, clearCart, toggleFav, loading],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
}

type User = { id?: string; name: string; email: string } | null;
type AuthCtx = {
  user: User;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("treadly.token");
    if (!token) {
      setUser(read<User>("treadly.user", null));
      setLoading(false);
      return;
    }
    api
      .me()
      .then(({ user: u }) => {
        setUser(u);
        localStorage.setItem("treadly.user", JSON.stringify(u));
      })
      .catch(() => {
        setToken(null);
        setUser(read<User>("treadly.user", null));
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      signIn: async (email, password) => {
        const { user: u, token } = await api.login(email, password);
        setToken(token);
        localStorage.setItem("treadly.user", JSON.stringify(u));
        setUser(u);
      },
      signUp: async (name, email, password) => {
        const { user: u, token } = await api.register(name, email, password);
        setToken(token);
        localStorage.setItem("treadly.user", JSON.stringify(u));
        setUser(u);
      },
      signOut: () => {
        api.logout().catch(() => {});
        setToken(null);
        localStorage.removeItem("treadly.user");
        setUser(null);
      },
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
