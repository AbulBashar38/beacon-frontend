import { apiClient } from "@/lib/api/client";
import type { AuthUser } from "@/lib/auth-session";

export type ApiReportCategory = "pothole" | "broken_streetlight" | "water_leak" | "illegal_dumping" | "other";
export type ApiSeverity = "low" | "medium" | "high" | "critical";
export type ApiReportStatus = "pending" | "under_review" | "assigned" | "in_progress" | "resolved" | "rejected";
export type ApiDepartment = "roads_and_highways" | "electrical" | "water_and_sewerage" | "waste_management" | "general";

export type ApiReport = {
  id: string;
  trackingCode: string;
  citizenName: string | null;
  contact: string | null;
  description: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  category: ApiReportCategory;
  aiCategory: ApiReportCategory | null;
  severityLevel: ApiSeverity | null;
  severityScore: number | null;
  summary: string | null;
  canonicalSummary: string | null;
  language: "bn" | "en" | "unknown";
  imageUrls: string[];
  evidenceUrls: string[];
  status: ApiReportStatus;
  assignedDepartment: ApiDepartment | null;
  duplicateOfId: string | null;
  duplicateScore: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ApiReportDetails = ApiReport & {
  citizenId: string | null;
  citizenCategory: ApiReportCategory | null;
  normalizedLocation: string | null;
  aiConfidence: number | null;
  severityRationale: string | null;
  suggestedAction: string | null;
  citizen: {
    id: string;
    name: string;
    email: string;
  } | null;
  progressUpdates: Array<{
    id: string;
    status: ApiReportStatus;
    note: string | null;
    visibility: "public" | "internal";
    createdAt: string;
    updatedBy: {
      id: string;
      name: string;
      email: string;
    } | null;
  }>;
  duplicateParent: {
    id: string;
    trackingCode: string;
    summary: string | null;
    status: ApiReportStatus;
  } | null;
  duplicateChildren: Array<{
    id: string;
    trackingCode: string;
    summary: string | null;
    createdAt: string;
    severityLevel: ApiSeverity | null;
    status: ApiReportStatus;
  }>;
};

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ReportStats = {
  totalReports: number;
  pendingReports: number;
  criticalReports: number;
  resolvedReports: number;
  categoryBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
  departmentBreakdown: Record<string, number>;
  statusBreakdown: Record<ApiReportStatus, number>;
  averageResolutionTimeHours: number;
  last7Days: Array<{ date: string; count: number; resolved: number }>;
  duplicatesLinked: number;
};

export type TrackedReport = {
  reportId: string;
  trackingCode: string;
  description: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  category: ApiReportCategory;
  summary: string;
  severity: {
    level: ApiSeverity | null;
    score: number | null;
    rationale: string | null;
  };
  status: ApiReportStatus;
  department: ApiDepartment | null;
  language: "bn" | "en" | "unknown";
  images: string[];
  evidenceUrls: string[];
  suggestedAction: string | null;
  createdAt: string;
  updatedAt: string;
  progress: Array<{
    id: string;
    status: ApiReportStatus;
    note: string | null;
    visibility: "public" | "internal";
    createdAt: string;
  }>;
};

export type PublicMapReport = {
  trackingCode: string;
  latitude: number;
  longitude: number;
  category: ApiReportCategory;
  severityLevel: ApiSeverity | null;
  severityScore: number | null;
  status: ApiReportStatus;
  summary: string | null;
  createdAt: string;
};

export type PublicLandingData = {
  totalReports: number;
  resolvedReports: number;
  activeReports: number;
  mappedReports: number;
  averageResolutionTimeHours: number | null;
  recentResolutions: Array<{
    trackingCode: string;
    category: ApiReportCategory;
    locationText: string;
    summary: string | null;
    assignedDepartment: ApiDepartment | null;
    createdAt: string;
    resolvedAt: string;
    resolutionHours: number;
  }>;
};

type ApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: ApiMeta;
};

export type CreateReportInput = {
  citizenName?: string;
  contact?: string;
  description: string;
  locationText: string;
  latitude?: number;
  longitude?: number;
  imageUrls?: string[];
  evidenceUrls?: string[];
  language?: "bn" | "en" | "unknown";
  category?: ApiReportCategory;
};

export type ReportQuery = {
  category?: ApiReportCategory;
  severityLevel?: ApiSeverity;
  status?: ApiReportStatus;
  assignedDepartment?: ApiDepartment;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: "createdAt" | "severityScore" | "status";
  sortOrder?: "asc" | "desc";
};

export const authApi = {
  async login(input: { email: string; password: string }) {
    const response = await apiClient.post<ApiResponse<{ accessToken: string; user: AuthUser }>>("auth/login", input);
    return response.data.data;
  },
  async register(input: { name: string; email: string; password: string }) {
    const response = await apiClient.post<ApiResponse<AuthUser & { createdAt: string }>>("auth/register", input);
    return response.data.data;
  },
  async me() {
    const response = await apiClient.get<ApiResponse<AuthUser>>("auth/me");
    return response.data.data;
  },
  async logout() {
    await apiClient.post("auth/logout");
  },
};

export const reportApi = {
  async create(input: CreateReportInput) {
    const response = await apiClient.post<ApiResponse<ApiReport>>("reports", input);
    return response.data.data;
  },

  async list(query: ReportQuery = {}) {
    const response = await apiClient.get<ApiResponse<ApiReport[]>>("reports", { params: query });
    return {
      reports: response.data.data,
      meta: response.data.meta ?? { page: 1, limit: query.limit ?? 10, total: response.data.data.length, totalPages: 1 },
    };
  },

  async getById(id: string) {
    const response = await apiClient.get<ApiResponse<ApiReportDetails>>(`reports/${id}`);
    return response.data.data;
  },

  async updateStatus(
    id: string,
    input: { status: ApiReportStatus; note?: string; visibility?: "public" | "internal" },
  ) {
    const response = await apiClient.patch<ApiResponse<ApiReportDetails>>(`reports/${id}/status`, input);
    return response.data.data;
  },

  async assignDepartment(
    id: string,
    input: { assignedDepartment: ApiDepartment; note?: string },
  ) {
    const response = await apiClient.patch<ApiResponse<ApiReportDetails>>(`reports/${id}/assign`, input);
    return response.data.data;
  },

  async mine() {
    const response = await apiClient.get<ApiResponse<ApiReport[]>>("reports/mine");
    return response.data.data;
  },

  async track(trackingCode: string) {
    const response = await apiClient.get<ApiResponse<TrackedReport>>(`reports/track/${encodeURIComponent(trackingCode)}`);
    return response.data.data;
  },

  async publicMap() {
    const response = await apiClient.get<ApiResponse<PublicMapReport[]>>("reports/public/map");
    return response.data.data;
  },

  async publicLanding() {
    const response = await apiClient.get<ApiResponse<PublicLandingData>>("reports/public/landing");
    return response.data.data;
  },

  async stats(query: { location?: string; startDate?: string; endDate?: string; dateField?: "createdAt" | "updatedAt" } = {}) {
    const response = await apiClient.get<ApiResponse<ReportStats>>("reports/stats/summary", { params: query });
    return response.data.data;
  },
};
