"use client";

import { useMemo, useState } from "react";
import {
  BarChart3,
  Check,
  Download,
  FileText,
  MapPinned,
  RotateCcw,
  Save,
  SlidersHorizontal,
} from "lucide-react";

import { SeverityBadge, StatusBadge } from "@/components/shared/issue-badges";
import { Button } from "@/components/ui/button";
import { useReports } from "@/hooks/use-reports";
import { issueCategories, issueSeverities, issueStatuses, type AdminIssue } from "@/lib/admin-issues";
import { cn } from "@/lib/utils";

type ReportConfig = {
  startDate: string;
  endDate: string;
  division: string;
  district: string;
  category: string;
  severity: string;
  status: string;
  department: string;
  mapType: string;
  includeDetails: boolean;
  includeCharts: boolean;
};

const defaultConfig: ReportConfig = {
  startDate: "2026-07-01",
  endDate: "2026-07-24",
  division: "All divisions",
  district: "All districts",
  category: "All categories",
  severity: "All severities",
  status: "All statuses",
  department: "All departments",
  mapType: "Issue heatmap",
  includeDetails: true,
  includeCharts: true,
};

const divisions = ["All divisions", "Barishal", "Chattogram", "Dhaka", "Khulna", "Mymensingh", "Rajshahi", "Rangpur", "Sylhet"];
const mapTypes = ["Issue heatmap", "Severity view", "District summary", "Marker view"];

export function ReportBuilder() {
  const { reports, loading, error, reload } = useReports({ limit: 100, sortBy: "createdAt", sortOrder: "desc" });
  const [config, setConfig] = useState(defaultConfig);
  const [saved, setSaved] = useState(false);
  const districts = useMemo(() => ["All districts", ...Array.from(new Set(reports.map((issue) => issue.district))).sort()], [reports]);
  const departments = useMemo(() => ["All departments", ...Array.from(new Set(reports.map((issue) => issue.department))).sort()], [reports]);

  const reportIssues = useMemo(() => reports.filter((issue) => {
    const submitted = issue.submittedAt.slice(0, 10);
    return submitted >= config.startDate &&
      submitted <= config.endDate &&
      (config.division === "All divisions" || issue.division === config.division) &&
      (config.district === "All districts" || issue.district === config.district) &&
      (config.category === "All categories" || issue.category === config.category) &&
      (config.severity === "All severities" || issue.severity === config.severity) &&
      (config.status === "All statuses" || issue.status === config.status) &&
      (config.department === "All departments" || issue.department === config.department);
  }), [config, reports]);

  function update<K extends keyof ReportConfig>(key: K, value: ReportConfig[K]) {
    setConfig((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,.06),transparent_28%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">Intelligence exports</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Report builder</h1>
            <p className="mt-1 text-sm text-slate-500">Create official infrastructure summaries for review and distribution.</p>
          </div>
          <div className="flex flex-wrap gap-2 print:hidden">
            <Button variant="outline" className="border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/[0.06] hover:text-white" onClick={() => { setConfig(defaultConfig); setSaved(false); }}><RotateCcw /> Reset</Button>
            <Button variant="outline" className="border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/[0.06] hover:text-white" onClick={() => { setSaved(true); window.setTimeout(() => setSaved(false), 1800); }}>{saved ? <Check className="text-emerald-300" /> : <Save />}{saved ? "Saved" : "Save configuration"}</Button>
            <Button className="bg-teal-400 text-slate-950 hover:bg-teal-300" onClick={() => window.print()}><Download /> Download PDF</Button>
          </div>
        </div>

        <div className="mt-6 grid items-start gap-5 xl:grid-cols-[320px_minmax(0,1fr)]">
          <ReportFilters config={config} update={update} resultCount={reportIssues.length} districts={districts} departments={departments} />
          <div>
            {error && <div role="alert" className="mb-3 flex items-center gap-3 rounded-xl border border-red-300/15 bg-red-400/[0.06] px-4 py-3 text-xs text-red-300 print:hidden"><span className="flex-1">{error}</span><button onClick={() => void reload()} className="font-semibold text-white">Retry</button></div>}
            {loading && <div className="mb-3 rounded-xl border border-white/8 bg-white/[0.035] px-4 py-2 text-[10px] text-teal-300 print:hidden">Syncing report data from the API…</div>}
          <ReportPreview config={config} issues={reportIssues} />
          </div>
        </div>
      </div>
    </main>
  );
}

function ReportFilters({ config, update, resultCount, districts, departments }: { config: ReportConfig; update: <K extends keyof ReportConfig>(key: K, value: ReportConfig[K]) => void; resultCount: number; districts: string[]; departments: string[] }) {
  return (
    <aside className="overflow-hidden rounded-2xl border border-white/8 bg-slate-900/80 shadow-xl shadow-black/10 print:hidden xl:sticky xl:top-20">
      <header className="border-b border-white/7 px-5 py-4">
        <div className="flex items-center gap-2"><SlidersHorizontal className="size-4 text-teal-300" /><h2 className="font-heading text-sm font-semibold text-white">Report parameters</h2></div>
        <p className="mt-1 text-[10px] text-slate-500">{resultCount} matching reports in preview</p>
      </header>
      <div className="max-h-[calc(100vh-11rem)] space-y-5 overflow-y-auto p-5">
        <FilterGroup label="Reporting period">
          <div className="grid grid-cols-2 gap-2">
            <DateField label="From" value={config.startDate} onChange={(value) => update("startDate", value)} />
            <DateField label="To" value={config.endDate} onChange={(value) => update("endDate", value)} />
          </div>
        </FilterGroup>
        <FilterGroup label="Geography">
          <SelectField label="Division" value={config.division} options={divisions} onChange={(value) => update("division", value)} />
          <SelectField label="District" value={config.district} options={districts} onChange={(value) => update("district", value)} />
        </FilterGroup>
        <FilterGroup label="Issue criteria">
          <SelectField label="Category" value={config.category} options={issueCategories} onChange={(value) => update("category", value)} />
          <SelectField label="Severity" value={config.severity} options={issueSeverities} onChange={(value) => update("severity", value)} />
          <SelectField label="Status" value={config.status} options={issueStatuses} onChange={(value) => update("status", value)} />
          <SelectField label="Department" value={config.department} options={departments} onChange={(value) => update("department", value)} />
        </FilterGroup>
        <FilterGroup label="Visualization">
          <SelectField label="Map view" value={config.mapType} options={mapTypes} onChange={(value) => update("mapType", value)} />
          <ToggleField label="Include analysis charts" checked={config.includeCharts} onChange={(value) => update("includeCharts", value)} />
          <ToggleField label="Include issue details" checked={config.includeDetails} onChange={(value) => update("includeDetails", value)} />
        </FilterGroup>
      </div>
    </aside>
  );
}

function ReportPreview({ config, issues }: { config: ReportConfig; issues: AdminIssue[] }) {
  const resolved = issues.filter((issue) => issue.status === "Resolved").length;
  const critical = issues.filter((issue) => issue.severity === "Critical").length;
  const inProgress = issues.filter((issue) => issue.status === "In progress").length;
  const resolutionRate = issues.length ? Math.round((resolved / issues.length) * 100) : 0;

  return (
    <section className="report-paper mx-auto w-full max-w-[1040px] overflow-hidden rounded-sm bg-slate-50 text-slate-900 shadow-[0_28px_80px_-22px_rgba(0,0,0,.55)] print:max-w-none print:shadow-none" aria-label="Report preview">
      <div className="h-2 bg-gradient-to-r from-emerald-700 via-teal-600 to-cyan-600" />
      <div className="px-6 py-7 sm:px-10 sm:py-9">
        <ReportHeader config={config} />

        <section className="mt-8 grid gap-5 border-y border-slate-200 py-6 sm:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="report-label">Executive summary</p>
            <h2 className="mt-2 font-heading text-xl font-bold tracking-tight text-slate-900">National Civic Infrastructure Situation Report</h2>
            <p className="mt-3 text-xs leading-6 text-slate-600">This report consolidates {issues.length} citizen-submitted infrastructure cases matching the applied criteria. Operational teams are currently managing {inProgress} active repairs, with {critical} cases classified as critical and requiring priority coordination.</p>
          </div>
          <AppliedFilters config={config} />
        </section>

        <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <ReportMetric label="Matching issues" value={String(issues.length)} />
          <ReportMetric label="Critical cases" value={String(critical)} tone="danger" />
          <ReportMetric label="In progress" value={String(inProgress)} tone="warning" />
          <ReportMetric label="Resolution rate" value={`${resolutionRate}%`} tone="success" />
        </section>

        <section className="mt-7">
          <SectionTitle icon={<MapPinned />} label="Geospatial overview" meta={config.mapType} />
          <ReportMap issues={issues} />
        </section>

        {config.includeCharts && (
          <section className="mt-7 break-inside-avoid">
            <SectionTitle icon={<BarChart3 />} label="Issue analysis" meta="Category and severity distribution" />
            <ReportCharts issues={issues} />
          </section>
        )}

        {config.includeDetails && (
          <section className="mt-7">
            <SectionTitle icon={<FileText />} label="Issue register" meta={`${issues.length} matching records`} />
            <ReportTable issues={issues} />
          </section>
        )}

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-4 text-[8px] leading-relaxed text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>Generated by Beacon Civic Infrastructure Intelligence · Government Operations Portal</p>
          <p className="font-mono">CONFIDENTIALITY: OFFICIAL USE · BCN/RPT/2026/0724</p>
        </footer>
      </div>
    </section>
  );
}

function ReportHeader({ config }: { config: ReportConfig }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-lg bg-emerald-700 text-lg font-black text-white">B</div>
        <div><p className="font-heading text-lg font-extrabold tracking-tight">BEACON</p><p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-emerald-700">Civic Infrastructure Intelligence</p></div>
      </div>
      <div className="sm:text-right">
        <p className="report-label">Infrastructure situation report</p>
        <p className="mt-1 font-mono text-[10px] text-slate-600">{formatReportDate(config.startDate)} — {formatReportDate(config.endDate)}</p>
        <p className="mt-1 font-mono text-[8px] text-slate-400">Generated 24 Jul 2026 · 10:30 BST</p>
      </div>
    </header>
  );
}

function AppliedFilters({ config }: { config: ReportConfig }) {
  const values = [config.division, config.district, config.category, config.severity, config.status].filter((value) => !value.startsWith("All "));
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="report-label">Applied filters</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {values.length ? values.map((value) => <span key={value} className="rounded bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-800">{value}</span>) : <span className="text-[10px] text-slate-500">All national records</span>}
      </div>
      <p className="mt-3 text-[9px] text-slate-400">Map view: {config.mapType}</p>
    </div>
  );
}

function ReportMetric({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "danger" | "warning" | "success" }) {
  const tones = { default: "text-slate-900", danger: "text-red-700", warning: "text-amber-700", success: "text-emerald-700" };
  return <div className="rounded-lg border border-slate-200 bg-white p-3"><p className="text-[8px] font-bold uppercase tracking-[0.12em] text-slate-400">{label}</p><p className={cn("mt-1 font-heading text-xl font-extrabold", tones[tone])}>{value}</p></div>;
}

function ReportMap({ issues }: { issues: AdminIssue[] }) {
  const dots = issues.slice(0, 12);
  return (
    <div className="relative mt-3 h-64 overflow-hidden rounded-lg border border-slate-200 bg-[linear-gradient(rgba(15,118,110,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(15,118,110,.04)_1px,transparent_1px)] bg-[size:24px_24px] sm:h-72">
      <svg viewBox="0 0 600 280" className="h-full w-full" role="img" aria-label="Bangladesh issue density summary">
        <path d="M280 18 330 32 344 66 386 77 368 109 405 133 377 166 392 198 348 215 334 263 296 238 270 262 242 224 208 236 219 190 181 170 208 132 189 101 226 82 215 48 260 45Z" fill="#dff6ef" stroke="#0f766e" strokeWidth="2" />
        {dots.map((issue, index) => {
          const x = 235 + ((index * 47) % 135);
          const y = 54 + ((index * 61) % 166);
          const color = issue.severity === "Critical" ? "#dc2626" : issue.severity === "High" ? "#f97316" : issue.severity === "Medium" ? "#f59e0b" : "#06b6d4";
          return <g key={issue.id}><circle cx={x} cy={y} r={issue.severity === "Critical" ? 20 : 14} fill={color} opacity=".12" /><circle cx={x} cy={y} r="4" fill={color} stroke="white" strokeWidth="1.5" /></g>;
        })}
      </svg>
      <div className="absolute bottom-3 left-3 rounded-md border border-slate-200 bg-white/95 px-3 py-2 shadow-sm">
        <p className="text-[8px] font-bold uppercase tracking-wider text-slate-400">Density scale</p>
        <div className="mt-1 flex items-center gap-2 text-[8px] text-slate-500"><span>Low</span><span className="h-1.5 w-20 rounded-full bg-gradient-to-r from-cyan-400 via-amber-400 to-red-500" /><span>Critical</span></div>
      </div>
    </div>
  );
}

function ReportCharts({ issues }: { issues: AdminIssue[] }) {
  const categoryCounts = issueCategories.slice(1).map((category) => ({ label: category, value: issues.filter((issue) => issue.category === category).length }));
  const severityCounts = issueSeverities.slice(1).map((severity) => ({ label: severity, value: issues.filter((issue) => issue.severity === severity).length }));
  const max = Math.max(1, ...categoryCounts.map((item) => item.value), ...severityCounts.map((item) => item.value));
  return (
    <div className="mt-3 grid gap-4 sm:grid-cols-2">
      <ReportBarChart title="Category breakdown" data={categoryCounts} max={max} color="bg-teal-600" />
      <ReportBarChart title="Severity breakdown" data={severityCounts} max={max} color="bg-amber-500" />
    </div>
  );
}

function ReportBarChart({ title, data, max, color }: { title: string; data: Array<{ label: string; value: number }>; max: number; color: string }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4"><h3 className="text-[10px] font-bold text-slate-700">{title}</h3><div className="mt-4 space-y-2.5">{data.map((item) => <div key={item.label} className="grid grid-cols-[74px_1fr_20px] items-center gap-2 text-[8px]"><span className="truncate text-slate-500">{item.label}</span><div className="h-2 rounded-full bg-slate-100"><div className={cn("h-full rounded-full", color)} style={{ width: `${(item.value / max) * 100}%` }} /></div><span className="font-mono font-bold text-slate-700">{item.value}</span></div>)}</div></div>;
}

function ReportTable({ issues }: { issues: AdminIssue[] }) {
  return (
    <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
      <table className="w-full text-left">
        <thead className="bg-slate-100 text-[7px] font-bold uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-2">Report</th><th className="hidden px-3 py-2 sm:table-cell">Location</th><th className="px-3 py-2">Severity</th><th className="px-3 py-2">Status</th></tr></thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {issues.slice(0, 8).map((issue) => <tr key={issue.id}><td className="px-3 py-2"><p className="font-mono text-[7px] text-slate-400">{issue.id}</p><p className="mt-0.5 max-w-72 truncate text-[8px] font-semibold text-slate-700">{issue.title}</p></td><td className="hidden px-3 py-2 text-[8px] text-slate-500 sm:table-cell">{issue.location}, {issue.district}</td><td className="px-3 py-2"><SeverityBadge severity={issue.severity} /></td><td className="px-3 py-2"><StatusBadge status={issue.status} /></td></tr>)}
        </tbody>
      </table>
      {issues.length > 8 && <p className="border-t border-slate-100 bg-slate-50 px-3 py-2 text-center text-[8px] text-slate-400">Showing 8 of {issues.length} matching records</p>}
      {!issues.length && <p className="bg-white px-3 py-10 text-center text-[9px] text-slate-400">No issue records match the selected filters.</p>}
    </div>
  );
}

function SectionTitle({ icon, label, meta }: { icon: React.ReactNode; label: string; meta: string }) {
  return <div className="flex items-center justify-between border-b border-slate-200 pb-2"><div className="flex items-center gap-2 text-emerald-700 [&_svg]:size-3.5"><span>{icon}</span><h2 className="text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-800">{label}</h2></div><span className="text-[8px] text-slate-400">{meta}</span></div>;
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return <fieldset className="space-y-2.5"><legend className="mb-2 text-[9px] font-semibold uppercase tracking-[0.15em] text-slate-600">{label}</legend>{children}</fieldset>;
}

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="block"><span className="mb-1 block text-[10px] font-medium text-slate-400">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-lg border border-white/8 bg-slate-950/60 px-2.5 text-[11px] text-slate-300 outline-none focus:border-teal-400/40">{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}

function DateField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <label><span className="mb-1 block text-[10px] font-medium text-slate-400">{label}</span><input type="date" value={value} onChange={(event) => onChange(event.target.value)} className="h-9 w-full rounded-lg border border-white/8 bg-slate-950/60 px-2 text-[10px] text-slate-300 outline-none focus:border-teal-400/40" /></label>;
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-white/7 bg-white/[0.025] px-3 py-2.5"><span className="text-[11px] text-slate-300">{label}</span><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="size-4 accent-teal-400" /></label>;
}

function formatReportDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(`${value}T00:00:00`));
}
