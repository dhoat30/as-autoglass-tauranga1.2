"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import styles from "./UspAccordionSection.module.scss";

export default function UspAccordionSection({ data }) {
  const items = data?.items || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = items[activeIndex] || items[0];
  const cta = data?.cta?.[0]?.link;

  if (!data || items.length === 0) return null;

  return (
    <section className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={`${styles.headerGrid} `}>
          <div className={styles.titleWrapper}>
            {data.eyebrow_text && (
             
                   <Typography variant="h6" component="div" className={`${styles.subtitle} eyebrow-text`} >
          {data.eyebrow_text}
          </Typography>
            )}
            {data.section_title && (
              <Typography variant="h2" component="h2" className={`${styles.title} mt-8`} color="var(--light-primary)" >
                {data.section_title}
              </Typography>
            )}
          </div>

          <div className={styles.introWrapper}>
            {data.section_description && (
              <div
                className={`${styles.description} heading-5 mb-16`}
                dangerouslySetInnerHTML={{ __html: data.section_description }}
              />
            )}
            {cta && (
              <Button
                component={Link}
                href={cta.url}
                target={cta.target || undefined}
                variant="contained"
                        size="large"
                endIcon={<ArrowForwardIcon />}
            
              >
                {cta.title}
              </Button>
            )}
          </div>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.accordionWrapper}>
            {items.map((item, index) => {
              const expanded = activeIndex === index;

              return (
                <Accordion
                  key={index}
                  expanded={expanded}
                  onChange={() => setActiveIndex(index)}
                  disableGutters
                  elevation={0}
                  square
                  className={styles.accordion}
                >
                  <AccordionSummary
                    expandIcon={<ArrowForwardIcon className={styles.summaryArrow} />}
                    className={styles.summary}
                    aria-controls={`usp-panel-${index}`}
                    id={`usp-header-${index}`}
                  >
                    <span className={styles.iconWrapper}>
                      {item.icon && (
                        <Image
                          src={item.icon.url}
                          alt={item.icon.alt || ""}
                          width={item.icon.width * 1.2|| 16}
                          height={item.icon.height * 1.2|| 16}
                          className={styles.icon}
                        />
                      )}
                    </span>
                    <Typography variant="h5" component="h3" className={styles.itemTitle} color={"var(--light-primary)"} > 
                      {item.title}
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails className={styles.details}>
                    {item.description && (
                      <div
                        className={`${styles.itemDescription} heading-6`}
                        dangerouslySetInnerHTML={{ __html: item.description }}
                      />
                    )}

                    {item.image && (
                      <div className={styles.mobileImageWrapper}>
                        <Image
                          src={item.image.sizes?.large || item.image.url}
                          alt={item.image.alt || item.title}
                          fill
                          className={styles.image}
                          sizes="100vw"
                        />
                      </div>
                    )}
                  </AccordionDetails>
                </Accordion>
              );
            })}
          </div>

          {activeItem?.image && (
            <div className={styles.desktopImageWrapper}>
              <Image
                src={activeItem.image.sizes?.large || activeItem.image.url}
                alt={activeItem.image.alt || activeItem.title}
                fill
                className={styles.image}
                sizes="(max-width: 1000px) 100vw, 50vw"
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
