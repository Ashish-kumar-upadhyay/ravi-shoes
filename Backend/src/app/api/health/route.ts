import { connectDB } from "@/lib/mongodb";
import { jsonOk } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    return jsonOk({ status: "ok", database: "connected", timestamp: new Date().toISOString() });
  } catch {
    return Response.json(
      { success: false, message: "Database connection failed" },
      { status: 503 },
    );
  }
}
