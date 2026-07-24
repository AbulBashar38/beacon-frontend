import type { Metadata } from "next";

import { TrackingWorkspace } from "@/components/citizen/tracking-workspace";

export const metadata: Metadata = {
  title: "Track a Report",
  description: "Track the public progress of a Beacon civic infrastructure report.",
};

export default function TrackPage() {
  return <TrackingWorkspace />;
}
