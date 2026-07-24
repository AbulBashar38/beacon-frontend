import { apiClient } from "@/lib/api/client";

export type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  reportCount: number;
  updateCount: number;
};

export type UserListResult = {
  users: ApiUser[];
  stats: {
    totalUsers: number;
    citizenUsers: number;
    adminUsers: number;
    totalOwnedReports: number;
  };
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

export const userApi = {
  async list(query: { search?: string; role?: "user" | "admin"; page?: number; limit?: number } = {}) {
    const response = await apiClient.get<ApiResponse<UserListResult>>("users", { params: query });
    return response.data.data;
  },
};
