export default function manifest() {
  return {
    name: "AS Autoglass",
    short_name: "AS Autoglass",
    description:
      "Mobile windscreen replacement, repair and ADAS recalibration in Tauranga.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b130e",
    theme_color: "#0b130e",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
