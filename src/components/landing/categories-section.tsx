import { Section, SectionHeader } from "@/components/shared/section";
import { Stagger, StaggerItem } from "@/components/motion/stagger";
import { issueCategories, toneClasses } from "@/lib/landing-data";

export function CategoriesSection() {
  return (
    <Section id="categories" className="scroll-mt-16">
      <SectionHeader
        eyebrow="What you can report"
        title="Built for the problems people actually face"
        description="From flooded streets to dark alleys, Beacon covers the civic issues that affect daily life — each routed to the department that owns it."
      />

      <Stagger className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {issueCategories.map((category) => {
          const tone = toneClasses[category.tone];
          const Icon = category.icon;
          return (
            <StaggerItem key={category.id}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-elevated)]">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl ${tone.tile}`}
                >
                  <Icon className={`size-5 ${tone.icon}`} />
                </div>
                <h3 className="mt-5 font-heading text-lg font-semibold tracking-tight">
                  {category.label}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {category.description}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary/60 transition-transform duration-300 group-hover:scale-x-100" />
              </article>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
