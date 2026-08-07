"use client";

import { useState } from "react";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import Image from "next/image";
import ReactPlayer from "react-player";
import styles from "./Video.module.scss";

export default function Video({
  videoID,
  placeholderImage,
  className = "",
  showCompressedImage,
  priority = false,
}) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const imageURL = showCompressedImage
    ? placeholderImage?.sizes?.large || placeholderImage?.url
    : placeholderImage?.url;

  if (!videoID || !imageURL) return null;

  return (
    <div className={`${styles.container} ${className}`}>
      <div className={styles.videoWrapper}>
        {!videoLoaded ? (
          <button
            type="button"
            className={styles.poster}
            aria-label="Play video"
            onClick={() => setVideoLoaded(true)}
          >
            <Image
              src={imageURL}
              fill
              alt={placeholderImage?.alt || ""}
              className={styles.posterImage}
              sizes="(max-width: 1200px) 100vw, 1040px"
              priority={priority}
            />
            <span className={styles.posterOverlay} />
            <span className={styles.playControl}>
              <span className={styles.playIcon} aria-hidden="true">
                <PlayArrowRoundedIcon />
              </span>
              <span>Play video</span>
            </span>
          </button>
        ) : (
          <ReactPlayer
            src={`https://www.youtube.com/watch?v=${videoID}`}
            className={styles.player}
            width="100%"
            height="100%"
            controls
            playing
          />
        )}
      </div>
    </div>
  );
}
