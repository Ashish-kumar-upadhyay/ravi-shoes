import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { phone, otp } = body;

    if (!phone || !otp) {
      return jsonError("Phone number and OTP are required", 400);
    }

    // Find user with this phone
    const user = await User.findOne({ phone });
    if (!user) {
      return jsonError("User not found", 404);
    }

    // Check if OTP matches and is not expired
    if (!user.otp || user.otp !== otp) {
      return jsonError("Invalid OTP", 400);
    }

    if (!user.otpExpiry || new Date(user.otpExpiry) < new Date()) {
      return jsonError("OTP has expired", 400);
    }

    // Clear OTP after successful verification
    user.otp = undefined;
    user.otpExpiry = undefined;
    
    // Check if this is a new user (has temporary email)
    const isNewUser = user.email.includes('@temp.com');
    
    await user.save();

    // Generate token
    const token = signToken({ userId: String(user._id), email: user.email });

    const res = jsonOk({ 
      user: formatUser(user), 
      token,
      isNewUser,
      needsProfileCompletion: isNewUser
    });
    res.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
    );
    return res;
  } catch (err) {
    console.error("Verify OTP error:", err);
    return jsonError("Failed to verify OTP", 500);
  }
}
