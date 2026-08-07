import Typography from "@mui/material/Typography";
import Image from "next/image";
import React from "react";
import { ReactCompareSlider } from "react-compare-slider";
import styles from "./BeforeAfter.module.scss";
export default function BeforeAfter({ data, showTitle }) {
  const [position, setPosition] = React.useState(50);

  if (!data.afterImage || !data.beforeImage) return null;

  const showBeforeLabel = position > 3;
  const showAfterLabel = position < 97;

  return (
    <div>
      {showTitle && (
        <Typography component="h2" variant="h3" className="title" color="white">
          Before & After
        </Typography>
      )}

      <div className={styles.wrapper}>
        <ReactCompareSlider
          className="image-wrapper"
          onlyHandleDraggable={true}
          onPositionChange={setPosition}
          style={{
            paddingBottom: `${
              (data.beforeImage.height / data.beforeImage.width) * 100
            }%`,
            touchAction: "pan-y",
          }}
          itemOne={
            <Image
              src={data.beforeImage.url}
              alt={data.beforeImage.alt ? data.beforeImage.alt : "Before image"}
              sizes="(max-width: 1200px) 100vw, 50vw"
              fill
              priority
            />
          }
          itemTwo={
            <Image
              src={data.afterImage.url}
              alt={data.afterImage.alt ? data.afterImage.alt : "After Image"}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 50vw"
            />
          }
        />
        <Typography
          variant="body2"
          component={"span"}
          className={`${styles.label} ${styles.beforeLabel} ${
            !showBeforeLabel ? styles.hiddenLabel : ""
          }`}
        >
          Before
        </Typography>
        <Typography
          variant="body2"
          component={"span"}
          className={`${styles.label} ${styles.afterLabel} ${
            !showAfterLabel ? styles.hiddenLabel : ""
          }`}
        >
          After
        </Typography>
      </div>
    </div>
  );
}
