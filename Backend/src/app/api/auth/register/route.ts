import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";
import { registerSchema } from "@/lib/validate";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message ?? "Invalid input");
    }

    const { name, email, password } = parsed.data;
    const exists = await User.findOne({ email });
    if (exists) return jsonError("Email already registered", 409);

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    const token = signToken({ userId: String(user._id), email: user.email });

    const res = jsonOk({ user: formatUser(user), token });
    res.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    );
    return res;
  } catch (err) {
    console.error("Register error:", err);
    return jsonError("Registration failed", 500);
  }
}
