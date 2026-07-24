import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  CopyCheck,
  FileWarning,
  Gauge,
  Inbox,
  type LucideIcon,
} from "lucide-react";

export type DashboardMetric = {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  tone: "default" | "danger" | "warning" | "success";
};

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Total issues", value: "12,842", change: "+8.2% this month", trend: "up", icon: Inbox, tone: "default" },
  { label: "New issues", value: "384", change: "62 since midnight", trend: "up", icon: FileWarning, tone: "warning" },
  { label: "Critical", value: "27", change: "9 require action", trend: "up", icon: AlertTriangle, tone: "danger" },
  { label: "In progress", value: "1,246", change: "73% within SLA", trend: "neutral", icon: Gauge, tone: "default" },
  { label: "Resolved", value: "9,871", change: "+12.4% this month", trend: "up", icon: CheckCircle2, tone: "success" },
  { label: "Duplicates", value: "143", change: "AI confidence 94%", trend: "down", icon: CopyCheck, tone: "default" },
  { label: "Avg. resolution", value: "3.4d", change: "0.8d faster", trend: "down", icon: Clock3, tone: "success" },
];

export const categoryDistribution = [
  { name: "Road damage", value: 32, color: "#2dd4bf" },
  { name: "Drainage", value: 24, color: "#38bdf8" },
  { name: "Streetlight", value: 18, color: "#fbbf24" },
  { name: "Waste", value: 15, color: "#a78bfa" },
  { name: "Water leak", value: 11, color: "#fb7185" },
];

export const resolutionTrend = [
  { day: "Sat", opened: 118, resolved: 94 },
  { day: "Sun", opened: 132, resolved: 121 },
  { day: "Mon", opened: 164, resolved: 139 },
  { day: "Tue", opened: 151, resolved: 145 },
  { day: "Wed", opened: 179, resolved: 158 },
  { day: "Thu", opened: 146, resolved: 154 },
  { day: "Fri", opened: 107, resolved: 126 },
];

export const districtRanking = [
  { district: "Dhaka", open: 486, resolved: 82 },
  { district: "Chattogram", open: 274, resolved: 78 },
  { district: "Gazipur", open: 193, resolved: 74 },
  { district: "Narayanganj", open: 156, resolved: 86 },
  { district: "Sylhet", open: 121, resolved: 80 },
];

export const criticalIssues = [
  { id: "BCN-DHK-9382", title: "Collapsed drain cover beside school gate", location: "Mirpur 11, Dhaka", age: "18 min", severity: "Critical" },
  { id: "BCN-CTG-4817", title: "Major water main burst flooding carriageway", location: "Agrabad, Chattogram", age: "31 min", severity: "Critical" },
  { id: "BCN-GAZ-2710", title: "Exposed electrical cable on footpath", location: "Tongi, Gazipur", age: "47 min", severity: "Critical" },
];

export const recentActivity = [
  { title: "Issue assigned to DNCC Engineering", meta: "BCN-DHK-9234 · 4 minutes ago", tone: "primary" },
  { title: "Critical road hazard acknowledged", meta: "BCN-GAZ-2710 · 11 minutes ago", tone: "danger" },
  { title: "Drainage repair marked resolved", meta: "BCN-SYL-1149 · 16 minutes ago", tone: "success" },
  { title: "12 duplicate reports merged by AI", meta: "Mohakhali cluster · 23 minutes ago", tone: "warning" },
];
