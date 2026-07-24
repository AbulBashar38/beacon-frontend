import type { ApiReport } from "@/lib/api/report-api";
import type { AdminIssue, IssueCategory, IssueSeverity, IssueStatus } from "@/lib/admin-issues";

const categoryLabels: Record<ApiReport["category"], IssueCategory> = {
  pothole: "Road damage",
  broken_streetlight: "Streetlight",
  water_leak: "Water leak",
  illegal_dumping: "Waste",
  other: "Other",
};

const severityLabels: Record<NonNullable<ApiReport["severityLevel"]>, IssueSeverity> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  critical: "Critical",
};

const statusLabels: Record<ApiReport["status"], IssueStatus> = {
  pending: "New",
  under_review: "Under review",
  assigned: "Assigned",
  in_progress: "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

const departmentLabels: Record<NonNullable<ApiReport["assignedDepartment"]>, string> = {
  roads_and_highways: "Roads & Highways",
  electrical: "Electrical Department",
  water_and_sewerage: "Water & Sewerage Authority",
  waste_management: "Waste Management",
  general: "General Civic Services",
};

const districtDivision: Record<string, string> = {
  Dhaka: "Dhaka",
  Gazipur: "Dhaka",
  Narayanganj: "Dhaka",
  Chattogram: "Chattogram",
  Cumilla: "Chattogram",
  Sylhet: "Sylhet",
  Rajshahi: "Rajshahi",
  Bogura: "Rajshahi",
  Khulna: "Khulna",
  Barishal: "Barishal",
  Rangpur: "Rangpur",
  Mymensingh: "Mymensingh",
};

function inferDistrict(location: string) {
  return Object.keys(districtDivision).find((district) =>
    location.toLowerCase().includes(district.toLowerCase()),
  ) ?? "Not specified";
}

function relativeTime(value: string) {
  const minutes = Math.max(0, Math.round((Date.now() - new Date(value).getTime()) / 60_000));
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1_440) return `${Math.floor(minutes / 60)} hr ago`;
  return `${Math.floor(minutes / 1_440)}d ago`;
}

export function mapApiReportToAdminIssue(report: ApiReport): AdminIssue {
  const district = inferDistrict(report.locationText);
  return {
    id: report.id,
    trackingCode: report.trackingCode,
    title: report.canonicalSummary ?? report.summary ?? report.description.slice(0, 90),
    description: report.description,
    category: categoryLabels[report.category],
    severity: report.severityLevel ? severityLabels[report.severityLevel] : "Medium",
    location: report.locationText,
    district,
    division: districtDivision[district] ?? "Not specified",
    department: report.assignedDepartment ? departmentLabels[report.assignedDepartment] : "Unassigned",
    status: statusLabels[report.status],
    submittedAt: report.createdAt,
    lastUpdated: relativeTime(report.updatedAt),
    latitude: report.latitude,
    longitude: report.longitude,
  };
}
