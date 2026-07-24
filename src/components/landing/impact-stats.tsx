import { Section } from "@/components/shared/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { Eyebrow } from "@/components/shared/section";
import { impactStats } from "@/lib/landing-data";

export function ImpactStats() {
  return (
    <Section id="impact" className="scroll-mt-16">
      <div className="relative overflow-hidden rounded-3xl border border-console-border/50 bg-console px-6 py-14 sm:px-12">
        <div
          aria-hidden
          className="bg-grid text-console-foreground/40 absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        />
        <div
          aria-hidden
          className="absolute -bottom-24 left-1/2 size-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl text-center">
          <Eyebrow className="border-primary/30 bg-primary/15 text-primary-foreground">
            Platform impact
          </Eyebrow>
          <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight text-console-foreground text-balance sm:text-4xl">
            Real infrastructure outcomes, at national scale
          </h2>
        </div>

        <Stagger className="relative mt-12 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
          {impactStats.map((stat) => (
            <StaggerItem key={stat.label} className="text-center">
              <div className="font-heading text-4xl font-bold tracking-tight text-console-foreground tabular-nums sm:text-5xl">
                <AnimatedNumber
                  value={stat.value}
                  decimals={stat.decimals}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </div>
              <div className="mt-2 text-sm font-medium text-console-foreground">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-console-muted">{stat.hint}</div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
