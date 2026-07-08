const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:3000",
  "https://ravi-shoes.vercel.app",
  "https://luxuryshoes.dpdns.org",
];

export function getAllowedOrigins(): string[] {
  const fromEnv =
    process.env.FRONTEND_URL?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) ?? [];

  return [...new Set([...DEFAULT_ORIGINS, ...fromEnv])];
}

export function resolveCorsOrigin(requestOrigin: string | null): string | null {
  if (!requestOrigin) return null;
  return getAllowedOrigins().includes(requestOrigin) ? requestOrigin : null;
}

export function buildCorsHeaders(requestOrigin: string | null): Headers {
  const headers = new Headers();
  const origin = resolveCorsOrigin(requestOrigin);

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
  }

  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT,OPTIONS");
  headers.set(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization",
  );

  return headers;
}
