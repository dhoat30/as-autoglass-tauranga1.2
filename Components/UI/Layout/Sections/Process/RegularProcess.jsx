import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./Process.module.scss";

export default function RegularProcess({ title, description, cards }) {
  const processCards = Array.isArray(cards) ? cards.filter(Boolean) : [];

  if (processCards.length === 0) return null;

  const columnCount = Math.min(processCards.length, 4);
  const maxWidths = {
    1: "380px",
    2: "780px",
    3: "1100px",
    4: "100%",
  };

  return (
    <section className={styles.section} id="process">
      <Container maxWidth="xl" className={styles.container}>
        <header className={styles.header}>
          <Typography component="p" className={`${styles.eyebrow} eyebrow-text`}>
            How it works
          </Typography>

          <Typography variant="h2" component="h2" className={styles.sectionTitle}>
            {title}
          </Typography>

          {description && (
            <div
              className={styles.sectionDescription}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </header>

        <ol
          className={styles.stepsWrapper}
          data-card-count={processCards.length}
          data-multi-row={processCards.length > 4 ? "true" : undefined}
          style={{
            "--process-column-count": columnCount,
            "--process-max-width": maxWidths[columnCount],
          }}
        >
          {processCards.map((item, index) => (
            <li className={styles.stepWrapper} key={item.id ?? item.title ?? index}>
              <div className={styles.stepMarker} aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>

              <div className={styles.content}>
                <Typography variant="h6" component="h3" className={styles.stepTitle}>
                  {item.title}
                </Typography>

                {item.description && (
                  <div
                    className={styles.stepDescription}
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                )}
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
