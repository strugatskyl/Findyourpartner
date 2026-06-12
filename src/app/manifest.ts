import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Find Your Partner",
    short_name: "FindPartner",
    description:
      "Couple compatibility through scientific, psychological and mystical lenses.",
    start_url: "/",
    display: "standalone",
    background_color: "#0f0a1a",
    theme_color: "#0f0a1a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
