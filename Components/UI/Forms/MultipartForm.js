"use client";

import React, { useState } from "react";
import Input from "./InputFields/Input";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import axios from "axios";
import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Link from "next/link";
import GoogleAutocomplete from "@/Components/GoogleMaps/GoogleAutoComplete";
import styles from "./FormStyle.module.scss";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";

const cleaningServices = [
  "Office Cleaning",
  "Supermarket & Retail",
  "Medical Facility",
  "End of Tenancy",
  "Airbnb & Short-Stay",
  "Food Premises",
  "Post-Construction Clean-Up",
    "School, College & ECE",

];

const maintenanceServices = [
  "12A Duct Cleaning",
 
  "Line Marking",
  "Water Blasting",
  "Building Wash",
  "Window Cleaning",
 
  "Painting",
  "Carpark Sweeping",
  "Access Mats",
   "Vinyl Floor Polishing",
   "Concrete Grinding & Polishing",
  "Deli, Bakery & Restroom Deep Cleaning",
  "Tile & Carpet Steam Cleaning",
  "General Repairs & Maintenance",
];

const propertyTypes = [
  "Supermarket",
  "Food Premises (Cafe, Restaurant, Bakery)",
  "Office Building",
  "Medical Facility",
  "Education (School, College, ECE)",
  "Retail Store",
  "Industrial / Warehouse",
  "Other Commercial",
];

const frequencies = [
  "One-off job",
  "Weekly",
  "Fortnightly",
  "Monthly",
  "Ongoing programme",
  "Not sure yet",
];

const sizeOptions = [
  { value: "Small (up to 200m²)", label: "Small (up to 200m²)" },
  { value: "Medium (200-1,000m²)", label: "Medium (200-1,000m²)" },
  { value: "Large (1,000m²+)", label: "Large (1,000m²+)" },
];

const STEPS = [
  {
    number: 1,
    label: "Services",
    title: "What service do you need?",
    subtitle:
      "Step 1 of 3 — Select the services you're enquiring about. You can choose more than one, across both categories.",
  },
  {
    number: 2,
    label: "Site",
    title: "Tell us about your site",
    subtitle:
      "Step 2 of 3 — A few quick details so we can prepare an accurate quote.",
  },
  {
    number: 3,
    label: "Contact",
    title: "How can we reach you?",
    subtitle: "Step 3 of 3 — We'll be in touch within 1 business day.",
  },
];

const toOptions = (items) => items.map((item) => ({ value: item, label: item }));
const isEmailValid = (value) => /\S+@\S+\.\S+/.test(value);
const hasValue = (value) => typeof value === "string" && value.trim().length > 0;
const isFullNameValid = (value) =>
  typeof value === "string" && value.trim().length > 1;
const isPhoneValid = (value) => {
  const cleanPhone = (value || "").replace(/[^0-9]/g, "");
  return cleanPhone.length > 6;
};

const contactFieldValidators = {
  fullName: isFullNameValid,
  email: isEmailValid,
  phone: isPhoneValid,
};

export default function MultipartForm({
  className,
  formName = "Get a Quote Form",
  hideTitle = false,
}) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    cleaningServices: [],
    maintenanceServices: [],
    propertyAddress: "",
    propertyType: "",
    approximateSize: "",
    frequency: "",
    fullName: "",
    email: "",
    phone: "",
    preferredContactMethod: "",
    message: "",
    consent: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [newSubmission, setNewSubmission] = useState(false);
  const [touched, setTouched] = useState({});

  const handleChange = (id, value) => {
    const newValue = value?.target ? value.target.value : value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: newValue,
    }));

    setErrors((prevErrors) => {
      const nextErrors = { ...prevErrors };

      if (id === "cleaningServices" || id === "maintenanceServices") {
        nextErrors.services = false;
      }

      if (contactFieldValidators[id] && touched[id]) {
        nextErrors[id] = !contactFieldValidators[id](newValue);
      } else if (prevErrors[id]) {
        nextErrors[id] = false;
      }

      return nextErrors;
    });
  };

  const validateContactField = (id) => {
    const validator = contactFieldValidators[id];
    if (!validator) return true;

    const isValid = validator(formData[id]);
    setTouched((prevTouched) => ({ ...prevTouched, [id]: true }));
    setErrors((prevErrors) => ({ ...prevErrors, [id]: !isValid }));
    return isValid;
  };

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      const selectedServices =
        formData.cleaningServices.length + formData.maintenanceServices.length;

      if (selectedServices === 0) {
        newErrors.services = true;
      }
    }

    if (stepNumber === 2) {
      if (!hasValue(formData.propertyAddress)) newErrors.propertyAddress = true;
      if (!hasValue(formData.propertyType)) newErrors.propertyType = true;
      if (!hasValue(formData.approximateSize)) newErrors.approximateSize = true;
      if (!hasValue(formData.frequency)) newErrors.frequency = true;
    }

    if (stepNumber === 3) {
      if (!isFullNameValid(formData.fullName)) newErrors.fullName = true;
      if (!isEmailValid(formData.email)) newErrors.email = true;
      if (!isPhoneValid(formData.phone)) newErrors.phone = true;
      if (!hasValue(formData.preferredContactMethod)) {
        newErrors.preferredContactMethod = true;
      }
      if (!formData.consent) newErrors.consent = true;
    }

    setErrors((prevErrors) => ({ ...prevErrors, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const validateAllSteps = () => {
    const allErrors = {};
    const selectedServices =
      formData.cleaningServices.length + formData.maintenanceServices.length;

    if (selectedServices === 0) allErrors.services = true;
    if (!hasValue(formData.propertyAddress)) allErrors.propertyAddress = true;
    if (!hasValue(formData.propertyType)) allErrors.propertyType = true;
    if (!hasValue(formData.approximateSize)) allErrors.approximateSize = true;
    if (!hasValue(formData.frequency)) allErrors.frequency = true;
    if (!isFullNameValid(formData.fullName)) allErrors.fullName = true;
    if (!isEmailValid(formData.email)) allErrors.email = true;
    if (!isPhoneValid(formData.phone)) allErrors.phone = true;
    if (!hasValue(formData.preferredContactMethod)) {
      allErrors.preferredContactMethod = true;
    }
    if (!formData.consent) allErrors.consent = true;

    setErrors(allErrors);
    return Object.keys(allErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!validateAllSteps()) {
      return;
    }

    const dataPayload = {
      email: formData.email,
      formName,
      message: `Full Name: ${formData.fullName}
Email: ${formData.email}
Phone Number: ${formData.phone}
Preferred Contact Method: ${formData.preferredContactMethod}
Property Address: ${formData.propertyAddress}
Property Type: ${formData.propertyType}
Approximate Size: ${formData.approximateSize}
Frequency: ${formData.frequency}
Cleaning Services: ${formData.cleaningServices.join(", ")}
Maintenance Services: ${formData.maintenanceServices.join(", ")}
Message: ${formData.message}`,
    };

    setIsLoading(true);

    const configSendMail = {
      method: "post",
      url: "/api/sendmail",
      headers: { "Content-Type": "application/json" },
      data: dataPayload,
    };

    axios(configSendMail)
      .then(function (response) {
        if (response.status === 200) {
          setIsLoading(false);
          setIsSuccess(true);
          setNewSubmission(false);
          setError(false);
          router.push("/form-submitted/thank-you");
        } else {
          setIsLoading(false);
          setIsSuccess(false);
          setError(true);
          setNewSubmission(true);
        }
      })
      .catch(function (submitError) {
        console.log(submitError);
        setIsLoading(false);
        setIsSuccess(false);
        setError(true);
        setNewSubmission(true);
      });
  };

  const renderStepFields = () => {
    if (currentStep === 1) {
      return (
        <>
          <Input
            lightTheme
            label="Cleaning services"
            type="select"
            id="cleaningServices"
            value={formData.cleaningServices}
            onChange={(event) => handleChange("cleaningServices", event)}
            required
            isInvalid={errors.services}
            errorMessage="Please select at least one service."
            options={toOptions(cleaningServices)}
            multipleValue
          />
          <Input
            lightTheme
            label="Maintenance services"
            type="select"
            id="maintenanceServices"
            value={formData.maintenanceServices}
            onChange={(event) => handleChange("maintenanceServices", event)}
            required
            isInvalid={errors.services}
            errorMessage="Please select at least one service."
            options={toOptions(maintenanceServices)}
            multipleValue
          />
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <GoogleAutocomplete
            className="mt-16"
            label="Property address"
            value={formData.propertyAddress}
            onChange={(value) => handleChange("propertyAddress", value)}
            onSelect={(selectedAddress) => {
              handleChange("propertyAddress", selectedAddress.formattedAddress);
            }}
            required
            error={errors.propertyAddress}
            helperText="Please enter the property address."
            autoComplete="street-address"
          />
          <Input
            lightTheme
            label="Property type"
            type="select"
            value={formData.propertyType}
            onChange={(event) => handleChange("propertyType", event)}
            required
            isInvalid={errors.propertyType}
            errorMessage="Please select a property type."
            options={toOptions(propertyTypes)}
            multipleValue={false}
          />
          <FormControl
            fullWidth
            error={Boolean(errors.approximateSize)}
            className={styles.toggleField}
          >
            <Typography variant="h6" component="div">
              Approximate size
            </Typography>
            <ToggleButtonGroup
              exclusive
              value={formData.approximateSize}
              onChange={(event, value) => {
                if (value) handleChange("approximateSize", value);
              }}
              className={styles.toggleGroup}
            >
              {sizeOptions.map((option) => (
                <ToggleButton
                  key={option.value}
                  value={option.value}
                  style={{
                    color:
                      formData.approximateSize === option.value
                        ? "#fff"
                        : "var(--light-primary)",
                  }}
                  sx={{
                    "&.MuiToggleButton-root:hover": {
                      backgroundColor: "var(--light-primary)",
                      borderColor: "var(--light-primary)",
                      color: "#fff !important",
                    },
                    "&.MuiToggleButton-root.Mui-selected, &.MuiToggleButton-root.Mui-selected:hover": {
                      backgroundColor: "var(--light-primary)",
                      borderColor: "var(--light-primary)",
                      color: "#fff !important",
                    },
                  }}
                >
                  {option.label}
                </ToggleButton>
              ))}
            </ToggleButtonGroup>
            <FormHelperText>
              {errors.approximateSize && "Please select an approximate size."}
            </FormHelperText>
          </FormControl>
          <Input
            lightTheme
            label="Frequency"
            type="select"
            value={formData.frequency}
            onChange={(event) => handleChange("frequency", event)}
            required
            isInvalid={errors.frequency}
            errorMessage="Please select a frequency."
            options={toOptions(frequencies)}
            multipleValue={false}
          />
        </>
      );
    }

    return (
      <>
        <Input
          lightTheme
          label="Full name"
          type="text"
          id="fullName"
          value={formData.fullName}
          onChange={(event) => handleChange("fullName", event)}
          onBlur={() => validateContactField("fullName")}
          required
          isInvalid={errors.fullName}
          errorMessage="Please enter your full name."
          autoComplete="name"
        />
        <Input
          lightTheme
          label="Email"
          type="email"
          id="email"
          value={formData.email}
          onChange={(event) => handleChange("email", event)}
          onBlur={() => validateContactField("email")}
          required
          isInvalid={errors.email}
          errorMessage="Please enter a valid email address."
          autoComplete="email"
        />
        <Input
          lightTheme
          label="Phone"
          type="tel"
          id="phone"
          value={formData.phone}
          onChange={(event) => handleChange("phone", event)}
          onBlur={() => validateContactField("phone")}
          required
          isInvalid={errors.phone}
          errorMessage="Please enter a valid phone number."
          autoComplete="tel"
        />
        <FormControl
          fullWidth
          error={Boolean(errors.preferredContactMethod)}
          className={styles.radioField}
        >
          <Typography variant="h6" component="div">
            Preferred contact method
          </Typography>
          <RadioGroup
            row
            value={formData.preferredContactMethod}
            onChange={(event) => handleChange("preferredContactMethod", event)}
          >
            <FormControlLabel value="Email" control={<Radio />} label="Email" />
            <FormControlLabel value="Phone" control={<Radio />} label="Phone" />
          </RadioGroup>
          <FormHelperText>
            {errors.preferredContactMethod && "Please choose a contact method."}
          </FormHelperText>
        </FormControl>
        <Input
          lightTheme
          label="Anything else you'd like us to know?"
          type="textarea"
          id="message"
          value={formData.message}
          onChange={(event) => handleChange("message", event)}
          required={false}
          isInvalid={false}
          errorMessage=""
          autoComplete="off"
          placeholder="Specific timing, access requirements, compliance needs, etc."
        />
        <FormControl error={Boolean(errors.consent)} className={styles.consentField}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.consent}
                onChange={(event) => handleChange("consent", event.target.checked)}
              />
            }
            label={
              <>
                I agree to Darmar Group contacting me about my enquiry and accept
                the{" "}
                <Link href="/privacy-policy">Privacy Policy</Link>.
              </>
            }
          />
          <FormHelperText>
            {errors.consent && "Please accept before submitting your quote request."}
          </FormHelperText>
        </FormControl>
      </>
    );
  };

  return (
    <Container
      variant="div"
      className={`${className} ${styles.multipartFormContainer}`}
      maxWidth="sm"
      id="get-quote-form"
    >
      <div className={styles.formHeader}>
        <div className="row flex space-between align-start gap-16">
          <div className={styles.formTitleWrapper}>
            <Typography
              variant="h5"
              component="h2"
              className={styles.formTitle}
              color="var(--light-on-primary-container)"
            >
              Get Your Free Quote
            </Typography>
            <Typography
              variant="body1"
              component="p"
              className={`${styles.formSubtitle} mt-8`}
              color="var(--dark-on-surface-variant)"
            >
              Tell us what you need and we will prepare the right next step.
            </Typography>
          </div>
          <div
            className={`${styles.stepsTextWrapper} flex align-center justify-center flex-column border-radius-8`}
          >
            <Typography
              variant="subtitle1"
              component="p"
              className={styles.stepsText}
              color="var(--light-inverse-primary)"
            >
              3 quick steps
            </Typography>
          </div>
        </div>

        <div className={`${styles.stepsContainer} grid space-between gap-16 mb-8`}>
          {STEPS.map((step) => (
            <div key={step.number} className={`${styles.stepWrapper} align-center`}>
              <div
                className={styles.stepLine}
                style={{
                  backgroundColor:
                    currentStep >= step.number
                      ? "var(--dark-surface-tint)"
                      : "var(--dark-on-primary-container)",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color:
                    currentStep >= step.number
                      ? "#fff"
                      : "var(--dark-on-surface-variant)",
                  fontWeight: currentStep >= step.number ? 600 : 400,
                }}
              >
                {step.label}
              </Typography>
            </div>
          ))}
        </div>
      </div>

      <Box component="form" className={styles.inputContainer} onSubmit={submitHandler}>
        <div className={styles.inputWrapper}>
          {!hideTitle && (
            <div className={styles.stepHeading}>
              <Typography variant="h5" component="h3" className={styles.stepTitle}>
                {STEPS[currentStep - 1].title}
              </Typography>
              <Typography
                variant="body2"
                component="p"
                className={styles.stepSubtitle}
                color="var(--light-on-surface-variant)"
              >
                {STEPS[currentStep - 1].subtitle}
              </Typography>
            </div>
          )}

          {renderStepFields()}

          <div className={`${styles.buttonWrapper} flex gap-8 mt-16`}>
            {currentStep > 1 && (
              <Button
                variant="outlined"
                type="button"
                onClick={handlePreviousStep}
                size="large"
                sx={{ flex: 1 }}
              >
                Back
              </Button>
            )}
            {currentStep < STEPS.length && (
              <Button
                variant="contained"
                type="button"
                onClick={handleNextStep}
                size="large"
                style={{ width: "100%" }}
              >
                Continue
              </Button>
            )}
            {currentStep === STEPS.length && (
              <Button
                variant="contained"
                type="submit"
                loading={isLoading}
                size="large"
                style={{ width: "100%" }}
              >
                Request my quote
              </Button>
            )}
          </div>
          {currentStep === STEPS.length && (
            <>
              <Button
                variant="text"
                className="mt-8 align-center"
                style={{
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                }}
                href={`tel:${process.env.NEXT_PUBLIC_PHONE_NUMBER}`}
                startIcon={<LocalPhoneIcon />}
              >
                Prefer to talk? {process.env.NEXT_PUBLIC_PHONE_NUMBER}
              </Button>
              <Typography
                variant="body1"
                component="div"
                className="center-align mt-8"
                color="secondary"
              >
                Honest advice - Free Quote - No obligation
              </Typography>
            </>
          )}

          {error && (
            <Alert sx={{ margin: "8px 0", mt: 2 }} severity="error">
              Something went wrong. Please try again.
            </Alert>
          )}
        </div>
      </Box>
    </Container>
  );
}
