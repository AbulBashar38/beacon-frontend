import type { Metadata } from "next";

import { AdminShell } from "@/components/layout/admin-shell";
import { AdminAuthGuard } from "@/components/auth/admin-auth-guard";

export const metadata: Metadata = {
  title: "Operations Dashboard",
  description: "Beacon national civic infrastructure operations dashboard.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthGuard>
      <AdminShell>{children}</AdminShell>
    </AdminAuthGuard>
  );
}
