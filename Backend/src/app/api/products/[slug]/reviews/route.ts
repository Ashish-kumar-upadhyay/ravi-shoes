import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/models/Product";
import { Review } from "@/models/Review";
import {
  getAuthUser,
  authError,
  jsonOk,
  jsonError,
  handleOptions,
} from "@/lib/auth";
import { reviewSchema } from "@/lib/validate";

export { handleOptions as OPTIONS };

type Params = { params: Promise<{ slug: string }> };

export async function GET(_req: Request, { params }: Params) {
  try {
    await connectDB();
    const { slug } = await params;

    const product = await Product.findOne({ slug });
    if (!product) return jsonError("Product not found", 404);

    const reviews = await Review.find({ product: product._id })
      .sort({ createdAt: -1 })
      .limit(20);

    return jsonOk({
      reviews: reviews.map((r) => ({
        id: String(r._id),
        name: r.userName,
        rating: r.rating,
        text: r.text,
        date: r.createdAt,
      })),
      count: reviews.length,
    });
  } catch (err) {
    console.error("Reviews list error:", err);
    return jsonError("Failed to fetch reviews", 500);
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to write a review");

    const { slug } = await params;
    const product = await Product.findOne({ slug });
    if (!product) return jsonError("Product not found", 404);

    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid input");
    }

    const review = await Review.findOneAndUpdate(
      { user: user._id, product: product._id },
      {
        userName: user.name,
        rating: parsed.data.rating,
        text: parsed.data.text,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const stats = await Review.aggregate([
      { $match: { product: product._id } },
      { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
    ]);

    if (stats[0]) {
      product.rating = Math.round(stats[0].avg * 10) / 10;
      product.reviewCount = stats[0].count;
      await product.save();
    }

    return jsonOk(
      {
        review: {
          id: String(review._id),
          name: review.userName,
          rating: review.rating,
          text: review.text,
          date: review.createdAt,
        },
      },
      201,
    );
  } catch (err) {
    console.error("Review create error:", err);
    return jsonError("Failed to submit review", 500);
  }
}
