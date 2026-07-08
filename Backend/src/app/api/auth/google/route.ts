import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, jsonOk, jsonError, handleOptions } from "@/lib/auth";
import { formatUser } from "@/lib/format";

export { handleOptions as OPTIONS };

export async function GET(req: Request) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:8080/api/auth/google/callback";

  if (!clientId) {
    return jsonError("Google Client ID not configured", 500);
  }

  const scope = encodeURIComponent("openid profile email");
  const state = Math.random().toString(36).substring(2, 15);
  
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&state=${state}`;

  return Response.json({ success: true, authUrl });
}
