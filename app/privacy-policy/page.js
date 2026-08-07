export const revalidate = 2592000;

import PolicyPage from "@/Components/Pages/PolicyPage/PolicyPage";
import { getPageUrl, siteName, siteUrl } from "@/site.config";
import { getOptions, getSinglePostData } from "@/utils/fetchData";

const SLUG = "privacy-policy";
const PAGE_URL = getPageUrl(`/${SLUG}`);
const DESCRIPTION =
  "How AS Autoglass collects, uses, and protects information provided through our website and enquiry forms.";

export async function generateMetadata() {
  const data = await getSinglePostData(SLUG, "/wp-json/wp/v2/pages");
  const seo = Array.isArray(data) && data.length ? data[0].yoast_head_json : {};

  return {
    title: seo?.title || `Privacy Policy | ${siteName}`,
    description: seo?.description || DESCRIPTION,
    metadataBase: new URL(siteUrl),
    alternates: { canonical: PAGE_URL },
    openGraph: {
      title: seo?.og_title || seo?.title || `Privacy Policy | ${siteName}`,
      description: seo?.og_description || seo?.description || DESCRIPTION,
      url: PAGE_URL,
      siteName,
      images: seo?.og_image || [],
      type: "website",
    },
  };
}

export default async function PrivacyPolicyPage() {
  const [postData, options] = await Promise.all([
    getSinglePostData(SLUG, "/wp-json/wp/v2/pages"),
    getOptions(),
  ]);

  if (!Array.isArray(postData) || postData.length === 0) return null;

  return (
    <PolicyPage
      pageData={postData[0]}
      options={options || {}}
      description={DESCRIPTION}
    />
  );
}
