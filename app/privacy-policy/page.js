export const revalidate = 2592000;

import PolicyPage from "@/Components/Pages/PolicyPage/PolicyPage";
import { siteName } from "@/site.config";
import { getOptions, getSinglePostData } from "@/utils/fetchData";
import { buildMetadata } from "@/utils/seo";

const SLUG = "privacy-policy";
const DESCRIPTION =
  "How AS Autoglass collects, uses, and protects information provided through our website and enquiry forms.";

export async function generateMetadata() {
  const data = await getSinglePostData(SLUG, "/wp-json/wp/v2/pages");
  const seo = Array.isArray(data) && data.length ? data[0].yoast_head_json : {};

  return buildMetadata({
    yoast: seo,
    path: `/${SLUG}`,
    fallbackTitle: `Privacy Policy | ${siteName}`,
    fallbackDescription: DESCRIPTION,
  });
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
