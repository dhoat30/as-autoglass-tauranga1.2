export const revalidate = 2592000; // applies to both page and metadata

import Header from "@/Components/UI/Header/Header";
import {
  getSinglePostData,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import GallerySection from "@/Components/UI/Gallery/GallerySection";
import { buildMetadata } from "@/utils/seo";

export async function generateMetadata() {
  const data = await getSinglePostData("gallery", "/wp-json/wp/v2/pages");
  const page = Array.isArray(data) ? data[0] : null;

  return buildMetadata({
    yoast: page?.yoast_head_json,
    path: "/our-work/gallery",
    fallbackTitle: "Our Autoglass Work in Tauranga | AS Autoglass",
    fallbackDescription:
      "See windscreen replacements, chip repairs, ADAS recalibrations and headlight restoration completed by AS Autoglass in Tauranga.",
  });
}

export default async function Home() {
  const data = await getSinglePostData("gallery", "/wp-json/wp/v2/pages");
  const options = (await getOptions()) || {};
  const page = Array.isArray(data) ? data[0] : null;
  const galleryItems = options.gallery || page?.acf?.gallery;

  if (!Array.isArray(galleryItems) || galleryItems.length === 0) return null;

  return (
    <>
      <Header />
      <main>
        <GallerySection
          title={page?.title?.rendered || "Our Autoglass Work"}
          description={
            page?.content?.rendered ||
            "Explore windscreen replacements, repairs, recalibrations, and restoration work completed by our Tauranga team."
          }
          items={galleryItems}
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
