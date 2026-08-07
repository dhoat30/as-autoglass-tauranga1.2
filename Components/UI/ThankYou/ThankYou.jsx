import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import ManageSearchOutlinedIcon from "@mui/icons-material/ManageSearchOutlined";
import SmsOutlinedIcon from "@mui/icons-material/SmsOutlined";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "next/link";
import styles from "./ThankYou.module.scss";

const nextSteps = [
  {
    icon: ManageSearchOutlinedIcon,
    title: "We review your details",
    description:
      "Our local team checks what you’ve sent and works out the right next step.",
  },
  {
    icon: SmsOutlinedIcon,
    title: "We get in touch",
    description:
      "We’ll confirm what’s needed, answer your questions and provide a clear quote.",
  },
  {
    icon: CalendarMonthOutlinedIcon,
    title: "You choose what suits",
    description:
      "If you’re happy to proceed, we’ll arrange a convenient time and place.",
  },
];

export default function ThankYou({
  phone = "07 543 0009",
  title = "Thanks — we’ve got your request.",
  description =
    "One of our Tauranga autoglass team will review your details and get back to you shortly during business hours.",
}) {
  const phoneUrl = `tel:${phone.replace(/[^\d+]/g, "")}`;

  return (
    <section className={styles.section} aria-labelledby="thank-you-title">
      <Container maxWidth="lg" className={styles.container}>
        <div className={styles.layout}>
          <div className={styles.confirmation} aria-live="polite">
            <div className={styles.statusIcon} aria-hidden="true">
              <CheckRoundedIcon />
            </div>

            <div className={styles.eyebrow}>Request received</div>
            <h1 id="thank-you-title">{title}</h1>
            <p className={styles.intro}>{description}</p>

            <div className={styles.responseNote}>
              <span className={styles.responseDot} aria-hidden="true" />
              <div>
                <strong>What happens now?</strong>
                <span>No chasing required—we’ll contact you.</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Button
                component={Link}
                href="/"
                variant="contained"
                size="large"
                endIcon={<ArrowForwardRoundedIcon />}
                className={styles.primaryButton}
              >
                Back to home
              </Button>
              <Button
                component="a"
                href={phoneUrl}
                variant="outlined"
                size="large"
                startIcon={<LocalPhoneOutlinedIcon />}
                className={styles.phoneButton}
              >
                {phone}
              </Button>
            </div>
          </div>

          <aside className={styles.nextSteps} aria-labelledby="next-steps-title">
            <div className={styles.panelHeader}>
              <span>From here</span>
              <h2 id="next-steps-title">Simple, clear, sorted.</h2>
            </div>

            <ol>
              {nextSteps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <li key={step.title}>
                    <div className={styles.stepMarker}>
                      <span>{String(index + 1).padStart(2, "0")}</span>
                      <Icon aria-hidden="true" />
                    </div>
                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.description}</p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className={styles.urgentNote}>
              <SupportAgentOutlinedIcon aria-hidden="true" />
              <p>
                <strong>Need help urgently?</strong> Call us and speak directly with
                the local team.
              </p>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
