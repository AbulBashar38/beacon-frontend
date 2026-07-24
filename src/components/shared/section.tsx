import * as React from "react";

import { cn } from "@/lib/utils";
import { FadeIn } from "@/components/motion/fade-in";

/** Consistent vertical rhythm + max width for every landing section. */
export function Section({
  className,
  containerClassName,
  children,
  ...props
}: React.ComponentProps<"section"> & { containerClassName?: string }) {
  return (
    <section className={cn("py-20 sm:py-28", className)} {...props}>
      <div
        className={cn(
          "mx-auto w-full max-w-6xl px-5 sm:px-8",
          containerClassName,
        )}
      >
        {children}
      </div>
    </section>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "start" | "center";
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeaderProps) {
  return (
    <FadeIn
      className={cn(
        "flex max-w-2xl flex-col gap-4",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
          {description}
        </p>
      ) : null}
    </FadeIn>
  );
}

/** Small pill label used above section titles and in the hero. */
export function Eyebrow({
  className,
  children,
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium tracking-wide text-primary uppercase",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-primary" />
      {children}
    </span>
  );
}
