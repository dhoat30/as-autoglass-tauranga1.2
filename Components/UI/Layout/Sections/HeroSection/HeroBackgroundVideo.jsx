"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./HeroSection.module.scss";

export default function HeroBackgroundVideo({ video, placeholderImage }) {
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  const posterUrl =
    placeholderImage?.sizes?.["2048x2048"] ||
    placeholderImage?.sizes?.large ||
    placeholderImage?.url;
  const videoUrl = video?.url;

  useEffect(() => {
    if (!videoUrl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    let idleId;
    let timeoutId;

    const loadVideo = () => setShouldLoadVideo(true);
    const scheduleVideo = () => {
      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(loadVideo, { timeout: 2000 });
      } else {
        timeoutId = window.setTimeout(loadVideo, 500);
      }
    };

    if (document.readyState === "complete") {
      scheduleVideo();
    } else {
      window.addEventListener("load", scheduleVideo, { once: true });
    }

    return () => {
      window.removeEventListener("load", scheduleVideo);
      if (idleId) window.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [videoUrl]);

  if (!posterUrl && !videoUrl) return null;

  return (
    <div className={styles.backgroundMedia} aria-hidden="true">
      {posterUrl && (
        <Image
          src={posterUrl}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={85}
          className={`${styles.backgroundPoster} ${
            videoReady ? styles.backgroundPosterHidden : ""
          }`}
        />
      )}

      {shouldLoadVideo && videoUrl && (
        <video
          className={`${styles.backgroundVideo} ${
            videoReady ? styles.backgroundVideoVisible : ""
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={posterUrl}
          onCanPlay={() => setVideoReady(true)}
        >
          <source src={videoUrl} type={video?.mime_type || "video/mp4"} />
        </video>
      )}

      <div className={styles.backgroundOverlay} />
    </div>
  );
}
