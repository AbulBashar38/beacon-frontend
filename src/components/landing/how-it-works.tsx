import { Section, SectionHeader } from "@/components/shared/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { howItWorks } from "@/lib/landing-data";

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      className="scroll-mt-16 bg-surface-muted/60"
      containerClassName=""
    >
      <SectionHeader
        eyebrow="How it works"
        title="Three steps from photo to fixed"
        description="No accounts to wrestle with, no paperwork. Beacon does the heavy lifting behind the scenes."
      />

      <Stagger
        stagger={0.12}
        className="relative mt-14 grid grid-cols-1 gap-6 md:grid-cols-3"
      >
        {/* connecting line */}
        <div
          aria-hidden
          className="absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
        />
        {howItWorks.map((step) => {
          const Icon = step.icon;
          return (
            <StaggerItem key={step.step} className="relative">
              <div className="flex h-full flex-col items-start rounded-2xl border border-border bg-surface p-6">
                <div className="flex w-full items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary ring-8 ring-surface-muted/60">
                    <Icon className="size-5" />
                  </span>
                  <span className="font-mono text-sm font-medium text-muted-foreground/60">
                    {step.step}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
