import mongoose, { Schema, models, model } from "mongoose";
import type { IOrder, IOrderItem, OrderStatus } from "@/types";

const OrderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
    qty: { type: Number, required: true, min: 1 },
    size: { type: Number },
    color: { type: String },
  },
  { _id: false },
);

const ShippingSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
  },
  { _id: false },
);

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"] satisfies OrderStatus[],
      default: "pending",
    },
    shippingAddress: { type: ShippingSchema, required: true },
  },
  { timestamps: true },
);

OrderSchema.index({ user: 1, createdAt: -1 });

export const Order = models.Order || model<IOrder>("Order", OrderSchema);
