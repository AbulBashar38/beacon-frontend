"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AxiosError } from "axios";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileCheck2,
  Home,
  Loader2,
  LockKeyhole,
  Plus,
  RadioTower,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

import { PublicReportResult } from "@/components/citizen/public-report-result";
import { CitizenFooter } from "@/components/layout/citizen-footer";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { BeaconWordmark } from "@/components/shared/beacon-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getApiErrorMessage } from "@/lib/api/client";
import { reportApi, type TrackedReport } from "@/lib/api/report-api";

const trackingCodePattern = /^CIV-[A-Z0-9-]+$/;

export function TrackingWorkspace({
  initialCode = "",
}: {
  initialCode?: string;
}) {
  const requestSequence = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchPanelRef = useRef<HTMLElement>(null);
  const resultRegionRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [code, setCode] = useState(() => normalizeTrackingCode(initialCode));
  const [report, setReport] = useState<TrackedReport | null>(null);
  const [loading, setLoading] = useState(Boolean(initialCode));
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(
    async (candidate: string, updateAddressBar: boolean) => {
      const requestId = ++requestSequence.current;
      const normalized = normalizeTrackingCode(candidate);
      setCode(normalized);

      if (!isValidTrackingCode(normalized)) {
        setLoading(false);
        setError(
          normalized
            ? "Check the code format. Beacon codes look like CIV-3K9P7X."
            : "Enter your public tracking code to continue.",
        );
        requestAnimationFrame(() => errorRef.current?.focus());
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const result = await reportApi.track(normalized);
        if (requestId !== requestSequence.current) return;

        setReport(result);
        if (updateAddressBar) {
          window.history.replaceState(
            null,
            "",
            `/track?code=${encodeURIComponent(normalized)}`,
          );
        }
        requestAnimationFrame(() => {
          resultRegionRef.current?.scrollIntoView({
            behavior: prefersReducedMotion() ? "auto" : "smooth",
            block: "start",
          });
        });
      } catch (requestError) {
        if (requestId !== requestSequence.current) return;
        setError(getTrackingErrorMessage(requestError));
        requestAnimationFrame(() => errorRef.current?.focus());
      } finally {
        if (requestId === requestSequence.current) setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!initialCode) return;
    let active = true;
    void Promise.resolve().then(() => {
      if (active) return lookup(initialCode, false);
    });
    return () => {
      active = false;
      requestSequence.current += 1;
    };
  }, [initialCode, lookup]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(code, true);
  }

  function handleTrackAnother() {
    searchPanelRef.current?.scrollIntoView({
      behavior: prefersReducedMotion() ? "auto" : "smooth",
      block: "center",
    });
    window.setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, prefersReducedMotion() ? 0 : 350);
  }

  const showingPreviousResult =
    Boolean(error && report) &&
    normalizeTrackingCode(code) !== report?.trackingCode;

  return (
    <div className="landing-page min-h-svh bg-[var(--landing-paper)]">
      <a
        href="#tracking-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[var(--landing-ink)] shadow-xl transition focus:translate-y-0"
      >
        Skip to tracking
      </a>

      <TrackingHeader />

      <main id="tracking-content" className="overflow-hidden">
        <section className="relative bg-[var(--landing-ink)] pb-32 pt-14 text-white sm:pb-36 sm:pt-18 lg:pb-40 lg:pt-20">
          <div
            aria-hidden
            className="landing-grid absolute inset-0 opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent_95%)]"
          />
          <div
            aria-hidden
            className="absolute -right-40 -top-44 size-[34rem] rounded-full border border-white/8 shadow-[0_0_0_70px_oklch(1_0_0/2.2%),0_0_0_140px_oklch(1_0_0/1.2%)]"
          />

          <div className="relative mx-auto grid w-full max-w-7xl items-end gap-10 px-5 sm:px-8 lg:grid-cols-[1.15fr_.85fr] lg:px-10">
            <div>
              <p className="flex items-center gap-2 font-mono text-[10px] font-semibold uppercase tracking-[0.17em] text-[var(--landing-signal)]">
                <RadioTower className="size-3.5" aria-hidden="true" />
                Beacon / Public tracking
              </p>
              <h1 className="mt-5 max-w-3xl font-heading text-4xl font-semibold leading-[.98] tracking-[-0.055em] text-balance sm:text-5xl lg:text-6xl">
                Follow the signal.
                <span className="block text-white/38">See what happens next.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-7 text-white/58 text-balance sm:text-lg">
                Every Beacon report creates a public progress record. Enter its
                code to see the current status and verified updates—no sign-in
                required.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Assurance
                icon={Search}
                title="No sign-in"
                detail="A public code is all you need."
              />
              <Assurance
                icon={ShieldCheck}
                title="Protected identity"
                detail="Contact details and internal notes stay hidden."
              />
              <Assurance
                icon={RadioTower}
                title="Public updates"
                detail="Follow the record from review to resolution."
              />
            </div>
          </div>
        </section>

        <div className="relative mx-auto -mt-24 w-full max-w-5xl px-5 sm:-mt-28 sm:px-8 lg:-mt-32 lg:px-10">
          <section
            ref={searchPanelRef}
            aria-labelledby="tracking-search-heading"
            className="scroll-mt-28 overflow-hidden rounded-[1.7rem] border border-black/8 bg-white shadow-[0_34px_90px_-55px_oklch(0.2_0.04_187/65%)]"
          >
            <div className="grid gap-6 px-5 py-6 sm:px-7 sm:py-7 lg:grid-cols-[.7fr_1.3fr] lg:items-end lg:px-8">
              <div>
                <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
                  Public record lookup
                </p>
                <h2
                  id="tracking-search-heading"
                  className="mt-2 font-heading text-xl font-semibold tracking-[-0.025em] sm:text-2xl"
                >
                  Enter your tracking code
                </h2>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Find it on the submission confirmation or report email.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <label
                  htmlFor="public-tracking-code"
                  className="text-[10px] font-semibold uppercase tracking-[0.11em] text-muted-foreground"
                >
                  Tracking code
                </label>
                <div className="mt-2 flex flex-col gap-2.5 sm:flex-row">
                  <div className="relative min-w-0 flex-1">
                    <RadioTower
                      className="pointer-events-none absolute left-4 top-1/2 z-10 size-4 -translate-y-1/2 text-[var(--landing-signal-strong)]"
                      aria-hidden="true"
                    />
                    <Input
                      ref={inputRef}
                      id="public-tracking-code"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value.toUpperCase());
                        if (error) setError(null);
                      }}
                      placeholder="CIV-3K9P7X"
                      maxLength={24}
                      autoCapitalize="characters"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      aria-invalid={Boolean(error)}
                      aria-describedby={
                        error
                          ? "tracking-code-help tracking-code-error"
                          : "tracking-code-help"
                      }
                      className="h-13 rounded-xl border-black/9 bg-[var(--landing-paper)] pl-11 pr-11 font-mono text-sm font-semibold uppercase tracking-[0.08em] focus-visible:border-[var(--landing-signal-strong)]/45 focus-visible:ring-[var(--landing-signal)]/18"
                    />
                    {code ? (
                      <button
                        type="button"
                        onClick={() => {
                          setCode("");
                          setError(null);
                          inputRef.current?.focus();
                        }}
                        aria-label="Clear tracking code"
                        className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-black/[0.045] hover:text-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    ) : null}
                  </div>
                  <Button
                    type="submit"
                    size="xl"
                    disabled={loading}
                    className="bg-[var(--landing-ink)] text-white shadow-none hover:bg-[var(--landing-ink-soft)] sm:min-w-40"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Search />
                    )}
                    {loading ? "Checking…" : "Track report"}
                  </Button>
                </div>
                <div
                  id="tracking-code-help"
                  className="mt-2 flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground"
                >
                  <span>Format: CIV-XXXXXX</span>
                  <span className="inline-flex items-center gap-1">
                    <LockKeyhole className="size-3" aria-hidden="true" />
                    Public lookup · No account required
                  </span>
                </div>
              </form>
            </div>

            {error ? (
              <div
                ref={errorRef}
                id="tracking-code-error"
                role="alert"
                tabIndex={-1}
                className="flex items-start gap-3 border-t border-danger/12 bg-danger/[0.045] px-5 py-4 text-sm text-[color-mix(in_oklch,var(--danger),black_18%)] outline-none sm:px-7 lg:px-8"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-danger/8">
                  <AlertCircle className="size-4" aria-hidden="true" />
                </span>
                <span>
                  <span className="block font-semibold">We could not open that record.</span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                    {error}
                  </span>
                </span>
              </div>
            ) : null}
          </section>
        </div>

        <div
          ref={resultRegionRef}
          className="scroll-mt-24 px-5 pb-20 pt-10 sm:px-8 sm:pb-24 sm:pt-12 lg:px-10"
          aria-busy={loading}
        >
          <p className="sr-only" aria-live="polite">
            {loading
              ? "Checking the public report record."
              : report
                ? `Public report ${report.trackingCode} loaded.`
                : error
                  ? "The public report could not be loaded."
                  : "Ready to track a public report."}
          </p>
          <div className="mx-auto w-full max-w-7xl">
            {showingPreviousResult ? (
              <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-warning/18 bg-warning/[0.065] px-4 py-3 text-xs leading-5 text-[color-mix(in_oklch,var(--warning),black_38%)]">
                <AlertTriangle className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                The new code could not be opened, so the previous public record
                remains visible below.
              </div>
            ) : null}

            {loading ? (
              <TrackingResultSkeleton />
            ) : report ? (
              <PublicReportResult
                report={report}
                onTrackAnother={handleTrackAnother}
              />
            ) : (
              <TrackingExplainer />
            )}
          </div>
        </div>
      </main>

      <CitizenFooter />
    </div>
  );
}

function TrackingHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/8 bg-[color-mix(in_oklch,var(--landing-ink),transparent_3%)] text-white shadow-[0_12px_40px_-30px_black] backdrop-blur-xl">
      <div className="mx-auto flex h-[4.75rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link href="/" aria-label="Beacon home">
          <BeaconWordmark className="[&>span:last-child]:text-white" />
        </Link>
        <nav aria-label="Public tracking navigation" className="flex items-center gap-1.5">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="text-white/58 hover:bg-white/8 hover:text-white"
          >
            <Link href="/">
              <Home />
              <span className="hidden sm:inline">Home</span>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="hidden bg-[var(--landing-signal)] text-[var(--landing-ink)] shadow-none hover:bg-[color-mix(in_oklch,var(--landing-signal),white_10%)] sm:inline-flex"
          >
            <Link href="/#report">
              <Plus />
              Report an issue
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

function Assurance({
  icon: Icon,
  title,
  detail,
}: {
  icon: typeof Search;
  title: string;
  detail: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-4">
      <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-white/8 bg-white/[0.045] text-[var(--landing-signal)]">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span>
        <span className="block text-xs font-semibold text-white/78">{title}</span>
        <span className="mt-1 block text-[11px] leading-4 text-white/42">
          {detail}
        </span>
      </span>
    </div>
  );
}

function TrackingExplainer() {
  const steps = [
    {
      icon: FileCheck2,
      index: "01",
      title: "Find the code",
      description:
        "Your confirmation screen or report email includes a code beginning with CIV-.",
    },
    {
      icon: Search,
      index: "02",
      title: "Open the public record",
      description:
        "Beacon checks the code and loads only the privacy-safe tracking information.",
    },
    {
      icon: CheckCircle2,
      index: "03",
      title: "Follow every update",
      description:
        "Return with the same code whenever you want to see the latest public progress.",
    },
  ];

  return (
    <div>
      <div className="text-center">
        <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-[var(--landing-signal-strong)]">
          Simple public access
        </p>
        <h2 className="mt-3 font-heading text-2xl font-semibold tracking-[-0.035em] sm:text-3xl">
          One code. A complete public trail.
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          Tracking is designed to be clear, private, and useful on any device.
        </p>
      </div>

      <Stagger className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map(({ icon: Icon, index, title, description }) => (
          <StaggerItem key={index}>
            <article className="h-full rounded-[1.35rem] border border-black/8 bg-white p-5 shadow-[0_22px_60px_-50px_oklch(0.2_0.03_187/65%)] sm:p-6">
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-[var(--landing-mist)] text-[var(--landing-signal-strong)]">
                  <Icon className="size-[18px]" aria-hidden="true" />
                </span>
                <span className="font-mono text-[9px] text-muted-foreground/55">
                  {index}
                </span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {description}
              </p>
            </article>
          </StaggerItem>
        ))}
      </Stagger>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-warning/15 bg-warning/[0.055] px-4 py-4 text-xs leading-5 text-muted-foreground sm:px-5">
        <AlertTriangle
          className="mt-0.5 size-4 shrink-0 text-[color-mix(in_oklch,var(--warning),black_25%)]"
          aria-hidden="true"
        />
        <p>
          Beacon is for non-emergency infrastructure reports. For an immediate
          threat to life or public safety, contact the appropriate emergency
          service.
        </p>
      </div>
    </div>
  );
}

function TrackingResultSkeleton() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading public report">
      <div className="overflow-hidden rounded-[1.8rem] bg-[var(--landing-ink)] p-7 sm:p-9">
        <div className="h-3 w-40 animate-pulse rounded bg-white/8" />
        <div className="mt-6 h-8 w-3/4 animate-pulse rounded-lg bg-white/9" />
        <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-white/6" />
        <div className="mt-8 grid gap-3 border-t border-white/8 pt-6 sm:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-12 animate-pulse rounded-xl bg-white/[0.055]" />
          ))}
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.72fr)]">
        <div className="space-y-6">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="rounded-[1.45rem] border border-black/8 bg-white p-6"
            >
              <div className="h-3 w-32 animate-pulse rounded bg-black/[0.045]" />
              <div className="mt-4 h-6 w-1/2 animate-pulse rounded bg-black/[0.055]" />
              <div className="mt-5 h-4 w-full animate-pulse rounded bg-black/[0.04]" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-black/[0.04]" />
            </div>
          ))}
        </div>
        <div className="h-72 rounded-[1.45rem] border border-black/8 bg-white p-6">
          <div className="h-3 w-28 animate-pulse rounded bg-black/[0.045]" />
          <div className="mt-5 space-y-4">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-10 animate-pulse rounded-lg bg-black/[0.04]" />
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Checking the public report record…</span>
    </div>
  );
}

function normalizeTrackingCode(value: string) {
  const cleaned = value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  if (!cleaned) return "";
  if (cleaned.startsWith("CIV-")) return cleaned;
  const tail = cleaned.replaceAll("-", "");
  return tail ? `CIV-${tail}` : "";
}

function isValidTrackingCode(value: string) {
  return (
    value.length >= 5 &&
    value.length <= 20 &&
    trackingCodePattern.test(value)
  );
}

function getTrackingErrorMessage(error: unknown) {
  if (error instanceof AxiosError) {
    if (error.response?.status === 404) {
      return "No public report matches that code. Check each character and try again.";
    }
    if (error.response?.status === 400) {
      return "That code is not in a valid Beacon tracking format.";
    }
  }
  return getApiErrorMessage(
    error,
    "The public record could not be loaded. Please try again.",
  );
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
