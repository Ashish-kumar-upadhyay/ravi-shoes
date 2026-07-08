import { Product } from "@/models/Product";
import { normalizeImgForStorage } from "@/lib/url";

let migrationStarted = false;

export async function fixStoredImageUrls() {
  if (migrationStarted) return;
  migrationStarted = true;

  const products = await Product.find({ img: { $regex: "^https?://" } }).select("_id img");

  await Promise.all(
    products.map(async (product) => {
      const normalized = normalizeImgForStorage(product.img);
      if (normalized && normalized !== product.img) {
        await Product.updateOne({ _id: product._id }, { img: normalized });
      }
    }),
  );
}
