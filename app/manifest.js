export default function manifest() {
  return {
    name: "Darmar Group",
    short_name: "Darmar Group",
    description: "Darmar Group — commercial cleaning and maintenance services in New Zealand.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#017069",
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
