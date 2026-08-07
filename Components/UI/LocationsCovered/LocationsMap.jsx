"use client";

import { useEffect } from "react";
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import {
  normalizeLocationName,
  TAURANGA_SERVICE_LOCATIONS,
} from "@/utils/staticData/taurangaServiceLocations";
import styles from "./LocationsMap.module.scss";

const SERVICE_AREA_BOUNDS = TAURANGA_SERVICE_LOCATIONS.map(
  (location) => location.position,
);

function MapController({ selectedLocation }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedLocation?.position) return;

    map.flyTo(selectedLocation.position, 14, {
      animate: true,
      duration: 1.15,
    });
  }, [map, selectedLocation]);

  return null;
}

export default function LocationsMap({ selectedLocation, onSelectLocation }) {
  const selectedName = normalizeLocationName(selectedLocation?.location);

  return (
    <div className={styles.mapFrame}>
      <MapContainer
        bounds={SERVICE_AREA_BOUNDS}
        boundsOptions={{ padding: [28, 28] }}
        scrollWheelZoom={false}
        className={styles.map}
        aria-label="Mobile windscreen service area from Ōmokoroa to Te Puke"
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <MapController selectedLocation={selectedLocation} />

        {TAURANGA_SERVICE_LOCATIONS.map((location) => {
          const isSelected =
            selectedName === normalizeLocationName(location.location);

          return (
            <CircleMarker
              key={location.location}
              center={location.position}
              radius={isSelected ? 9 : 4.5}
              pathOptions={{
                color: isSelected ? "#ffffff" : "#fff3c4",
                fillColor: "#f6b91a",
                fillOpacity: isSelected ? 1 : 0.78,
                weight: isSelected ? 3 : 1.5,
              }}
              eventHandlers={{ click: () => onSelectLocation?.(location) }}
            >
              <Tooltip
                direction="top"
                offset={[0, -7]}
                opacity={1}
                permanent={isSelected}
              >
                {location.location}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div className={styles.mapLabel}>
        <span aria-hidden="true" />
        {selectedLocation?.location || "Choose a suburb"}
      </div>
    </div>
  );
}
