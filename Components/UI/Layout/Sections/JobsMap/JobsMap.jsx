"use client";
import styles from "./JobsMap.module.scss";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState, useRef } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function JobsMap({ jobs }) {
  const [position, setPosition] = useState([-37.6861, 176.1676]); // Default to Tauranga's center
  const [currentJobs, setCurrentJobs] = useState(jobs.slice(0, 3)); // Start with first 3 jobs
  const [opacity, setOpacity] = useState(1);
  const intervalRef = useRef();

  useEffect(() => {
    if (jobs.length > 0) {
      // Set map to the center of the first job or the average position of all jobs
      const latitudes = jobs.map((job) => job.lat);
      const longitudes = jobs.map((job) => job.lng);
      const avgLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
      const avgLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;
      setPosition([avgLat, avgLng]);
    }
  }, [jobs]);

  const cycleJobs = () => {
    let index = 0;
    intervalRef.current = setInterval(() => {
      // Change opacity for smooth transition
      setOpacity(0);

      setTimeout(() => {
        setCurrentJobs(jobs.slice(index, index + 3)); // Cycle through 3 jobs
        setOpacity(1);
        index += 3;

        if (index + 3 > jobs.length) {
          index = 0; // Restart from beginning once we reach the end
        }
      }, 500); // Wait for opacity transition before switching
    }, 5000); // Switch every 10  seconds
  };

  useEffect(() => {
    cycleJobs(); // Start cycling jobs when the component mounts
    return () => clearInterval(intervalRef.current); // Cleanup interval on unmount
  }, []);

  return (
    <div className={`${styles.section}`}>
      <Container className={`${styles.wrapper}`} maxWidth="lg">
        <div className={`${styles.map_wrapper}`}>
          <Typography
            variant="h4"
            component="h2"
            className="center-align mb-16 "
          >
            Jobs We've Completed Around Tauranga
          </Typography>
          <Paper className={`${styles.map} mt-40`}>
            <MapContainer
              center={position}
              zoom={12}
              style={{ height: "500px", width: "100%" }}
            >
              <TileLayer
                url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                attribution=""
              />
              {jobs.map((job, index) => (
                <Marker
                  key={index}
                  position={[job.lat, job.lng]}
                  icon={greenIcon}
                ></Marker>
              ))}
            </MapContainer>
          </Paper>

          <div className={`${styles.job_boxes}`}>
            {/* Boxes showing job info */}
            {currentJobs[0]?.geo_state && (
              <Paper
                elevation={5}
                style={{
                  opacity,
                  transition: "opacity 0.5s ease-in-out",
                }}
                className={`${styles.job_box_1}`}
              >
                <Typography
                  variant="body1"
                  component="div"
                  className={`${styles.box_content}`}
                >
                  {currentJobs[0]?.client_name} booked an arborist in{" "}
                  {currentJobs[0]?.geo_city
                    ? currentJobs[0]?.geo_city
                    : currentJobs[0]?.geo_state}
                </Typography>
              </Paper>
            )}
            {currentJobs[1]?.geo_state && (
              <Paper
                elevation={5}
                style={{
                  opacity,
                  transition: "opacity 0.5s ease-in-out",
                }}
                className={`${styles.job_box_2} `}
              >
                <Typography
                  variant="body1"
                  component="div"
                  className={`${styles.box_content}`}
                >
                  {currentJobs[1]?.client_name} booked an arborist in{" "}
                  {currentJobs[1]?.geo_city
                    ? currentJobs[1]?.geo_city
                    : currentJobs[1]?.geo_state}
                </Typography>
              </Paper>
            )}
            {currentJobs[2]?.geo_state && (
              <Paper
                elevation={5}
                style={{
                  opacity,
                  transition: "opacity 0.5s ease-in-out",
                }}
                className={`${styles.job_box_3}`}
              >
                <Typography
                  variant="body1"
                  component="div"
                  className={`${styles.box_content}`}
                >
                  {currentJobs[2]?.client_name} booked an arborist in{" "}
                  {currentJobs[2]?.geo_city
                    ? currentJobs[2]?.geo_city
                    : currentJobs[2]?.geo_state}
                </Typography>
              </Paper>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
