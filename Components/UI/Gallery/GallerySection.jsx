"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import BeforeAfter from "../BeforeAfterSlider/BeforeAfter";
import styles from "./GallerySection.module.scss";

function hasImage(image) {
  return Boolean(image && image.url);
}

function getImageSrc(image) {
  return image?.sizes?.large || image?.url;
}

function normalizeImage(image) {
  if (!hasImage(image)) return null;

  return {
    ...image,
    fullUrl: image.url,
    url: getImageSrc(image),
  };
}

function getFullImage(image) {
  return image
    ? {
        ...image,
        url: image.fullUrl || image.url,
      }
    : null;
}

function getTag(item) {
  const tag = item.tag || item.service_tag || item.images?.service_tag;

  if (!tag) return { value: "all", label: "All" };
  if (typeof tag === "string") {
    return {
      value: tag,
      label: tag.replace(/_/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()),
    };
  }

  return {
    value: tag.value || tag.label || "all",
    label: tag.label || tag.value || "All",
  };
}

function getGalleryImages(item) {
  const images = item.images || item;

  return {
    beforeImage: normalizeImage(
      images.before || images.before_image || images.beforeImage,
    ),
    afterImage: normalizeImage(
      images.after || images.image || images.after_image || images.afterImage,
    ),
  };
}

function GalleryItem({ item, priority, onOpen }) {
  const { beforeImage, afterImage } = getGalleryImages(item);
  const galleryLabel = getTag(item).label;

  // Gallery entries are outcome-led: a before-only item is incomplete.
  if (!afterImage) return null;

  return (
    <article className={styles.item}>
      {beforeImage && afterImage ? (
        <div className={styles.comparisonWrapper}>
          <BeforeAfter
            showTitle={false}
            data={{
              beforeImage: { ...beforeImage, alt: galleryLabel },
              afterImage: { ...afterImage, alt: galleryLabel },
            }}
          />
          <IconButton
            type="button"
            className={styles.expandButton}
            onClick={() => onOpen(item)}
            aria-label={`Enlarge ${galleryLabel}`}
          >
            <OpenInFullIcon />
          </IconButton>
        </div>
      ) : (
        <button
          type="button"
          className={`${styles.imageWrapper} ${styles.imageButton}`}
          style={{ paddingBottom: `${(afterImage.height / afterImage.width) * 100}%` }}
          onClick={() => onOpen(item)}
          aria-label={`Enlarge ${galleryLabel}`}
        >
          <Image
            src={afterImage.url}
            alt={galleryLabel}
            fill
            priority={priority}
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
            className={styles.image}
          />
          <span className={styles.expandIcon} aria-hidden="true">
            <OpenInFullIcon />
          </span>
        </button>
      )}
    </article>
  );
}

function GalleryLightbox({ item, onClose }) {
  const { beforeImage, afterImage } = item
    ? getGalleryImages(item)
    : { beforeImage: null, afterImage: null };
  const title = item ? getTag(item).label : "Gallery image";

  return (
    <Dialog
      open={Boolean(item)}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      aria-labelledby="gallery-lightbox-title"
      slotProps={{
        paper: { className: styles.lightboxPaper },
        backdrop: { className: styles.lightboxBackdrop },
      }}
    >
      <div className={styles.lightboxHeader}>
        <Typography id="gallery-lightbox-title" component="h2" className={styles.lightboxTitle}>
          {title}
        </Typography>
        <IconButton onClick={onClose} className={styles.closeButton} aria-label="Close gallery image">
          <CloseIcon />
        </IconButton>
      </div>

      <div className={styles.lightboxContent}>
        {beforeImage && afterImage ? (
          <div className={styles.lightboxComparison}>
            <BeforeAfter
              showTitle={false}
              data={{
                beforeImage: { ...getFullImage(beforeImage), alt: title },
                afterImage: { ...getFullImage(afterImage), alt: title },
              }}
            />
          </div>
        ) : afterImage ? (
          <div className={styles.lightboxImageWrapper}>
            <Image
              src={afterImage.fullUrl || afterImage.url}
              alt={title}
              fill
              sizes="95vw"
              className={styles.lightboxImage}
            />
          </div>
        ) : null}
      </div>
    </Dialog>
  );
}

export default function GallerySection({
  title,
  description,
  items,
  headingComponent = "h1",
  allLimit,
  filteredLimit,
}) {
  const galleryItems = Array.isArray(items) ? items : [];
  const [activeTag, setActiveTag] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);

  const displayableItems = useMemo(
    () => galleryItems.filter((item) => getGalleryImages(item).afterImage),
    [galleryItems],
  );

  const tags = useMemo(() => {
    const tagMap = new Map();

    displayableItems.forEach((item) => {
      const tag = getTag(item);
      tagMap.set(tag.value, tag.label);
    });

    const visibleTags = Array.from(tagMap, ([value, label]) => ({ value, label }))
      .filter((tag) => tag.value && tag.value !== "all");

    return visibleTags.length > 0
      ? [{ value: "all", label: "All" }, ...visibleTags]
      : [];
  }, [displayableItems]);

  const visibleItems = useMemo(() => {
    if (activeTag === "all") {
      return Number.isFinite(allLimit)
        ? displayableItems.slice(0, allLimit)
        : displayableItems;
    }

    const filteredItems = displayableItems.filter(
      (item) => getTag(item).value === activeTag,
    );

    return Number.isFinite(filteredLimit)
      ? filteredItems.slice(0, filteredLimit)
      : filteredItems;
  }, [activeTag, allLimit, displayableItems, filteredLimit]);

  if (displayableItems.length === 0) return null;

  return (
    <section className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.header}>
          <div>
            <Typography variant="subtitle1" component="p" className="eyebrow-text">
              Our Work
            </Typography>
            {title && (
              <Typography
                variant="h1"
                component={headingComponent}
                className={styles.title}
              >
                {title}
              </Typography>
            )}
          </div>

          {description && (
            <div
              className={`${styles.description} heading-5`}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        {tags.length > 0 && (
          <div className={styles.filters}>
            {tags.map((tag) => (
              <Chip
                key={tag.value}
                label={tag.label}
                clickable
                color={activeTag === tag.value ? "primary" : "default"}
                variant={activeTag === tag.value ? "filled" : "outlined"}
                onClick={() => setActiveTag(tag.value)}
                className={styles.filterChip}
              />
            ))}
          </div>
        )}

        <div className={styles.masonry}>
          {visibleItems.map((item, index) => (
            <GalleryItem
              key={
                item.images?.after?.ID ||
                item.after_image?.ID ||
                item.image?.ID ||
                item.images?.before?.ID ||
                index
              }
              item={item}
              priority={index < 4}
              onOpen={setLightboxItem}
            />
          ))}
        </div>
      </Container>

      <GalleryLightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
    </section>
  );
}
