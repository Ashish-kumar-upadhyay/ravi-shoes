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

export { handleOptions as OPTIONS };

type Params = { params: Promise<{ productId: string }> };

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to remove favorites");

    const { productId } = await params;
    const product = await Product.findOne({ slug: productId });
    if (!product) return jsonError("Product not found", 404);

    await Favorite.deleteOne({ user: user._id, product: product._id });
    return jsonOk({ message: "Removed from favorites" });
  } catch (err) {
    console.error("Favorite delete error:", err);
    return jsonError("Failed to remove favorite", 500);
  }
}
