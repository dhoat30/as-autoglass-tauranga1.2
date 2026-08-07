"use client";

import dynamic from "next/dynamic";

const LocationsMap = dynamic(() => import("./LocationsMap"), {
  ssr: false,
  loading: () => <div style={{ minHeight: 560 }} aria-label="Loading service area map" />,
});

export default function ClientLocationsMap(props) {
  return <LocationsMap {...props} />;
}
