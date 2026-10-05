import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import DirectionsCarFilledOutlinedIcon from "@mui/icons-material/DirectionsCarFilledOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
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
import bookingStyles from "./page.module.scss";

const PAGE_URL = getPageUrl("/book-now");
const BOOKING_FAQS = [
  {
    question: "Is my booking confirmed when I submit the form?",
    answer:
      "Your form sends a booking request. Our Tauranga team will contact you during business hours to confirm the service, your quote and availability before the appointment is booked. If you need help urgently, please call us.",
  },
  {
    question: "Do you offer mobile service in my area?",
    answer:
      "We offer mobile autoglass service across Tauranga and the Western Bay of Plenty, including Mount Maunganui, Papamoa and Te Puke. Tell us your suburb in the optional details, or call us to check availability at your home or workplace.",
  },
  {
    question: "Can you help with an insurance claim?",
    answer:
      "Yes, we can help manage your autoglass insurance claim. Let us know you would like to use insurance when we contact you. Cover, excess and approval depend on your policy and insurer.",
  },
  {
    question: "How much will my repair or replacement cost?",
    answer:
      "The cost depends on your vehicle, the damage and the service needed. We’ll confirm your quote before you agree to any work. You can add your registration and a photo to help us assess what’s needed.",
  },
  {
    question: "How soon can you do the work?",
    answer:
      "Availability depends on the service and any parts your vehicle needs. You can suggest a preferred date, or leave it blank and we’ll suggest an available appointment. For urgent damage, call our team directly.",
  },
  {
    question: "Do I need to upload a photo or choose a date?",
    answer:
      "No. Your photo, registration, extra details and preferred date are all optional. Choose the service you need and provide your contact details—we’ll help with the rest. Select ‘Not sure—I need advice’ if you’re unsure which service to book.",
  },
];

export const metadata = {
  title: `Book an Autoglass Service in Tauranga | ${siteName}`,
  description:
    "Request a convenient date for windscreen replacement, chip repair, ADAS recalibration, or headlight restoration with AS Autoglass.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Book Your Autoglass Service",
    description:
      "Choose a preferred date and send us the details. Our Tauranga team will confirm your booking directly.",
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
    <div className={bookingStyles.page}>
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
        <section className={bookingStyles.hero}>
          <Container maxWidth="lg">
            <div className={bookingStyles.heroGrid}>
              <div className={bookingStyles.intro}>
                <p className={bookingStyles.eyebrow}>
                  Mobile service · Tauranga & Western Bay
                </p>
                <h1 className={bookingStyles.title}>
                  Windscreen repair & replacement <span>in Tauranga.</span>
                </h1>
                <p className={bookingStyles.lead}>
                  Book mobile service at your home or workplace. Request a date
                  that suits you—our local team will confirm availability and
                  your quote.
                </p>
                <div className={bookingStyles.heroActions}>
                  <Button
                    href="#booking-form"
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardRoundedIcon />}
                    className={bookingStyles.bookButton}
                  >
                    Request a booking
                  </Button>
                  <span>No obligation · Quote before any work</span>
                </div>
                <p className={bookingStyles.rating}>
                  <Image src="/google.png" alt="Google" width={20} height={20} />
                  <strong>{rating.average}/5</strong> from {rating.total}+ customer reviews
                </p>
              </div>

              <div className={bookingStyles.bookingForm}>
                <SendPhotoForm
                  phone={phone}
                  phoneUrl={phoneUrl}
                  bookingMode
                  formTitle="Request your booking"
                  formDescription="Tell us what you need—we’ll confirm your quote and booking."
                  submitLabel="Request my booking"
                />
              </div>

              <div className={bookingStyles.benefits}>
                <h2>Local service, clear advice.</h2>
                <ul className={styles.benefits}>
                  <li>Mobile service at your home or workplace</li>
                  <li>Help managing your insurance claim</li>
                  <li>ADAS camera recalibration and headlight restoration</li>
                  <li>Not sure what you need? Our team can help</li>
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
                      <VerifiedUserOutlinedIcon aria-hidden="true" className={styles.trustMuiIcon} />
                      Insurance help
                    </strong>
                    <span>Support with your autoglass claim</span>
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
            </div>
          </Container>
        </section>

        <GoogleReviewsCarousel data={reviewsData} />

        <section className={bookingStyles.faqSection} aria-labelledby="booking-faq-title">
          <Container maxWidth="lg">
            <div className={bookingStyles.faqLayout}>
              <div className={bookingStyles.faqIntro}>
                <p className={bookingStyles.eyebrow}>Before you book</p>
                <h2 id="booking-faq-title">Your questions, answered.</h2>
                <p>Clear advice before you commit. Call our local team if you’d prefer to talk it through.</p>
                <a href={phoneUrl} className={bookingStyles.faqPhone}>
                  <LocalPhoneOutlinedIcon aria-hidden="true" />
                  {phone}
                </a>
              </div>
              <div className={bookingStyles.faqList}>
                {BOOKING_FAQS.map(({ question, answer }) => (
                  <details className={bookingStyles.faqItem} key={question}>
                    <summary>{question}</summary>
                    <p>{answer}</p>
                  </details>
                ))}
              </div>
            </div>
          </Container>
        </section>

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

        <section className={bookingStyles.closingCta} aria-labelledby="booking-cta-title">
          <Container maxWidth="lg" className={bookingStyles.closingCtaInner}>
            <div>
              <h2 id="booking-cta-title">Let’s get your glass sorted.</h2>
              <p>Request a booking—we’ll confirm your quote and a date that suits.</p>
            </div>
            <Button
              href="#booking-form"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardRoundedIcon />}
              className={bookingStyles.bookButton}
            >
              Request a booking
            </Button>
          </Container>
        </section>
      </main>

      <footer className={styles.footer}>
        <Container maxWidth="lg" className={styles.footerInner}>
          <div className={bookingStyles.footerDetails}>
            <span>© {new Date().getFullYear()} AS Autoglass</span>
            <span>64A Maleme Street, Greerton, Tauranga · Mon–Fri, 8am–5pm</span>
          </div>
          <Link href="/privacy-policy">Privacy policy</Link>
        </Container>
      </footer>

      <nav className={bookingStyles.mobileActions} aria-label="Call or request a booking">
        <a href={phoneUrl} className={bookingStyles.mobileCall}>
          <LocalPhoneOutlinedIcon aria-hidden="true" />
          Call our team
        </a>
        <a href="#booking-form" className={bookingStyles.mobileBook}>
          Request a booking
          <ArrowForwardRoundedIcon aria-hidden="true" />
        </a>
      </nav>
    </div>
  );
}
