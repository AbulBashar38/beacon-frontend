"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, Clock3, FileText, Loader2, LogOut, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { reportApi, type ApiReport } from "@/lib/api/report-api";
import { authApi } from "@/lib/api/report-api";
import { clearAuthSession, getAuthUser } from "@/lib/auth-session";
import { getApiErrorMessage } from "@/lib/api/client";

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function CitizenDashboard() {
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const user = getAuthUser();

  useEffect(() => {
    void reportApi.mine()
      .then(setReports)
      .catch((reason) => setError(getApiErrorMessage(reason, "We couldn't load your reports.")))
      .finally(() => setLoading(false));
  }, []);

  const metrics = useMemo(() => ({
    total: reports.length,
    active: reports.filter((report) => !["resolved", "rejected"].includes(report.status)).length,
    resolved: reports.filter((report) => report.status === "resolved").length,
  }), [reports]);

  async function logout() {
    try {
      await authApi.logout();
    } finally {
      clearAuthSession();
      window.location.assign("/login");
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">Citizen workspace</p>
            <h1 className="font-heading text-3xl font-semibold tracking-tight">Welcome, {user?.name ?? "Citizen"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">Only reports submitted while signed in to this account appear here.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline">
              <Link href="/"><ArrowLeft />Back to home</Link>
            </Button>
            <Button asChild variant="hero"><Link href="/#report"><Plus />Report an issue</Link></Button>
            <Button variant="outline" onClick={logout}><LogOut />Sign out</Button>
          </div>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Total reports", value: metrics.total, icon: FileText },
            { label: "Active", value: metrics.active, icon: Clock3 },
            { label: "Resolved", value: metrics.resolved, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => (
            <article key={label} className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-sm)]">
              <div className="flex items-center justify-between text-muted-foreground"><span className="text-sm">{label}</span><Icon className="size-4" /></div>
              <p className="mt-3 font-mono text-3xl font-semibold">{value}</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface">
          <div className="border-b border-border px-5 py-4">
            <h2 className="font-heading text-lg font-semibold">My uploaded reports</h2>
          </div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-muted-foreground"><Loader2 className="size-4 animate-spin" />Loading reports…</div>
          ) : error ? (
            <div className="flex items-center justify-center gap-2 p-12 text-sm text-danger"><AlertCircle className="size-4" />{error}</div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="mx-auto size-8 text-muted-foreground" />
              <h3 className="mt-3 font-medium">No account reports yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">Submit a report while signed in and it will appear here.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {reports.map((report) => (
                <article key={report.id} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-surface-muted/40 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-border bg-surface-muted px-2 py-1 text-[10px] font-semibold">{formatLabel(report.category)}</span>
                      <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold text-primary">{formatLabel(report.status)}</span>
                      {report.severityLevel ? <span className="rounded-md border border-warning/20 bg-warning/10 px-2 py-1 text-[10px] font-semibold text-warning">{formatLabel(report.severityLevel)}</span> : null}
                    </div>
                    <p className="mt-2 font-medium">{report.summary ?? report.description.split("\n")[0]}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{report.locationText}</p>
                  </div>
                  <Button asChild variant="ghost">
                    <Link href={`/track?code=${encodeURIComponent(report.trackingCode)}`}>
                      {report.trackingCode}<ArrowRight />
                    </Link>
                  </Button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
