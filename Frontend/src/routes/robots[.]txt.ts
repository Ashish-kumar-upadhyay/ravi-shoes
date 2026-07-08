import { createFileRoute } from "@tanstack/react-router";
import { SITE_URL } from "@/lib/seo";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        const robots = `User-agent: *
Allow: /
Disallow: /admin-login
Disallow: /admin-dashboard
Disallow: /admin-products
Disallow: /admin-orders
Disallow: /admin-analytics
Disallow: /admin-settings
Disallow: /login
Disallow: /signup
Disallow: /cart
Disallow: /favorites

Sitemap: ${SITE_URL}/sitemap.xml
`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
