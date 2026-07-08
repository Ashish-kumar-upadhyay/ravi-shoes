import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getAuthUser, authError, jsonOk, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";

export { handleOptions as OPTIONS };

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getAuthUser(req);
    if (!user) return authError();

    return jsonOk({ user: formatUser(user) });
  } catch (err) {
    console.error("Me error:", err);
    return authError();
  }
}
