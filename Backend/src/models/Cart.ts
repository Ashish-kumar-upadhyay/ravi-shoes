import mongoose, { Schema, models, model } from "mongoose";
import type { ICart } from "@/types";

const CartItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1, default: 1 },
    size: { type: Number },
    color: { type: String },
  },
  { _id: false },
);

const CartSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

export const Cart = models.Cart || model<ICart>("Cart", CartSchema);
