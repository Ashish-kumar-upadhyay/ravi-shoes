import mongoose, { Schema, models, model } from "mongoose";
import type { IReview } from "@/types";

const ReviewSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

ReviewSchema.index({ product: 1, createdAt: -1 });
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export const Review = models.Review || model<IReview>("Review", ReviewSchema);
