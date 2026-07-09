import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";
import jwt from "jsonwebtoken";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { name, email } = body;

    if (!name || !email) {
      return jsonError("Name and email are required", 400);
    }

    // Get token from authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.replace("Bearer ", "");
    
    if (!token) {
      return jsonError("Unauthorized", 401);
    }

    // Verify token and get user ID
    const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
    let decoded: any;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return jsonError("Invalid token", 401);
    }

    const userId = decoded.userId;

    // Check if email already exists for another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return jsonError("Email already in use", 400);
    }

    // Update user profile
    const user = await User.findByIdAndUpdate(
      userId,
      { 
        name, 
        email,
      },
      { new: true }
    );

    if (!user) {
      return jsonError("User not found", 404);
    }

    return jsonOk({ 
      success: true, 
      message: "Profile completed successfully",
      user: formatUser(user)
    });
  } catch (err) {
    console.error("Complete profile error:", err);
    return jsonError("Failed to complete profile", 500);
  }
}
