"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./DeferredBackgroundVideo.module.scss";

export default function DeferredBackgroundVideo({
  video,
  placeholderImage,
}) {
  const videoRef = useRef(null);
  const [shouldLoadVideo, setShouldLoadVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    let idleId;
    let timeoutId;

    const queueVideo = () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const connection = navigator.connection;
      const prefersReducedData = connection?.saveData === true;
      const onSlowConnection = /(^|-)[23]g$/.test(connection?.effectiveType || "");
      // Autoplay forces a full download regardless of preload="metadata", so the
      // poster alone has to serve anyone we can't afford to send the video to.
      const isSmallScreen = window.matchMedia("(max-width: 900px)").matches;

      if (
        prefersReducedMotion ||
        prefersReducedData ||
        onSlowConnection ||
        isSmallScreen
      ) {
        return;
      }

      if ("requestIdleCallback" in window) {
        idleId = window.requestIdleCallback(
          () => setShouldLoadVideo(true),
          { timeout: 2500 },
        );
      } else {
        timeoutId = window.setTimeout(() => setShouldLoadVideo(true), 1200);
      }
    };

    if (document.readyState === "complete") {
      queueVideo();
    } else {
      window.addEventListener("load", queueVideo, { once: true });
    }

    return () => {
      window.removeEventListener("load", queueVideo);

      if (idleId && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }

      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, []);

  const handleVideoReady = () => {
    setVideoReady(true);
    videoRef.current?.play().catch(() => setVideoReady(false));
  };

  const placeholderUrl =
    placeholderImage?.sizes?.["1536x1536"] ||
    placeholderImage?.sizes?.large ||
    placeholderImage?.url;

  return (
    <div className={styles.media} aria-hidden="true">
      {placeholderUrl && (
        <Image
          src={placeholderUrl}
          alt=""
          fill
          priority
          quality={82}
          sizes="100vw"
          className={`${styles.placeholder} ${
            videoReady ? styles.placeholderHidden : ""
          }`}
        />
      )}

      {shouldLoadVideo && video?.url && (
        <video
          ref={videoRef}
          className={`${styles.video} ${
            videoReady ? styles.videoVisible : ""
          }`}
          muted
          loop
          playsInline
          autoPlay
          preload="metadata"
          poster={placeholderUrl}
          onCanPlay={handleVideoReady}
        >
          <source src={video.url} type={video.mime_type || "video/mp4"} />
        </video>
      )}
    </div>
  );
}
