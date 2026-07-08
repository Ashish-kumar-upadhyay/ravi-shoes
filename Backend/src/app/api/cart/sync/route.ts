import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { Product } from "@/models/Product";
import {
  getAuthUser,
  authError,
  jsonOk,
  jsonError,
  handleOptions,
} from "@/lib/auth";
import { getPopulatedCart, mergeCartItem } from "@/lib/cart";
import { cartSyncSchema } from "@/lib/validate";

export { handleOptions as OPTIONS };

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to sync cart");

    const body = await req.json();
    const parsed = cartSyncSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid input");
    }

    if (parsed.data.items.length === 0) {
      const cart = await getPopulatedCart(String(user._id));
      return jsonOk(cart);
    }

    const slugs = parsed.data.items.map((i) => i.productId);
    const products = await Product.find({ slug: { $in: slugs } });
    const slugToProduct = new Map(products.map((p) => [p.slug, p]));

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = await Cart.create({ user: user._id, items: [] });
    }

    for (const item of parsed.data.items) {
      const product = slugToProduct.get(item.productId);
      if (!product) continue;
      mergeCartItem(cart.items, product._id, item.qty, item.size, item.color);
    }

    await cart.save();
    const result = await getPopulatedCart(String(user._id));
    return jsonOk(result);
  } catch (err) {
    console.error("Cart sync error:", err);
    return jsonError("Failed to sync cart", 500);
  }
}
