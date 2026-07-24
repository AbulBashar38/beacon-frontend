import type { Metadata } from "next";

import { LiveMapWorkspace } from "@/components/maps/live-map-workspace";

export const metadata: Metadata = {
  title: "Live Map",
  description: "Monitor civic infrastructure issues across Bangladesh in real time.",
};

export default function LiveMapPage() {
  return <LiveMapWorkspace />;
}
