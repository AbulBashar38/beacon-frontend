import type { Metadata } from "next";

import { TrackingWorkspace } from "@/components/citizen/tracking-workspace";

export const metadata: Metadata = {
  title: "Track a Report",
  description: "Track the public progress of a Beacon civic infrastructure report.",
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
