import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { buildCorsHeaders } from "@/lib/cors";

function withCorsHeaders(response: NextResponse, requestOrigin: string | null) {
  const corsHeaders = buildCorsHeaders(requestOrigin);
  corsHeaders.forEach((value, key) => {
    response.headers.set(key, value);
  });
  return response;
}

export function middleware(request: NextRequest) {
  const requestOrigin = request.headers.get("origin");

  if (request.method === "OPTIONS") {
    return withCorsHeaders(new NextResponse(null, { status: 204 }), requestOrigin);
  }

  return withCorsHeaders(NextResponse.next(), requestOrigin);
}

export const config = {
  matcher: "/api/:path*",
};
