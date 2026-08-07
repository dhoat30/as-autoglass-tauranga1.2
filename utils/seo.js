import { getPageUrl, siteName, siteUrl } from "@/site.config";

const HTML_ENTITIES = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "…",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  ndash: "–",
  nbsp: " ",
  quot: '"',
  rdquo: "”",
  rsquo: "’",
};

export function plainText(value = "") {
  return String(value)
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#(x?[\da-f]+);/gi, (_match, entity) => {
      const radix = entity[0].toLowerCase() === "x" ? 16 : 10;
      const valueToParse = radix === 16 ? entity.slice(1) : entity;
      const codePoint = Number.parseInt(valueToParse, radix);
      return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : " ";
    })
    .replace(/&([a-z]+);/gi, (match, entity) => HTML_ENTITIES[entity.toLowerCase()] ?? match)
    .replace(/\s+/g, " ")
    .trim();
}

export const DEFAULT_OG_IMAGE = {
  url: getPageUrl("/opengraph-image"),
  width: 1200,
  height: 630,
  alt: `${siteName} — Windscreen Repair & Replacement Tauranga`,
};

function getYoastImages(yoast, title) {
  const images = Array.isArray(yoast?.og_image) ? yoast.og_image : [];

  return images
    .filter((image) => image?.url)
    .map((image) => ({
      url: image.url,
      ...(image.width ? { width: image.width } : {}),
      ...(image.height ? { height: image.height } : {}),
      alt: image.alt || title,
    }));
}

function getRobots(yoast) {
  const index = yoast?.robots?.index !== "noindex";
  const follow = yoast?.robots?.follow !== "nofollow";

  return {
    index,
    follow,
    googleBot: {
      index,
      follow,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };
}

export function buildMetadata({
  yoast = {},
  path = "/",
  fallbackTitle,
  fallbackDescription,
  type = "website",
}) {
  const title = plainText(yoast?.title) || fallbackTitle || siteName;
  const description =
    plainText(yoast?.description) || plainText(fallbackDescription);
  const canonical = getPageUrl(path);
  const yoastImages = getYoastImages(yoast, title);
  const images = yoastImages.length ? yoastImages : [DEFAULT_OG_IMAGE];
  const twitterImage = yoast?.twitter_image || images[0]?.url;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    alternates: { canonical },
    robots: getRobots(yoast),
    openGraph: {
      title: plainText(yoast?.og_title) || title,
      description: plainText(yoast?.og_description) || description,
      url: canonical,
      siteName,
      locale: "en_NZ",
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: plainText(yoast?.twitter_title) || title,
      description: plainText(yoast?.twitter_description) || description,
      images: [twitterImage],
    },
  };
}

export function getFaqItems(sections) {
  if (!Array.isArray(sections)) return [];

  const seen = new Set();

  return sections
    .filter((section) => section?.acf_fc_layout === "local_faq")
    .flatMap((section) => (Array.isArray(section?.items) ? section.items : []))
    .map((item) => ({
      question: plainText(item?.question),
      answer: plainText(item?.answer),
    }))
    .filter(({ question, answer }) => {
      const key = question.toLowerCase();
      if (!question || !answer || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function buildFaqSchema(sections) {
  const faqs = getFaqItems(sections);
  if (!faqs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

export function getBusinessContact() {
  return {
    phone: process.env.NEXT_PUBLIC_PHONE_NUMBER || "",
    email: process.env.NEXT_PUBLIC_EMAIL || "",
    address:
      process.env.NEXT_PUBLIC_ADDRESS || process.env.NEXT_ADDRESS || "",
  };
}
