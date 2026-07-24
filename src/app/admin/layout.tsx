import type { Metadata } from "next";

import { AdminShell } from "@/components/layout/admin-shell";

export const metadata: Metadata = {
  title: "Operations Dashboard",
  description: "Beacon national civic infrastructure operations dashboard.",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
