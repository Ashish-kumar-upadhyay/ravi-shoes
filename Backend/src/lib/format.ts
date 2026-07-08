import type { IProduct } from "@/types";

export function formatProduct(doc: IProduct & { _id?: unknown }) {
  const baseUrl = process.env.API_URL || "http://localhost:5000";
  const imgUrl = doc.img.startsWith('/') ? `${baseUrl}${doc.img}` : doc.img;
  
  return {
    id: doc.slug,
    slug: doc.slug,
    name: doc.name,
    price: doc.price,
    img: imgUrl,
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
