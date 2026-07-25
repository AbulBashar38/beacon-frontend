import type { Metadata } from "next";

import { TrackingWorkspace } from "@/components/citizen/tracking-workspace";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Track a Report",
  description:
    "Enter a Beacon tracking code to view the privacy-safe public progress of a civic infrastructure report.",
  alternates: {
    canonical: "/track",
  },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/track",
    siteName: siteConfig.name,
    title: "Track a Civic Report · Beacon",
    description:
      "Use your Beacon tracking code to follow public progress without signing in.",
    images: [siteConfig.ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "Track a Civic Report · Beacon",
    description:
      "Use your Beacon tracking code to follow public progress without signing in.",
    images: [siteConfig.ogImage.url],
  },
};

export default async function TrackPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string | string[] }>;
}) {
  const params = await searchParams;
  const code = Array.isArray(params.code) ? params.code[0] : params.code;
  return <TrackingWorkspace initialCode={code ?? ""} />;
}
