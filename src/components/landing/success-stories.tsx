"use client";

import { MapPin, Clock, Building2 } from "lucide-react";

import { Section, SectionHeader } from "@/components/shared/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { useLandingData } from "@/contexts/landing-data-context";

export function SuccessStories() {
  const data = useLandingData();
  if (!data?.recentResolutions.length) return null;

  return (
    <Section id="stories" className="scroll-mt-16 bg-surface-muted/60">
      <SectionHeader
        eyebrow="Recent resolutions"
        title="Cases closed, streets improved"
        description="A live feed of real reports resolved through Beacon — every one traceable by its public tracking code."
      />

      <Stagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {data.recentResolutions.map((story) => (
          <StaggerItem key={story.trackingCode}>
            <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  Resolved
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {story.trackingCode}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-lg font-semibold leading-snug tracking-tight">
                {formatLabel(story.category)}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {story.summary ?? "This infrastructure report has been marked as resolved."}
              </p>

              <dl className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <MetaRow icon={MapPin} value={story.locationText} />
                <MetaRow icon={Clock} value={`Resolved in ${formatDuration(story.resolutionHours)}`} />
                <MetaRow icon={Building2} value={formatLabel(story.assignedDepartment ?? "unassigned")} />
              </dl>
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

function MetaRow({
  icon: Icon,
  value,
}: {
  icon: typeof MapPin;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-3.5 shrink-0 text-primary/70" />
      <span>{value}</span>
    </div>
  );
}
