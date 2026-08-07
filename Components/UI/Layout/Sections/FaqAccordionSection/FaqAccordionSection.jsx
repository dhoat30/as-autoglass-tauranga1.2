import React from "react";
import CustomAccordion from "../../../Accordion/CustomAccordion";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./FaqAccordionSection.module.scss";
function FaqAccordionSection({ title, description, qaData, eyebrowText }) {
  if (!qaData) return null;
  return (
    <section className={`${styles.section}`}>
      <Container maxWidth="lg">
        <div className={`${styles.gridWrapper} grid`}>
          <div className={`${styles.titleWrapper}`}>
            <Typography variant="h6" component="div" className={`eyebrow-text`} >
              {eyebrowText}
            </Typography>

            <Typography variant="h1" component="h2" color="var(--light-primary)" className={`mt-8 `} >
              {title}
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className="description mt-16"
            >
              {description}
            </Typography>
          </div>
          <CustomAccordion qaData={qaData} />
        </div>
      </Container>
    </section>
  );
}

export default FaqAccordionSection;

