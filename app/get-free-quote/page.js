export const revalidate = 2592000; // applies to both page and metadata

import Header from "@/Components/UI/Header/Header";
import {
  getSinglePostData,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import reviewsData from "@/data/google-reviews.json";
import { getPageUrl } from "@/site.config";

const PAGE_URL = getPageUrl("/get-free-quote");

export async function generateMetadata(_props, parent) {
  const data = await getSinglePostData("get-free-quote", "/wp-json/wp/v2/pages");

  await parent;
  if (Array.isArray(data) && data.length > 0) {
    const seoData = data[0].yoast_head_json;
    return {
      title: seoData?.title,
      description: seoData?.description,
      metadataBase: new URL(process.env.siteUrl),
      alternates: {
        canonical: PAGE_URL,
      },
      openGraph: {
        title: seoData?.title,
        description: seoData?.description,
        url: PAGE_URL,
        siteName: process.env.siteName,
        images: [
          {
            url: seoData?.og_image && seoData?.og_image[0]?.url,
            width: 800,
            height: 600,
          },
          {
            url: seoData?.og_image && seoData?.og_image[0].url,
            width: 1800,
            height: 1600,
          },
        ],
        type: "website",
      },
    };
  }
}

export default async function Home() {
  const data = await getSinglePostData("get-free-quote", "/wp-json/wp/v2/pages");
  const options = (await getOptions()) || {};
  if (!Array.isArray(data) || data.length === 0) return null;
  const sections = data[0]?.acf?.sections;
  const reviewerPics = options?.review_section_?.reviewer_pics;

  return (
    <>
      <Header />
      <main>
        <Layout
          sections={sections}
          galleryData={options.gallery}
          ductCleaning={options["12a_duct_cleaning"]}
          clientLogos={options.client_logos || options.clients_logos || options.client_logos_section}
          uspData={options.usp}
          uspTable={options.usp_table}
          statsData={options.status}
          locationsCovered={options.locations_covered}
          hoursCalculatorData={options.hours_calculator}
          googleReviewsData={reviewsData}
          reviewerPics={reviewerPics}
        />
      </main>
      <Footer
        showFooterCta={false}
        className="mt-32"
        footerCtaData={options.footer_cta}
        contactInfo={options.contact_info}
        socialData={options.social_links}
        heroUspData={options.hero_usp}
      />
    </>
  );
}
