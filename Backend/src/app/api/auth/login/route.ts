import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";
import { loginSchema } from "@/lib/validate";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid input");
    }

    const { email, password } = parsed.data;
    const user = await User.findOne({ email }).select("+password");
    if (!user) return jsonError("Invalid email or password", 401);

    const match = await bcrypt.compare(password, user.password!);
    if (!match) return jsonError("Invalid email or password", 401);

    const token = signToken({ userId: String(user._id), email: user.email });

    const res = jsonOk({ user: formatUser(user), token });
    res.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    );
    return res;
  } catch (err) {
    console.error("Login error:", err);
    return jsonError("Login failed", 500);
  }
}
