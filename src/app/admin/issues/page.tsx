import type { Metadata } from "next";

import { IssuesWorkspace } from "@/components/admin/issues-workspace";

export const metadata: Metadata = {
  title: "Issues",
  description: "Review and manage civic infrastructure reports across Bangladesh.",
};

export default function AdminIssuesPage() {
  return <IssuesWorkspace />;
}
