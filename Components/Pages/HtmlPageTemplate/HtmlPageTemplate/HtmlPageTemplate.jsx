import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "./HtmlPageTemplate.module.scss";
export default function HtmlPageTemplate({ pageData }) {
  return (
    <section className={styles.section}>
      <Container maxWidth="md" className={styles.container}>
        <Box className={styles.content}>
          <Typography
            variant="body1"
            component="div"
            className={`${styles.html} body1 policy-html`}
            dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
          ></Typography>
        </Box>
      </Container>
    </section>
  );
}
