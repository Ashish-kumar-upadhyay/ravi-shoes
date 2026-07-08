import mongoose, { Schema, models, model } from "mongoose";

export type NotificationType = "order_success" | "order_status";

export interface INotification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  message: string;
  orderId?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["order_success", "order_status"], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order" },
    read: { type: Boolean, default: false },
  },
  { timestamps: true },
);

NotificationSchema.index({ user: 1, read: 1, createdAt: -1 });

export const Notification =
  models.Notification || model<INotification>("Notification", NotificationSchema);
