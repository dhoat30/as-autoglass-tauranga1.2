import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
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
import styles from "../send-photo/page.module.scss";

const PAGE_URL = getPageUrl("/book-now");

export const metadata = {
  title: `Book an Autoglass Service in Tauranga | ${siteName}`,
  description:
    "Request a convenient time for windscreen replacement, chip repair, ADAS recalibration, or headlight restoration with AS Autoglass.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Book Your Autoglass Service",
    description:
      "Choose a preferred time and send us the details. Our Tauranga team will confirm your booking directly.",
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

export default async function BookNowPage() {
  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER || "07 543 0009";
  const phoneUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const rating = getRatingSummary();
  const options = await getOptions();
  const gallery = Array.isArray(options?.gallery) ? options.gallery : [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mobile autoglass booking",
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
      "Headlight restoration",
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
                  Local mobile autoglass booking
                </p>
                <h1 className={styles.title}>
                  Choose a time. <span>We’ll take care of the glass.</span>
                </h1>
                <p className={styles.lead}>
                  Tell us what your vehicle needs, choose a preferred date and
                  time, and send a photo so our technicians can arrive prepared.
                  We’ll contact you to confirm availability.
                </p>

                <ul className={styles.benefits}>
                  <li>Book replacement, repair, recalibration or headlight work</li>
                  <li>Mobile service at your home or workplace</li>
                  <li>Choose the date and time that suits you</li>
                  <li>Your booking is confirmed directly by our local team</li>
                </ul>

                <div className={styles.trustStrip}>
                  <div>
                    <strong>Local team</strong>
                    <span>Our own certified technicians</span>
                  </div>
                  <div>
                    <strong>{rating.average} ★ Google rating</strong>
                    <span>Based on {rating.total}+ customer reviews</span>
                  </div>
                  <div>
                    <strong>Work guaranteed</strong>
                    <span>We stand behind every job</span>
                  </div>
                </div>
              </div>

              <SendPhotoForm
                phone={phone}
                phoneUrl={phoneUrl}
                bookingMode
                formTitle="Request your booking"
                formDescription="Choose a preferred time—we’ll confirm it with you directly."
                submitLabel="Request my booking"
              />
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
