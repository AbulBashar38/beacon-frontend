export type IssueStatus = "New" | "Under review" | "Assigned" | "In progress" | "Resolved" | "Rejected";
export type IssueSeverity = "Critical" | "High" | "Medium" | "Low";
export type IssueCategory = "Road damage" | "Drainage" | "Streetlight" | "Waste" | "Water leak" | "Other";

export type AdminIssue = {
  id: string;
  title: string;
  category: IssueCategory;
  severity: IssueSeverity;
  location: string;
  district: string;
  division: string;
  department: string;
  status: IssueStatus;
  submittedAt: string;
  lastUpdated: string;
  trackingCode?: string;
  description?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export const adminIssues: AdminIssue[] = [
  { id: "BCN-DHK-9382", title: "Collapsed drain cover beside school gate", category: "Drainage", severity: "Critical", location: "Mirpur 11", district: "Dhaka", division: "Dhaka", department: "DNCC Engineering", status: "New", submittedAt: "2026-07-24T08:42:00+06:00", lastUpdated: "18 min ago" },
  { id: "BCN-CTG-4817", title: "Major water main burst flooding carriageway", category: "Water leak", severity: "Critical", location: "Agrabad", district: "Chattogram", division: "Chattogram", department: "CWASA", status: "Under review", submittedAt: "2026-07-24T08:29:00+06:00", lastUpdated: "9 min ago" },
  { id: "BCN-GAZ-2710", title: "Exposed electrical cable on footpath", category: "Streetlight", severity: "Critical", location: "Tongi Bazar", district: "Gazipur", division: "Dhaka", department: "Gazipur City Corporation", status: "In progress", submittedAt: "2026-07-24T08:13:00+06:00", lastUpdated: "4 min ago" },
  { id: "BCN-SYL-1152", title: "Deep pothole cluster near hospital entrance", category: "Road damage", severity: "High", location: "Zindabazar", district: "Sylhet", division: "Sylhet", department: "Roads & Highways", status: "Under review", submittedAt: "2026-07-24T07:48:00+06:00", lastUpdated: "22 min ago" },
  { id: "BCN-RAJ-6634", title: "Waste collection missed for six consecutive days", category: "Waste", severity: "Medium", location: "Boalia", district: "Rajshahi", division: "Rajshahi", department: "RCC Conservancy", status: "New", submittedAt: "2026-07-24T07:21:00+06:00", lastUpdated: "1 hr ago" },
  { id: "BCN-KHU-3481", title: "Streetlights out across residential block", category: "Streetlight", severity: "Medium", location: "Sonadanga", district: "Khulna", division: "Khulna", department: "KCC Electrical", status: "In progress", submittedAt: "2026-07-24T06:55:00+06:00", lastUpdated: "32 min ago" },
  { id: "BCN-BAR-5029", title: "Blocked roadside drain causing waterlogging", category: "Drainage", severity: "High", location: "Nathullabad", district: "Barishal", division: "Barishal", department: "BCC Engineering", status: "In progress", submittedAt: "2026-07-23T18:36:00+06:00", lastUpdated: "2 hrs ago" },
  { id: "BCN-RNG-8840", title: "Broken pavement creating wheelchair hazard", category: "Road damage", severity: "High", location: "Jahaj Company Mor", district: "Rangpur", division: "Rangpur", department: "RpCC Engineering", status: "Under review", submittedAt: "2026-07-23T17:12:00+06:00", lastUpdated: "3 hrs ago" },
  { id: "BCN-MYM-7291", title: "Overflowing community waste collection point", category: "Waste", severity: "Medium", location: "Ganginarpar", district: "Mymensingh", division: "Mymensingh", department: "MCC Conservancy", status: "New", submittedAt: "2026-07-23T15:49:00+06:00", lastUpdated: "4 hrs ago" },
  { id: "BCN-CUM-1936", title: "Persistent water leak under market road", category: "Water leak", severity: "Low", location: "Kandirpar", district: "Cumilla", division: "Chattogram", department: "DPHE Cumilla", status: "Resolved", submittedAt: "2026-07-22T13:24:00+06:00", lastUpdated: "Yesterday" },
  { id: "BCN-NAR-4175", title: "Damaged median barrier obstructing traffic", category: "Road damage", severity: "Medium", location: "Chashara", district: "Narayanganj", division: "Dhaka", department: "NCC Engineering", status: "Resolved", submittedAt: "2026-07-22T10:06:00+06:00", lastUpdated: "Yesterday" },
  { id: "BCN-BOG-6103", title: "Non-functional crossing lights at intersection", category: "Streetlight", severity: "High", location: "Satmatha", district: "Bogura", division: "Rajshahi", department: "Bogura Municipality", status: "In progress", submittedAt: "2026-07-21T19:31:00+06:00", lastUpdated: "Yesterday" },
];

export const issueStatuses: Array<IssueStatus | "All statuses"> = ["All statuses", "New", "Under review", "Assigned", "In progress", "Resolved", "Rejected"];
export const issueSeverities: Array<IssueSeverity | "All severities"> = ["All severities", "Critical", "High", "Medium", "Low"];
export const issueCategories: Array<IssueCategory | "All categories"> = ["All categories", "Road damage", "Drainage", "Streetlight", "Waste", "Water leak", "Other"];
