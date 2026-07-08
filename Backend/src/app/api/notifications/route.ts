import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Notification } from "@/models/Notification";
import {
  getAuthUser,
  authError,
  jsonOk,
  jsonError,
  handleOptions,
} from "@/lib/auth";
import { simulateOrderProgress } from "@/lib/notifications";

export { handleOptions as OPTIONS };

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError("Sign in to view notifications");

    await simulateOrderProgress(String(user._id));

    const notifications = await Notification.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unread = notifications.filter((n) => !n.read).length;

    return jsonOk({
      notifications: notifications.map((n) => ({
        id: String(n._id),
        type: n.type,
        title: n.title,
        message: n.message,
        orderId: n.orderId ? String(n.orderId) : undefined,
        read: n.read,
        createdAt: n.createdAt,
      })),
      unread,
      count: notifications.length,
    });
  } catch (err) {
    console.error("Notifications error:", err);
    return jsonError("Failed to fetch notifications", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError();

    const body = await req.json();
    if (body.markAllRead) {
      await Notification.updateMany({ user: user._id, read: false }, { read: true });
      return jsonOk({ message: "All marked as read" });
    }

    return jsonError("Invalid request");
  } catch (err) {
    console.error("Notifications patch error:", err);
    return jsonError("Failed to update notifications", 500);
  }
}
