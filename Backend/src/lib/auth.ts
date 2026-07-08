import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { User } from "@/models/User";
import type { IUser } from "@/types";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-dev-secret";

export type JwtPayload = { userId: string; email: string };

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);
  return req.cookies.get("token")?.value ?? null;
}

export async function getAuthUser(req: NextRequest): Promise<IUser | null> {
  const token = getTokenFromRequest(req);
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const user = await User.findById(payload.userId).select("-password");
  return user;
}

export function authError(message = "Unauthorized") {
  return Response.json({ success: false, message }, { status: 401 });
}

export function jsonOk<T>(data: T, status = 200) {
  return Response.json({ success: true, data }, { status });
}

export function jsonError(message: string, status = 400) {
  return Response.json({ success: false, message }, { status });
}

export async function handleOptions() {
  return new Response(null, { status: 204 });
}
