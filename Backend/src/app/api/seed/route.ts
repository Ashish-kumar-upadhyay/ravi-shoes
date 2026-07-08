import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { seedProducts, seedReviews } from "@/lib/seed-data";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  const secret = req.headers.get("x-seed-secret");
  if (secret !== process.env.SEED_SECRET) {
    return jsonError("Unauthorized", 401);
  }

  try {
    await connectDB();

    await Promise.all([
      Product.deleteMany({}),
      Review.deleteMany({}),
      User.deleteMany({ email: "demo@treadly.com" }),
    ]);

    const products = await Product.insertMany(
      seedProducts.map((p) => ({ ...p, rating: 4.7, reviewCount: 0 })),
    );

    const slugToId = new Map(products.map((p) => [p.slug, p._id]));
    const hashed = await bcrypt.hash("demo1234", 10);
    const demoUser = await User.create({
      name: "Demo User",
      email: "demo@treadly.com",
      password: hashed,
    });

    for (const r of seedReviews) {
      const productId = slugToId.get(r.productSlug);
      if (!productId) continue;
      await Review.create({
        product: productId,
        user: demoUser._id,
        userName: r.userName,
        rating: r.rating,
        text: r.text,
      });
    }

    for (const p of products) {
      const count = await Review.countDocuments({ product: p._id });
      if (count > 0) {
        const avg = await Review.aggregate([
          { $match: { product: p._id } },
          { $group: { _id: null, avg: { $avg: "$rating" } } },
        ]);
        p.reviewCount = count;
        p.rating = Math.round((avg[0]?.avg ?? 4.7) * 10) / 10;
        await p.save();
      }
    }

    return jsonOk({
      message: "Database seeded",
      products: products.length,
      demoUser: { email: "demo@treadly.com", password: "demo1234" },
    });
  } catch (err) {
    console.error("Seed error:", err);
    return jsonError("Seed failed", 500);
  }
}
