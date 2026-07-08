import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Order } from "@/models/Order";
import { getAuthUser, authError, jsonOk, jsonError, handleOptions } from "@/lib/auth";

export { handleOptions as OPTIONS };

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to view order");

    const { id } = await params;
    const order = await Order.findOne({ _id: id, user: user._id });
    if (!order) return jsonError("Order not found", 404);

    return jsonOk({
      order: {
        id: String(order._id),
        items: order.items,
        subtotal: order.subtotal,
        tax: order.tax,
        total: order.total,
        status: order.status,
        shippingAddress: order.shippingAddress,
        createdAt: order.createdAt,
      },
    });
  } catch (err) {
    console.error("Order detail error:", err);
    return jsonError("Failed to fetch order", 500);
  }
}
