import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, toProduct, type ApiProduct, type ProductFilters } from "@/lib/api";
import type { Product } from "@/lib/store";

export function useProducts(category?: string, filters?: ProductFilters) {
  return useQuery({
    queryKey: ["products", category, filters],
    queryFn: async () => {
      const params: ProductFilters = { ...filters };
      if (category && category !== "all") params.category = category;
      const { products } = await api.getProducts(params);
      return products.map(toProduct);
    },
    staleTime: 60_000,
  });
}

export function useProductSearch(filters: ProductFilters) {
  return useQuery({
    queryKey: ["search", filters],
    queryFn: async () => {
      const { products } = await api.getProducts(filters);
      return products.map(toProduct);
    },
    enabled: !!(filters.search || filters.brand || filters.category || filters.minPrice || filters.maxPrice || filters.size || filters.color || filters.minRating),
    staleTime: 30_000,
  });
}

export function useBestsellers() {
  return useQuery({
    queryKey: ["bestsellers"],
    queryFn: async () => {
      const { products } = await api.getBestsellers();
      return products.map(toProduct);
    },
    staleTime: 60_000,
  });
}

export function useNewArrivals() {
  return useQuery({
    queryKey: ["new-arrivals"],
    queryFn: async () => {
      const { products } = await api.getNewArrivals();
      return products.map(toProduct);
    },
    staleTime: 60_000,
  });
}

export function useBrands() {
  return useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { brands } = await api.getBrands();
      return brands;
    },
    staleTime: 120_000,
  });
}

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { product, related } = await api.getProduct(slug);
      return {
        product: product as ApiProduct,
        related: related.map(toProduct) as Product[],
      };
    },
    enabled: !!slug,
  });
}

export function useProductReviews(slug: string) {
  return useQuery({
    queryKey: ["reviews", slug],
    queryFn: async () => {
      const { reviews } = await api.getReviews(slug);
      return reviews;
    },
    enabled: !!slug,
  });
}

export function useSubmitReview(slug: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { rating: number; text: string }) => api.submitReview(slug, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews", slug] });
      qc.invalidateQueries({ queryKey: ["product", slug] });
    },
  });
}

export function useNotifications(enabled: boolean) {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => api.getNotifications(),
    enabled,
    refetchInterval: 20_000,
    staleTime: 10_000,
  });
}
