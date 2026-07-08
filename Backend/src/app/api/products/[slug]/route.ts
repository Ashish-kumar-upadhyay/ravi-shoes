import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatProduct } from "@/lib/format";

export { handleOptions as OPTIONS };

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug });
    if (!product) return jsonError("Product not found", 404);

    const related = await Product.find({
      slug: { $ne: slug },
      $or: [{ category: product.category }, { collection: product.collection }],
    })
      .limit(4);

    return jsonOk({
      product: formatProduct(product),
      related: related.map(formatProduct),
    });
  } catch (err) {
    console.error("Product detail error:", err);
    return jsonError("Failed to fetch product", 500);
  }
}
