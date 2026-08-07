"use client";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./ContactUsForm.module.scss";

const initialValues = {
  firstname: "",
  email: "",
  phone: "",
  message: "",
  website: "",
};

const fieldSx = {
  "& .MuiInputLabel-root": { color: "var(--light-on-surface-variant)" },
  "& .MuiInputLabel-root.Mui-focused": { color: "var(--brand-kowhai)" },
  "& .MuiOutlinedInput-root": {
    color: "var(--light-on-surface)",
    backgroundColor: "var(--light-surface-container-lowest)",
    borderRadius: "10px",
    "& fieldset": { borderColor: "var(--light-outline-variant)" },
    "&:hover fieldset": { borderColor: "var(--light-outline)" },
    "&.Mui-focused fieldset": { borderColor: "var(--brand-kowhai)" },
  },
  "& .MuiFormHelperText-root": { marginLeft: "2px" },
  "& .MuiFormHelperText-root.Mui-error": { color: "#ffb4ab" },
};

function validate(values) {
  const errors = {};
  if (values.firstname.trim().length < 2) errors.firstname = "Enter your name.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (values.phone.trim() && !/^[+\d][\d\s()-]{7,}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  return errors;
}

export default function ContactUsForm({ phone }) {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const updateField = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setSubmitError("");
    if (touched[name] || errors[name]) {
      setErrors((current) => ({ ...current, [name]: validate(nextValues)[name] }));
    }
  };

  const touchField = (name) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({ ...current, [name]: validate(values)[name] }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setTouched({ firstname: true, email: true, phone: true, message: true });
    setErrors(nextErrors);
    setSubmitError("");
    if (Object.keys(nextErrors).length) return;

    try {
      setSubmitting(true);
      const response = await fetch("/api/hubspot/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, pageUri: window.location.href }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "We couldn’t send your message.");
      }
      router.push("/form-submitted/thank-you");
    } catch (error) {
      setSubmitError(
        error.message || `We couldn’t send your message. Please call ${phone}.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (name, label, props = {}) => (
    <TextField
      fullWidth
      name={name}
      label={label}
      value={values[name]}
      onChange={(event) => updateField(name, event.target.value)}
      onBlur={() => touchField(name)}
      error={Boolean(touched[name] && errors[name])}
      helperText={(touched[name] && errors[name]) || " "}
      sx={fieldSx}
      {...props}
    />
  );

  return (
    <aside className={styles.card} aria-labelledby="contact-form-title">
      <div className={styles.cardHeader}>
        <p className={`${styles.cardEyebrow} eyebrow-text`}>Send an enquiry</p>
        <h2 id="contact-form-title">How can we help?</h2>
        <p>Leave your details and our local team will get back to you.</p>
      </div>
      <div className={styles.promiseBar}>Local advice · Clear next steps · No obligation</div>

      <Box component="form" className={styles.form} onSubmit={handleSubmit} noValidate>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <div className={styles.twoColumns}>
          {renderField("firstname", "Your name *", { autoComplete: "name" })}
          {renderField("phone", "Phone number (optional)", { autoComplete: "tel" })}
        </div>
        {renderField("email", "Email address *", {
          type: "email",
          autoComplete: "email",
        })}
        {renderField("message", "What do you need help with? (optional)", {
          multiline: true,
          minRows: 4,
        })}

        <TextField
          name="website"
          label="Website"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
          className={styles.honeypot}
          tabIndex={-1}
          autoComplete="off"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={18} /> : <ArrowForwardIcon />}
          className={styles.submitButton}
        >
          {submitting ? "Sending…" : "Send my enquiry"}
        </Button>

        <p className={styles.privacyNote}>
          <LockOutlinedIcon />
          <span>Your details stay private and are only used to respond to your enquiry.</span>
        </p>
      </Box>
    </aside>
  );
}
