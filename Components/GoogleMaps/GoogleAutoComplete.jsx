"use client";

import React, { useEffect, useRef } from "react";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

let googleMapsScriptPromise;

function isGoogleMapsReady() {
  return Boolean(window.google?.maps?.places);
}

function loadGoogleMapsScript() {
  if (isGoogleMapsReady()) {
    window.dispatchEvent(new Event("gmaps-ready"));
    return Promise.resolve();
  }

  if (googleMapsScriptPromise) return googleMapsScriptPromise;

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.getElementById("google-maps-places");
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(), { once: true });
      existingScript.addEventListener("error", reject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-places";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&v=weekly&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.dispatchEvent(new Event("gmaps-ready"));
      resolve();
    };
    script.onerror = reject;
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

export default function GoogleAutocomplete({
  value,
  onChange,
  onSelect,
  error,
  helperText,
  label,
  required,
  className,
  autoComplete,
  inputTitle,
}) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);

  const requestGoogleMaps = () => {
    loadGoogleMapsScript().catch((error) => {
      console.error("Failed to load Google Maps Places API", error);
    });
  };

  useEffect(() => {
    let cancelled = false;

    const init = () => {
      if (cancelled) return;
      if (!window.google?.maps?.places) return;
      if (!inputRef.current || autocompleteRef.current) return;

      const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["address"],
        componentRestrictions: { country: "nz" },
      });
      autocompleteRef.current = ac;

      ac.addListener("place_changed", () => {
        const place = ac.getPlace();
        if (!place || !place.address_components) return;

        let streetNumber = "";
        let streetName = "";
        let suburb = "";
        let city = "";
        let region = "";
        let postalCode = "";

        place.address_components.forEach((c) => {
          const t = c.types;
          if (t.includes("street_number")) streetNumber = c.long_name;
          if (t.includes("route")) streetName = c.long_name;
          if (t.includes("sublocality") || t.includes("sublocality_level_1")) suburb = c.long_name;
          if (t.includes("locality")) city = c.long_name;
          if (t.includes("administrative_area_level_1")) region = c.long_name;
          if (t.includes("postal_code")) postalCode = c.long_name;
        });

        const unformatted = { streetNumber, streetName, suburb, city, region, postalCode };
        if (place.formatted_address) {
          onSelect({
            formattedAddress: place.formatted_address,
            unformattedAddress: unformatted,
          });
        }
      });
    };

    if (isGoogleMapsReady()) {
      init();
    } else {
      const onReady = () => init();
      window.addEventListener("gmaps-ready", onReady);
      return () => {
        cancelled = true;
        window.removeEventListener("gmaps-ready", onReady);
      };
    }

    return () => {
      cancelled = true;
    };
  }, [onSelect]);

  return (
    <>
      {inputTitle && (
        <Typography variant="h6" component="h2" className="mt-24">
          {inputTitle}
        </Typography>
      )}
      <TextField
        className={className}
        label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={requestGoogleMaps}
        onMouseDown={requestGoogleMaps}
        onTouchStart={requestGoogleMaps}
        inputRef={inputRef}
        color="secondary"
        fullWidth
        required={required}
        autoComplete={autoComplete}
        error={!!error}
        helperText={error ? helperText : undefined}
      />
    </>
  );
}
