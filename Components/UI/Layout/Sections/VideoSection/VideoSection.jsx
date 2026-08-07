import Container from "@mui/material/Container";
import Video from "@/Components/UI/Video/Video";
import styles from "./VideoSection.module.scss";

export default function VideoSection({
  title,
  videoId,
  placeholderImage,
  eyebrow = "Behind the glass",
}) {
  if (!videoId || !placeholderImage?.url) return null;

  return (
    <section className={styles.section}>
      <Container maxWidth="xl">
        <div className={styles.heading}>
          {eyebrow && (
            <span className={`${styles.eyebrow} eyebrow-text`}>{eyebrow}</span>
          )}
          {title && (
            <div
              className={styles.title}
              dangerouslySetInnerHTML={{ __html: title }}
            />
          )}
        </div>

        <div className={styles.videoFrame}>
          <Video
            videoID={videoId}
            placeholderImage={placeholderImage}
            showCompressedImage
          />
        </div>
      </Container>
    </section>
  );
}
