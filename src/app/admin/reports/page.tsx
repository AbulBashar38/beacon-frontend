import type { Metadata } from "next";

import { ReportBuilder } from "@/components/reports/report-builder";

export const metadata: Metadata = {
  title: "Report Builder",
  description: "Build and export official civic infrastructure reports.",
};

export default function ReportsPage() {
  return <ReportBuilder />;
}
