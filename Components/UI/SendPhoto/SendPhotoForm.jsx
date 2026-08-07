"use client";

import { useEffect, useMemo, useState } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import LocalPhoneOutlinedIcon from "@mui/icons-material/LocalPhoneOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useRouter } from "next/navigation";
import styles from "./SendPhotoForm.module.scss";

const SERVICE_OPTIONS = [
  "Windscreen replacement",
  "Chip or crack repair",
  "ADAS camera recalibration",
  "Headlight polish",
  "Not sure—I need advice",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

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
  "& .MuiFormHelperText-root": {
    marginLeft: "2px",
    color: "var(--light-on-surface-variant)",
  },
  "& .MuiFormHelperText-root.Mui-error": { color: "#ffb4ab" },
  "& input[type='datetime-local']": {
    cursor: "pointer",
  },
  "& input[type='datetime-local']::-webkit-calendar-picker-indicator": {
    filter: "invert(1) brightness(1.35)",
    opacity: 0.86,
    cursor: "pointer",
  },
};

const selectSx = {
  color: "var(--light-on-surface)",
  backgroundColor: "var(--light-surface-container-lowest)",
  borderRadius: "10px",
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--light-outline-variant)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--light-outline)",
  },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
    borderColor: "var(--brand-kowhai)",
  },
  "& .MuiSelect-icon": {
    color: "var(--light-on-surface)",
  },
};

function getPhotoError(file) {
  if (!file) return "";
  if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
    return "Use a JPG, PNG, WebP, HEIC or HEIF image.";
  }
  if (file.size > MAX_FILE_SIZE) return "The photo must be smaller than 10 MB.";
  return "";
}

function getPreferredDateTimeError(value) {
  if (!value) return "Choose your preferred date and time.";

  const selectedTime = new Date(value).getTime();
  if (Number.isNaN(selectedTime)) return "Choose a valid date and time.";
  const currentMinute = Math.floor(Date.now() / 60000) * 60000;
  if (selectedTime < currentMinute) {
    return "Choose the current time or a future date and time.";
  }

  return "";
}

function getLocalDateTimeMinimum() {
  const now = new Date();
  const localTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return localTime.toISOString().slice(0, 16);
}

function validate(values, requirePreferredDateTime = false) {
  const errors = {};
  if (!values.services_required) {
    errors.services_required = "Choose the service you need—or select ‘Not sure’.";
  }
  if (values.firstname.trim().length < 2) errors.firstname = "Enter your first name.";
  if (!/^[+\d][\d\s()-]{7,}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number.";
  }
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (requirePreferredDateTime) {
    const dateTimeError = getPreferredDateTimeError(values.booking_date__time);
    if (dateTimeError) errors.booking_date__time = dateTimeError;
  }
  const photoError = getPhotoError(values.windscreen_photo);
  if (photoError) errors.windscreen_photo = photoError;
  return errors;
}

export default function SendPhotoForm({
  phone,
  phoneUrl,
  bookingMode = false,
  formTitle = "Get your free assessment",
  formDescription = "Send the details—it usually takes less than 60 seconds.",
  submitLabel = "Send photo & get my free quote",
}) {
  const router = useRouter();
  const [values, setValues] = useState({
    services_required: "",
    firstname: "",
    phone: "",
    email: "",
    registration: "",
    booking_date__time: "",
    message: "",
    windscreen_photo: null,
    website: "",
    submission_type: bookingMode ? "booking" : "photo_assessment",
  });
  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [minimumDateTime, setMinimumDateTime] = useState("");

  const previewUrl = useMemo(
    () =>
      values.windscreen_photo ? URL.createObjectURL(values.windscreen_photo) : "",
    [values.windscreen_photo],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    const updateMinimum = () => setMinimumDateTime(getLocalDateTimeMinimum());
    updateMinimum();
    const timer = window.setInterval(updateMinimum, 60000);

    return () => window.clearInterval(timer);
  }, []);

  const updateField = (name, value) => {
    const nextValues = { ...values, [name]: value };
    setValues(nextValues);
    setSubmitError("");

    if (touched[name] || errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: validate(nextValues, bookingMode)[name],
      }));
    }
  };

  const touchField = (name) => {
    setTouched((current) => ({ ...current, [name]: true }));
    setErrors((current) => ({
      ...current,
      [name]: validate(values, bookingMode)[name],
    }));
  };

  const handlePhoto = (event) => {
    const file = event.target.files?.[0] || null;
    const nextValues = { ...values, windscreen_photo: file };
    setValues(nextValues);
    setTouched((current) => ({ ...current, windscreen_photo: true }));
    setErrors((current) => ({
      ...current,
      windscreen_photo: getPhotoError(file),
    }));
    event.target.value = "";
  };

  const removePhoto = () => {
    setValues((current) => ({ ...current, windscreen_photo: null }));
    setTouched((current) => ({ ...current, windscreen_photo: true }));
    setErrors((current) => ({
      ...current,
      windscreen_photo: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values, bookingMode);
    setTouched({
      services_required: true,
      firstname: true,
      phone: true,
      email: true,
      registration: true,
      ...(bookingMode ? { booking_date__time: true } : {}),
      windscreen_photo: true,
    });
    setErrors(nextErrors);
    setSubmitError("");

    if (Object.keys(nextErrors).length > 0) return;

    const payload = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value === null) return;

      if (key === "booking_date__time" && value) {
        payload.append(key, new Date(value).toISOString());
        return;
      }

      payload.append(key, value);
    });
    payload.append("pageUri", window.location.href);

    try {
      setSubmitting(true);
      const response = await fetch("/api/hubspot/send-photo", {
        method: "POST",
        body: payload,
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "We couldn’t send your photo. Please try again.");
      }

      router.push("/form-submitted/thank-you");
    } catch (error) {
      setSubmitError(
        error.message || `We couldn’t send your photo. Please call us on ${phone}.`,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <aside className={styles.card} aria-labelledby="send-photo-form-title">
      <div className={styles.cardHeader}>
        <h2 id="send-photo-form-title">{formTitle}</h2>
        <p>{formDescription}</p>
      </div>
      <div className={styles.promiseBar}>Fast reply · Honest advice · No obligation</div>

      <Box component="form" className={styles.form} onSubmit={handleSubmit} noValidate>
        {submitError && <Alert severity="error">{submitError}</Alert>}

        <FormControl
          fullWidth
          error={Boolean(touched.services_required && errors.services_required)}
        >
          <InputLabel
            id="send-photo-service-label"
            sx={{
              color: "var(--light-on-surface-variant)",
              "&.Mui-focused": { color: "var(--brand-kowhai)" },
              "&.Mui-error": { color: "error.main" },
            }}
          >
            What do you need?
          </InputLabel>
          <Select
            labelId="send-photo-service-label"
            value={values.services_required}
            label="What do you need?"
            onChange={(event) =>
              updateField("services_required", event.target.value)
            }
            onBlur={() => touchField("services_required")}
            sx={selectSx}
            MenuProps={{
              PaperProps: {
                sx: {
                  color: "var(--light-on-surface)",
                  backgroundColor: "var(--light-surface-container-high)",
                },
              },
            }}
          >
            {SERVICE_OPTIONS.map((service) => (
              <MenuItem value={service} key={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText>
            {touched.services_required && errors.services_required}
          </FormHelperText>
        </FormControl>

        <div className={styles.twoColumns}>
          <TextField
            label="First name"
            value={values.firstname}
            onChange={(event) => updateField("firstname", event.target.value)}
            onBlur={() => touchField("firstname")}
            error={Boolean(touched.firstname && errors.firstname)}
            helperText={touched.firstname && errors.firstname}
            autoComplete="given-name"
            fullWidth
            required
            sx={fieldSx}
          />
          <TextField
            label="Phone number"
            type="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            onBlur={() => touchField("phone")}
            error={Boolean(touched.phone && errors.phone)}
            helperText={touched.phone && errors.phone}
            autoComplete="tel"
            fullWidth
            required
            sx={fieldSx}
          />
        </div>

        <TextField
          label="Email address"
          type="email"
          value={values.email}
          onChange={(event) => updateField("email", event.target.value)}
          onBlur={() => touchField("email")}
          error={Boolean(touched.email && errors.email)}
          helperText={touched.email && errors.email}
          autoComplete="email"
          fullWidth
          required
          sx={fieldSx}
        />

        <TextField
          label="Vehicle registration (optional)"
          value={values.registration}
          onChange={(event) =>
            updateField("registration", event.target.value.toUpperCase())
          }
          onBlur={() => touchField("registration")}
          error={Boolean(touched.registration && errors.registration)}
          helperText={touched.registration && errors.registration}
          fullWidth
          sx={fieldSx}
          slotProps={{ htmlInput: { maxLength: 12 } }}
        />

        {bookingMode && (
          <TextField
            label="Preferred date and time"
            type="datetime-local"
            value={values.booking_date__time}
            onChange={(event) =>
              updateField("booking_date__time", event.target.value)
            }
            onBlur={() => touchField("booking_date__time")}
            error={Boolean(
              touched.booking_date__time && errors.booking_date__time,
            )}
            helperText={
              (touched.booking_date__time && errors.booking_date__time) ||
              "We’ll confirm availability with you before the booking is final."
            }
            fullWidth
            required
            sx={fieldSx}
            slotProps={{
              inputLabel: { shrink: true },
              htmlInput: {
                min: minimumDateTime,
                step: 60,
                onClick: (event) => {
                  try {
                    event.currentTarget.showPicker?.();
                  } catch {
                    // The browser will fall back to its native date/time control.
                  }
                },
              },
            }}
          />
        )}

        <TextField
          label="Anything else we should know? (optional)"
          value={values.message}
          onChange={(event) => updateField("message", event.target.value)}
          multiline
          minRows={2}
          fullWidth
          sx={fieldSx}
          slotProps={{ htmlInput: { maxLength: 1000 } }}
        />

        <FormControl
          error={Boolean(touched.windscreen_photo && errors.windscreen_photo)}
        >
          <span className={styles.uploadLabel}>
            Photo of the damage or vehicle (optional)
          </span>
          {previewUrl ? (
            <div className={styles.preview}>
              <img src={previewUrl} alt="Selected vehicle damage" />
              <div className={styles.previewMeta}>
                <span>{values.windscreen_photo.name}</span>
                <small>
                  {(values.windscreen_photo.size / 1024 / 1024).toFixed(1)} MB
                </small>
              </div>
              <IconButton onClick={removePhoto} aria-label="Remove selected photo">
                <DeleteOutlineIcon />
              </IconButton>
            </div>
          ) : (
            <Box component="label" className={styles.uploadBox}>
              <CloudUploadOutlinedIcon aria-hidden="true" />
              <span>
                <strong>Choose a photo</strong>
                <small>JPG, PNG, WebP or HEIC · max 10 MB</small>
              </span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                onChange={handlePhoto}
              />
            </Box>
          )}
          <FormHelperText>
            {touched.windscreen_photo && errors.windscreen_photo}
          </FormHelperText>
        </FormControl>

        <input
          type="text"
          name="website"
          value={values.website}
          onChange={(event) => updateField("website", event.target.value)}
          className={styles.honeypot}
          tabIndex="-1"
          autoComplete="off"
          aria-hidden="true"
        />

        <Button
          type="submit"
          variant="contained"
          size="large"
          fullWidth
          disabled={submitting}
          endIcon={submitting ? <CircularProgress size={19} color="inherit" /> : <ArrowForwardIcon />}
          className={styles.submitButton}
        >
          {submitting ? "Sending your request…" : submitLabel}
        </Button>

        <a href={phoneUrl} className={styles.callLink}>
          <LocalPhoneOutlinedIcon aria-hidden="true" />
          Prefer to talk? <strong>{phone}</strong>
        </a>

        <p className={styles.privacyNote}>
          <LockOutlinedIcon aria-hidden="true" />
          Your photo and details are kept private and only used to assess your enquiry.
        </p>
      </Box>
    </aside>
  );
}
