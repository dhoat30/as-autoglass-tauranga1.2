"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import BeforeAfter from "../../../BeforeAfterSlider/BeforeAfter";
import styles from "./ServicesAccordionSection.module.scss";

function normalizeSuitedTo(items) {
  if (!items) return [];

  if (Array.isArray(items)) {
    return items
      .map((item) => item.value || item.label || item.title || "")
      .filter(Boolean);
  }

  if (typeof items === "object") {
    return [items.value || items.label || items.title || ""].filter(Boolean);
  }

  return [items].filter(Boolean);
}

function slugify(value = "") {
  return value
    .toString()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hasImage(image) {
  return Boolean(image && image.url);
}

function getImageSrc(image) {
  return image?.sizes?.large || image?.url;
}

function getSliderImage(image) {
  if (!hasImage(image)) return null;

  return {
    ...image,
    url: getImageSrc(image),
  };
}

function ServiceImage({ item, sizes }) {
  const beforeImage = getSliderImage(item.before_image || item.beforeImage);
  const afterImage = getSliderImage(item.image);

  if (!afterImage) return null;

  if (beforeImage) {
    return (
      <BeforeAfter
        showTitle={false}
        data={{
          beforeImage,
          afterImage,
        }}
      />
    );
  }

  return (
    <Image
      src={afterImage.url}
      alt={afterImage.alt || item.title}
      fill
      className={styles.image}
      sizes={sizes}
    />
  );
}

export default function ServicesAccordionSection({
  eyebrowText,
  title,
  description,
  cards,
}) {
  console.log("cards", cards)
  const items = useMemo(
    () =>
      (cards || []).map((item) => ({
        ...item,
        serviceId: slugify(item.title),
      })),
    [cards],
  );
  const [activeIndex, setActiveIndex] = useState(null);
  const activeItem = activeIndex === null ? items[0] : items[activeIndex];

  useEffect(() => {
    const openServiceFromHash = () => {
      const hash = decodeURIComponent(window.location.hash.replace("#", ""));
      if (!hash) return;

      const nextIndex = items.findIndex(
        (item) => item.serviceId === hash || `service-${item.serviceId}` === hash,
      );

      if (nextIndex === -1) return;

      setActiveIndex(nextIndex);

      window.requestAnimationFrame(() => {
        document.getElementById(items[nextIndex].serviceId)?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    };

    openServiceFromHash();
    window.addEventListener("hashchange", openServiceFromHash);

    return () => window.removeEventListener("hashchange", openServiceFromHash);
  }, [items]);

  if (items.length === 0) return null;

  return (
    <section className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.headerGrid}>
          <div className={styles.titleWrapper}>
            {eyebrowText && (
              <Typography variant="h6" component="div" className={`${styles.eyebrow} eyebrow-text`}>
                {eyebrowText}
              </Typography>
            )}
            {title && (
              <Typography variant="h2" component="h2" className={`${styles.title} mt-8`}>
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

        <div className={styles.contentGrid}>
          <div className={styles.accordionWrapper}>
            {items.map((item, index) => {
              const expanded = activeIndex === index;
              const suitedTo = normalizeSuitedTo(item.suited_to);

              return (
                <Accordion
                  key={index}
                  id={item.serviceId}
                  expanded={expanded}
                  onChange={(event, isExpanded) =>
                    setActiveIndex(isExpanded ? index : null)
                  }
                  disableGutters
                  elevation={0}
                  square
                  className={styles.accordion}
                >
                  <AccordionSummary
                    expandIcon={<ArrowForwardIcon className={styles.summaryArrow} />}
                    className={styles.summary}
                    aria-controls={`service-panel-${index}`}
                    id={`service-header-${index}`}
                  >
                    <Typography variant="h5" component="h3" className={styles.itemTitle}>
                      {item.title}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails className={styles.details}>
                    {item.description && (
                      <div
                        className={`${styles.itemDescription} body1`}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    {suitedTo.length > 0 && (
                      <div className={styles.suitedWrapper}>
                        <Typography variant="subtitle2" component="p" className={styles.suitedLabel}>
                          Suited to
                        </Typography>
                        <div className={styles.suitedList}>
                          {suitedTo.map((value, suitedIndex) => (
                            <Typography key={suitedIndex}
                              variant="body2"
                              component="div"
                            className={`${styles.suitedItem} `}
                            >{value}</Typography>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.image && (
                      <div className={styles.mobileImageWrapper}>
                        <ServiceImage item={item} sizes="100vw" />
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>

          {activeItem?.image && (
            <div className={styles.desktopImageWrapper}>
              <ServiceImage
                item={activeItem}
                sizes="(max-width: 1000px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
