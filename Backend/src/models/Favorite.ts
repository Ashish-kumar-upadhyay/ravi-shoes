import mongoose, { Schema, models, model } from "mongoose";

const FavoriteSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true },
);

FavoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export const Favorite = models.Favorite || model("Favorite", FavoriteSchema);
