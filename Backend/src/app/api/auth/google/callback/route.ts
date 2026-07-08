import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken, jsonOk, jsonError } from "@/lib/auth";
import { formatUser } from "@/lib/format";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get("code");
    const error = url.searchParams.get("error");

    if (error) {
      return jsonError(`Google OAuth error: ${error}`, 400);
    }

    if (!code) {
      return jsonError("Authorization code not provided", 400);
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI || "http://localhost:8080/api/auth/google/callback";

    if (!clientId || !clientSecret) {
      return jsonError("Google OAuth credentials not configured", 500);
    }

    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange error:", errorText);
      return jsonError("Failed to exchange authorization code", 400);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!userResponse.ok) {
      return jsonError("Failed to fetch user info from Google", 400);
    }

    const googleUser = await userResponse.json();
    const email = googleUser.email;
    const name = googleUser.name;
    const picture = googleUser.picture;

    if (!email) {
      return jsonError("Email not provided by Google", 400);
    }

    await connectDB();

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user
      user = await User.create({
        email,
        name: name || email.split("@")[0],
        password: "", // No password for OAuth users
        picture,
        provider: "google",
        googleId: googleUser.id,
      });
    } else {
      // Update existing user with Google info if needed
      if (!user.googleId) {
        user.googleId = googleUser.id;
        user.provider = "google";
        if (picture && !user.picture) {
          user.picture = picture;
        }
        await user.save();
      }
    }

    const token = signToken({ userId: String(user._id), email: user.email });

    const res = jsonOk({ user: formatUser(user), token });
    res.headers.set(
      "Set-Cookie",
      `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`
    );

    return res;
  } catch (err) {
    console.error("Google OAuth callback error:", err);
    return jsonError("Google authentication failed", 500);
  }
}
