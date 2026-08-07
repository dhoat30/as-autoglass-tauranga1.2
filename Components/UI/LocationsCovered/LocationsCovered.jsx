"use client";

import React, { useState } from "react";
import styles from "./LocationsCovered.module.scss";
import Container from "@mui/material/Container";
import { Typography } from "@mui/material";
import ClientLocationsMap from "./ClientLocationsMap";
import {
  findTaurangaServiceLocation,
  normalizeLocationName,
} from "@/utils/staticData/taurangaServiceLocations";
export default function LocationsCovered({
  title,
  description,
  locations,
}) {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const selectLocation = (location) => {
    const mappedLocation =
      location.position?.length === 2
        ? location
        : findTaurangaServiceLocation(location.location);

    if (mappedLocation) setSelectedLocation(mappedLocation);
  };

  return (
    <section className={`${styles.section}`} id="areas-covered">
      <Container
        maxWidth="xl"
        className={`${styles.container} grid gap-32`}
      >
        <div className={`${styles.contentWrapper}`}>
          <Typography variant="h3" component="h2" className={`${styles.title}`}>
            {title}
          </Typography>
          <Typography
            variant="body1"
            component="p"
            className={`${styles.description} mt-16`}
          >
            {description}
          </Typography>
          <ul className={`${styles.locationsWrapper} grid mt-16 gap-8`}>
            {locations &&
              locations.map((location, index) => {
                const mappedLocation =
                  location.position?.length === 2
                    ? location
                    : findTaurangaServiceLocation(location.location);
                const isSelected =
                  selectedLocation &&
                  normalizeLocationName(selectedLocation.location) ===
                    normalizeLocationName(location.location);

                return (
                  <li className={styles.locationItem} key={location.location || index}>
                    <button
                      type="button"
                      className={`${styles.location} ${
                        isSelected ? styles.selectedLocation : ""
                      }`}
                      onClick={() => selectLocation(location)}
                      disabled={!mappedLocation}
                      aria-pressed={Boolean(isSelected)}
                    >
                      {location.location}
                    </button>
                  </li>
                );
              })}
            </ul> 
        </div>
        <ClientLocationsMap
          selectedLocation={selectedLocation}
          onSelectLocation={setSelectedLocation}
        />
      </Container>
    </section>
  );
}
