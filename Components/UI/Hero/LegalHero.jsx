import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./LegalHero.module.scss";

export default function LegalHero({ title, eyebrow = "Legal", description }) {
  return (
    <section className={styles.section}>
      <Container maxWidth="md" className={styles.container}>
       
        <Typography variant="h1" component="h1" className={styles.title}>
          {title}
        </Typography>
        {description && (
          <Typography variant="body1" component="p" className={`${styles.description} mt-16`}>
            {description}
          </Typography>
        )}
      </Container>
    </section>
  );
}
