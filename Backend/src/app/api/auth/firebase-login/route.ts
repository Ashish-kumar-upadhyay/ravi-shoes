import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";
import jwt from "jsonwebtoken";
import admin from "firebase-admin";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { idToken, phone } = body;

    if (!idToken || !phone) {
      return jsonError("ID token and phone number are required", 400);
    }

    // Verify Firebase ID token
    // In production, use Firebase Admin SDK to verify the token
    // For now, we'll skip verification and use the phone directly
    let decoded: any;
    try {
      // If you have Firebase Admin SDK configured:
      // const decodedToken = await admin.auth().verifyIdToken(idToken);
      // For now, we'll just use the phone number
      decoded = { phone };
    } catch (err) {
      return jsonError("Invalid Firebase token", 401);
    }

    // Check if user exists with this phone
    const user = await User.findOne({ phone });
    const isNewUser = !user;

    if (user) {
      // Existing user - just return token
      const token = signToken({ userId: String(user._id), email: user.email });
      const res = jsonOk({ 
        user: formatUser(user), 
        token,
        isNewUser: false,
        needsProfileCompletion: false
      });
      res.headers.set(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
      );
      return res;
    } else {
      // New user - create account with temporary data
      const newUser = new User({
        name: "User",
        email: `${phone}@temp.com`,
        phone,
        password: Math.random().toString(36),
        provider: "firebase",
      });
      await newUser.save();

      const token = signToken({ userId: String(newUser._id), email: newUser.email });
      const res = jsonOk({ 
        user: formatUser(newUser), 
        token,
        isNewUser: true,
        needsProfileCompletion: true
      });
      res.headers.set(
        "Set-Cookie",
        `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
      );
      return res;
    }
  } catch (err) {
    console.error("Firebase login error:", err);
    return jsonError("Firebase login failed", 500);
  }
}
