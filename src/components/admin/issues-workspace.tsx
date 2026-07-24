"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  Filter,
  MoreHorizontal,
  Search,
  SlidersHorizontal,
  X,
  RefreshCw,
} from "lucide-react";

import { SeverityBadge, StatusBadge } from "@/components/shared/issue-badges";
import { Button } from "@/components/ui/button";
import {
  issueCategories,
  issueSeverities,
  issueStatuses,
  type AdminIssue,
} from "@/lib/admin-issues";
import { cn } from "@/lib/utils";
import { useReports } from "@/hooks/use-reports";

type SortKey = "submittedAt" | "severity" | "status";
const severityOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
const PAGE_SIZE = 7;

export function IssuesWorkspace() {
  const { reports, loading, error, reload } = useReports({ limit: 100, sortBy: "createdAt", sortOrder: "desc" });
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [severity, setSeverity] = useState("All severities");
  const [category, setCategory] = useState("All categories");
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortDesc, setSortDesc] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return reports
      .filter((issue) => !query || [issue.id, issue.title, issue.location, issue.district, issue.department].some((value) => value.toLowerCase().includes(query)))
      .filter((issue) => status === "All statuses" || issue.status === status)
      .filter((issue) => severity === "All severities" || issue.severity === severity)
      .filter((issue) => category === "All categories" || issue.category === category)
      .sort((a, b) => {
        let result = 0;
        if (sortKey === "submittedAt") result = new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime();
        if (sortKey === "severity") result = severityOrder[a.severity] - severityOrder[b.severity];
        if (sortKey === "status") result = a.status.localeCompare(b.status);
        return sortDesc ? -result : result;
      });
  }, [category, reports, search, severity, sortDesc, sortKey, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const activeFilters = [status !== "All statuses" ? status : null, severity !== "All severities" ? severity : null, category !== "All categories" ? category : null].filter(Boolean);
  const allVisibleSelected = visible.length > 0 && visible.every((issue) => selected.includes(issue.id));

  function toggleSort(next: SortKey) {
    if (sortKey === next) setSortDesc((value) => !value);
    else { setSortKey(next); setSortDesc(true); }
  }

  function clearFilters() {
    setSearch(""); setStatus("All statuses"); setSeverity("All severities"); setCategory("All categories"); setPage(1);
  }

  function exportSelected() {
    const rows = reports.filter((issue) => selected.includes(issue.id));
    if (!rows.length) return;
    const csv = [
      ["Report ID", "Title", "Category", "Severity", "Location", "Department", "Status", "Submitted"],
      ...rows.map((issue) => [
        issue.trackingCode ?? issue.id,
        issue.title,
        issue.category,
        issue.severity,
        issue.location,
        issue.department,
        issue.status,
        issue.submittedAt,
      ]),
    ].map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "beacon-issues.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[radial-gradient(circle_at_15%_0%,rgba(20,184,166,.06),transparent_28%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">Case management</p>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl">Infrastructure issues</h1>
            <p className="mt-1 text-sm text-slate-500">Triage, assign and resolve citizen reports across Bangladesh.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-white/10 bg-white/[0.035] text-slate-300 hover:bg-white/[0.06] hover:text-white" disabled={!selected.length} onClick={exportSelected}><Download /> Export {selected.length ? `(${selected.length})` : ""}</Button>
            <Button asChild className="bg-teal-400 text-slate-950 hover:bg-teal-300"><Link href="/#report"><Filter /> Create report</Link></Button>
          </div>
        </div>

        <section className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-slate-900/75 shadow-2xl shadow-black/10">
          {error && <div role="alert" className="flex items-center gap-3 border-b border-red-300/10 bg-red-400/[0.06] px-4 py-3 text-xs text-red-300"><span className="flex-1">{error}</span><Button size="sm" variant="ghost" className="hover:bg-red-400/10" onClick={() => void reload()}><RefreshCw /> Retry</Button></div>}
          {loading && <div className="h-0.5 overflow-hidden bg-white/5"><div className="h-full w-1/3 animate-pulse rounded-full bg-teal-400" /></div>}
          <div className="border-b border-white/7 p-4">
            <div className="flex flex-col gap-3 xl:flex-row">
              <label className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
                <span className="sr-only">Search issues</span>
                <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search by report ID, title, location or department…" className="h-10 w-full rounded-lg border border-white/8 bg-slate-950/60 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-600 focus:border-teal-400/40 focus:ring-2 focus:ring-teal-400/10" />
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                <FilterSelect label="Status" value={status} options={issueStatuses} onChange={(value) => { setStatus(value); setPage(1); }} />
                <FilterSelect label="Severity" value={severity} options={issueSeverities} onChange={(value) => { setSeverity(value); setPage(1); }} />
                <FilterSelect label="Category" value={category} options={issueCategories} onChange={(value) => { setCategory(value); setPage(1); }} />
              </div>
              <Button variant="outline" className="border-white/10 bg-white/[0.035] text-slate-400 hover:bg-white/[0.06] hover:text-white"><SlidersHorizontal /> Columns</Button>
            </div>

            {(activeFilters.length > 0 || search) && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-medium uppercase tracking-wide text-slate-600">Active filters</span>
                {activeFilters.map((filter) => <span key={filter} className="inline-flex h-7 items-center gap-1.5 rounded-md border border-teal-300/10 bg-teal-400/8 px-2 text-[10px] font-medium text-teal-300">{filter}</span>)}
                {search && <span className="inline-flex h-7 items-center rounded-md border border-white/8 bg-white/[0.035] px-2 text-[10px] text-slate-400">Search: “{search}”</span>}
                <button onClick={clearFilters} className="ml-1 inline-flex items-center gap-1 text-[10px] text-slate-500 hover:text-white"><X className="size-3" /> Clear all</button>
              </div>
            )}
          </div>

          {selected.length > 0 && (
            <div className="flex items-center gap-3 border-b border-teal-300/10 bg-teal-400/[0.06] px-4 py-2.5 text-xs">
              <span className="font-semibold text-teal-300">{selected.length} selected</span>
              <span className="h-4 w-px bg-white/10" />
              <span className="text-slate-500">Open a report to assign or update its status</span>
              <button onClick={() => setSelected([])} className="ml-auto text-slate-500 hover:text-white">Clear selection</button>
            </div>
          )}

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1120px] border-separate border-spacing-0 text-left">
              <thead className="sticky top-16 z-20 bg-slate-900 text-[9px] font-semibold uppercase tracking-[0.14em] text-slate-600 shadow-[0_1px_0_rgba(255,255,255,0.07)]">
                <tr className="border-b border-white/7">
                  <th className="w-12 px-4 py-3"><Checkbox checked={allVisibleSelected} onChange={() => setSelected(allVisibleSelected ? selected.filter((id) => !visible.some((issue) => issue.id === id)) : Array.from(new Set([...selected, ...visible.map((issue) => issue.id)])))} label="Select visible issues" /></th>
                  <th className="px-3 py-3">Issue</th>
                  <th className="px-3 py-3">Category</th>
                  <SortableHeader label="Severity" active={sortKey === "severity"} desc={sortDesc} onClick={() => toggleSort("severity")} />
                  <th className="px-3 py-3">Location</th>
                  <th className="px-3 py-3">Department</th>
                  <SortableHeader label="Status" active={sortKey === "status"} desc={sortDesc} onClick={() => toggleSort("status")} />
                  <SortableHeader label="Submitted" active={sortKey === "submittedAt"} desc={sortDesc} onClick={() => toggleSort("submittedAt")} />
                  <th className="w-12 px-3 py-3"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/6">
                {visible.map((issue) => <IssueRow key={issue.id} issue={issue} selected={selected.includes(issue.id)} onSelect={() => setSelected((items) => items.includes(issue.id) ? items.filter((id) => id !== issue.id) : [...items, issue.id])} />)}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-white/7 lg:hidden">
            {visible.map((issue) => <IssueMobileCard key={issue.id} issue={issue} selected={selected.includes(issue.id)} onSelect={() => setSelected((items) => items.includes(issue.id) ? items.filter((id) => id !== issue.id) : [...items, issue.id])} />)}
          </div>

          {!loading && !visible.length && <div className="px-6 py-20 text-center"><Search className="mx-auto size-7 text-slate-700" /><h2 className="mt-3 text-sm font-semibold text-slate-300">No issues found</h2><p className="mt-1 text-xs text-slate-600">{error ? "Reconnect to the API and try again." : "Try adjusting your search or clearing the active filters."}</p><Button variant="outline" size="sm" className="mt-4 border-white/10 bg-white/[0.035] text-slate-300" onClick={error ? () => void reload() : clearFilters}>{error ? "Retry connection" : "Clear filters"}</Button></div>}

          <footer className="flex flex-col gap-3 border-t border-white/7 px-4 py-3 text-[11px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>Showing {visible.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} issues</p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="grid size-8 place-items-center rounded-lg border border-white/8 text-slate-400 disabled:opacity-30 hover:not-disabled:bg-white/5" aria-label="Previous page"><ChevronLeft className="size-4" /></button>
              <span className="px-2 font-mono text-[10px] text-slate-400">Page {currentPage} / {pageCount}</span>
              <button disabled={currentPage === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="grid size-8 place-items-center rounded-lg border border-white/8 text-slate-400 disabled:opacity-30 hover:not-disabled:bg-white/5" aria-label="Next page"><ChevronRight className="size-4" /></button>
            </div>
          </footer>
        </section>
      </div>
    </main>
  );
}

function IssueRow({ issue, selected, onSelect }: { issue: AdminIssue; selected: boolean; onSelect: () => void }) {
  return (
    <tr className={cn("group transition hover:bg-white/[0.025]", selected && "bg-teal-400/[0.045]")}>
      <td className="px-4 py-3"><Checkbox checked={selected} onChange={onSelect} label={`Select ${issue.id}`} /></td>
      <td className="max-w-[300px] px-3 py-3"><Link href={`/admin/issues/${issue.id}`} className="block"><span className="font-mono text-[10px] font-medium text-teal-400">{issue.trackingCode ?? issue.id}</span><span className="mt-1 block truncate text-xs font-medium text-slate-200 group-hover:text-white">{issue.title}</span><span className="mt-1 block text-[10px] text-slate-600">Updated {issue.lastUpdated}</span></Link></td>
      <td className="px-3 py-3 text-[11px] text-slate-400">{issue.category}</td>
      <td className="px-3 py-3"><SeverityBadge severity={issue.severity} /></td>
      <td className="max-w-[260px] px-3 py-3"><span className="line-clamp-2 text-[11px] leading-5 text-slate-300">{issue.location}</span>{issue.district !== "Not specified" ? <span className="mt-0.5 block text-[9px] text-slate-600">{issue.district} · {issue.division}</span> : null}</td>
      <td className="max-w-[170px] px-3 py-3 text-[10px] text-slate-400"><span className="line-clamp-2">{issue.department}</span></td>
      <td className="px-3 py-3"><StatusBadge status={issue.status} /></td>
      <td className="px-3 py-3 font-mono text-[10px] text-slate-500">{formatDate(issue.submittedAt)}</td>
      <td className="px-3 py-3"><button className="grid size-8 place-items-center rounded-lg text-slate-600 opacity-0 transition hover:bg-white/5 hover:text-white group-hover:opacity-100" aria-label={`Actions for ${issue.id}`}><MoreHorizontal className="size-4" /></button></td>
    </tr>
  );
}

function IssueMobileCard({ issue, selected, onSelect }: { issue: AdminIssue; selected: boolean; onSelect: () => void }) {
  return (
    <article className={cn("p-4", selected && "bg-teal-400/[0.045]")}>
      <div className="flex items-start gap-3">
        <Checkbox checked={selected} onChange={onSelect} label={`Select ${issue.id}`} />
        <Link href={`/admin/issues/${issue.id}`} className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2"><span className="font-mono text-[10px] font-medium text-teal-400">{issue.trackingCode ?? issue.id}</span><span className="font-mono text-[9px] text-slate-600">{formatDate(issue.submittedAt)}</span></div>
          <h2 className="mt-1.5 text-sm font-medium leading-snug text-slate-100">{issue.title}</h2>
          <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{issue.location} · {issue.category}</p>
          <div className="mt-3 flex flex-wrap gap-2"><SeverityBadge severity={issue.severity} /><StatusBadge status={issue.status} /></div>
        </Link>
      </div>
    </article>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return <label className="relative"><span className="sr-only">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="h-10 min-w-36 appearance-none rounded-lg border border-white/8 bg-slate-950/60 px-3 pr-8 text-xs text-slate-300 outline-none focus:border-teal-400/40">{options.map((option) => <option key={option}>{option}</option>)}</select><ChevronDownIcon /></label>;
}

function ChevronDownIcon() {
  return <svg viewBox="0 0 20 20" fill="none" className="pointer-events-none absolute right-2.5 top-1/2 size-3 -translate-y-1/2 text-slate-600"><path d="m6 8 4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}

function SortableHeader({ label, active, desc, onClick }: { label: string; active: boolean; desc: boolean; onClick: () => void }) {
  return <th className="px-3 py-3"><button onClick={onClick} className={cn("inline-flex items-center gap-1 hover:text-slate-300", active && "text-teal-300")}>{label}{active ? desc ? <ArrowDown className="size-3" /> : <ArrowUp className="size-3" /> : null}</button></th>;
}

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return <label className="inline-grid size-4 shrink-0 cursor-pointer place-items-center"><span className="sr-only">{label}</span><input type="checkbox" checked={checked} onChange={onChange} className="size-4 rounded border-white/15 bg-slate-950 accent-teal-400" /></label>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));
}
