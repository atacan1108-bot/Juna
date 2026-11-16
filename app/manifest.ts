import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Juna – sapjes op het ritme van je cyclus",
    short_name: "Juna",
    description: "Elke fase van je cyclus het juiste sapje, plus glow- en haarroutines.",
    start_url: "/app",
    scope: "/",
    display: "standalone",
    background_color: "#FFF7F2",
    theme_color: "#FFF7F2",
    lang: "nl",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
