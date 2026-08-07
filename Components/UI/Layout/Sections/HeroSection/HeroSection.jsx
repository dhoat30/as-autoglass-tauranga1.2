import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import Image from "next/image";
import Link from "next/link";
import HeroUSP from "@/Components/UI/USP/HeroUSP";
import Video from "@/Components/UI/Video/Video";
import DeferredBackgroundVideo from "@/Components/UI/Video/DeferredBackgroundVideo";
import styles from "./HeroSection.module.scss";

export default function HeroSection({
  subtitle,
  title,
  description,
  cta,
  uspData,
  graphicType,
  graphicData,
}) {
  const ctaLinks = Array.isArray(cta) ? cta : cta ? [{ link: cta }] : [];
  const quoteCta = ctaLinks[0]?.link;
  const cmsPhoneCta = ctaLinks[1]?.link;
  const configuredPhoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER;
  const phoneLabel = configuredPhoneNumber || cmsPhoneCta?.title;
  const phoneUrl = configuredPhoneNumber
    ? `tel:${configuredPhoneNumber.replace(/[^\d+]/g, "")}`
    : cmsPhoneCta?.url;
  const hasBackgroundVideo =
    graphicType === "video" && Boolean(graphicData?.video?.url);
  const hasBackgroundImage =
    graphicType === "image" && Boolean(graphicData?.url);
  const hasBackgroundMedia = hasBackgroundVideo || hasBackgroundImage;

  let graphic = null;

  if (graphicType === "youtube_video" && graphicData?.youtube_id) {
    graphic = (
      <Video
        videoID={graphicData.youtube_id}
        placeholderImage={graphicData.placeholder_image}
        priority
      />
    );
  }

  return (
    <section
      className={`${styles.section} ${
        hasBackgroundMedia ? styles.backgroundMediaSection : ""
      }`}
    >
      {hasBackgroundVideo && (
          <DeferredBackgroundVideo
            video={graphicData.video}
            placeholderImage={graphicData.placeholder_image}
          />
      )}

      {hasBackgroundImage && (
        <div className={styles.backgroundImageMedia} aria-hidden="true">
          <Image
            src={
              graphicData.sizes?.["2048x2048"] ||
              graphicData.sizes?.["1536x1536"] ||
              graphicData.sizes?.large ||
              graphicData.url
            }
            alt=""
            fill
            priority
            quality={85}
            sizes="100vw"
            className={styles.backgroundImage}
          />
        </div>
      )}

      {hasBackgroundMedia && <div className={styles.mediaOverlay} />}

      <Container
        maxWidth="xl"
        className={`${styles.container} ${
          hasBackgroundMedia ? styles.backgroundContainer : ""
        } grid gap-40 align-center`}
      >
        <div className={styles.contentWrapper}>
          {subtitle && (
            <Typography
              variant="h6"
              component="div"
              className={`${styles.subtitle} eyebrow-text`}
            >
              {subtitle}
            </Typography>
          )}

          <div
            dangerouslySetInnerHTML={{ __html: title }}
            className={`heading-1 ${styles.title} mt-8`}
          />

          <div
            dangerouslySetInnerHTML={{ __html: description }}
            className={`heading-5 mt-24 ${styles.description}`}
          />

          {(quoteCta || phoneUrl) && (
            <div
              className={`${styles.ctaWrapper} flex gap-8 align-center mt-24 flex-wrap`}
            >
              {quoteCta && (
                <Button
                  component={Link}
                  href={quoteCta.url}
                  target={quoteCta.target || undefined}
                  className={styles.quoteButton}
                  variant="contained"
                  disableElevation
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                >
                  {quoteCta.title}
                </Button>
              )}

              {phoneUrl && (
                <Button
                  href={phoneUrl}
                  target={configuredPhoneNumber ? undefined : cmsPhoneCta?.target || undefined}
                  className={styles.phoneButton}
                  variant="outlined"
                  disableElevation
                  size="large"
                  startIcon={<LocalPhoneOutlinedIcon />}
                >
                  {phoneLabel}
                </Button>
              )}
            </div>
          )}

          <HeroUSP
            data={uspData}
            className="mt-16"
            inverted={hasBackgroundMedia}
            twoColumnsGrid={hasBackgroundMedia}
          />
        </div>

        {!hasBackgroundMedia && (
          <div className={styles.graphicWrapper}>{graphic}</div>
        )}
      </Container>
    </section>
  );
}
