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

export { handleOptions as OPTIONS };

type Params = { params: Promise<{ productId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to update cart");

    const { productId } = await params;
    const body = await req.json();
    const qty = Number(body.qty);

    if (!qty || qty < 1) return jsonError("Quantity must be at least 1");

    const product = await Product.findOne({ slug: productId });
    if (!product) return jsonError("Product not found", 404);

    const cart = await Cart.findOne({ user: user._id });
    if (!cart) return jsonError("Cart not found", 404);

    const item = cart.items.find(
      (i: { product: unknown; qty: number }) =>
        String(i.product) === String(product._id),
    );
    if (!item) return jsonError("Item not in cart", 404);

    item.qty = qty;
    await cart.save();

    return jsonOk({ message: "Cart updated" });
  } catch (err) {
    console.error("Cart patch error:", err);
    return jsonError("Failed to update cart item", 500);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await getAuthUser(_req);
    if (!user) return authError("Sign in to remove from cart");

    const { productId } = await params;
    const product = await Product.findOne({ slug: productId });
    if (!product) return jsonError("Product not found", 404);

    await Cart.findOneAndUpdate(
      { user: user._id },
      { $pull: { items: { product: product._id } } },
    );

    return jsonOk({ message: "Item removed" });
  } catch (err) {
    console.error("Cart delete error:", err);
    return jsonError("Failed to remove item", 500);
  }
}
