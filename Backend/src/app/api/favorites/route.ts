import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Favorite } from "@/models/Favorite";
import { Product } from "@/models/Product";
import {
  getAuthUser,
  authError,
  jsonOk,
  jsonError,
  handleOptions,
} from "@/lib/auth";
import { formatProduct } from "@/lib/format";

export { handleOptions as OPTIONS };

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to view favorites");

    const favs = await Favorite.find({ user: user._id }).populate("product");
    const products = favs
      .map((f) => f.product)
      .filter(Boolean)
      .map((p) => formatProduct(p as never));

    return jsonOk({ favorites: products, count: products.length });
  } catch (err) {
    console.error("Favorites get error:", err);
    return jsonError("Failed to fetch favorites", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to save favorites");

    const body = await req.json();
    const productId = body.productId as string;
    if (!productId) return jsonError("productId is required");

    const product = await Product.findOne({ slug: productId });
    if (!product) return jsonError("Product not found", 404);

    await Favorite.findOneAndUpdate(
      { user: user._id, product: product._id },
      {},
      { upsert: true, new: true },
    );

    return jsonOk({ product: formatProduct(product) }, 201);
  } catch (err) {
    console.error("Favorite add error:", err);
    return jsonError("Failed to add favorite", 500);
  }
}
