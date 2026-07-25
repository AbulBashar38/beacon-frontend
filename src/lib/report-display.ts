import type {
  ApiDepartment,
  ApiReport,
  ApiReportCategory,
  ApiReportStatus,
  ApiSeverity,
} from "@/lib/api/report-api";

export const reportCategoryLabels: Record<ApiReportCategory, string> = {
  pothole: "Pothole",
  broken_streetlight: "Broken streetlight",
  water_leak: "Water leak",
  illegal_dumping: "Illegal dumping",
  other: "Other issue",
};

export const reportStatusPresentation: Record<
  ApiReportStatus,
  { label: string; className: string }
> = {
  pending: {
    label: "Pending review",
    className:
      "border-warning/25 bg-warning/12 text-[color-mix(in_oklch,var(--warning),black_38%)]",
  },
  under_review: {
    label: "Under review",
    className:
      "border-info/20 bg-info/10 text-[color-mix(in_oklch,var(--info),black_24%)]",
  },
  assigned: {
    label: "Team assigned",
    className: "border-primary/20 bg-primary/9 text-primary",
  },
  in_progress: {
    label: "In progress",
    className:
      "border-warning/25 bg-warning/12 text-[color-mix(in_oklch,var(--warning),black_38%)]",
  },
  resolved: {
    label: "Resolved",
    className:
      "border-success/20 bg-success/10 text-[color-mix(in_oklch,var(--success),black_25%)]",
  },
  rejected: {
    label: "Closed",
    className:
      "border-danger/18 bg-danger/8 text-[color-mix(in_oklch,var(--danger),black_18%)]",
  },
};

export const reportSeverityPresentation: Record<
  ApiSeverity,
  { label: string; className: string }
> = {
  low: {
    label: "Low priority",
    className: "border-black/8 bg-black/[0.035] text-muted-foreground",
  },
  medium: {
    label: "Medium priority",
    className:
      "border-warning/20 bg-warning/9 text-[color-mix(in_oklch,var(--warning),black_38%)]",
  },
  high: {
    label: "High priority",
    className:
      "border-danger/18 bg-danger/8 text-[color-mix(in_oklch,var(--danger),black_18%)]",
  },
  critical: {
    label: "Critical",
    className:
      "border-critical/20 bg-critical/9 text-[color-mix(in_oklch,var(--critical),black_15%)]",
  },
};

export const reportDepartmentLabels: Record<ApiDepartment, string> = {
  roads_and_highways: "Roads & Highways",
  electrical: "Electrical Department",
  water_and_sewerage: "Water & Sewerage Authority",
  waste_management: "Waste Management",
  general: "General Civic Services",
};

const reportDateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

export function getReportTitle(
  report: Pick<ApiReport, "summary" | "description">,
) {
  return (
    report.summary?.trim() ||
    report.description.split("\n")[0]?.trim() ||
    "Civic infrastructure report"
  );
}

export function getReportDepartmentLabel(department: ApiDepartment | null) {
  return department
    ? reportDepartmentLabels[department]
    : "Awaiting department assignment";
}

export function formatReportDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : reportDateFormatter.format(date);
}
