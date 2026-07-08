import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Cart } from "@/models/Cart";
import { Order } from "@/models/Order";
import {
  getAuthUser,
  authError,
  jsonOk,
  jsonError,
  handleOptions,
} from "@/lib/auth";
import { orderSchema } from "@/lib/validate";
import type { ICartItem } from "@/types";
import { notifyOrderPlaced, simulateOrderProgress } from "@/lib/notifications";

export { handleOptions as OPTIONS };

type PopulatedCartItem = ICartItem & {
  product: { _id: unknown; name: string; price: number; img: string };
};

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to view orders");

    await simulateOrderProgress(String(user._id));

    const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 });
    return jsonOk({
      orders: orders.map((o) => ({
        id: String(o._id),
        items: o.items,
        subtotal: o.subtotal,
        tax: o.tax,
        total: o.total,
        status: o.status,
        shippingAddress: o.shippingAddress,
        createdAt: o.createdAt,
      })),
      count: orders.length,
    });
  } catch (err) {
    console.error("Orders list error:", err);
    return jsonError("Failed to fetch orders", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to checkout");

    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid shipping address");
    }

    const cart = await Cart.findOne({ user: user._id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return jsonError("Cart is empty", 400);
    }

    const orderItems = (cart.items as PopulatedCartItem[]).map((item) => {
      const p = item.product;
      return {
        product: p._id,
        name: p.name,
        price: p.price,
        img: p.img,
        qty: item.qty,
        size: item.size,
        color: item.color,
      };
    });

    const subtotal = orderItems.reduce((s, i) => s + i.price * i.qty, 0);
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      subtotal,
      tax,
      total,
      status: "confirmed",
      shippingAddress: parsed.data.shippingAddress,
    });

    cart.items = [];
    await cart.save();

    await notifyOrderPlaced(String(user._id), String(order._id), order.total);

    return jsonOk(
      {
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
      },
      201,
    );
  } catch (err) {
    console.error("Order create error:", err);
    return jsonError("Checkout failed", 500);
  }
}
