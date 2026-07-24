import type { IssueSeverity, IssueStatus } from "@/lib/admin-issues";
import { cn } from "@/lib/utils";

const statusStyles: Record<IssueStatus, string> = {
  New: "border-cyan-300/15 bg-cyan-400/10 text-cyan-300",
  Acknowledged: "border-violet-300/15 bg-violet-400/10 text-violet-300",
  "In progress": "border-amber-300/15 bg-amber-400/10 text-amber-300",
  Resolved: "border-emerald-300/15 bg-emerald-400/10 text-emerald-300",
};

const severityStyles: Record<IssueSeverity, string> = {
  Critical: "border-red-300/15 bg-red-400/10 text-red-300",
  High: "border-orange-300/15 bg-orange-400/10 text-orange-300",
  Medium: "border-amber-300/15 bg-amber-400/10 text-amber-300",
  Low: "border-slate-300/10 bg-slate-400/10 text-slate-400",
};

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold", statusStyles[status])}><span className="mr-1.5 size-1.5 rounded-full bg-current" />{status}</span>;
}

export function SeverityBadge({ severity }: { severity: IssueSeverity }) {
  return <span className={cn("inline-flex items-center rounded-md border px-2 py-1 text-[10px] font-semibold", severityStyles[severity])}>{severity}</span>;
}
