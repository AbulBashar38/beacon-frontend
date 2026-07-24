import type { Metadata } from "next";

import { UsersWorkspace } from "@/components/admin/users-workspace";

export const metadata: Metadata = {
  title: "Users & Permissions",
  description: "Manage Beacon government operators, roles, and account access.",
};

export default function UsersPage() {
  return <UsersWorkspace />;
}
