"use client";

import type { ComponentProps, FormEvent } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleEllipsis,
  Clock3,
  Construction,
  Droplets,
  FileText,
  Home,
  Lightbulb,
  Loader2,
  LockKeyhole,
  LogOut,
  MapPin,
  Plus,
  RadioTower,
  RefreshCw,
  Search,
  ShieldCheck,
  Sparkles,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AnimatedNumber } from "@/components/motion/animated-number";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { BeaconWordmark } from "@/components/shared/beacon-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";
import { getApiErrorMessage } from "@/lib/api/client";
import {
  reportApi,
  type ApiReport,
  type ApiReportCategory,
} from "@/lib/api/report-api";
import {
  formatReportDate,
  getReportDepartmentLabel,
  getReportTitle,
  reportCategoryLabels,
  reportSeverityPresentation,
  reportStatusPresentation,
} from "@/lib/report-display";
import { cn } from "@/lib/utils";

const categoryIcons: Record<ApiReportCategory, LucideIcon> = {
  pothole: Construction,
  broken_streetlight: Lightbulb,
  water_leak: Droplets,
  illegal_dumping: Trash2,
  other: CircleEllipsis,
};

const metricToneClasses = {
  ink: "bg-[var(--landing-ink)] text-white",
  signal:
    "bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]",
  sun: "bg-warning/12 text-[color-mix(in_oklch,var(--warning),black_32%)]",
  resolved:
    "bg-success/10 text-[color-mix(in_oklch,var(--success),black_24%)]",
} as const;

export function CitizenDashboard() {
  const router = useRouter();
  const requestSequence = useRef(0);
  const [reports, setReports] = useState<ApiReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [signingOut, setSigningOut] = useState(false);
  const [trackingCode, setTrackingCode] = useState("");
  const { user, logout } = useAuth();

  const loadReports = useCallback(async () => {
    const requestId = ++requestSequence.current;
    setLoading(true);
    setError(null);

    try {
      const nextReports = await reportApi.mine();
      if (requestId === requestSequence.current) setReports(nextReports);
    } catch (reason) {
      if (requestId === requestSequence.current) {
        setError(
          getApiErrorMessage(reason, "We couldn't load your reports."),
        );
      }
    } finally {
      if (requestId === requestSequence.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (active) return loadReports();
    });
    return () => {
      active = false;
      requestSequence.current += 1;
    };
  }, [loadReports]);

  const sortedReports = useMemo(
    () =>
      [...reports].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [reports],
  );

  const metrics = useMemo(
    () => ({
      total: reports.length,
      review: reports.filter((report) =>
        ["pending", "under_review"].includes(report.status),
      ).length,
      inMotion: reports.filter((report) =>
        ["assigned", "in_progress"].includes(report.status),
      ).length,
      resolved: reports.filter((report) => report.status === "resolved").length,
    }),
    [reports],
  );

  const firstName = user?.name.trim().split(/\s+/)[0] || "Citizen";
  const completionRate = metrics.total
    ? Math.round((metrics.resolved / metrics.total) * 100)
    : 0;
  const initialLoading = loading && reports.length === 0;

  async function handleLogout() {
    setSigningOut(true);
    try {
      await logout();
      router.replace("/login");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  function handleTrackSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = trackingCode.trim();
    if (!code) return;
    router.push(`/track?code=${encodeURIComponent(code)}`);
  }

  return (
    <div className="landing-page min-h-svh bg-[var(--landing-paper)]">
      <a
        href="#dashboard-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--landing-ink)] shadow-xl transition focus:translate-y-0"
      >
        Skip to dashboard
      </a>

      <DashboardHeader
        name={user?.name ?? "Citizen"}
        email={user?.email ?? ""}
        signingOut={signingOut}
        onLogout={() => void handleLogout()}
      />

      <main
        id="dashboard-content"
        className="relative overflow-hidden px-5 pb-32 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-10 lg:pt-12"
      >
        <div
          aria-hidden
          className="bg-grid pointer-events-none absolute inset-x-0 top-0 h-[34rem] text-[var(--landing-ink)] opacity-[0.035] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-36 top-20 size-[26rem] rounded-full border border-black/[0.035] shadow-[0_0_0_55px_oklch(0.2_0.03_187/1.2%),0_0_0_110px_oklch(0.2_0.03_187/.8%)]"
        />

        <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 sm:gap-8">
          <DashboardHero
            firstName={firstName}
            total={metrics.total}
            resolved={metrics.resolved}
            completionRate={completionRate}
            loading={initialLoading}
            error={Boolean(error && reports.length === 0)}
          />

          <Stagger className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
            <StaggerItem>
              <DashboardMetric
                index="01"
                label="Total reports"
                value={error && reports.length === 0 ? null : metrics.total}
                note="Linked to this account"
                icon={FileText}
                tone="ink"
                loading={initialLoading}
              />
            </StaggerItem>
            <StaggerItem>
              <DashboardMetric
                index="02"
                label="Needs review"
                value={error && reports.length === 0 ? null : metrics.review}
                note="Pending or under review"
                icon={Search}
                tone="sun"
                loading={initialLoading}
              />
            </StaggerItem>
            <StaggerItem>
              <DashboardMetric
                index="03"
                label="In motion"
                value={error && reports.length === 0 ? null : metrics.inMotion}
                note="Assigned or in progress"
                icon={Clock3}
                tone="signal"
                loading={initialLoading}
              />
            </StaggerItem>
            <StaggerItem>
              <DashboardMetric
                index="04"
                label="Resolved"
                value={error && reports.length === 0 ? null : metrics.resolved}
                note="Completed public records"
                icon={CheckCircle2}
                tone="resolved"
                loading={initialLoading}
              />
            </StaggerItem>
          </Stagger>

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.65fr)_minmax(19rem,.72fr)]">
            <ReportsPanel
              reports={sortedReports}
              loading={loading}
              error={error}
              onRetry={() => void loadReports()}
            />

            <aside className="grid gap-5 lg:sticky lg:top-[6.25rem]">
              <QuickTrackPanel
                value={trackingCode}
                onChange={setTrackingCode}
                onSubmit={handleTrackSubmit}
              />
              <LatestActivity
                report={sortedReports[0]}
                loading={initialLoading}
                error={Boolean(error && reports.length === 0)}
              />
              <ProcessGuide />
            </aside>
          </div>
        </div>
      </main>

      <footer className="border-t border-black/6 bg-[var(--landing-paper-deep)] px-5 pb-24 pt-6 sm:px-8 sm:py-6 lg:px-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Beacon citizen workspace · Account-linked reports only</span>
          <span className="inline-flex items-center gap-1.5">
            <LockKeyhole className="size-3.5" aria-hidden="true" />
            Contact details remain private
          </span>
        </div>
      </footer>

      <div className="fixed inset-x-4 bottom-4 z-40 sm:hidden">
        <Button
          asChild
          size="xl"
          className="w-full bg-[var(--landing-signal)] text-[var(--landing-ink)] shadow-[0_18px_45px_-18px_var(--landing-ink)] hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)]"
        >
          <Link href="/#report">
            <Plus />
            Report an issue
          </Link>
        </Button>
      </div>
    </div>
  );
}

function DashboardHeader({
  name,
  email,
  signingOut,
  onLogout,
}: {
  name: string;
  email: string;
  signingOut: boolean;
  onLogout: () => void;
}) {
  const initial = name.trim().charAt(0).toUpperCase() || "C";

  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[color-mix(in_oklch,var(--landing-ink),transparent_3%)] text-white shadow-[0_12px_40px_-30px_black] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Beacon home">
          <BeaconWordmark className="[&>span:last-child]:text-white" />
        </Link>

        <nav
          aria-label="Citizen workspace navigation"
          className="hidden items-center gap-1 rounded-full border border-white/8 bg-white/[0.035] p-1 md:flex"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-white/58 transition-colors hover:bg-white/6 hover:text-white"
          >
            <Home className="size-3.5" />
            Home
          </Link>
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium text-white/58 transition-colors hover:bg-white/6 hover:text-white"
          >
            <Search className="size-3.5" />
            Public tracker
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2.5 rounded-xl border border-white/8 bg-white/[0.04] py-1.5 pl-1.5 pr-3 sm:flex">
            <span className="grid size-8 place-items-center rounded-lg bg-[var(--landing-signal)] font-heading text-xs font-bold text-[var(--landing-ink)]">
              {initial}
            </span>
            <span className="min-w-0">
              <span className="block max-w-32 truncate text-xs font-semibold text-white/82">
                {name}
              </span>
              <span className="hidden max-w-40 truncate text-[9px] text-white/40 xl:block">
                {email}
              </span>
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="lg"
            disabled={signingOut}
            onClick={onLogout}
            aria-label="Sign out of Beacon"
            className="text-white/58 hover:bg-white/8 hover:text-white"
          >
            {signingOut ? (
              <Loader2 className="animate-spin" />
            ) : (
              <LogOut />
            )}
            <span className="hidden lg:inline">
              {signingOut ? "Signing out…" : "Sign out"}
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}

function DashboardHero({
  firstName,
  total,
  resolved,
  completionRate,
  loading,
  error,
}: {
  firstName: string;
  total: number;
  resolved: number;
  completionRate: number;
  loading: boolean;
  error: boolean;
}) {
  return (
    <section className="relative overflow-hidden rounded-[1.8rem] bg-[var(--landing-ink)] px-6 py-8 text-white shadow-[0_30px_80px_-52px_oklch(0.2_0.04_187/70%)] sm:px-9 sm:py-10 lg:px-11">
      <div
        aria-hidden
        className="landing-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(100deg,black,transparent_80%)]"
      />
      <div
        aria-hidden
        className="absolute -right-36 -top-44 size-[28rem] rounded-full border border-white/8 shadow-[0_0_0_55px_oklch(1_0_0/2.5%),0_0_0_110px_oklch(1_0_0/1.4%)]"
      />

      <div className="relative grid items-center gap-9 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--landing-signal)]">
            <RadioTower className="size-3.5" aria-hidden="true" />
            Citizen workspace / Live record
          </p>
          <h1 className="mt-5 max-w-2xl font-heading text-3xl font-semibold leading-[1.04] tracking-[-0.045em] text-balance sm:text-4xl lg:text-[2.75rem]">
            Good to see you, {firstName}.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-white/58 sm:text-base sm:leading-7">
            Every report connected to your account stays here—from first review
            to public resolution.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="xl"
              className="bg-[var(--landing-signal)] text-[var(--landing-ink)] shadow-none hover:-translate-y-px hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)]"
            >
              <Link href="/#report">
                <Plus />
                Report an issue
              </Link>
            </Button>
            <Button
              asChild
              variant="glass"
              size="xl"
              className="border-white/10 text-white/78"
            >
              <a href="#quick-track">
                Track another report
                <ArrowRight />
              </a>
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-white/9 bg-white/[0.045] p-4 pr-5 backdrop-blur-sm sm:gap-6 sm:p-5 sm:pr-7">
          <div
            className="grid size-24 shrink-0 place-items-center rounded-full p-2 sm:size-28"
            style={{
              background: `conic-gradient(var(--landing-signal) ${completionRate}%, oklch(1 0 0 / 8%) 0)`,
            }}
            role="meter"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={loading || error ? undefined : completionRate}
            aria-label={
              loading
                ? "Loading account resolution rate"
                : error
                  ? "Account resolution rate unavailable"
                  : `${completionRate}% of account reports resolved`
            }
          >
            <div className="grid size-full place-items-center rounded-full bg-[var(--landing-ink)]">
              {loading ? (
                <span className="size-8 animate-pulse rounded-lg bg-white/8" />
              ) : error ? (
                <span className="font-mono text-xl font-semibold text-white/42">
                  —
                </span>
              ) : (
                <span className="font-mono text-xl font-semibold sm:text-2xl">
                  {completionRate}%
                </span>
              )}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/82">
              Resolution rate
            </p>
            <p className="mt-1 text-xs leading-5 text-white/42">
              {loading
                ? "Loading account progress…"
                : error
                  ? "Progress unavailable"
                  : `${resolved} of ${total} account reports resolved`}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-[var(--landing-signal)]">
              <ShieldCheck className="size-3.5" />
              Privacy safe
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardMetric({
  index,
  label,
  value,
  note,
  icon: Icon,
  tone,
  loading,
}: {
  index: string;
  label: string;
  value: number | null;
  note: string;
  icon: LucideIcon;
  tone: keyof typeof metricToneClasses;
  loading: boolean;
}) {
  return (
    <article className="group h-full min-h-36 rounded-[1.35rem] border border-black/8 bg-white p-4 shadow-[0_18px_50px_-42px_oklch(0.2_0.03_187/70%)] transition duration-200 hover:-translate-y-0.5 hover:border-black/12 sm:min-h-40 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className={cn(
            "grid size-9 place-items-center rounded-xl sm:size-10",
            metricToneClasses[tone],
          )}
        >
          <Icon className="size-4 sm:size-[18px]" aria-hidden="true" />
        </span>
        <span className="font-mono text-[9px] text-muted-foreground/55">
          {index}
        </span>
      </div>
      {loading ? (
        <span className="mt-5 block h-8 w-14 animate-pulse rounded-md bg-black/[0.055]" />
      ) : value === null ? (
        <span className="mt-4 block font-mono text-3xl font-semibold tracking-[-0.04em] text-muted-foreground/45 sm:text-4xl">
          —
        </span>
      ) : (
        <AnimatedNumber
          value={value}
          className="mt-4 block font-mono text-3xl font-semibold tracking-[-0.04em] sm:text-4xl"
        />
      )}
      <p className="mt-2 text-sm font-semibold">{label}</p>
      <p className="mt-1 hidden text-[11px] leading-4 text-muted-foreground sm:block">
        {value === null ? "Data unavailable" : note}
      </p>
    </article>
  );
}

function ReportsPanel({
  reports,
  loading,
  error,
  onRetry,
}: {
  reports: ApiReport[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}) {
  const initialLoading = loading && reports.length === 0;

  return (
    <DashboardPanel aria-labelledby="reports-heading">
      <div className="flex items-start justify-between gap-4 border-b border-black/6 px-5 py-5 sm:px-6 sm:py-6">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
            Account activity
          </p>
          <h2
            id="reports-heading"
            className="mt-2 font-heading text-xl font-semibold tracking-[-0.025em] sm:text-2xl"
          >
            Your reports
          </h2>
          <p className="mt-1 text-xs leading-5 text-muted-foreground sm:text-sm">
            {initialLoading
              ? "Loading your account-linked reports…"
              : `${reports.length} ${reports.length === 1 ? "report" : "reports"} connected to this account`}
          </p>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          disabled={loading}
          onClick={onRetry}
          aria-label="Refresh reports"
          className="rounded-xl text-muted-foreground hover:bg-black/[0.035] hover:text-foreground"
        >
          <RefreshCw className={cn(loading && "animate-spin")} />
        </Button>
      </div>

      {error ? (
        <div
          role="alert"
          className="m-4 flex flex-col gap-3 rounded-xl border border-danger/15 bg-danger/[0.045] px-4 py-3 text-sm text-[color-mix(in_oklch,var(--danger),black_18%)] sm:m-5 sm:flex-row sm:items-center sm:justify-between"
        >
          <span className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            {error}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={onRetry}
            className="border-danger/15 bg-white"
          >
            <RefreshCw className={cn(loading && "animate-spin")} />
            Try again
          </Button>
        </div>
      ) : null}

      {initialLoading ? (
        <ReportListSkeleton />
      ) : error && reports.length === 0 ? (
        <div className="h-2" aria-hidden="true" />
      ) : reports.length === 0 ? (
        <EmptyReports />
      ) : (
        <div className="divide-y divide-black/6">
          {reports.map((report, index) => (
            <ReportRow key={report.id} report={report} latest={index === 0} />
          ))}
        </div>
      )}
    </DashboardPanel>
  );
}

function ReportRow({
  report,
  latest,
}: {
  report: ApiReport;
  latest: boolean;
}) {
  const CategoryIcon = categoryIcons[report.category];
  const status = reportStatusPresentation[report.status];
  const severity = report.severityLevel
    ? reportSeverityPresentation[report.severityLevel]
    : null;

  return (
    <article className="group grid gap-5 px-5 py-5 transition-colors hover:bg-[var(--landing-paper)]/65 sm:px-6 sm:py-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
      <div className="flex min-w-0 gap-3.5 sm:gap-4">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-black/7 bg-[var(--landing-mist)] text-[var(--landing-signal-strong)] sm:size-11">
          <CategoryIcon className="size-[18px]" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            {latest ? (
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.12em] text-[var(--landing-signal-strong)]">
                Latest update
              </span>
            ) : null}
            <span
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                status.className,
              )}
            >
              <span className="size-1.5 rounded-full bg-current" aria-hidden />
              {status.label}
            </span>
            {severity ? (
              <span
                className={cn(
                  "inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                  severity.className,
                )}
              >
                {severity.label}
              </span>
            ) : null}
          </div>

          <h3 className="mt-2 line-clamp-2 font-heading text-[15px] font-semibold leading-6 tracking-[-0.015em] sm:text-base">
            {getReportTitle(report)}
          </h3>
          <p className="mt-1.5 flex min-w-0 items-start gap-1.5 text-xs leading-5 text-muted-foreground sm:text-sm">
            <MapPin className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
            <span className="line-clamp-1">
              {report.locationText || "Location unavailable"}
            </span>
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground sm:text-[11px]">
            <span>{reportCategoryLabels[report.category]}</span>
            <span className="inline-flex items-center gap-1">
              <Building2 className="size-3" />
              {getReportDepartmentLabel(report.assignedDepartment)}
            </span>
            <time dateTime={report.updatedAt}>
              Updated {formatReportDate(report.updatedAt)}
            </time>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-black/5 pt-4 md:flex-col md:items-end md:border-0 md:pt-0">
        <span className="font-mono text-[10px] font-semibold tracking-[0.06em] text-muted-foreground">
          {report.trackingCode}
        </span>
        <Button
          asChild
          variant="outline"
          size="sm"
          className="rounded-xl bg-white group-hover:border-primary/20 group-hover:text-primary"
        >
          <Link
            href={`/track?code=${encodeURIComponent(report.trackingCode)}`}
          >
            View progress
            <ArrowUpRight />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function QuickTrackPanel({
  value,
  onChange,
  onSubmit,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <section
      id="quick-track"
      aria-labelledby="quick-track-heading"
      className="relative scroll-mt-28 overflow-hidden rounded-[1.45rem] bg-[var(--landing-ink)] p-5 text-white shadow-[0_26px_60px_-42px_black] sm:p-6"
    >
      <div aria-hidden className="landing-grid absolute inset-0 opacity-20" />
      <div className="relative">
        <span className="grid size-10 place-items-center rounded-xl border border-white/9 bg-white/[0.055] text-[var(--landing-signal)]">
          <Search className="size-[18px]" aria-hidden="true" />
        </span>
        <p className="mt-5 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal)]">
          Public lookup
        </p>
        <h2
          id="quick-track-heading"
          className="mt-2 font-heading text-xl font-semibold tracking-[-0.025em]"
        >
          Track any report
        </h2>
        <p className="mt-2 text-xs leading-5 text-white/48">
          Use a public tracking code—even if the report is not linked to this
          account.
        </p>

        <form onSubmit={onSubmit} className="mt-5 space-y-2.5">
          <label
            htmlFor="dashboard-tracking-code"
            className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/48"
          >
            Tracking code
          </label>
          <Input
            id="dashboard-tracking-code"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Enter your tracking code"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            className="h-12 rounded-xl border-white/10 bg-white/[0.065] font-mono text-sm text-white placeholder:font-sans placeholder:text-white/30 focus-visible:border-[var(--landing-signal)]/45 focus-visible:ring-[var(--landing-signal)]/15"
          />
          <Button
            type="submit"
            size="lg"
            disabled={!value.trim()}
            className="w-full bg-[var(--landing-signal)] text-[var(--landing-ink)] shadow-none hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)]"
          >
            Open public tracker
            <ArrowRight />
          </Button>
        </form>
      </div>
    </section>
  );
}

function LatestActivity({
  report,
  loading,
  error,
}: {
  report: ApiReport | undefined;
  loading: boolean;
  error: boolean;
}) {
  return (
    <DashboardPanel
      aria-labelledby="latest-activity-heading"
      className="p-5 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
            Most recent
          </p>
          <h2
            id="latest-activity-heading"
            className="mt-2 font-heading text-lg font-semibold"
          >
            Latest activity
          </h2>
        </div>
        <Sparkles
          className="size-[18px] text-[var(--landing-signal-strong)]"
          aria-hidden="true"
        />
      </div>

      {loading ? (
        <div className="mt-5 space-y-3" aria-label="Loading latest activity">
          <span className="block h-5 w-24 animate-pulse rounded-md bg-black/[0.055]" />
          <span className="block h-4 w-full animate-pulse rounded-md bg-black/[0.045]" />
          <span className="block h-4 w-3/4 animate-pulse rounded-md bg-black/[0.045]" />
        </div>
      ) : error ? (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Latest activity is temporarily unavailable. Retry from the reports
          panel to reconnect.
        </p>
      ) : report ? (
        <div className="mt-5">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
              reportStatusPresentation[report.status].className,
            )}
          >
            <span className="size-1.5 rounded-full bg-current" />
            {reportStatusPresentation[report.status].label}
          </span>
          <p className="mt-3 line-clamp-2 text-sm font-semibold leading-6">
            {getReportTitle(report)}
          </p>
          <p className="mt-1.5 text-[11px] text-muted-foreground">
            Updated {formatReportDate(report.updatedAt)}
          </p>
          <Link
            href={`/track?code=${encodeURIComponent(report.trackingCode)}`}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-[var(--landing-signal-strong)]"
          >
            Read the public update
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Your newest public progress update will appear here after you submit
          a report.
        </p>
      )}
    </DashboardPanel>
  );
}

function ProcessGuide() {
  const steps = [
    {
      title: "Signal received",
      detail: "Your report becomes a trackable public record.",
    },
    {
      title: "Reviewed and routed",
      detail: "The issue is assessed and sent to the responsible team.",
    },
    {
      title: "Progress published",
      detail: "Public updates remain visible through the tracking code.",
    },
  ];

  return (
    <DashboardPanel aria-labelledby="process-heading" className="p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[var(--landing-signal-strong)]">
        <ShieldCheck className="size-4" aria-hidden="true" />
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
          Civic record flow
        </p>
      </div>
      <h2
        id="process-heading"
        className="mt-3 font-heading text-lg font-semibold"
      >
        What happens next
      </h2>
      <ol className="mt-4">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-3 pb-4 last:pb-0">
            {index < steps.length - 1 ? (
              <span
                aria-hidden
                className="absolute left-[0.8rem] top-7 h-[calc(100%-1rem)] w-px bg-black/8"
              />
            ) : null}
            <span className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full bg-[var(--landing-mist)] font-mono text-[9px] font-bold text-[var(--landing-signal-strong)]">
              {index + 1}
            </span>
            <span>
              <span className="block text-xs font-semibold">{step.title}</span>
              <span className="mt-1 block text-[11px] leading-4 text-muted-foreground">
                {step.detail}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </DashboardPanel>
  );
}

function EmptyReports() {
  return (
    <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
      <span className="mx-auto grid size-14 place-items-center rounded-2xl border border-primary/10 bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]">
        <RadioTower className="size-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 font-heading text-xl font-semibold">
        Your first civic signal starts here.
      </h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
        Submit while signed in and Beacon will keep the report, tracking code,
        and public progress together in this workspace.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Button
          asChild
          size="lg"
          className="bg-[var(--landing-ink)] text-white hover:bg-[var(--landing-ink-soft)]"
        >
          <Link href="/#report">
            <Plus />
            Report your first issue
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/track">
            Track an existing report
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </div>
  );
}

function ReportListSkeleton() {
  return (
    <div aria-label="Loading reports" role="status">
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          className="flex gap-4 border-b border-black/6 px-5 py-6 last:border-0 sm:px-6"
        >
          <span className="size-11 shrink-0 animate-pulse rounded-xl bg-black/[0.05]" />
          <span className="min-w-0 flex-1">
            <span className="block h-4 w-28 animate-pulse rounded bg-black/[0.05]" />
            <span className="mt-3 block h-5 w-3/4 animate-pulse rounded bg-black/[0.055]" />
            <span className="mt-2 block h-4 w-1/2 animate-pulse rounded bg-black/[0.04]" />
          </span>
        </div>
      ))}
      <span className="sr-only">Loading your account reports…</span>
    </div>
  );
}

function DashboardPanel({
  className,
  ...props
}: ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.45rem] border border-black/8 bg-white shadow-[0_24px_65px_-52px_oklch(0.2_0.03_187/65%)]",
        className,
      )}
      {...props}
    />
  );
}
