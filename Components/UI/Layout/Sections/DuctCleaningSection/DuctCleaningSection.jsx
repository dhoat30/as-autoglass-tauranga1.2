import Image from "next/image";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./DuctCleaningSection.module.scss";

export default function DuctCleaningSection({ data }) {
  if (!data) return null;

  const quoteCta = data.cta?.[0]?.link;

  return (
    <section className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.contentGrid}>
          <div className={styles.leftColumn}>
            {data.eyebrow_text && (
              <Typography variant="subtitle1" component="p" className={"eyebrow-text eyebrow-text-dark mb-16"} >
                {data.eyebrow_text}
              </Typography>
            )}

            {data.badge && (
              <div className={styles.badgeWrapper}>
                <Image
                  src={data.badge.url}
                  alt={data.badge.alt || "12A certified duct cleaning"}
                  width={128}
                  height={128}
                  className={styles.badge}
                />
              </div>
            )}

            {data.title && (
              <div
                className={`${styles.title} heading-1  mt-24`}
                dangerouslySetInnerHTML={{ __html: data.title }}
              />
            )}
          </div>

          <div className={styles.rightColumn}>
            {data.description && (
              <div
                className={`${styles.description} body1 dark-body1 `}
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            )}

            {data.attributes && data.attributes.length > 0 && (
              <div className={styles.attributesGrid}>
                {data.attributes.map((item, index) => (
                  <div className={styles.attribute} key={index}>
                    <Typography variant="subtitle2" component="p" className={styles.attributeLabel}>
                      {item.label}
                    </Typography>
                    <Typography variant="body2" component="p" className={styles.attributeValue}>
                      {item.value}
                    </Typography>
                  </div>
                ))}
              </div>
            )}

            {quoteCta && (
              <div className={"mt-32"}>
                <Button
                  component={Link}
                  href={quoteCta.url}
                  target={quoteCta.target || undefined}
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  className={styles.quoteButton}
                >
                  {quoteCta.title}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
