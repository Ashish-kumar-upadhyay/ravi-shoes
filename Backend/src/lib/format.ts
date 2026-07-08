import type { IProduct } from "@/types";
import { resolveImgUrl } from "@/lib/url";

export function formatProduct(doc: IProduct & { _id?: unknown }) {
  return {
    id: doc.slug,
    slug: doc.slug,
    name: doc.name,
    price: doc.price,
    img: resolveImgUrl(doc.img),
    description: doc.description,
    category: doc.category,
    collection: doc.collection,
    colors: doc.colors,
    sizes: doc.sizes,
    isBestSeller: doc.isBestSeller,
    isNewArrival: doc.isNewArrival,
    brand: doc.brand,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
  };
}

export function formatUser(doc: { _id: unknown; name: string; email: string }) {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
  };
}
