import type { ProductCategory, CollectionType } from "@/types";

export type ProductQueryParams = {
  category?: string | null;
  collection?: string | null;
  brand?: string | null;
  search?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  size?: string | null;
  color?: string | null;
  minRating?: string | null;
  isNewArrival?: string | null;
  limit?: string | null;
};

export function buildProductFilter(params: ProductQueryParams) {
  const filter: Record<string, unknown> = {};

  if (params.category && params.category !== "all") {
    filter.category = params.category as ProductCategory;
  }
  if (params.collection) {
    filter.collection = params.collection as CollectionType;
  }
  if (params.brand) {
    filter.brand = { $regex: new RegExp(`^${escapeRegex(params.brand)}$`, "i") };
  }
  if (params.search) {
    filter.$or = [
      { name: { $regex: params.search, $options: "i" } },
      { brand: { $regex: params.search, $options: "i" } },
      { description: { $regex: params.search, $options: "i" } },
    ];
  }
  if (params.minPrice || params.maxPrice) {
    const price: Record<string, number> = {};
    if (params.minPrice) price.$gte = Number(params.minPrice);
    if (params.maxPrice) price.$lte = Number(params.maxPrice);
    if (!Number.isNaN(price.$gte) || !Number.isNaN(price.$lte)) {
      filter.price = price;
    }
  }
  if (params.size) {
    filter.sizes = Number(params.size);
  }
  if (params.color) {
    filter["colors.name"] = { $regex: new RegExp(`^${escapeRegex(params.color)}$`, "i") };
  }
  if (params.minRating) {
    const min = Number(params.minRating);
    if (!Number.isNaN(min)) filter.rating = { $gte: min };
  }
  if (params.isNewArrival === "true") {
    filter.isNewArrival = true;
  }

  const limit = Math.min(Number(params.limit ?? 50), 100);
  return { filter, limit };
}

function escapeRegex(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
