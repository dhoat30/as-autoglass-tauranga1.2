export const revalidate = 2592000; // applies to both page and metadata

import Header from "@/Components/UI/Header/Header";
import {
  getSinglePostData,
  getOptions,
} from "@/utils/fetchData";
import Footer from "@/Components/UI/Footer/Footer";
import GallerySection from "@/Components/UI/Gallery/GallerySection";
import { getPageUrl } from "@/site.config";

const PAGE_URL = getPageUrl("/our-work/gallery");

export async function generateMetadata(_props, parent) {
  const data = await getSinglePostData("gallery", "/wp-json/wp/v2/pages");

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
