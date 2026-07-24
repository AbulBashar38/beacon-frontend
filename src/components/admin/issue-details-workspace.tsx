"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  FileImage,
  Loader2,
  MapPin,
  RefreshCw,
  Save,
  ShieldAlert,
} from "lucide-react";

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

  const evidence = Array.from(new Set([...report.imageUrls, ...report.evidenceUrls]));
  const coordinateText = report.latitude != null && report.longitude != null
    ? `${report.latitude.toFixed(6)}, ${report.longitude.toFixed(6)}`
    : "Not provided";

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-950 px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/admin/issues" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft className="size-4" />Back to issues</Link>
        <header className="mt-5">
          <p className="font-mono text-xs text-teal-400">{report.trackingCode}</p>
          <h1 className="mt-2 font-heading text-3xl font-bold">{report.summary ?? report.description.split("\n")[0]}</h1>
          <p className="mt-2 flex items-center gap-2 text-sm text-slate-400"><MapPin className="size-4" />{report.locationText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>{label(report.status)}</Pill>
            <Pill>{label(report.severityLevel)}</Pill>
            <Pill>{label(report.assignedDepartment)}</Pill>
          </div>
        </header>

        {error ? <p role="alert" className="mt-5 rounded-xl border border-red-400/15 bg-red-400/8 p-3 text-sm text-red-300">{error}</p> : null}
        {message ? <p role="status" className="mt-5 rounded-xl border border-teal-400/15 bg-teal-400/8 p-3 text-sm text-teal-300">{message}</p> : null}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_.8fr]">
          <section className="space-y-5">
            <DetailSection title="Citizen submission">
              <div>
                <p className="text-[10px] uppercase tracking-wide text-slate-500">Full description</p>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-slate-300">{report.description}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Fact label="Submitted name" value={report.citizenName ?? report.citizen?.name ?? "Not provided"} />
                <Fact label="Contact" value={report.contact ?? "Not provided"} />
                <Fact label="Account email" value={report.citizen?.email ?? "Guest submission"} />
                <Fact label="Citizen account ID" value={report.citizenId ?? "Guest submission"} mono />
                <Fact label="Language" value={label(report.language)} />
                <Fact label="Citizen category" value={label(report.citizenCategory)} />
              </div>
            </DetailSection>

            <DetailSection title="Location information">
              <div className="grid gap-3 sm:grid-cols-2">
                <Fact label="Submitted address" value={report.locationText} />
                <Fact label="Normalized location" value={report.normalizedLocation ?? "Not available"} />
                <Fact label="Coordinates" value={coordinateText} mono />
                <Fact
                  label="Map"
                  value={report.latitude != null && report.longitude != null
                    ? <a className="inline-flex items-center gap-1 text-teal-300 hover:text-teal-200" href={`https://www.openstreetmap.org/?mlat=${report.latitude}&mlon=${report.longitude}#map=17/${report.latitude}/${report.longitude}`} target="_blank" rel="noreferrer">Open location <ExternalLink className="size-3" /></a>
                    : "Coordinates unavailable"}
                />
              </div>
            </DetailSection>

            <DetailSection title={`Evidence (${evidence.length})`}>
              {evidence.length ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {evidence.map((url, index) => (
                    <a key={url} href={url} target="_blank" rel="noreferrer" className="group overflow-hidden rounded-xl border border-white/8 bg-black/15 transition hover:border-teal-300/25">
                      {/* External evidence hosts are user-provided, so native images are intentional. */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt={`Report evidence ${index + 1}`} className="aspect-video w-full object-cover" />
                      <span className="flex items-center justify-between gap-2 px-3 py-2 text-[10px] text-slate-400">
                        <span className="flex min-w-0 items-center gap-2"><FileImage className="size-3 shrink-0" /><span className="truncate">Evidence {index + 1}</span></span>
                        <ExternalLink className="size-3 shrink-0 opacity-60 group-hover:text-teal-300" />
                      </span>
                    </a>
                  ))}
                </div>
              ) : <EmptyValue>No images or evidence URLs were submitted.</EmptyValue>}
            </DetailSection>

            <DetailSection title="AI triage and classification">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <Fact label="Operational category" value={label(report.category)} />
                <Fact label="AI category" value={label(report.aiCategory)} />
                <Fact label="AI confidence" value={percentage(report.aiConfidence)} />
                <Fact label="Severity level" value={label(report.severityLevel)} />
                <Fact label="Severity score" value={percentage(report.severityScore)} />
                <Fact label="Assigned department" value={label(report.assignedDepartment)} />
              </div>
              <TextFact label="Summary" value={report.summary} />
              <TextFact label="Canonical English summary" value={report.canonicalSummary} />
              <TextFact label="Severity rationale" value={report.severityRationale} />
              <TextFact label="Suggested action" value={report.suggestedAction} />
            </DetailSection>

            <DetailSection title="Report record">
              <div className="grid gap-3 sm:grid-cols-2">
                <Fact label="Internal report ID" value={report.id} mono />
                <Fact label="Public tracking code" value={report.trackingCode} mono />
                <Fact label="Current status" value={label(report.status)} />
                <Fact label="Created" value={formatDateTime(report.createdAt)} />
                <Fact label="Last updated" value={formatDateTime(report.updatedAt)} />
                <Fact label="Duplicate score" value={percentage(report.duplicateScore)} />
              </div>
              {report.duplicateParent ? (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Linked parent report</p>
                  <ReportLink report={report.duplicateParent} />
                </div>
              ) : <EmptyValue>This report is not linked as a duplicate.</EmptyValue>}
              {report.duplicateChildren.length ? (
                <div>
                  <p className="text-[10px] uppercase tracking-wide text-slate-500">Linked duplicate reports ({report.duplicateChildren.length})</p>
                  <div className="mt-2 space-y-2">{report.duplicateChildren.map((duplicate) => <ReportLink key={duplicate.id} report={duplicate} />)}</div>
                </div>
              ) : null}
            </DetailSection>

            <DetailSection title={`Complete activity history (${report.progressUpdates.length})`}>
              {report.progressUpdates.length ? (
                <div className="space-y-3">
                  {report.progressUpdates.map((update) => (
                    <div key={update.id} className="rounded-xl border border-white/7 bg-black/10 p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-teal-300">{label(update.status)}</span>
                          <span className={update.visibility === "internal" ? "rounded bg-amber-400/10 px-1.5 py-0.5 text-[9px] text-amber-300" : "rounded bg-cyan-400/10 px-1.5 py-0.5 text-[9px] text-cyan-300"}>{label(update.visibility)}</span>
                        </div>
                        <time className="font-mono text-[9px] text-slate-500">{formatDateTime(update.createdAt)}</time>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-slate-300">{update.note ?? "Status updated without a note."}</p>
                      <p className="mt-3 text-[10px] text-slate-500">Updated by {update.updatedBy ? `${update.updatedBy.name} (${update.updatedBy.email})` : "System"} · <span className="font-mono">{update.id}</span></p>
                    </div>
                  ))}
                </div>
              ) : <EmptyValue>No progress updates have been recorded.</EmptyValue>}
            </DetailSection>
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

function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-2xl border border-white/8 bg-slate-900/70 p-5 sm:p-6"><h2 className="font-heading text-base font-semibold text-white">{title}</h2>{children}</section>;
}

function Fact({ label: itemLabel, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return <div className="min-w-0 rounded-xl border border-white/7 bg-black/10 p-3"><p className="text-[10px] uppercase tracking-wide text-slate-500">{itemLabel}</p><div className={`mt-1 break-words text-sm font-medium text-slate-200 ${mono ? "font-mono text-xs" : ""}`}>{value}</div></div>;
}

function TextFact({ label: itemLabel, value }: { label: string; value: string | null }) {
  return <div><p className="text-[10px] uppercase tracking-wide text-slate-500">{itemLabel}</p><p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">{value ?? "Not available"}</p></div>;
}

function EmptyValue({ children }: { children: React.ReactNode }) {
  return <p className="rounded-xl border border-dashed border-white/8 bg-black/10 p-4 text-xs text-slate-500">{children}</p>;
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="rounded-lg border border-white/8 bg-white/[0.04] px-2.5 py-1 text-[10px] font-medium text-slate-300">{children}</span>;
}

function ReportLink({ report }: { report: { id: string; trackingCode: string; summary: string | null; status: ApiReportStatus } }) {
  return <Link href={`/admin/issues/${report.id}`} className="mt-2 flex items-center justify-between gap-3 rounded-xl border border-white/7 bg-black/10 p-3 transition hover:border-teal-300/20"><span className="min-w-0"><span className="block font-mono text-[10px] text-teal-400">{report.trackingCode}</span><span className="mt-1 block truncate text-xs text-slate-300">{report.summary ?? "Report details"}</span></span><span className="shrink-0 text-[10px] text-slate-500">{label(report.status)}</span></Link>;
}

function percentage(value: number | null) {
  return value == null ? "Not available" : `${Math.round(value * 100)}%`;
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-BD", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Dhaka",
  }).format(new Date(value));
}
