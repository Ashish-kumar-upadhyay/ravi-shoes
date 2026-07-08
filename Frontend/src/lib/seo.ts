import type { ApiProduct } from "@/lib/api";

export const SITE_URL = (import.meta.env.VITE_SITE_URL || "https://luxuryshoes.dpdns.org").replace(/\/$/, "");
export const SITE_NAME = "Luxury Shoes";
export const DEFAULT_TITLE = "Luxury Shoes — Buy Premium Designer Footwear Online";
export const DEFAULT_DESCRIPTION =
  "Shop luxury shoes online at Luxury Shoes. Discover premium designer sneakers, formal shoes, and running footwear from Nike, Adidas, PUMA and more. Free shipping across India.";
export const SEO_KEYWORDS =
  "luxury shoes, designer shoes, premium footwear, buy luxury shoes online, men's luxury shoes, women's luxury shoes, luxury sneakers, formal luxury shoes";

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

type PageMetaOptions = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  type?: string;
};

export function buildPageMeta(options: PageMetaOptions) {
  const url = absoluteUrl(options.path ?? "/");
  const meta: Array<Record<string, string>> = [
    { title: options.title },
    { name: "description", content: options.description },
    { name: "keywords", content: SEO_KEYWORDS },
    { name: "author", content: SITE_NAME },
    { name: "robots", content: options.noindex ? "noindex, nofollow" : "index, follow" },
    { property: "og:title", content: options.title },
    { property: "og:description", content: options.description },
    { property: "og:type", content: options.type ?? "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "en_IN" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: options.title },
    { name: "twitter:description", content: options.description },
  ];

  if (options.image) {
    meta.push({ property: "og:image", content: options.image });
    meta.push({ name: "twitter:image", content: options.image });
  }

  return {
    meta,
    links: [{ rel: "canonical", href: url }],
  };
}

export function jsonLdScript(data: Record<string, unknown>) {
  return {
    type: "application/ld+json",
    children: JSON.stringify(data),
  };
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: absoluteUrl("/favicon.ico"),
    description: DEFAULT_DESCRIPTION,
    sameAs: [],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function productSchema(product: ApiProduct) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `${product.name} — premium luxury shoes available at ${SITE_NAME}.`,
    image: product.img,
    sku: product.slug || product.id,
    brand: product.brand
      ? { "@type": "Brand", name: product.brand }
      : { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug || product.id}`),
      priceCurrency: "INR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
    aggregateRating:
      product.rating && product.reviewCount
        ? {
            "@type": "AggregateRating",
            ratingValue: product.rating,
            reviewCount: product.reviewCount,
          }
        : undefined,
  };
}

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

export const NOINDEX_PAGE_META = buildPageMeta({
  title: `${SITE_NAME}`,
  description: DEFAULT_DESCRIPTION,
  noindex: true,
});
