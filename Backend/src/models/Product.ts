import mongoose, { Schema, models, model } from "mongoose";
import type { IProduct } from "@/types";
import { normalizeImgForStorage } from "@/lib/url";

const ColorSchema = new Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false },
);

const ProductSchema = new Schema(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: ["all", "popular", "male", "female", "children"],
      default: "all",
    },
    collection: {
      type: String,
      enum: ["sneaker", "running", "formal"],
      default: "sneaker",
    },
    colors: { type: [ColorSchema], default: [] },
    sizes: { type: [Number], default: [40, 41, 42, 43, 44, 45] },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: false },
    brand: { type: String, default: "" },
    rating: { type: Number, default: 4.7 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ isBestSeller: 1 });
ProductSchema.index({ isNewArrival: 1 });
ProductSchema.index({ brand: 1 });

ProductSchema.pre("save", function () {
  if (this.img) {
    this.img = normalizeImgForStorage(this.img) ?? this.img;
  }
});

export const Product = models.Product || model<IProduct>("Product", ProductSchema);
