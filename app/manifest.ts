import type { MetadataRoute } from "next";
import { BRAND, documentDescription } from "@/lib/branding";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: BRAND.appName,
    short_name: BRAND.appName,
    description: documentDescription(),
    start_url: "/",
    display: "standalone",
    background_color: "#f3eee4",
    theme_color: "#1f3d2b",
    lang: "sv",
    icons: [
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon.png",
        sizes: "1024x1024",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
