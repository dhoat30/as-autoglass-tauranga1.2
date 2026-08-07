import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import styles from "./ClientLogosSection.module.scss";

export default function ClientLogosSection({ logos }) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className={styles.section}>
      <Container maxWidth="xl" className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.titleWrapper}>
            <Typography variant="subtitle1" component="p" className={"eyebrow-text mb-8"}  >
              Trusted by leading retailers
            </Typography>
            <Typography variant="h5" component="h2" className={styles.title} color="var(--light-primary)" >
              Trusted to maintain the standards of New Zealand&apos;s biggest retailers.
            </Typography>
          </div>

          <div className={`${styles.logoGrid} flex flex-wrap  align-center justify-center `}>
            {logos.map((item, index) => {
              const logo = item.logo;
              if (!logo) return null;

              return (
                <div className={styles.logoItem} key={index}>
                  <Image
                    src={logo.url}
                    alt={logo.alt || logo.title || "Client logo"}
                    width={logo.width*1.5 }
                    height={logo.height*1.5 }
                    className={styles.logo}
                    sizes="(max-width: 700px) 33vw, 160px"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
