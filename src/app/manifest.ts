import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "CrackDSA - Master Algorithms & System Design",
    short_name: "CrackDSA",
    description: "The ultimate platform to master Data Structures, Algorithms, and System Design for tech interviews.",
    start_url: "/",
    display: "standalone",
    background_color: "#070b12",
    theme_color: "#465fff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
