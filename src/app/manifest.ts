import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: siteConfig.title,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "any",
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    lang: siteConfig.language,
    categories: ["government", "utilities", "productivity"],
    icons: [
      {
        src: "/icons/beacon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/beacon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/beacon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Report an issue",
        short_name: "Report",
        description: "Send a public infrastructure report to Beacon",
        url: "/#quick-report",
      },
      {
        name: "Track a report",
        short_name: "Track",
        description: "Follow a report with its public tracking code",
        url: "/track",
      },
    ],
  };
}
