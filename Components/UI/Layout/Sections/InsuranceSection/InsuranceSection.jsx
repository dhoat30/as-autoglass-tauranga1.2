import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import styles from "./InsuranceSection.module.scss";

function getCtaLink(cta) {
  if (Array.isArray(cta)) return cta[0]?.link || cta[0];
  return cta?.link || cta;
}

export default function InsuranceSection({
  eyebrowText,
  title,
  description,
  cta,
  ctaNote,
  steps,
}) {
  const ctaLink = getCtaLink(cta);
  const stepItems = Array.isArray(steps?.step) ? steps.step : [];

  if (!title && !description && stepItems.length === 0) return null;

  return (
    <section className={styles.section} id="insurance_section">
      <Container maxWidth="xl">
        <div className={styles.wrapper}>
          <div className={styles.contentColumn}>
            {eyebrowText && (
              <Typography component="p" className={`${styles.eyebrow} eyebrow-text`}>
                {eyebrowText}
              </Typography>
            )}

            {title && (
              <Typography component="h2" variant="h2" className={styles.title}>
                {title}
              </Typography>
            )}

            {description && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {ctaLink?.url && (
              <div className={styles.ctaRow}>
                <Button
                  component={Link}
                  href={ctaLink.url}
                  target={ctaLink.target || undefined}
                  variant="contained"
                  disableElevation
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  className={styles.cta}
                >
                  {ctaLink.title}
                </Button>
                {ctaNote && <p className={styles.ctaNote}>{ctaNote}</p>}
              </div>
            )}
          </div>

          {stepItems.length > 0 && (
            <div className={styles.stepsSection}>
              {steps?.title && (
                <Typography component="h3" variant="h4" className={styles.stepsTitle}>
                  {steps.title}
                </Typography>
              )}

              <ol className={styles.stepsGrid}>
                {stepItems.map((step, index) => {
                  const handledByUs = step.responsibility?.toLowerCase() === "us";

                  return (
                    <li className={styles.stepCard} key={`${step.label}-${index}`}>
                      <span className={styles.stepNumber} aria-hidden="true">
                        {index + 1}
                      </span>
                      <div className={styles.stepContent}>
                        <Typography component="h4" className={styles.stepLabel}>
                          {step.label}
                        </Typography>
                        {step.description && (
                          <p className={styles.stepDescription}>{step.description.trim()}</p>
                        )}
                      </div>
                      <div className={styles.stepMeta}>
                        <span
                          className={`${styles.responsibility} ${
                            handledByUs ? styles.responsibilityUs : ""
                          }`}
                        >
                          {handledByUs ? "Us" : "You"}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {steps?.section_note && (
                <p className={styles.sectionNote}>
                  <ShieldOutlinedIcon aria-hidden="true" />
                  {steps.section_note}
                </p>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
