import Image from "next/image";
import Link from "next/link";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./ServicesSection.module.scss";

function getSuitedTo(card) {
  const suitedTo =
    card.suited_to ||
    card.suitedTo ||
    card.best_for ||
    card.suitable_for ||
    card.subtitle ||
    "";

  if (Array.isArray(suitedTo)) {
    return suitedTo
      .map((item) => item.value || item.label || item.title || "")
      .filter(Boolean)
      .join(" · ");
  }

  if (typeof suitedTo === "object") {
    return suitedTo.value || suitedTo.label || suitedTo.title || "";
  }

  return suitedTo;
}

export default function ServicesSection({ title, description, cards, eyebrowText }) {
  if (!cards?.length) return null;

  return (
    <section id="our-services" className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.titleGrid}>
          <div className={styles.titleWrapper}>
            {eyebrowText && (
              <Typography variant="subtitle1" component="p" className={"eyebrow-text"}>
                {eyebrowText}
              </Typography>
            )}
            {title && (
              <Typography variant="h2" component="h2" className={styles.title}>
                {title}
              </Typography>
            )}
          </div>

          {description && (
            <div
              className={styles.description}
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
        </div>

        <div className={styles.cardsGrid}>
          {cards.map((card, index) => {
            const suitedTo = getSuitedTo(card);
            const ctaItems = Array.isArray(card.cta) ? card.cta : [];
            const primaryCta = ctaItems.find((item) => item?.link?.url)?.link;
            const CardContent = primaryCta ? Link : "div";

            return (
              <article className={styles.card} key={index}>
                <CardContent
                  className={styles.cardLink}
                  {...(primaryCta
                    ? {
                        href: primaryCta.url,
                        target: primaryCta.target || undefined,
                      }
                    : {})}
                >
                  {card.image && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={card.image.sizes?.large || card.image.url}
                        alt={card.image.alt || card.title}
                        fill
                        className={styles.image}
                        sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      />
                      <span className={styles.cardNumber} aria-hidden="true">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  )}

                  <div className={styles.contentWrapper}>
                    {card.title && (
                      <Typography
                        variant="h6"
                        component="h3"
                        className={styles.cardTitle}
                      >
                        {card.title}
                      </Typography>
                    )}

                    {card.description && (
                      <div
                        className={styles.cardDescription}
                        dangerouslySetInnerHTML={{ __html: card.description }}
                      />
                    )}

                    {suitedTo && (
                      <div className={styles.suitedWrapper}>
                        <Typography
                          variant="subtitle2"
                          component="p"
                          className={styles.suitedLabel}
                        >
                          Suited to
                        </Typography>
                        <Typography
                          variant="body2"
                          component="p"
                          className={styles.suitedValue}
                        >
                          {suitedTo}
                        </Typography>
                      </div>
                    )}

                    {primaryCta && (
                      <div className={styles.cardCta}>
                        <span>{primaryCta.title || "View service"}</span>
                        <span className={styles.arrowIcon} aria-hidden="true">
                          <ArrowForwardRoundedIcon />
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
