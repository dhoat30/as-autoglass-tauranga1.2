import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import styles from "./GuaranteeSection.module.scss";

function getCtaLink(cta) {
  if (Array.isArray(cta)) {
    return cta[0]?.link || cta[0];
  }

  return cta?.link || cta;
}

function getDescriptionParts(description = "") {
  const listItems = Array.from(
    description.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi),
    (match) => match[1],
  );

  return {
    body: description.replace(/<ul[^>]*>[\s\S]*?<\/ul>/gi, "").trim(),
    listItems,
  };
}

export default function GuaranteeSection({
  eyebrowText,
  title,
  description,
  cta,
  badge,
}) {
  const ctaLink = getCtaLink(cta);
  const badgeUrl = badge?.url || badge?.sizes?.large;
  const descriptionParts = getDescriptionParts(description);
  const titleParts =
    typeof title === "string" ? title.trim().match(/^(.*)\s+(\S+)$/) : null;

  if (!title && !description && !badgeUrl) return null;

  return (
    <section className={styles.section} id="guarantee_section">
      <Container maxWidth="xl">
        <div className={styles.wrapper}>
          <div className={styles.leftColumn}>
            {eyebrowText && (
              <Typography
                variant="h6"
                component="p"
                className={`${styles.eyebrow} eyebrow-text`}
              >
                {eyebrowText}
              </Typography>
            )}

            {badgeUrl && (
              <div className={styles.badgeWrapper}>
                <Image
                  src={badgeUrl}
                  alt={badge.alt || "Workmanship guarantee"}
                  width={badge.width || 650}
                  height={badge.height || 855}
                  sizes="130px"
                  className={styles.badge}
                />
              </div>
            )}

            {title && (
              <Typography variant="h2" component="h2" className={styles.title}>
                {titleParts ? (
                  <>
                    {titleParts[1]} <span>{titleParts[2]}</span>
                  </>
                ) : (
                  title
                )}
              </Typography>
            )}
          </div>

          <div className={styles.rightColumn}>
            {descriptionParts.body && (
              <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: descriptionParts.body }}
              />
            )}

            {descriptionParts.listItems.length > 0 && (
              <ul className={styles.guaranteeList}>
                {descriptionParts.listItems.map((item, index) => (
                  <li key={index}>
                    <CheckCircleIcon aria-hidden="true" />
                    <span dangerouslySetInnerHTML={{ __html: item }} />
                  </li>
                ))}
              </ul>
            )}

            {ctaLink?.url && (
              <div className={styles.ctaWrapper}>
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
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
