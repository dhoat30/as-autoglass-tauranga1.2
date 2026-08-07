"use client";

import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import styles from "./CustomAccordion.module.scss";

export default function CustomAccordion({ qaData, className }) {
  const [expanded, setExpanded] = React.useState(false);

  if (!qaData) return null;

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <div className={`${styles.accordionWrapper} ${className || ""}`}>
      {qaData.map((item, index) => {
        const accordionPanel = `panel${index}`;

        return (
          <Accordion
            key={index}
            expanded={expanded === accordionPanel}
            onChange={handleChange(accordionPanel)}
            disableGutters
            elevation={0}
            square
            className={styles.accordion}
          >
            <AccordionSummary
              expandIcon={<KeyboardArrowRightIcon className={styles.expandIcon} />}
              aria-controls={`panel${index}a-content`}
              id={`panel${index}a-header`}
              className={styles.summary}
            >
              <Typography variant="h6" component="h3" className={`${styles.question} medium`} >
                {item.question}
              </Typography>
            </AccordionSummary>

            <AccordionDetails className={styles.details}>
              <div
                className={`${styles.answer} body1`}
                dangerouslySetInnerHTML={{ __html: item.answer }}
              />
            </AccordionDetails>
          </Accordion>
        );
      })}
    </div>
  );
}
