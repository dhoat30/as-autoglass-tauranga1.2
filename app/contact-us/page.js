import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import Container from "@mui/material/Container";
import Link from "next/link";
import ContactUsForm from "@/Components/UI/Contact/ContactUsForm";
import StructuredData from "@/Components/SEO/StructuredData";
import Header from "@/Components/UI/Header/Header";
import { getPageUrl, siteName } from "@/site.config";
import { DEFAULT_OG_IMAGE, getBusinessContact } from "@/utils/seo";
import styles from "./page.module.scss";

const PAGE_URL = getPageUrl("/contact-us");

export const metadata = {
  title: `Contact AS Autoglass | Tauranga Mobile Autoglass`,
  description:
    "Contact the local AS Autoglass team for windscreen replacement, chip repair, ADAS recalibration, headlight polishing, or insurance help in Tauranga.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Contact AS Autoglass",
    description:
      "Talk to a local technician about your windscreen, vehicle glass, camera recalibration, or headlight restoration.",
    url: PAGE_URL,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function ContactUsPage() {
  const contact = getBusinessContact();
  const phone = contact.phone || "07 543 0009";
  const phoneUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;
  const email = contact.email;
  const address = contact.address;
  const mapUrl = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : "";

  const schema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact AS Autoglass",
    url: PAGE_URL,
    mainEntity: {
      "@type": "LocalBusiness",
      name: siteName,
      telephone: phone,
      ...(email ? { email } : {}),
      ...(address ? { address } : {}),
      url: getPageUrl(),
      areaServed: "Tauranga and Western Bay of Plenty",
    },
  };

  return (
    <>
      <StructuredData data={schema} />
      <Header />

      <main className={styles.main}>
        <section className={styles.hero}>
          <Container maxWidth="lg">
            <div className={styles.grid}>
              <div className={styles.content}>
                <p className={`${styles.eyebrow} eyebrow-text`}>Talk to the local team</p>
                <h1>
                  Need help with your glass? <span>Let’s sort it.</span>
                </h1>
                <p className={styles.lead}>
                  Tell us what’s happened and we’ll point you to the right fix—whether
                  that’s a repair, replacement, recalibration, or headlight polish.
                  Straight answers, no pressure.
                </p>

                <a className={styles.phoneCard} href={phoneUrl}>
                  <span className={styles.iconWrap}>
                    <LocalPhoneOutlinedIcon />
                  </span>
                  <span>
                    <small>Call our Tauranga team</small>
                    <strong>{phone}</strong>
                  </span>
                  <span className={styles.availability}>Call now</span>
                </a>

                {(email || address) && (
                  <div className={styles.contactDetails}>
                    {email && (
                      <a href={`mailto:${email}`}>
                        <EmailOutlinedIcon />
                        <span>
                          <small>Email us</small>
                          <strong>{email}</strong>
                        </span>
                      </a>
                    )}
                    {address && (
                      <a href={mapUrl} target="_blank" rel="noreferrer">
                        <LocationOnOutlinedIcon />
                        <span>
                          <small>Visit the workshop</small>
                          <strong>{address}</strong>
                        </span>
                      </a>
                    )}
                  </div>
                )}

                <div className={styles.quickActions}>
                  <Link href="/send-photo">
                    <PhotoCameraOutlinedIcon />
                    <span>
                      <strong>Send a photo</strong>
                      <small>Get a fast damage assessment</small>
                    </span>
                  </Link>
                  <Link href="/book-now">
                    <CalendarMonthOutlinedIcon />
                    <span>
                      <strong>Book a job</strong>
                      <small>Choose your preferred time</small>
                    </span>
                  </Link>
                </div>

                <ul className={styles.assurances}>
                  <li>Mobile service across Tauranga and the Western Bay</li>
                  <li>Insurance claims handled for you</li>
                  <li>Work completed by our own certified technicians</li>
                </ul>
              </div>

              <ContactUsForm phone={phone} />
            </div>
          </Container>
        </section>
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
