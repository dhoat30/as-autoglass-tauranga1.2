import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Image from "next/image";
import Link from "next/link";
import GallerySection from "@/Components/UI/Gallery/GallerySection";
import GoogleReviewsCarousel from "@/Components/UI/GoogleReviews/GoogleReviewsCarousel";
import SendPhotoForm from "@/Components/UI/SendPhoto/SendPhotoForm";
import reviewsData from "@/data/google-reviews.json";
import { getPageUrl, siteName } from "@/site.config";
import { getOptions } from "@/utils/fetchData";
import { DEFAULT_OG_IMAGE } from "@/utils/seo";
import styles from "./page.module.scss";

const PAGE_URL = getPageUrl("/send-photo");

export const metadata = {
  title: `Send a Photo for a Free Autoglass Quote | ${siteName}`,
  description:
    "Send AS Autoglass a photo for a fast, free assessment of windscreen damage, ADAS recalibration, or headlight polishing in Tauranga.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Send a Photo for a Free Autoglass Quote",
    description:
      "A quick photo is often all we need to recommend the right service and prepare your free quote.",
    url: PAGE_URL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

function getRatingSummary() {
  const reviews = Array.isArray(reviewsData?.reviews) ? reviewsData.reviews : [];
  const ratings = reviews.map((review) => Number(review.rating)).filter(Boolean);
  const average = ratings.length
    ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
    : 5;

  return {
    average: average.toFixed(1),
    total: reviewsData?.total || ratings.length,
  };
}

export default async function SendPhotoPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "07 543 0009";
  const phoneUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const rating = getRatingSummary();
  const options = await getOptions();
  const gallery = Array.isArray(options?.gallery) ? options.gallery : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mobile autoglass photo assessment",
    provider: {
      "@type": "LocalBusiness",
      name: siteName,
      url: getPageUrl(),
      telephone: phone,
    },
    areaServed: "Tauranga and Western Bay of Plenty",
    serviceType: [
      "Windscreen replacement",
      "Windscreen repair",
      "ADAS recalibration",
      "Headlight polishing",
    ],
    url: PAGE_URL,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <header className={styles.header}>
        <Container maxWidth="lg" className={styles.headerInner}>
          <Link href="/" className={styles.logoLink} aria-label="AS Autoglass home">
            <Image src="/logo.png" width={58} height={58} alt="AS Autoglass" priority />
          </Link>
          <div className={styles.headerContact}>
            <span>Prefer to talk?</span>
            <Button
              href={phoneUrl}
              variant="outlined"
              startIcon={<LocalPhoneOutlinedIcon />}
              className={styles.phoneButton}
            >
              {phone}
            </Button>
          </div>
        </Container>
      </header>

      <main>
        <section className={styles.main}>
          <Container maxWidth="lg">
            <div className={`${styles.heroGrid} ${styles.topAlignedHeroGrid}`}>
              <div className={styles.content}>
              <p className={`${styles.eyebrow} eyebrow-text`}>
                Fast, honest photo assessment
              </p>
              <h1 className={styles.title}>
                Send us a photo. <span>We’ll tell you what it needs.</span>
              </h1>
              <p className={styles.lead}>
                Replacement, repair, camera recalibration or headlight polish—we’ll
                review the photo and recommend the right next step. No guesswork and
                no obligation.
              </p>

              <ul className={styles.benefits}>
                <li>Fast response from a local Tauranga technician</li>
                <li>Mobile service available across the Western Bay</li>
                <li>We can manage your insurance claim</li>
                <li>Clear advice before you book anything</li>
              </ul>

              <div className={styles.trustStrip}>
                <div className={styles.trustItem}>
                  <strong className={styles.trustHeading}>
                    <DirectionsCarFilledOutlinedIcon aria-hidden="true" className={styles.trustMuiIcon} />
                    Courtesy car
                  </strong>
                  <span>Available to help keep you moving</span>
                </div>
                <div className={styles.trustItem}>
                  <strong className={styles.trustHeading}>
                    <Image
                      src="/google.png"
                      alt=""
                      width={18}
                      height={18}
                      aria-hidden="true"
                      className={styles.trustLogo}
                    />
                    {rating.average} Google rating
                  </strong>
                  <span>Based on {rating.total}+ customer reviews</span>
                </div>
                <div className={styles.trustItem}>
                  <strong className={styles.trustHeading}>
                    <Image
                      src="/winz-logo.png"
                      alt=""
                      width={48}
                      height={18}
                      aria-hidden="true"
                      className={styles.trustLogoWide}
                    />
                    WINZ quotes
                  </strong>
                  <span>We can provide quotes for WINZ support</span>
                </div>
              </div>
              </div>

              <SendPhotoForm phone={phone} phoneUrl={phoneUrl} />
            </div>
          </Container>
        </section>

        <GoogleReviewsCarousel data={reviewsData} />

        {gallery.length > 0 && (
          <GallerySection
            title="Recent Autoglass Work"
            description="See recent windscreen replacements, chip repairs, recalibrations, and restoration work completed by our Tauranga team."
            items={gallery}
            headingComponent="h2"
            allLimit={9}
            filteredLimit={6}
          />
        )}
      </main>

      <footer className={styles.footer}>
        <Container maxWidth="lg" className={styles.footerInner}>
          <span>© {new Date().getFullYear()} AS Autoglass</span>
          <Link href="/privacy-policy">Privacy policy</Link>
        </Container>
      </footer>
    </>
  );
}
