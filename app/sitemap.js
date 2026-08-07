import { getPageUrl } from "@/site.config";
import { getAllPosts } from "@/utils/fetchData";

export const revalidate = 2592000;

const STATIC_ROUTES = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/send-photo", changeFrequency: "monthly", priority: 0.9 },
  { path: "/book-now", changeFrequency: "monthly", priority: 0.9 },
  { path: "/get-free-quote", changeFrequency: "monthly", priority: 0.8 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.7 },
  { path: "/our-work/gallery", changeFrequency: "weekly", priority: 0.7 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
  { path: "/terms-and-conditions", changeFrequency: "yearly", priority: 0.2 },
];

function validDate(value) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export default async function sitemap() {
  const services = await getAllPosts("wp-json/wp/v2/service", {
    status: "publish",
    _fields: "slug,modified,modified_gmt,status",
  });
  const serviceEntries = (Array.isArray(services) ? services : [])
    .filter((service) => service?.slug && service?.status !== "draft")
    .map((service) => ({
      url: getPageUrl(`/services/${service.slug}`),
      lastModified: validDate(service.modified_gmt || service.modified),
      changeFrequency: "monthly",
      priority: 0.8,
    }));

  return [
    ...STATIC_ROUTES.map(({ path, ...entry }) => ({
      url: getPageUrl(path),
      ...entry,
    })),
    ...serviceEntries,
  ];
}
