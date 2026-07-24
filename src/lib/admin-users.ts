export type UserRole = "Super admin" | "National operator" | "Department officer" | "District coordinator" | "Analyst";
export type UserStatus = "Active" | "Invited" | "Suspended";

export type AdminUser = {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  organization: string;
  district: string;
  status: UserStatus;
  lastActive: string;
  joinedAt: string;
};

export const adminUsers: AdminUser[] = [
  { id: "USR-0018", name: "Sadia Akter", initials: "SA", email: "sadia.akter@beacon.gov.bd", role: "National operator", organization: "National Civic Operations Centre", district: "Dhaka", status: "Active", lastActive: "Online now", joinedAt: "12 Jan 2026" },
  { id: "USR-0024", name: "Mahmud Hasan", initials: "MH", email: "mahmud.hasan@dncc.gov.bd", role: "Department officer", organization: "Dhaka North City Corporation", district: "Dhaka", status: "Active", lastActive: "8 min ago", joinedAt: "18 Jan 2026" },
  { id: "USR-0031", name: "Nusrat Jahan", initials: "NJ", email: "nusrat.jahan@cpa.gov.bd", role: "District coordinator", organization: "Chattogram City Corporation", district: "Chattogram", status: "Active", lastActive: "24 min ago", joinedAt: "02 Feb 2026" },
  { id: "USR-0042", name: "Arifur Rahman", initials: "AR", email: "arifur.rahman@rhd.gov.bd", role: "Department officer", organization: "Roads & Highways Department", district: "Rajshahi", status: "Active", lastActive: "1 hr ago", joinedAt: "11 Feb 2026" },
  { id: "USR-0057", name: "Farhana Islam", initials: "FI", email: "farhana.islam@beacon.gov.bd", role: "Analyst", organization: "National Civic Operations Centre", district: "Dhaka", status: "Active", lastActive: "2 hrs ago", joinedAt: "23 Feb 2026" },
  { id: "USR-0063", name: "Shahriar Kabir", initials: "SK", email: "shahriar.kabir@kcc.gov.bd", role: "District coordinator", organization: "Khulna City Corporation", district: "Khulna", status: "Invited", lastActive: "Invitation pending", joinedAt: "22 Jul 2026" },
  { id: "USR-0071", name: "Tasnim Chowdhury", initials: "TC", email: "tasnim.chowdhury@scc.gov.bd", role: "Department officer", organization: "Sylhet City Corporation", district: "Sylhet", status: "Active", lastActive: "Yesterday", joinedAt: "09 Mar 2026" },
  { id: "USR-0088", name: "Imran Hossain", initials: "IH", email: "imran.hossain@rpcc.gov.bd", role: "District coordinator", organization: "Rangpur City Corporation", district: "Rangpur", status: "Suspended", lastActive: "18 Jul 2026", joinedAt: "17 Mar 2026" },
  { id: "USR-0094", name: "Sabina Yasmin", initials: "SY", email: "sabina.yasmin@mcc.gov.bd", role: "Analyst", organization: "Mymensingh City Corporation", district: "Mymensingh", status: "Active", lastActive: "Yesterday", joinedAt: "28 Mar 2026" },
  { id: "USR-0102", name: "Rafiq Uddin", initials: "RU", email: "rafiq.uddin@barishalcity.gov.bd", role: "Department officer", organization: "Barishal City Corporation", district: "Barishal", status: "Invited", lastActive: "Invitation pending", joinedAt: "23 Jul 2026" },
];

export const userRoles: Array<UserRole | "All roles"> = ["All roles", "Super admin", "National operator", "Department officer", "District coordinator", "Analyst"];
export const userStatuses: Array<UserStatus | "All statuses"> = ["All statuses", "Active", "Invited", "Suspended"];
