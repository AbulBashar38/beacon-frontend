import { MapPin, Clock, Building2 } from "lucide-react";

import { Section, SectionHeader } from "@/components/shared/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { successStories } from "@/lib/landing-data";

export function SuccessStories() {
  return (
    <Section id="stories" className="scroll-mt-16 bg-surface-muted/60">
      <SectionHeader
        eyebrow="Recent resolutions"
        title="Cases closed, streets improved"
        description="A live feed of real reports resolved through Beacon — every one traceable by its public tracking code."
      />

      <Stagger className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
        {successStories.map((story) => (
          <StaggerItem key={story.id}>
            <article className="flex h-full flex-col rounded-2xl border border-border bg-surface p-6">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  Resolved
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {story.id}
                </span>
              </div>

              <h3 className="mt-4 font-heading text-lg font-semibold leading-snug tracking-tight">
                {story.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {story.summary}
              </p>

              <dl className="mt-5 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <MetaRow icon={MapPin} value={story.location} />
                <MetaRow icon={Clock} value={`Resolved in ${story.resolvedIn}`} />
                <MetaRow icon={Building2} value={story.department} />
              </dl>
            </article>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
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
