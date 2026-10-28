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

// CARTO now requires a key. Use OSM unless a public basemap key is configured
// so deployments without credentials still render a usable map.
const CARTO_API_KEY = process.env.NEXT_PUBLIC_CARTO_BASEMAPS_API_KEY?.trim();
const TILE_URL = CARTO_API_KEY
  ? `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=${encodeURIComponent(CARTO_API_KEY)}`
  : "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' +
  (CARTO_API_KEY
    ? ' &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : "");

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
        className={`${styles.map} ${CARTO_API_KEY ? styles.cartoTiles : styles.osmTiles}`}
        maxZoom={19}
        aria-label="Mobile windscreen service area from Ōmokoroa to Te Puke"
      >
        <TileLayer
          url={TILE_URL}
          attribution={TILE_ATTRIBUTION}
          maxZoom={19}
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
