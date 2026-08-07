/** @type {import('next-sitemap').IConfig} */

const { siteUrl: SITE_URL } = require("./site.config");

const WORDPRESS_URL =
  process.env.WORDPRESS_URL ||
  process.env.WP_URL ||
  process.env.CMS_URL ||
  process.env.url ||
  "http://as-autoglass.local";

const normaliseUrl = (value) => String(value || "").replace(/\/$/, "");

const WORDPRESS_API_BASE = `${normaliseUrl(WORDPRESS_URL)}/wp-json/wp/v2`;

const PAGE_ROUTE_MAP = {
  home: ["/"],
  "contact-us": ["/contact-us"],
  gallery: ["/our-work/gallery"],
  "get-free-quote": ["/get-free-quote"],
  "privacy-policy": ["/privacy-policy"],
  "terms-and-conditions": ["/terms-and-conditions"],
  "commercial-cleaning": ["/services/commercial-cleaning"],
  "maintenance-services": ["/services/maintenance-services"],
};

// Priority and changefreq per route
const PAGE_SEO_CONFIG = {
  "/": { priority: 1.0, changefreq: "weekly" },
  "/services/commercial-cleaning": { priority: 0.9, changefreq: "weekly" },
  "/services/maintenance-services": { priority: 0.9, changefreq: "weekly" },
  "/get-free-quote": { priority: 0.8, changefreq: "monthly" },
  "/contact-us": { priority: 0.7, changefreq: "monthly" },
  "/our-work/gallery": { priority: 0.6, changefreq: "weekly" },
  "/privacy-policy": { priority: 0.3, changefreq: "yearly" },
  "/terms-and-conditions": { priority: 0.3, changefreq: "yearly" },
};

const EXCLUDED_PATHS = [
  "/thank-you",
  "/order-received",
  "/checkout",
  "/form-submitted/thank-you",
  "/gallery",
  "/manifest.webmanifest",
];

async function getWordPressPages(page = 1, allPages = []) {
  const endpoint = new URL(`${WORDPRESS_API_BASE}/pages`);
  endpoint.searchParams.set("status", "publish");
  endpoint.searchParams.set("per_page", "100");
  endpoint.searchParams.set("page", String(page));
  endpoint.searchParams.set("_fields", "slug,modified_gmt");

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`WordPress pages request failed: ${response.status}`);
  }

  const pages = await response.json();
  const nextPages = [...allPages, ...pages];
  const totalPages = Number(response.headers.get("x-wp-totalpages") || 1);

  if (page < totalPages) {
    return getWordPressPages(page + 1, nextPages);
  }

  return nextPages;
}

async function getWordPressServices(page = 1, allServices = []) {
  const endpoint = new URL(`${WORDPRESS_API_BASE}/service`);
  endpoint.searchParams.set("status", "publish");
  endpoint.searchParams.set("per_page", "100");
  endpoint.searchParams.set("page", String(page));
  endpoint.searchParams.set("_fields", "slug,modified_gmt");

  const response = await fetch(endpoint);

  if (!response.ok) {
    throw new Error(`WordPress services request failed: ${response.status}`);
  }

  const services = await response.json();
  const nextServices = [...allServices, ...services];
  const totalPages = Number(response.headers.get("x-wp-totalpages") || 1);

  if (page < totalPages) {
    return getWordPressServices(page + 1, nextServices);
  }

  return nextServices;
}

function getPageRoutes(page) {
  return PAGE_ROUTE_MAP[page.slug] || [];
}

module.exports = {
  siteUrl: normaliseUrl(SITE_URL),
  generateRobotsTxt: true,
  sitemapSize: 1000,
  changefreq: "weekly",
  priority: 0.7,
  autoLastmod: true,
  exclude: EXCLUDED_PATHS,
  transform: async (config, path) => {
    if (EXCLUDED_PATHS.includes(path)) {
      return null;
    }

    const seoConfig = PAGE_SEO_CONFIG[path] || {};

    return {
      loc: path,
      changefreq: seoConfig.changefreq || config.changefreq,
      priority: seoConfig.priority ?? config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    };
  },
  additionalPaths: async (config) => {
    try {
      const [pages, services] = await Promise.all([
        getWordPressPages(),
        getWordPressServices(),
      ]);
      const seen = new Set();

      const entries = [
        ...pages.flatMap((page) =>
          getPageRoutes(page).map((path) => ({
            path,
            modified: page.modified_gmt,
          })),
        ),
        ...services.map((service) => ({
          path: `/services/${service.slug}`,
          modified: service.modified_gmt,
        })),
      ];

      return Promise.all(
        entries
          .filter(({ path }) => {
            if (seen.has(path)) return false;
            seen.add(path);
            return true;
          })
          .map(async ({ path, modified }) => {
            const entry = await config.transform(config, path);
            return {
              ...entry,
              lastmod: modified ? new Date(`${modified}Z`).toISOString() : entry.lastmod,
            };
          })
      );
    } catch (error) {
      console.error("Failed to fetch WordPress pages for sitemap:", error);
      return [];
    }
  },
};
