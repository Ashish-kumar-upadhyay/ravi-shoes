import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatProduct } from "@/lib/format";

export { handleOptions as OPTIONS };

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({ isNewArrival: true }).sort({ createdAt: -1 }).limit(12);
    return jsonOk({ products: products.map(formatProduct), count: products.length });
  } catch (err) {
    console.error("New arrivals error:", err);
    return jsonError("Failed to fetch new arrivals", 500);
  }
}
