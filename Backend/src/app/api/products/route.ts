import { NextRequest } from "next/server";
import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatProduct } from "@/lib/format";
import { buildProductFilter } from "@/lib/product-filters";

export { handleOptions as OPTIONS };

const API_BASE = process.env.API_URL || "http://localhost:5000";

function normalizeImgUrl(img?: string) {
  if (!img) return img;
  if (img.startsWith(API_BASE)) return img.slice(API_BASE.length);
  return img;
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function buildProductLookup(id: string) {
  return Types.ObjectId.isValid(id) ? { _id: id } : { slug: id };
}

function normalizeProductBody(body: Record<string, unknown>): Record<string, unknown> {
  const { id: _id, image, img, ...rest } = body;
  const normalizedImg = normalizeImgUrl((image as string) || (img as string));
  return {
    ...rest,
    ...(normalizedImg !== undefined ? { img: normalizedImg } : {}),
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = req.nextUrl;
    const { filter, limit } = buildProductFilter({
      category: searchParams.get("category"),
      collection: searchParams.get("collection"),
      brand: searchParams.get("brand"),
      search: searchParams.get("search"),
      minPrice: searchParams.get("minPrice"),
      maxPrice: searchParams.get("maxPrice"),
      size: searchParams.get("size"),
      color: searchParams.get("color"),
      minRating: searchParams.get("minRating"),
      isNewArrival: searchParams.get("isNewArrival"),
      limit: searchParams.get("limit"),
    });

    const products = await Product.find(filter).sort({ createdAt: -1 }).limit(limit);
    return jsonOk({ products: products.map(formatProduct), count: products.length });
  } catch (err) {
    console.error("Products list error:", err);
    return jsonError("Failed to fetch products", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const normalized = normalizeProductBody(body);
    const name = String(normalized.name || "");
    const slug =
      (body.slug as string) ||
      slugify(name) ||
      `product-${Date.now()}`;

    const product = await Product.create({
      ...normalized,
      slug,
      description: normalized.description || "",
    });
    return jsonOk({ product: formatProduct(product) }, 201);
  } catch (err) {
    console.error("Product creation error:", err);
    return jsonError("Failed to create product", 500);
  }
}

export async function PUT(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { id } = body;

    if (!id) return jsonError("Product ID is required", 400);

    const updateData = normalizeProductBody(body);
    const product = await Product.findOneAndUpdate(buildProductLookup(String(id)), updateData, {
      new: true,
    });
    if (!product) return jsonError("Product not found", 404);

    return jsonOk({ product: formatProduct(product) });
  } catch (err) {
    console.error("Product update error:", err);
    return jsonError("Failed to update product", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = req.nextUrl;
    const id = searchParams.get("id");

    if (!id) return jsonError("Product ID is required", 400);

    const product = await Product.findOneAndDelete(buildProductLookup(id));
    if (!product) return jsonError("Product not found", 404);

    return jsonOk({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Product deletion error:", err);
    return jsonError("Failed to delete product", 500);
  }
}
