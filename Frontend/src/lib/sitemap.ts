import type { ApiProduct } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

const API_URL = import.meta.env.VITE_API_URL || "https://api.luxuryshoes.dpdns.org";

type SitemapEntry = {
  loc: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: number;
  lastmod?: string;
};

const STATIC_PAGES: SitemapEntry[] = [
  { loc: `${SITE_URL}/`, changefreq: "daily", priority: 1.0 },
  { loc: `${SITE_URL}/search`, changefreq: "daily", priority: 0.9 },
  { loc: `${SITE_URL}/search?category=Men`, changefreq: "weekly", priority: 0.8 },
  { loc: `${SITE_URL}/search?category=Woman`, changefreq: "weekly", priority: 0.8 },
  { loc: `${SITE_URL}/search?category=Children`, changefreq: "weekly", priority: 0.8 },
  { loc: `${SITE_URL}/search?category=Popular`, changefreq: "weekly", priority: 0.8 },
  { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: 0.7 },
  { loc: `${SITE_URL}/faq`, changefreq: "monthly", priority: 0.7 },
];

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function renderUrl(entry: SitemapEntry) {
  const lastmod = entry.lastmod ? `\n    <lastmod>${escapeXml(entry.lastmod)}</lastmod>` : "";
  const changefreq = entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : "";
  const priority =
    entry.priority != null ? `\n    <priority>${entry.priority.toFixed(1)}</priority>` : "";

  return `  <url>
    <loc>${escapeXml(entry.loc)}</loc>${lastmod}${changefreq}${priority}
  </url>`;
}

export async function fetchProductsForSitemap(): Promise<ApiProduct[]> {
  try {
    const response = await fetch(`${API_URL}/api/products?limit=1000`, {
      headers: { Accept: "application/json" },
    });

    if (!response.ok) return [];

    const json = (await response.json()) as {
      success: boolean;
      data?: { products?: ApiProduct[] };
    };

    return json.success ? (json.data?.products ?? []) : [];
  } catch (error) {
    console.error("Sitemap product fetch failed:", error);
    return [];
  }
}

export async function buildSitemapXml() {
  const today = new Date().toISOString().slice(0, 10);
  const products = await fetchProductsForSitemap();

  const productEntries: SitemapEntry[] = products.map((product) => ({
    loc: `${SITE_URL}/product/${product.slug || product.id}`,
    changefreq: "weekly",
    priority: 0.8,
    lastmod: today,
  }));

  const urls = [...STATIC_PAGES, ...productEntries]
    .map((entry) => ({ ...entry, lastmod: entry.lastmod ?? today }))
    .map(renderUrl)
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}
