import { Notification } from "@/models/Notification";
import { Order } from "@/models/Order";
import type { OrderStatus } from "@/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export async function createNotification(
  userId: string,
  data: {
    type: "order_success" | "order_status";
    title: string;
    message: string;
    orderId?: string;
  },
) {
  return Notification.create({
    user: userId,
    ...data,
  });
}

export async function notifyOrderPlaced(userId: string, orderId: string, total: number) {
  return createNotification(userId, {
    type: "order_success",
    title: "Order Placed!",
    message: `Your order of $${total} has been confirmed. We'll notify you when it ships.`,
    orderId,
  });
}

export async function notifyOrderStatus(
  userId: string,
  orderId: string,
  status: OrderStatus,
) {
  const label = STATUS_LABELS[status];
  return createNotification(userId, {
    type: "order_status",
    title: `Order ${label}`,
    message: `Your order status has been updated to ${label}.`,
    orderId,
  });
}

/** Demo: auto-progress confirmed → shipped → delivered for status notifications */
export async function simulateOrderProgress(userId: string) {
  const orders = await Order.find({ user: userId, status: { $in: ["confirmed", "shipped"] } });

  for (const order of orders) {
    const age = Date.now() - new Date(order.updatedAt).getTime();
    if (order.status === "confirmed" && age > 15_000) {
      order.status = "shipped";
      await order.save();
      await notifyOrderStatus(userId, String(order._id), "shipped");
    } else if (order.status === "shipped" && age > 30_000) {
      order.status = "delivered";
      await order.save();
      await notifyOrderStatus(userId, String(order._id), "delivered");
    }
  }
}
