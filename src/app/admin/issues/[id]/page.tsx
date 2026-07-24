import type { Metadata } from "next";

import { IssueDetailsWorkspace } from "@/components/admin/issue-details-workspace";

export const metadata: Metadata = {
  title: "Issue Details",
  description: "Review, assign, and update a civic infrastructure issue.",
};

export default async function AdminIssueDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <IssueDetailsWorkspace id={id} />;
}
