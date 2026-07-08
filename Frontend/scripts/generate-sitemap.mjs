import { writeFileSync } from "fs";

const SITE = "https://luxuryshoes.dpdns.org";
const today = new Date().toISOString().slice(0, 10);

const staticPages = [
  ["/", 1.0, "daily"],
  ["/search", 0.9, "daily"],
  ["/search?category=Men", 0.8, "weekly"],
  ["/search?category=Woman", 0.8, "weekly"],
  ["/search?category=Children", 0.8, "weekly"],
  ["/search?category=Popular", 0.8, "weekly"],
  ["/about", 0.7, "monthly"],
  ["/faq", 0.7, "monthly"],
];

function escapeXml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderUrl(loc, priority, changefreq) {
  return `  <url>
    <loc>${escapeXml(`${SITE}${loc}`)}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
}

const response = await fetch("https://api.luxuryshoes.dpdns.org/api/products?limit=1000");
const json = await response.json();
const products = json.success ? (json.data?.products ?? []) : [];
const urls = [
  ...staticPages.map(([path, priority, changefreq]) => renderUrl(path, priority, changefreq)),
  ...products.map((product) => renderUrl(`/product/${product.slug || product.id}`, 0.8, "weekly")),
].join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

writeFileSync("public/sitemap.xml", xml);
console.log(`Sitemap written with ${staticPages.length + products.length} URLs`);
