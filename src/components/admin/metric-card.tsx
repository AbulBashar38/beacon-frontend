import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

import type { DashboardMetric } from "@/lib/admin-data";
import { cn } from "@/lib/utils";

const toneStyles = {
  default: "bg-cyan-400/10 text-cyan-300",
  danger: "bg-red-400/10 text-red-300",
  warning: "bg-amber-400/10 text-amber-300",
  success: "bg-emerald-400/10 text-emerald-300",
};

export function MetricCard({ metric }: { metric: DashboardMetric }) {
  const Icon = metric.icon;
  const TrendIcon = metric.trend === "up" ? ArrowUpRight : metric.trend === "down" ? ArrowDownRight : Minus;

  return (
    <article className="group rounded-2xl border border-white/8 bg-slate-900/75 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-teal-400/20 hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-400">{metric.label}</p>
        <span className={cn("grid size-8 place-items-center rounded-lg", toneStyles[metric.tone])}>
          <Icon className="size-4" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-heading text-2xl font-bold tracking-tight text-white">{metric.value}</p>
      <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
        <TrendIcon className="size-3" aria-hidden="true" />
        {metric.change}
      </p>
    </article>
  );
}
