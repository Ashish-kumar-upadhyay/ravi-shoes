export function getApiBaseUrl(): string {
  if (process.env.API_URL) return process.env.API_URL.replace(/\/$/, "");
  if (process.env.RENDER_EXTERNAL_URL) return process.env.RENDER_EXTERNAL_URL.replace(/\/$/, "");
  return "http://localhost:5000";
}

/** Store only relative paths like /uploads/file.png in the database. */
export function normalizeImgForStorage(img?: string): string | undefined {
  if (!img) return img;
  if (img.startsWith("/")) return img;

  if (img.startsWith("http://") || img.startsWith("https://")) {
    try {
      return new URL(img).pathname;
    } catch {
      return img;
    }
  }

  return img.startsWith("/") ? img : `/${img}`;
}

/** Resolve stored image paths to the correct public URL for the current environment. */
export function resolveImgUrl(img: string): string {
  if (!img) return img;
  if (img.startsWith("data:")) return img;

  const path = normalizeImgForStorage(img) ?? img;
  const base = getApiBaseUrl();
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
