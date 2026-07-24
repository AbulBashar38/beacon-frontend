import Link from "next/link";
import { ArrowRight, ChevronRight, Filter, Radio, ShieldAlert } from "lucide-react";

import { CategoryChart, ResolutionChart } from "@/components/admin/analytics-panels";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { MetricCard } from "@/components/admin/metric-card";
import { OverviewMap } from "@/components/admin/overview-map";
import { Button } from "@/components/ui/button";
import { criticalIssues, dashboardMetrics, districtRanking, recentActivity } from "@/lib/admin-data";

const activityTone: Record<string, string> = {
  primary: "bg-teal-400",
  danger: "bg-red-400",
  success: "bg-emerald-400",
  warning: "bg-amber-400",
};

export function DashboardOverview() {
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,.07),transparent_32%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">
              <Radio className="size-3" /> National operations
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Good morning, Sadia</h1>
            <p className="mt-1 text-sm text-slate-500">Here is the civic infrastructure picture across Bangladesh.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/[0.06] hover:text-white"><Filter /> Filter view</Button>
            <Button className="bg-teal-400 text-slate-950 hover:bg-teal-300" asChild><Link href="/admin/issues"><ShieldAlert /> Review critical</Link></Button>
          </div>
        </div>

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7" aria-label="Key metrics">
          {dashboardMetrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.7fr)]">
          <DashboardPanel title="Bangladesh issue intelligence" eyebrow="Live geospatial view" action={<Link href="/admin/map" className="flex items-center gap-1 text-[11px] font-medium text-teal-300 hover:text-teal-200">Open full map <ArrowRight className="size-3" /></Link>}>
            <OverviewMap />
          </DashboardPanel>

          <DashboardPanel title="Critical issue queue" eyebrow="Needs immediate action" action={<span className="rounded-md bg-red-400/10 px-2 py-1 font-mono text-[10px] text-red-300">27 open</span>}>
            <div className="divide-y divide-white/7">
              {criticalIssues.map((issue) => (
                <Link key={issue.id} href={`/admin/issues/${issue.id}`} className="group block p-4 transition hover:bg-white/[0.025]">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-300"><ShieldAlert className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] uppercase tracking-wide text-slate-600">{issue.id}</span><span className="text-[10px] text-slate-600">{issue.age}</span></div>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-slate-200 group-hover:text-white">{issue.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{issue.location}</p>
                    </div>
                    <ChevronRight className="mt-6 size-4 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-teal-300" />
                  </div>
                </Link>
              ))}
            </div>
            <div className="border-t border-white/7 p-3"><Button variant="ghost" className="w-full text-xs text-slate-400 hover:bg-white/5 hover:text-white" asChild><Link href="/admin/issues">View priority queue <ArrowRight /></Link></Button></div>
          </DashboardPanel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-[1fr_1fr_.85fr]">
          <DashboardPanel title="Resolution performance" eyebrow="Last 7 days" action={<ChartLegend />}>
            <ResolutionChart />
          </DashboardPanel>
          <DashboardPanel title="Issue categories" eyebrow="Distribution">
            <CategoryChart />
          </DashboardPanel>
          <DashboardPanel title="District ranking" eyebrow="Operational load">
            <div className="divide-y divide-white/7">
              {districtRanking.map((district, index) => (
                <div key={district.district} className="grid grid-cols-[24px_1fr_auto] items-center gap-3 px-4 py-3">
                  <span className="font-mono text-[10px] text-slate-600">{String(index + 1).padStart(2, "0")}</span>
                  <div><p className="text-xs font-medium text-slate-200">{district.district}</p><div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5"><div className="h-full rounded-full bg-teal-400/70" style={{ width: `${district.resolved}%` }} /></div></div>
                  <div className="text-right"><p className="font-mono text-xs font-semibold text-white">{district.open}</p><p className="text-[9px] text-slate-600">{district.resolved}% SLA</p></div>
                </div>
              ))}
            </div>
          </DashboardPanel>
        </div>

        <DashboardPanel title="Recent national activity" eyebrow="Live operations log" className="mt-4">
          <div className="grid divide-y divide-white/7 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            {recentActivity.map((activity) => (
              <div key={activity.title} className="flex gap-3 p-4">
                <span className={`mt-1 size-2 shrink-0 rounded-full ${activityTone[activity.tone]}`} />
                <div><p className="text-xs font-medium text-slate-200">{activity.title}</p><p className="mt-1 text-[10px] text-slate-600">{activity.meta}</p></div>
              </div>
            ))}
          </div>
        </DashboardPanel>
      </div>
    </main>
  );
}

function ChartLegend() {
  return <div className="flex items-center gap-3 text-[9px] text-slate-500"><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-slate-500" />Opened</span><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-teal-400" />Resolved</span></div>;
}
