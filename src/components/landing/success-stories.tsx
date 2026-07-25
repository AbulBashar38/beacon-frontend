"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, CheckCircle2, Clock, MapPin } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section, SectionHeader } from "@/components/shared/section";
import { useLandingData } from "@/contexts/landing-data-context";
import { cn } from "@/lib/utils";

export function SuccessStories() {
  const data = useLandingData();
  if (!data?.recentResolutions.length) return null;

  return (
    <Section id="stories" className="scroll-mt-16 bg-[var(--landing-paper)]">
      <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
        <SectionHeader
          eyebrow="05 / Resolution record"
          title="Closed cases leave a visible trail."
          align="start"
          className="mx-0"
        />
        <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end lg:text-lg">
          A public tracking code connects the original report, responsible
          department, and final status—so improvement is documented, not implied.
        </p>
      </div>

      <Stagger className="mt-12 grid gap-4 md:grid-cols-2">
        {data.recentResolutions.map((story, index) => (
          <StaggerItem
            key={story.trackingCode}
            className={cn(index === 0 && "md:col-span-2")}
          >
            <article
              className={cn(
                "group relative flex h-full flex-col overflow-hidden rounded-2xl border border-black/8 bg-white p-6 transition hover:border-primary/22 hover:shadow-[0_20px_60px_-44px_black]",
                index === 0 && "md:grid md:grid-cols-[1.15fr_.85fr] md:gap-10 md:p-8",
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-success">
                    <CheckCircle2 className="size-3" />
                    Resolved
                  </span>
                  <Link
                    href={`/track?code=${encodeURIComponent(story.trackingCode)}`}
                    className="inline-flex items-center gap-1 font-mono text-[10px] text-muted-foreground transition hover:text-primary"
                    aria-label={`Track report ${story.trackingCode}`}
                  >
                    {story.trackingCode}
                    <ArrowUpRight className="size-3.5" />
                  </Link>
                </div>

                <h3 className={cn("mt-6 font-heading text-xl font-semibold leading-snug tracking-tight", index === 0 && "max-w-xl sm:text-2xl")}>
                  {story.summary ?? `${formatLabel(story.category)} report resolved`}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {formatLabel(story.category)} · documented through Beacon&apos;s public report lifecycle.
                </p>
              </div>

              <div className={cn("mt-7 border-t border-border pt-5", index === 0 && "md:mt-0 md:border-l md:border-t-0 md:pl-8 md:pt-0")}>
                <div className="mb-5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  <span>Reported</span>
                  <span className="h-px flex-1 bg-border" />
                  <span>Assigned</span>
                  <span className="h-px flex-1 bg-success/30" />
                  <span className="text-success">Resolved</span>
                </div>
                <dl className="space-y-3 text-xs text-muted-foreground">
                  <MetaRow icon={MapPin} value={story.locationText} />
                  <MetaRow icon={Clock} value={`Resolved in ${formatDuration(story.resolutionHours)}`} />
                  <MetaRow icon={Building2} value={formatLabel(story.assignedDepartment ?? "unassigned")} />
                </dl>
              </div>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}

function formatLabel(value: string) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDuration(hours: number) {
  if (hours < 24) return `${Math.max(1, Math.round(hours))} hours`;
  const days = hours / 24;
  return `${days < 10 ? days.toFixed(1) : Math.round(days)} days`;
}

function MetaRow({ icon: Icon, value }: { icon: typeof MapPin; value: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <Icon className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
      <span>{value}</span>
    </div>
  );
}
