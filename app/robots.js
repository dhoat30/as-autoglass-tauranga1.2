import { getPageUrl, siteUrl } from "@/site.config";

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/form-submitted/"],
    },
    sitemap: getPageUrl("/sitemap.xml"),
    host: siteUrl,
  };
}
