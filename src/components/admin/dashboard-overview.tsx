"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronRight, Download, Loader2, Radio, RefreshCw, ShieldAlert } from "lucide-react";

import { CategoryChart, ResolutionChart } from "@/components/admin/analytics-panels";
import { DashboardPanel } from "@/components/admin/dashboard-panel";
import { MetricCard } from "@/components/admin/metric-card";
import { OverviewMap } from "@/components/admin/overview-map";
import { Button } from "@/components/ui/button";
import { dashboardMetrics } from "@/lib/admin-data";
import { useReports } from "@/hooks/use-reports";
import { useReportStats } from "@/hooks/use-report-stats";
import { useAuth } from "@/contexts/auth-context";

const categoryNames: Record<string, string> = {
  pothole: "Pothole",
  broken_streetlight: "Streetlight",
  water_leak: "Water leak",
  illegal_dumping: "Illegal dumping",
  other: "Other",
};
const categoryColors = ["#2dd4bf", "#38bdf8", "#fbbf24", "#a78bfa", "#fb7185"];

export function DashboardOverview() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const { reports, error: reportsError, reload: reloadReports } = useReports({ limit: 100, sortBy: "createdAt", sortOrder: "desc" }, 30_000);
  const { stats, error: statsError, reload: reloadStats } = useReportStats();
  const criticalIssues = reports.filter((issue) => issue.severity === "Critical" && issue.status !== "Resolved" && issue.status !== "Rejected").slice(0, 3);
  const metrics = dashboardMetrics.map((metric) => {
    if (!stats) return { ...metric, value: "—" };
    const values: Record<string, string> = {
      "Total issues": stats.totalReports.toLocaleString(),
      "New issues": stats.pendingReports.toLocaleString(),
      "Critical": stats.criticalReports.toLocaleString(),
      "In progress": stats.statusBreakdown.in_progress.toLocaleString(),
      "Resolved": stats.resolvedReports.toLocaleString(),
      "Duplicates": stats.duplicatesLinked.toLocaleString(),
      "Avg. resolution": `${(stats.averageResolutionTimeHours / 24).toFixed(1)}d`,
    };
    const descriptions: Record<string, string> = {
      "Total issues": "All active records",
      "New issues": "Awaiting review",
      "Critical": "AI-assessed critical",
      "In progress": "Work underway",
      "Resolved": "Completed reports",
      "Duplicates": "AI-linked reports",
      "Avg. resolution": "Created to resolved",
    };
    return { ...metric, value: values[metric.label] ?? metric.value, change: descriptions[metric.label] ?? "", trend: "neutral" as const };
  });
  const resolutionData = (stats?.last7Days ?? []).map((item) => ({
    day: new Intl.DateTimeFormat("en-BD", { weekday: "short" }).format(new Date(`${item.date}T00:00:00Z`)),
    opened: item.count,
    resolved: item.resolved,
  }));
  const categoryData = Object.entries(stats?.categoryBreakdown ?? {}).map(([name, value], index) => ({
    name: categoryNames[name] ?? name,
    value,
    color: categoryColors[index % categoryColors.length],
  }));
  const recentReports = reports.slice(0, 4);
  const apiError = reportsError ?? statsError;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  async function downloadOverviewReport() {
    if (!stats) return;
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 16;
      let y = 18;

      const addPageIfNeeded = (height = 10) => {
        if (y + height > 280) {
          pdf.addPage();
          y = 18;
        }
      };
      const line = (text: string, size = 10, bold = false) => {
        addPageIfNeeded(size * 0.5 + 3);
        pdf.setFont("helvetica", bold ? "bold" : "normal");
        pdf.setFontSize(size);
        const lines = pdf.splitTextToSize(text, pageWidth - margin * 2);
        pdf.text(lines, margin, y);
        y += lines.length * (size * 0.42) + 2;
      };

      pdf.setTextColor(15, 118, 110);
      line("BEACON CIVIC OPERATIONS", 10, true);
      pdf.setTextColor(15, 23, 42);
      line("National Infrastructure Overview", 20, true);
      line(`Generated ${new Intl.DateTimeFormat("en-BD", { dateStyle: "long", timeStyle: "short" }).format(new Date())}`, 9);
      y += 4;

      line("Executive metrics", 13, true);
      [
        ["Total issues", stats.totalReports],
        ["New issues", stats.pendingReports],
        ["Critical issues", stats.criticalReports],
        ["In progress", stats.statusBreakdown.in_progress],
        ["Resolved", stats.resolvedReports],
        ["AI-linked duplicates", stats.duplicatesLinked],
        ["Average resolution", `${(stats.averageResolutionTimeHours / 24).toFixed(1)} days`],
      ].forEach(([label, value]) => line(`${label}: ${value}`, 10));

      y += 3;
      line("Category breakdown", 13, true);
      Object.entries(stats.categoryBreakdown).forEach(([name, value]) => {
        line(`${categoryNames[name] ?? name}: ${value}`, 10);
      });

      y += 3;
      line("Recent issues", 13, true);
      reports.forEach((issue, index) => {
        addPageIfNeeded(20);
        line(`${index + 1}. ${issue.trackingCode ?? issue.id} — ${issue.title}`, 10, true);
        line(`${issue.status} | ${issue.severity} | ${issue.category} | ${issue.location}`, 9);
        y += 2;
      });

      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`beacon-overview-${date}.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_20%_0%,rgba(20,184,166,.07),transparent_32%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">
              <Radio className="size-3" /> National operations
            </div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">{greeting}, {user?.name ?? "Administrator"}</h1>
            <p className="mt-1 text-sm text-slate-500">Here is the civic infrastructure picture across Bangladesh.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/[0.06] hover:text-white" disabled={!stats || downloading} onClick={() => void downloadOverviewReport()}>
              {downloading ? <Loader2 className="animate-spin" /> : <Download />}
              {downloading ? "Preparing…" : "Download report"}
            </Button>
            <Button className="bg-teal-400 text-slate-950 hover:bg-teal-300" asChild><Link href="/admin/issues"><ShieldAlert /> Review critical</Link></Button>
          </div>
        </div>

        {apiError && <div role="alert" className="mt-5 flex items-center gap-3 rounded-xl border border-red-300/15 bg-red-400/[0.06] px-4 py-3 text-xs text-red-300"><span className="flex-1">{apiError}</span><Button size="sm" variant="ghost" className="hover:bg-red-400/10" onClick={() => { void reloadReports(); void reloadStats(); }}><RefreshCw /> Retry</Button></div>}

        <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7" aria-label="Key metrics">
          {metrics.map((metric) => <MetricCard key={metric.label} metric={metric} />)}
        </section>

        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,.7fr)]">
          <DashboardPanel title="Bangladesh issue intelligence" eyebrow="Live geospatial view" action={<Link href="/admin/map" className="flex items-center gap-1 text-[11px] font-medium text-teal-300 hover:text-teal-200">Open full map <ArrowRight className="size-3" /></Link>}>
            <OverviewMap issues={reports} />
          </DashboardPanel>

          <DashboardPanel title="Critical issue queue" eyebrow="Needs immediate action" action={<span className="rounded-md bg-red-400/10 px-2 py-1 font-mono text-[10px] text-red-300">{criticalIssues.length} shown</span>}>
            <div className="divide-y divide-white/7">
              {criticalIssues.map((issue) => (
                <Link key={issue.id} href={`/admin/issues/${issue.id}`} className="group block p-4 transition hover:bg-white/[0.025]">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-red-400/10 text-red-300"><ShieldAlert className="size-4" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2"><span className="font-mono text-[9px] uppercase tracking-wide text-slate-600">{issue.trackingCode ?? issue.id.slice(0, 8)}</span><span className="text-[10px] text-slate-600">{issue.lastUpdated}</span></div>
                      <p className="mt-1 text-xs font-medium leading-relaxed text-slate-200 group-hover:text-white">{issue.title}</p>
                      <p className="mt-1 text-[10px] text-slate-500">{issue.location}</p>
                    </div>
                    <ChevronRight className="mt-6 size-4 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-teal-300" />
                  </div>
                </Link>
              ))}
              {!criticalIssues.length && <div className="px-5 py-12 text-center"><p className="text-xs font-medium text-slate-300">No critical issues</p><p className="mt-1 text-[10px] text-slate-600">The live API has no open critical reports.</p></div>}
            </div>
            <div className="border-t border-white/7 p-3"><Button variant="ghost" className="w-full text-xs text-slate-400 hover:bg-white/5 hover:text-white" asChild><Link href="/admin/issues">View priority queue <ArrowRight /></Link></Button></div>
          </DashboardPanel>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <DashboardPanel title="Resolution performance" eyebrow="Last 7 days" action={<ChartLegend />}>
            <ResolutionChart data={resolutionData} />
          </DashboardPanel>
          <DashboardPanel title="Issue categories" eyebrow="Distribution">
            <CategoryChart data={categoryData} />
          </DashboardPanel>
        </div>

        <DashboardPanel title="Recent report activity" eyebrow="Latest API records" className="mt-4">
          <div className="grid divide-y divide-white/7 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-4">
            {recentReports.map((issue) => (
              <Link href={`/admin/issues/${issue.id}`} key={issue.id} className="flex gap-3 p-4 transition hover:bg-white/[0.025]">
                <span className="mt-1 size-2 shrink-0 rounded-full bg-teal-400" />
                <div className="min-w-0"><p className="truncate text-xs font-medium text-slate-200">{issue.title}</p><p className="mt-1 font-mono text-[10px] text-slate-600">{issue.trackingCode ?? issue.id.slice(0, 8)} · {issue.status}</p></div>
              </Link>
            ))}
            {!recentReports.length ? <p className="p-6 text-xs text-slate-500">No reports are available yet.</p> : null}
          </div>
        </DashboardPanel>
      </div>
    </main>
  );
}

function ChartLegend() {
  return <div className="flex items-center gap-3 text-[9px] text-slate-500"><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-slate-500" />Opened</span><span className="flex items-center gap-1"><span className="size-1.5 rounded-full bg-teal-400" />Resolved</span></div>;
}
