import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Link from "next/link";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import styles from "./FooterCTA.module.scss";

export default function FooterCta({ title, description, ctaArray }) {
  const ctaLinks = Array.isArray(ctaArray)
    ? ctaArray.map((cta) => cta?.link).filter(Boolean)
    : [];
  const quoteCta = ctaLinks.find((cta) => !cta.url?.startsWith("tel:"));
  const cmsPhoneCta = ctaLinks.find((cta) => cta.url?.startsWith("tel:"));
  const configuredPhoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const phoneLabel = configuredPhoneNumber || cmsPhoneCta?.title;
  const phoneUrl = configuredPhoneNumber
    ? `tel:${configuredPhoneNumber.replace(/[^\d+]/g, "")}`
    : cmsPhoneCta?.url;

  return (
    <section className={styles.section}>
      <Container maxWidth="lg">
        <div className={styles.wrapper}>
          <div className={styles.contentWrapper}>
            <Typography
              component="h2"
              variant="h2"
              align="center"
              className={styles.title}
            >
              {title}
            </Typography>

            {description && (
              <div
                className={`${styles.description} heading-5 mt-16`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            <div className={`${styles.buttonWrapper} flex align-center justify-center flex-wrap mt-24`}>
              {quoteCta && (
                <Button
                  component={Link}
                  href={quoteCta.url}
                  target={quoteCta.target || undefined}
                  size="large"
                  variant="contained"
                  disableElevation
                  className={styles.quoteButton}
                  endIcon={<ArrowForwardIcon />}
                >
                  {quoteCta.title}
                </Button>
              )}

              {phoneUrl && (
                <Button
                  href={phoneUrl}
                  target={configuredPhoneNumber ? undefined : cmsPhoneCta?.target || undefined}
                  size="large"
                  variant="outlined"
                  disableElevation
                  className={styles.phoneButton}
                  startIcon={<LocalPhoneOutlinedIcon />}
                  aria-label={`Call us on ${phoneLabel}`}
                >
                  {phoneLabel}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
