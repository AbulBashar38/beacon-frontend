"use client";

import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  Clipboard,
  Clock3,
  ExternalLink,
  FileText,
  ImageIcon,
  Link2,
  Plus,
  RadioTower,
  Search,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ApiReportStatus, TrackedReport } from "@/lib/api/report-api";
import {
  getReportDepartmentLabel,
  reportCategoryLabels,
  reportSeverityPresentation,
  reportStatusPresentation,
} from "@/lib/report-display";
import { cn } from "@/lib/utils";

const statusGuidance: Record<ApiReportStatus, string> = {
  pending:
    "Beacon has received this report. It is waiting for an initial public review.",
  under_review:
    "The report is being assessed before it is routed to the responsible team.",
  assigned:
    "A responsible department has been identified and the report has been routed.",
  in_progress:
    "The responsible team has recorded that work on this issue is underway.",
  resolved:
    "The responsible team has marked this infrastructure issue as resolved.",
  rejected:
    "This public record has been closed. Review the latest public update for the reason provided.",
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function PublicReportResult({
  report,
  onTrackAnother,
}: {
  report: TrackedReport;
  onTrackAnother: () => void;
}) {
  const status = reportStatusPresentation[report.status];
  const title =
    report.summary?.trim() ||
    `${reportCategoryLabels[report.category]} infrastructure report`;
  const latestUpdate = report.progress[0];
  const [copied, setCopied] = useState<"code" | "link" | null>(null);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  async function copy(value: string, kind: "code" | "link") {
    try {
      await navigator.clipboard.writeText(value);
      setCopyError(false);
      setCopied(kind);
      if (copyTimer.current) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(null), 1800);
    } catch {
      setCopied(null);
      setCopyError(true);
    }
  }

  const trackingLink =
    typeof window === "undefined"
      ? `/track?code=${encodeURIComponent(report.trackingCode)}`
      : `${window.location.origin}/track?code=${encodeURIComponent(report.trackingCode)}`;

  return (
    <section aria-labelledby="public-record-heading" className="space-y-6 sm:space-y-8">
      <div className="relative overflow-hidden rounded-[1.8rem] bg-[var(--landing-ink)] px-6 py-7 text-white shadow-[0_32px_85px_-54px_oklch(0.2_0.04_187/75%)] sm:px-9 sm:py-9 lg:px-11">
        <div
          aria-hidden
          className="landing-grid absolute inset-0 opacity-25 [mask-image:linear-gradient(105deg,black,transparent_82%)]"
        />
        <div
          aria-hidden
          className="absolute -right-36 -top-44 size-[28rem] rounded-full border border-white/8 shadow-[0_0_0_55px_oklch(1_0_0/2.5%),0_0_0_110px_oklch(1_0_0/1.4%)]"
        />

        <div className="relative">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <p className="flex flex-wrap items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal)]">
                <RadioTower className="size-3.5" aria-hidden="true" />
                Public report record
                <span className="text-white/28">/</span>
                <span className="normal-case tracking-[0.08em] text-white/58">
                  {report.trackingCode}
                </span>
              </p>
              <h2
                id="public-record-heading"
                className="mt-5 max-w-3xl font-heading text-2xl font-semibold leading-[1.08] tracking-[-0.04em] text-balance sm:text-3xl lg:text-[2.35rem]"
              >
                {title}
              </h2>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-white/45 sm:text-sm">
                <Clock3 className="size-3.5" aria-hidden="true" />
                Last public record update {formatDateTime(report.updatedAt)}
              </p>
            </div>

            <span
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/12 bg-white/[0.07] px-3 py-2 text-xs font-semibold text-white"
            >
              <span
                className="size-2 rounded-full bg-[var(--landing-signal)] shadow-[0_0_10px_var(--landing-signal)]"
                aria-hidden="true"
              />
              {status.label}
            </span>
          </div>

          <div className="mt-7 grid gap-5 border-t border-white/8 pt-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-white/38">
                Current status
              </p>
              <p className="mt-2 text-sm leading-6 text-white/68">
                {statusGuidance[report.status]}
              </p>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="glass"
                size="lg"
                onClick={() => void copy(report.trackingCode, "code")}
                className="border-white/10 text-white/78"
              >
                {copied === "code" ? <Check /> : <Clipboard />}
                {copied === "code" ? "Code copied" : "Copy code"}
              </Button>
              <Button
                type="button"
                variant="glass"
                size="lg"
                onClick={() => void copy(trackingLink, "link")}
                className="border-white/10 text-white/78"
              >
                {copied === "link" ? <Check /> : <Link2 />}
                {copied === "link" ? "Link copied" : "Copy tracking link"}
              </Button>
            </div>
          </div>
          <p
            aria-live="polite"
            className={cn(
              "mt-3 text-right text-[10px] text-white/42",
              !copyError && "sr-only",
            )}
          >
            {copyError
              ? "Copy was unavailable. Select the tracking code manually."
              : copied
                ? "Copied to clipboard."
                : ""}
          </p>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.72fr)]">
        <div className="grid gap-6">
          <LatestPublicUpdate report={report} update={latestUpdate} />
          <PublicTimeline report={report} />
          <AssessmentSummary report={report} />
          <EvidenceGallery report={report} title={title} />
        </div>

        <aside className="grid gap-5 lg:sticky lg:top-[6.25rem]">
          <ReportFacts report={report} />
          <PublicPrivacyNotice />
          <PublicRecordActions onTrackAnother={onTrackAnother} />
        </aside>
      </div>
    </section>
  );
}

function LatestPublicUpdate({
  report,
  update,
}: {
  report: TrackedReport;
  update: TrackedReport["progress"][number] | undefined;
}) {
  const presentation = reportStatusPresentation[update?.status ?? report.status];

  return (
    <PublicPanel
      aria-labelledby="latest-update-heading"
      className="p-5 sm:p-7"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
            Latest public update
          </p>
          <h3
            id="latest-update-heading"
            className="mt-2 font-heading text-xl font-semibold tracking-[-0.025em]"
          >
            {presentation.label}
          </h3>
        </div>
        <span
          className={cn(
            "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
            presentation.className,
          )}
        >
          <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
          Current record
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-foreground/78 sm:text-[15px] sm:leading-7">
        {update?.note?.trim() ||
          (update
            ? "A public status update was recorded by the responsible team."
            : "The report has been received. No additional public update has been published yet.")}
      </p>
      <p className="mt-3 text-[11px] text-muted-foreground">
        {formatDateTime(update?.createdAt ?? report.createdAt)}
      </p>
    </PublicPanel>
  );
}

function PublicTimeline({ report }: { report: TrackedReport }) {
  return (
    <PublicPanel aria-labelledby="timeline-heading" className="p-5 sm:p-7">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
            Verified public history
          </p>
          <h3
            id="timeline-heading"
            className="mt-2 font-heading text-xl font-semibold tracking-[-0.025em]"
          >
            Progress timeline
          </h3>
        </div>
        <span className="text-[10px] text-muted-foreground">Latest first</span>
      </div>

      {report.progress.length ? (
        <ol className="mt-6">
          {report.progress.map((update, index) => {
            const presentation = reportStatusPresentation[update.status];
            const current = index === 0;
            const MarkerIcon =
              update.status === "resolved"
                ? CheckCircle2
                : update.status === "rejected"
                  ? XCircle
                  : current
                    ? RadioTower
                    : Clock3;

            return (
              <li key={update.id} className="relative flex gap-4 pb-7 last:pb-0">
                {index < report.progress.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute left-[1.1rem] top-9 h-[calc(100%-1.1rem)] w-px bg-black/8"
                  />
                ) : null}
                <span
                  className={cn(
                    "relative z-10 grid size-9 shrink-0 place-items-center rounded-xl border",
                    current
                      ? "border-[var(--landing-signal)]/25 bg-[var(--landing-ink)] text-[var(--landing-signal)] shadow-[0_10px_28px_-18px_var(--landing-ink)]"
                      : presentation.className,
                  )}
                >
                  <MarkerIcon className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 pt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold">
                      {presentation.label}
                    </p>
                    {current ? (
                      <span className="font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-[var(--landing-signal-strong)]">
                        Latest
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {update.note?.trim() ||
                      "A public status update was recorded."}
                  </p>
                  <time
                    dateTime={update.createdAt}
                    className="mt-2 block text-[10px] text-muted-foreground/72"
                  >
                    {formatDateTime(update.createdAt)}
                  </time>
                </div>
              </li>
            );
          })}
        </ol>
      ) : (
        <div className="mt-6 flex gap-4 rounded-2xl border border-black/6 bg-[var(--landing-paper)] p-4 sm:p-5">
          <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]">
            <RadioTower className="size-4" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Report received</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              No additional public progress updates have been published yet.
            </p>
            <time
              dateTime={report.createdAt}
              className="mt-2 block text-[10px] text-muted-foreground/72"
            >
              {formatDateTime(report.createdAt)}
            </time>
          </div>
        </div>
      )}
    </PublicPanel>
  );
}

function AssessmentSummary({ report }: { report: TrackedReport }) {
  const priorityScore =
    report.severity.score == null
      ? null
      : Math.min(100, Math.max(0, Math.round(report.severity.score * 100)));
  const hasAssessment =
    report.severity.rationale ||
    report.suggestedAction ||
    priorityScore != null;

  return (
    <PublicPanel aria-labelledby="assessment-heading" className="p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]">
          <Sparkles className="size-[18px]" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
            AI-assisted triage
          </p>
          <h3
            id="assessment-heading"
            className="mt-1 font-heading text-lg font-semibold"
          >
            Assessment summary
          </h3>
        </div>
      </div>

      {hasAssessment ? (
        <div className="mt-5 grid gap-4">
          {report.severity.rationale ? (
            <FactBlock
              label="Priority rationale"
              value={report.severity.rationale}
            />
          ) : null}
          {report.suggestedAction ? (
            <FactBlock
              label="Suggested next action"
              value={report.suggestedAction}
            />
          ) : null}
          {priorityScore != null ? (
            <div>
              <div className="flex items-center justify-between gap-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                <span>Priority score</span>
                <span className="font-mono text-foreground">
                  {priorityScore} / 100
                </span>
              </div>
              <div
                className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/[0.055]"
                role="meter"
                aria-label="Priority score"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={priorityScore}
              >
                <span
                  className="block h-full rounded-full bg-[var(--landing-signal-strong)]"
                  style={{ width: `${priorityScore}%` }}
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-5 text-sm leading-6 text-muted-foreground">
          A detailed public assessment has not been published yet.
        </p>
      )}

      <p className="mt-5 border-t border-black/6 pt-4 text-[10px] leading-4 text-muted-foreground">
        Automated triage supports the first review and may be refined by the
        responsible government team.
      </p>
    </PublicPanel>
  );
}

function EvidenceGallery({
  report,
  title,
}: {
  report: TrackedReport;
  title: string;
}) {
  if (!report.images.length && !report.evidenceUrls.length) return null;

  return (
    <PublicPanel aria-labelledby="evidence-heading" className="p-5 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]">
          <ImageIcon className="size-[18px]" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
            Submitted evidence
          </p>
          <h3
            id="evidence-heading"
            className="mt-1 font-heading text-lg font-semibold"
          >
            Public evidence
          </h3>
        </div>
      </div>

      {report.images.length ? (
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {report.images.map((url, index) => (
            <a
              key={`${url}-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "group relative overflow-hidden rounded-2xl border border-black/8 bg-[var(--landing-paper-deep)]",
                index === 0 && report.images.length > 1 && "sm:col-span-2",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Public evidence ${index + 1} for ${title}`}
                loading="lazy"
                referrerPolicy="no-referrer"
                className={cn(
                  "w-full object-cover transition-transform duration-300 group-hover:scale-[1.015]",
                  index === 0 && report.images.length > 1
                    ? "aspect-[16/8]"
                    : "aspect-video",
                )}
              />
              <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/55 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-md">
                Open image
                <ArrowUpRight className="size-3" />
              </span>
            </a>
          ))}
        </div>
      ) : null}

      {report.evidenceUrls.length ? (
        <div className="mt-5 grid gap-2.5">
          {report.evidenceUrls.map((url, index) => (
            <a
              key={`${url}-${index}`}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-h-12 items-center justify-between gap-3 rounded-xl border border-black/7 px-4 py-3 text-sm transition-colors hover:border-primary/18 hover:bg-primary/[0.035]"
            >
              <span className="min-w-0">
                <span className="block text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                  Supporting source {index + 1}
                </span>
                <span className="mt-0.5 block truncate text-xs font-medium text-foreground">
                  {getUrlHost(url)}
                </span>
              </span>
              <ExternalLink
                className="size-4 shrink-0 text-primary"
                aria-hidden="true"
              />
            </a>
          ))}
        </div>
      ) : null}
    </PublicPanel>
  );
}

function ReportFacts({ report }: { report: TrackedReport }) {
  const severity = report.severity.level
    ? reportSeverityPresentation[report.severity.level]
    : null;

  const facts = [
    {
      label: "Category",
      value: reportCategoryLabels[report.category],
      icon: FileText,
    },
    {
      label: "Priority",
      value: severity?.label ?? "Assessment pending",
      icon: AlertTriangle,
    },
    {
      label: "Responsible team",
      value: getReportDepartmentLabel(report.department),
      icon: Building2,
    },
    {
      label: "Submitted",
      value: formatDateTime(report.createdAt),
      icon: CalendarDays,
    },
    {
      label: "Last updated",
      value: formatDateTime(report.updatedAt),
      icon: Clock3,
    },
  ];

  return (
    <PublicPanel aria-labelledby="facts-heading" className="p-5 sm:p-6">
      <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
        Public record facts
      </p>
      <h3 id="facts-heading" className="mt-2 font-heading text-lg font-semibold">
        Report at a glance
      </h3>
      <dl className="mt-4 divide-y divide-black/6">
        {facts.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]">
              <Icon className="size-3.5" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <dt className="text-[9px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                {label}
              </dt>
              <dd className="mt-1 text-xs font-semibold leading-5 text-foreground">
                {value}
              </dd>
            </span>
          </div>
        ))}
      </dl>
    </PublicPanel>
  );
}

function PublicPrivacyNotice() {
  return (
    <section className="rounded-[1.4rem] border border-[var(--landing-signal-strong)]/14 bg-[var(--landing-mist)]/65 p-5 sm:p-6">
      <div className="flex items-center gap-2 text-[var(--landing-signal-strong)]">
        <ShieldCheck className="size-4" aria-hidden="true" />
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.14em]">
          Privacy-safe public view
        </p>
      </div>
      <p className="mt-3 text-xs leading-5 text-foreground/68">
        This page shows normalized infrastructure details and public progress
        only. Reporter identity, contact information, exact coordinates, and
        internal government notes are withheld.
      </p>
    </section>
  );
}

function PublicRecordActions({
  onTrackAnother,
}: {
  onTrackAnother: () => void;
}) {
  return (
    <PublicPanel aria-labelledby="record-actions-heading" className="p-5 sm:p-6">
      <h3
        id="record-actions-heading"
        className="font-heading text-lg font-semibold"
      >
        What would you like to do?
      </h3>
      <div className="mt-4 grid gap-2.5">
        <Button
          type="button"
          size="lg"
          onClick={onTrackAnother}
          className="bg-[var(--landing-ink)] text-white hover:bg-[var(--landing-ink-soft)]"
        >
          <Search />
          Track another report
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link href="/#report">
            <Plus />
            Report a new issue
          </Link>
        </Button>
        <Button asChild variant="ghost" size="lg">
          <Link href="/">
            <ArrowLeft />
            Back to Beacon
          </Link>
        </Button>
      </div>
    </PublicPanel>
  );
}

function FactBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-black/6 bg-[var(--landing-paper)] p-4">
      <p className="text-[9px] font-semibold uppercase tracking-[0.11em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-foreground/78">{value}</p>
    </div>
  );
}

function PublicPanel({
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

function formatDateTime(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateTimeFormatter.format(date);
}

function getUrlHost(value: string) {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return "External supporting link";
  }
}
