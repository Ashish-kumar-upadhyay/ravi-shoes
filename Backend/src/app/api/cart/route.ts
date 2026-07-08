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
import { cartItemSchema } from "@/lib/validate";
import { getPopulatedCart, mergeCartItem } from "@/lib/cart";

export { handleOptions as OPTIONS };

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to view cart");

    const cart = await getPopulatedCart(String(user._id));
    return jsonOk(cart);
  } catch (err) {
    console.error("Cart get error:", err);
    return jsonError("Failed to fetch cart", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to add to cart");

    const body = await req.json();
    const parsed = cartItemSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid input");
    }

    const product = await Product.findOne({ slug: parsed.data.productId });
    if (!product) return jsonError("Product not found", 404);

    let cart = await Cart.findOne({ user: user._id });
    if (!cart) {
      cart = await Cart.create({
        user: user._id,
        items: [],
      });
    }

    mergeCartItem(
      cart.items,
      product._id,
      parsed.data.qty,
      parsed.data.size,
      parsed.data.color,
    );

    await cart.save();
    const result = await getPopulatedCart(String(user._id));
    return jsonOk(result, 201);
  } catch (err) {
    console.error("Cart add error:", err);
    return jsonError("Failed to update cart", 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to clear cart");

    await Cart.findOneAndUpdate({ user: user._id }, { items: [] });
    return jsonOk({ items: [], subtotal: 0, count: 0 });
  } catch (err) {
    console.error("Cart clear error:", err);
    return jsonError("Failed to clear cart", 500);
  }
}
