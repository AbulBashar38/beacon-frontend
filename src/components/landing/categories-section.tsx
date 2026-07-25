import { ArrowUpRight } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { Section, SectionHeader } from "@/components/shared/section";
import { cn } from "@/lib/utils";
import { issueCategories, toneClasses } from "@/lib/landing-data";

const featureLayouts = [
  "sm:col-span-2 lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "sm:col-span-2 lg:col-span-2",
  "lg:col-span-1",
  "lg:col-span-1",
  "sm:col-span-2 lg:col-span-2",
];

export function CategoriesSection() {
  return (
    <Section id="categories" className="scroll-mt-16 bg-[var(--landing-paper-deep)]">
      <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <SectionHeader
          eyebrow="03 / Issue index"
          title="Everyday problems, structured for action."
          align="start"
          className="mx-0"
        />
        <p className="max-w-2xl text-base leading-7 text-muted-foreground lg:justify-self-end lg:text-lg">
          Each category carries the right operational context, helping reviewers
          understand ownership without making citizens learn government structure.
        </p>
      </div>

      <Stagger className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {issueCategories.map((category, index) => {
          const tone = toneClasses[category.tone];
          const Icon = category.icon;
          return (
            <StaggerItem key={category.id} className={featureLayouts[index]}>
              <article className="group relative flex h-full min-h-56 flex-col overflow-hidden rounded-2xl border border-black/8 bg-[var(--landing-paper)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_22px_55px_-40px_black] sm:p-6">
                <div className="flex items-start justify-between">
                  <span className={cn("grid size-11 place-items-center rounded-xl", tone.tile)}>
                    <Icon className={cn("size-5", tone.icon)} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[9px] font-semibold tracking-[0.14em] text-muted-foreground/50">
                    CIV-{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-auto pt-8">
                  <h3 className="font-heading text-lg font-semibold tracking-tight">
                    {category.label}
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                    {category.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-black/7 pt-3">
                    <span className="text-[10px] font-medium uppercase tracking-[0.1em] text-muted-foreground">
                      Routes toward {category.department}
                    </span>
                    <ArrowUpRight className="size-4 text-primary opacity-50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                  </div>
                </div>
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
