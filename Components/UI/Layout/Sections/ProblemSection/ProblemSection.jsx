import Link from "next/link";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import styles from "./ProblemSection.module.scss";

export default function ProblemSection({
  eyebrowText,
  title,
  description,
  subtitle,
  cta,
  problemList,
}) {
  const ctaLinks = Array.isArray(cta) ? cta : [];

  return (
    <section className={styles.section} id="problems">
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.contentColumn}>
            {eyebrowText && (
              <Typography variant="subtitle1" component="p" className={"eyebrow-text "}>
                {eyebrowText}
              </Typography>
            )}

            {title && (
              <Typography variant="h2" component="h2" className={styles.title} color="var(--light-primary)" >
                {title}
              </Typography>
            )}

            {description && (
              <div
                className={"heading-6 mt-16 "}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}

            

            {ctaLinks.length > 0 && (
              <div className={`${styles.ctaWrapper} flex align-center gap-8 flex-wrap mt-32`}>
                {ctaLinks.map((item, index) => {
                  const link = item.link;
                  if (!link) return null;

                  const isPhone = link.url?.startsWith("tel:");

                  return (
                    <Button
                      key={index}
                      component={Link}
                      href={link.url}
                      target={link.target || undefined}
                      variant={isPhone ? "outlined" : "contained"}
                      size="large"
                      disableElevation
                      startIcon={isPhone ? <LocalPhoneOutlinedIcon /> : undefined}
                      endIcon={!isPhone ? <ArrowForwardIcon /> : undefined}
                      className={isPhone ? styles.phoneButton : styles.quoteButton}
                    >
                      {link.title}
                    </Button>
                  );
                })}
              </div>
            )}

            {subtitle && (
              <div
                className={`${styles.subtitle} heading-6 mt-32  `}
                dangerouslySetInnerHTML={{ __html: subtitle }}
              />
            )}
          </div>

          {problemList && problemList.length > 0 && (
            <div className={styles.problemColumn}>
              {problemList.map((group, index) => (
                <article className={styles.problemCard} key={index}>
                  <Typography variant="h6" component="h3" className={styles.cardTitle} color="var(--light-on-surface)" >
                    {group.title}
                  </Typography>

                  {group.values && group.values.length > 0 && (
                    <ul className={`${styles.problemList} mt-8 `}>
                      {group.values.map((item, itemIndex) => (
                        <li key={itemIndex} className="mb-8"><Typography  variant="body1" component="span" color="var(--light-on-surface-variant)" >
                          {item.value}
                        </Typography>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
