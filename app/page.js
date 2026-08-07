export const revalidate = 2592000; // applies to both page and metadata

import Header from "@/Components/UI/Header/Header";
import {
  getSinglePostData,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import Layout from "@/Components/UI/Layout/Layout";
import reviewsData from "@/data/google-reviews.json";
import { buildMetadata } from "@/utils/seo";

export async function generateMetadata() {
  const data = await getSinglePostData("home", "wp-json/wp/v2/pages");
  const page = Array.isArray(data) ? data[0] : null;

  return buildMetadata({
    yoast: page?.yoast_head_json,
    path: "/",
    fallbackTitle: "Windscreen Repair & Replacement Tauranga | AS Autoglass",
    fallbackDescription:
      "Mobile windscreen replacement, chip repair, ADAS recalibration and headlight restoration from a local Tauranga autoglass team.",
  });
}

export default async function Home() {
  const data = await getSinglePostData("home", "wp-json/wp/v2/pages");
  const options = await getOptions();
  const sections = data?.[0]?.acf?.sections;
  const reviewerPics = options?.review_section_?.reviewer_pics;
  return (
    <>
      <Header />
      <main>
        <Layout
          googleReviewsData={reviewsData}
          galleryData={options.gallery}
          uspTable={options.usp_table}
          sections={sections}
          ductCleaning={options["12a_duct_cleaning"]}
          clientLogos={options.client_logos || options.clients_logos || options.client_logos_section}
          uspData={options.usp}
          statsData={options.status}
          locationsCovered={options.locations_covered}
          hoursCalculatorData={options.hours_calculator}
          servicesData={options.services}
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
