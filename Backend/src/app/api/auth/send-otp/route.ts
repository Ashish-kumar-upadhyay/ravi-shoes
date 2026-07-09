import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { jsonOk, jsonError, handleOptions } from "@/lib/auth";

export { handleOptions as OPTIONS };

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { phone } = body;

    if (!phone) {
      return jsonError("Phone number is required", 400);
    }

    // Check if user exists with this phone
    const user = await User.findOne({ phone });
    if (!user) {
      return jsonError("User not found with this phone number", 404);
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // In production, you would send this via SMS service like Twilio
    // For now, we'll log it and return it for testing
    console.log(`OTP for ${phone}: ${otp}`);
    
    // Store OTP in user document (in production, use Redis with expiry)
    user.otp = otp;
    user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await user.save();

    return jsonOk({ 
      success: true, 
      message: "OTP sent successfully",
      // For testing only - remove in production
      otp: process.env.NODE_ENV === 'development' ? otp : undefined 
    });
  } catch (err) {
    console.error("Send OTP error:", err);
    return jsonError("Failed to send OTP", 500);
  }
}
