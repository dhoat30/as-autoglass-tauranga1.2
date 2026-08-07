import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";
import BeforeAfter from "@/Components/UI/BeforeAfterSlider/BeforeAfter";
import CustomAccordion from "@/Components/UI/Accordion/CustomAccordion";
import styles from "./RowSection.module.scss";

export default function RowSection({
  title,
  eyebrowText,
  description,
  imageAlignment,
  image,
  cta,
  items,
  showBeforeAfterImages,
  beforeImage,
  afterImage,
  accordionData,
  backgroundColor,
  fontColor,
}) {
  const ctaLinks = Array.isArray(cta) ? cta : cta ? [{ link: cta }] : [];
  const quoteCta = ctaLinks[0]?.link;
  const phoneCta = ctaLinks[1]?.link;
  const hasItems = Array.isArray(items) && items.length > 0;
  const hasAccordion =
    Array.isArray(accordionData) && accordionData.length > 0;
  const hasImage = Boolean(image?.url);
  const hasMedia = showBeforeAfterImages || hasImage;
  const imageAspectRatio =
    image?.width && image?.height ? `${image.width} / ${image.height}` : "4 / 3";

  return (
    <section
      className={styles.section}
      id="services"
      style={backgroundColor ? { background: backgroundColor } : undefined}
    >
      <Container maxWidth="xl">
        <div
          className={`${styles.wrapper} ${
            imageAlignment === "left" ? styles.imageLeft : styles.imageRight
          } ${!hasMedia ? styles.withoutMedia : ""}`}
        >
          <div className={styles.contentWrapper}>
            {eyebrowText && (
              <Typography
                variant="h6"
                component="div"
                className={`${styles.eyebrow} eyebrow-text`}
              >
                {eyebrowText}
              </Typography>
            )}

            {title && (
              <Typography
                variant="h2"
                component="h2"
                className={styles.title}
              >
                {title}
              </Typography>
            )}

            {description && (
              <div
                className={`${styles.description} ${
                  fontColor ? styles.alternateText : ""
                }`}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            {hasItems && (
              <div className={styles.itemsWrapper}>
                {items.map((item, index) => (
                  <div
                    key={item.id ?? item.item ?? index}
                    className={styles.item}
                  >
                    <CheckCircleIcon />
                    <Typography variant="subtitle1" component="span">
                      {item.item}
                    </Typography>
                  </div>
                ))}
              </div>
            )}

            {hasAccordion && <CustomAccordion qaData={accordionData} />}

            {(quoteCta || phoneCta) && (
              <div className={styles.ctaWrapper}>
                {quoteCta && (
                  <Button
                    component={Link}
                    href={quoteCta.url}
                    target={quoteCta.target || undefined}
                    variant="contained"
                    disableElevation
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                  >
                    {quoteCta.title}
                  </Button>
                )}

                {phoneCta && (
                  <Button
                    href={phoneCta.url}
                    target={phoneCta.target || undefined}
                    className={styles.phoneButton}
                    variant="outlined"
                    disableElevation
                    size="large"
                    startIcon={<LocalPhoneOutlinedIcon />}
                  >
                    {phoneCta.title}
                  </Button>
                )}
              </div>
            )}
          </div>

          {hasMedia && (
            <div
              className={`${styles.mediaColumn} ${
                !showBeforeAfterImages ? styles.plainMedia : ""
              }`}
            >
              {showBeforeAfterImages ? (
                <div className={styles.imageContainer}>
                  <BeforeAfter
                    showTitle={false}
                    data={{ beforeImage, afterImage }}
                  />
                </div>
              ) : (
                <div
                  className={styles.imageWrapper}
                  style={{ aspectRatio: imageAspectRatio }}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || ""}
                    fill
                    sizes="(max-width: 1100px) 100vw, 50vw"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
