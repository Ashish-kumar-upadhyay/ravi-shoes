import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";

export { handleOptions as OPTIONS };

export async function GET() {
  try {
    await connectDB();
    const brands = await Product.distinct("brand", { brand: { $ne: "" } });
    const counts = await Product.aggregate([
      { $match: { brand: { $ne: "" } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return jsonOk({
      brands: brands.map((name) => ({
        name,
        count: counts.find((c) => c._id === name)?.count ?? 0,
      })),
      count: brands.length,
    });
  } catch (err) {
    console.error("Brands error:", err);
    return jsonError("Failed to fetch brands", 500);
  }
}
