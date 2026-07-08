const DEFAULT_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:8081",
  "http://localhost:3000",
  "https://ravi-shoes.vercel.app",
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
