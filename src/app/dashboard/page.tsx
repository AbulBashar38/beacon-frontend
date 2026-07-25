import type { Metadata } from "next";

import { CitizenAuthGuard } from "@/components/auth/citizen-auth-guard";
import { CitizenDashboard } from "@/components/citizen/citizen-dashboard";

export const metadata: Metadata = {
  title: "My Reports",
  description: "Review your private Beacon reports and their latest progress.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    noimageindex: true,
  },
};

export default function CitizenDashboardPage() {
  return (
    <CitizenAuthGuard>
      <CitizenDashboard />
    </CitizenAuthGuard>
  );
}
