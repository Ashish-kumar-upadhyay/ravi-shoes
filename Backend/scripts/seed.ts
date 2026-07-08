import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { seedProducts, seedReviews } from "../src/lib/seed-data";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("MONGODB_URI missing in .env");
  process.exit(1);
}

async function seed() {
  await mongoose.connect(MONGODB_URI);

  const db = mongoose.connection.db!;
  const collections = ["products", "users", "reviews", "carts", "favorites", "orders"];

  for (const name of collections) {
    try {
      await db.collection(name).deleteMany({});
      console.log(`Cleared ${name}`);
    } catch {
      /* collection may not exist yet */
    }
  }

  const Product = mongoose.model(
    "Product",
    new mongoose.Schema({}, { strict: false }),
    "products",
  );

  const inserted = await Product.insertMany(
    seedProducts.map((p) => ({
      ...p,
      rating: 4.7,
      reviewCount: 0,
    })),
  );
  console.log(`Seeded ${inserted.length} products`);

  const slugToId = new Map(inserted.map((p) => [p.slug as string, p._id]));

  const User = mongoose.model("User", new mongoose.Schema({}, { strict: false }), "users");
  const demoPassword = await bcrypt.hash("demo1234", 10);
  const demoUser = await User.create({
    name: "Demo User",
    email: "demo@treadly.com",
    password: demoPassword,
  });
  console.log("Demo user: demo@treadly.com / demo1234");

  const Review = mongoose.model("Review", new mongoose.Schema({}, { strict: false }), "reviews");
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
  console.log(`Seeded ${seedReviews.length} reviews`);

  for (const p of inserted) {
    const count = await Review.countDocuments({ product: p._id });
    if (count > 0) {
      const avg = await Review.aggregate([
        { $match: { product: p._id } },
        { $group: { _id: null, avg: { $avg: "$rating" } } },
      ]);
      await Product.updateOne(
        { _id: p._id },
        { reviewCount: count, rating: Math.round((avg[0]?.avg ?? 4.7) * 10) / 10 },
      );
    }
  }

  console.log("Seed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
