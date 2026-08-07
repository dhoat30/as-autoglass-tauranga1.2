import { notFound } from "next/navigation";
import Footer from "@/Components/UI/Footer/Footer";
import Header from "@/Components/UI/Header/Header";
import Layout from "@/Components/UI/Layout/Layout";
import reviewsData from "@/data/google-reviews.json";
import { getOptions, getSinglePostData } from "@/utils/fetchData";
import { getPageUrl, siteName, siteUrl } from "@/site.config";
import StructuredData from "@/Components/SEO/StructuredData";
import { buildMetadata, plainText } from "@/utils/seo";

export const revalidate = 2592000;
export const dynamicParams = true;

const SERVICE_API_ROUTE = "wp-json/wp/v2/service";
const VALID_SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function getSlug(params) {
  const slug = String(params?.slug || "").toLowerCase();
  return VALID_SLUG.test(slug) ? slug : null;
}

async function getService(slug) {
  if (!slug) return null;

  const data = await getSinglePostData(slug, SERVICE_API_ROUTE);
  return Array.isArray(data) && data.length > 0 ? data[0] : null;
}

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const slug = getSlug(resolvedParams);
  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service not found",
      robots: { index: false, follow: false },
    };
  }

  const seo = service.yoast_head_json || {};
  const title = seo.title || plainText(service.title?.rendered) || siteName;
  const description =
    seo.description || plainText(service.excerpt?.rendered) ||
    `Professional ${plainText(service.title?.rendered).toLowerCase()} from ${siteName}.`;

  return buildMetadata({
    yoast: seo,
    path: `/services/${slug}`,
    fallbackTitle: title,
    fallbackDescription: description,
  });
}

export default async function ServicePage({ params }) {
  const resolvedParams = await params;
  const slug = getSlug(resolvedParams);

  if (!slug) notFound();

  const [service, options] = await Promise.all([
    getService(slug),
    getOptions(),
  ]);

  if (!service) notFound();

  const serviceName = plainText(service.title?.rendered) || "Autoglass service";
  const pageUrl = getPageUrl(`/services/${slug}`);
  const sections = service.acf?.sections;
  const reviewerPics = options?.review_section_?.reviewer_pics;
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: serviceName,
    serviceType: serviceName,
    url: pageUrl,
    provider: {
      "@type": "AutoRepair",
      "@id": `${siteUrl}/#business`,
      name: siteName,
      url: siteUrl,
    },
    areaServed: [
      { "@type": "City", name: "Tauranga" },
      { "@type": "AdministrativeArea", name: "Western Bay of Plenty" },
    ],
  };

  return (
    <>
      <StructuredData data={serviceSchema} />
      <Header />
      <main>
        <Layout
          googleReviewsData={reviewsData}
          galleryData={options?.gallery}
          uspTable={options?.usp_table}
          sections={sections}
          ductCleaning={options?.["12a_duct_cleaning"]}
          clientLogos={
            options?.client_logos ||
            options?.clients_logos ||
            options?.client_logos_section
          }
          uspData={options?.usp}
          statsData={options?.status}
          locationsCovered={options?.locations_covered}
          hoursCalculatorData={options?.hours_calculator}
          servicesData={options?.services}
          reviewerPics={reviewerPics}
        />
      </main>
      <Footer
        showFooterCta={false}
        className="mt-32"
        footerCtaData={options?.footer_cta}
        contactInfo={options?.contact_info}
        socialData={options?.social_links}
        heroUspData={options?.hero_usp}
      />
    </>
  );
}
