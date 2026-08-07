export const revalidate = 2592000;

import PolicyPage from "@/Components/Pages/PolicyPage/PolicyPage";
import { siteName } from "@/site.config";
import { getOptions, getSinglePostData } from "@/utils/fetchData";
import { buildMetadata } from "@/utils/seo";

const SLUG = "terms-and-conditions";
const DESCRIPTION =
  "The terms that apply when using the AS Autoglass website, requesting a quote, or booking our services.";

export async function generateMetadata() {
  const data = await getSinglePostData(SLUG, "/wp-json/wp/v2/pages");
  const seo = Array.isArray(data) && data.length ? data[0].yoast_head_json : {};

  return buildMetadata({
    yoast: seo,
    path: `/${SLUG}`,
    fallbackTitle: `Terms and Conditions | ${siteName}`,
    fallbackDescription: DESCRIPTION,
  });
}

export default async function TermsAndConditionsPage() {
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
