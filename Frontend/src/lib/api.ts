export const API_URL = import.meta.env.VITE_API_URL || "https://api.luxuryshoes.dpdns.org";

type ApiResponse<T> = { success: true; data: T } | { success: false; message: string };

export type ApiProduct = {
  id: string;
  slug: string;
  name: string;
  price: number;
  img: string;
  description?: string;
  category?: string;
  collection?: string;
  brand?: string;
  colors?: { name: string; hex: string }[];
  sizes?: number[];
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
};

export type ApiReview = {
  id: string;
  name: string;
  rating: number;
  text: string;
  date: string;
};

export type ApiUser = {
  id: string;
  name: string;
  email: string;
};

export type ApiCartItem = ApiProduct & {
  qty: number;
  size?: number;
  color?: string;
};

export type ShippingAddress = {
  name: string;
  email: string;
  phone?: string;
  address: string;
  city: string;
  zip: string;
};

export type ProductFilters = {
  category?: string;
  collection?: string;
  brand?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  size?: number;
  color?: string;
  minRating?: number;
  isNewArrival?: boolean;
  limit?: number;
};

export type ApiNotification = {
  id: string;
  type: "order_success" | "order_status";
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("treadly.token");
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem("treadly.token", token);
  else localStorage.removeItem("treadly.token");
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}/api${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const json = (await res.json()) as ApiResponse<T>;
  if (!json.success) throw new Error("message" in json ? json.message : "Request failed");
  return json.data;
}

function buildProductQuery(params?: ProductFilters) {
  const q = new URLSearchParams();
  if (!params) return "";
  if (params.category) q.set("category", params.category);
  if (params.collection) q.set("collection", params.collection);
  if (params.brand) q.set("brand", params.brand);
  if (params.search) q.set("search", params.search);
  if (params.minPrice != null) q.set("minPrice", String(params.minPrice));
  if (params.maxPrice != null) q.set("maxPrice", String(params.maxPrice));
  if (params.size != null) q.set("size", String(params.size));
  if (params.color) q.set("color", params.color);
  if (params.minRating != null) q.set("minRating", String(params.minRating));
  if (params.isNewArrival) q.set("isNewArrival", "true");
  if (params.limit) q.set("limit", String(params.limit));
  return q.toString();
}

export const api = {
  health: () => request<{ status: string; database: string }>("/health"),

  getProducts: (params?: ProductFilters) => {
    const qs = buildProductQuery(params);
    return request<{ products: ApiProduct[]; count: number }>(`/products${qs ? `?${qs}` : ""}`);
  },

  getBestsellers: () =>
    request<{ products: ApiProduct[]; count: number }>("/products/bestsellers"),

  getNewArrivals: () =>
    request<{ products: ApiProduct[]; count: number }>("/products/new-arrivals"),

  getBrands: () =>
    request<{ brands: { name: string; count: number }[]; count: number }>("/brands"),

  getProduct: (slug: string) =>
    request<{ product: ApiProduct; related: ApiProduct[] }>(`/products/${slug}`),

  getReviews: (slug: string) =>
    request<{ reviews: ApiReview[]; count: number }>(`/products/${slug}/reviews`),

  submitReview: (slug: string, data: { rating: number; text: string }) =>
    request<{ review: ApiReview }>(`/products/${slug}/reviews`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  login: (email: string, password: string) =>
    request<{ user: ApiUser; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (name: string, email: string, password: string) =>
    request<{ user: ApiUser; token: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  me: () => request<{ user: ApiUser }>("/auth/me"),

  logout: () =>
    request<{ message: string }>("/auth/logout", { method: "POST" }),

  getCart: () =>
    request<{ items: ApiCartItem[]; subtotal: number; count: number }>("/cart"),

  addToCart: (productId: string, qty = 1, size?: number, color?: string) =>
    request<{ items: ApiCartItem[]; subtotal: number; count: number }>("/cart", {
      method: "POST",
      body: JSON.stringify({ productId, qty, size, color }),
    }),

  syncCart: (items: { productId: string; qty: number; size?: number; color?: string }[]) =>
    request<{ items: ApiCartItem[]; subtotal: number; count: number }>("/cart/sync", {
      method: "POST",
      body: JSON.stringify({ items }),
    }),

  removeFromCart: (productId: string) =>
    request<{ message: string }>(`/cart/${productId}`, { method: "DELETE" }),

  clearCart: () =>
    request<{ items: []; subtotal: number; count: number }>("/cart", { method: "DELETE" }),

  getFavorites: () =>
    request<{ favorites: ApiProduct[]; count: number }>("/favorites"),

  addFavorite: (productId: string) =>
    request<{ product: ApiProduct }>("/favorites", {
      method: "POST",
      body: JSON.stringify({ productId }),
    }),

  removeFavorite: (productId: string) =>
    request<{ message: string }>(`/favorites/${productId}`, { method: "DELETE" }),

  createOrder: (shippingAddress: ShippingAddress) =>
    request<{ order: { id: string; total: number; status: string } }>("/orders", {
      method: "POST",
      body: JSON.stringify({ shippingAddress }),
    }),

  getOrders: () =>
    request<{
      orders: { id: string; total: number; status: string; createdAt: string }[];
      count: number;
    }>("/orders"),

  getNotifications: () =>
    request<{ notifications: ApiNotification[]; unread: number; count: number }>(
      "/notifications",
    ),

  markNotificationsRead: () =>
    request<{ message: string }>("/notifications", {
      method: "PATCH",
      body: JSON.stringify({ markAllRead: true }),
    }),
};

export function toProduct(p: ApiProduct) {
  return { id: p.id, name: p.name, price: p.price, img: p.img };
}

