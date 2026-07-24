"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Loader2, MapPin, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/client";
import { reportApi, type TrackedReport } from "@/lib/api/report-api";

const label = (value: string | null) =>
  value ? value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase()) : "Pending assignment";

export function TrackingWorkspace() {
  const [code, setCode] = useState("");
  const [report, setReport] = useState<TrackedReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function track() {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setError("Enter your public tracking code.");
      return;
    }
    setLoading(true);
    setError(null);
    setReport(null);
    try {
      setReport(await reportApi.track(normalized));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "That tracking code could not be found."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back to Beacon</Link>
        <section className="mt-8 rounded-3xl border border-border bg-surface p-6 shadow-[var(--shadow-elevated)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">Public report tracking</p>
          <h1 className="mt-3 font-heading text-3xl font-bold tracking-tight">Follow your report</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Enter the code you received after submission. Personal information is never shown here.</p>
          <form className="mt-6 flex flex-col gap-2 sm:flex-row" onSubmit={(event) => { event.preventDefault(); void track(); }}>
            <Input value={code} onChange={(event) => setCode(event.target.value)} className="h-12 flex-1 font-mono uppercase tracking-wide" placeholder="CIV-XXXXXX" aria-label="Tracking code" />
            <Button type="submit" size="xl" variant="hero" disabled={loading}>{loading ? <Loader2 className="animate-spin" /> : <Search />}Track report</Button>
          </form>
          {error && <p role="alert" className="mt-3 rounded-xl bg-danger/8 px-4 py-3 text-sm font-medium text-danger">{error}</p>}
        </section>

        {report && (
          <section className="mt-5 overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
            <header className="border-b border-border bg-surface-muted/50 p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div><p className="font-mono text-xs text-muted-foreground">{report.trackingCode}</p><h2 className="mt-2 font-heading text-xl font-bold">{report.summary}</h2></div>
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary"><span className="size-2 rounded-full bg-current" />{label(report.status)}</span>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <Info icon={<ShieldCheck />} label="Category" value={label(report.category)} />
                <Info icon={<Clock3 />} label="Severity" value={label(report.severity.level)} />
                <Info icon={<MapPin />} label="Department" value={label(report.department)} />
              </div>
            </header>
            <div className="p-6 sm:p-8">
              <h3 className="font-heading text-sm font-semibold">Progress timeline</h3>
              <ol className="mt-5 space-y-0">
                {report.progress.map((update, index) => (
                  <li key={update.id} className="relative flex gap-4 pb-6 last:pb-0">
                    {index < report.progress.length - 1 && <span className="absolute left-[11px] top-6 h-[calc(100%-12px)] w-px bg-border" />}
                    <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-success/10 text-success"><CheckCircle2 className="size-3.5" /></span>
                    <div><p className="text-sm font-semibold">{label(update.status)}</p><p className="mt-1 text-sm text-muted-foreground">{update.note || "Status updated by the responsible team."}</p><p className="mt-1.5 text-xs text-muted-foreground">{new Intl.DateTimeFormat("en-BD", { dateStyle: "medium", timeStyle: "short" }).format(new Date(update.createdAt))}</p></div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

function Info({ icon, label: itemLabel, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3 text-primary [&_svg]:size-4"><span>{icon}</span><span><span className="block text-[10px] font-medium uppercase tracking-wide text-muted-foreground">{itemLabel}</span><span className="mt-0.5 block text-xs font-semibold text-foreground">{value}</span></span></div>;
}
