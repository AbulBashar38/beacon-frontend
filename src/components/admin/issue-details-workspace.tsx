"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, RefreshCw, Save, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  reportApi,
  type ApiDepartment,
  type ApiReportDetails,
  type ApiReportStatus,
} from "@/lib/api/report-api";

const statuses: ApiReportStatus[] = ["pending", "under_review", "assigned", "in_progress", "resolved", "rejected"];
const departments: ApiDepartment[] = ["roads_and_highways", "electrical", "water_and_sewerage", "waste_management", "general"];
const label = (value: string | null) => value ? value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) : "Unassigned";

export function IssueDetailsWorkspace({ id }: { id: string }) {
  const [report, setReport] = useState<ApiReportDetails | null>(null);
  const [status, setStatus] = useState<ApiReportStatus>("pending");
  const [department, setDepartment] = useState<ApiDepartment>("general");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const result = await reportApi.getById(id);
      setReport(result);
      setStatus(result.status);
      setDepartment(result.assignedDepartment ?? "general");
    } catch (reason) {
      setError(getApiErrorMessage(reason, "Unable to load this issue."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void reportApi.getById(id)
      .then((result) => {
        setReport(result);
        setStatus(result.status);
        setDepartment(result.assignedDepartment ?? "general");
      })
      .catch((reason) => setError(getApiErrorMessage(reason, "Unable to load this issue.")))
      .finally(() => setLoading(false));
  }, [id]);

  async function saveChanges() {
    if (!report) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      let updated = report;
      if (department !== report.assignedDepartment) {
        updated = await reportApi.assignDepartment(report.id, {
          assignedDepartment: department,
          note: note || undefined,
        });
      }
      if (status !== updated.status) {
        updated = await reportApi.updateStatus(report.id, {
          status,
          note: note || undefined,
          visibility: "public",
        });
      }
      setReport(updated);
      setNote("");
      setMessage("Issue updated successfully.");
      await load();
    } catch (reason) {
      setError(getApiErrorMessage(reason, "Unable to update this issue."));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-slate-950 text-slate-400"><span className="flex items-center gap-2 text-sm"><Loader2 className="size-4 animate-spin" />Loading issue…</span></main>;

  if (!report) return <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-slate-950"><div className="text-center text-slate-300"><ShieldAlert className="mx-auto size-8 text-red-400" /><p className="mt-3">{error ?? "Issue not found."}</p><Button className="mt-4" onClick={() => void load()}><RefreshCw />Retry</Button></div></main>;

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/issues" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="size-4" />Back to issues</Link>
        <header className="mt-5">
          <p className="font-mono text-xs text-teal-400">{report.trackingCode}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">{report.summary ?? report.description.split("\n")[0]}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin className="size-4" />{report.locationText}</p>
        </header>

        {error ? <p role="alert" className="mt-5 rounded-xl border border-red-400/15 bg-red-400/8 p-3 text-sm text-red-300">{error}</p> : null}
        {message ? <p role="status" className="mt-5 rounded-xl border border-teal-400/15 bg-teal-400/8 p-3 text-sm text-teal-300">{message}</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <section className="space-y-5 rounded-2xl border border-white/8 bg-slate-900/70 p-6">
            <div><p className="text-xs uppercase tracking-wide text-slate-500">Citizen description</p><p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">{report.description}</p></div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Fact label="AI category" value={label(report.category)} />
              <Fact label="Severity" value={label(report.severityLevel)} />
              <Fact label="Confidence" value={report.severityScore == null ? "Pending" : `${Math.round(report.severityScore * 100)}%`} />
            </div>
            {report.severityRationale ? <div><p className="text-xs uppercase tracking-wide text-slate-500">AI rationale</p><p className="mt-2 text-sm text-slate-300">{report.severityRationale}</p></div> : null}
            <div><p className="text-xs uppercase tracking-wide text-slate-500">Public progress</p><div className="mt-3 space-y-3">{report.progressUpdates.map((update) => <div key={update.id} className="rounded-xl border border-white/7 bg-black/10 p-3"><p className="text-xs font-semibold text-teal-300">{label(update.status)}</p><p className="mt-1 text-sm text-slate-400">{update.note ?? "Status updated"}</p></div>)}</div></div>
          </section>

          <aside className="h-fit rounded-2xl border border-white/8 bg-slate-900/80 p-5 lg:sticky lg:top-20">
            <h2 className="font-heading text-lg font-semibold">Operational action</h2>
            <label className="mt-5 block text-xs text-slate-400">Department<select value={department} onChange={(event) => setDepartment(event.target.value as ApiDepartment)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950 px-3 text-sm">{departments.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <label className="mt-4 block text-xs text-slate-400">Status<select value={status} onChange={(event) => setStatus(event.target.value as ApiReportStatus)} className="mt-2 h-11 w-full rounded-lg border border-white/10 bg-slate-950 px-3 text-sm">{statuses.map((value) => <option key={value} value={value}>{label(value)}</option>)}</select></label>
            <label className="mt-4 block text-xs text-slate-400">Public progress note<Textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-2 border-white/10 bg-slate-950" placeholder="Explain the latest action to the citizen" /></label>
            <Button className="mt-5 w-full bg-teal-400 text-slate-950 hover:bg-teal-300" disabled={saving} onClick={saveChanges}>{saving ? <Loader2 className="animate-spin" /> : <Save />}Save update</Button>
          </aside>
        </div>
      </div>
    </main>
  );
}

function Fact({ label: itemLabel, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-white/7 bg-black/10 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{itemLabel}</p><p className="mt-1 text-sm font-medium">{value}</p></div>;
}
