import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function DashboardPanel({
  title,
  eyebrow,
  action,
  children,
  className,
}: {
  title: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-white/8 bg-slate-900/75 shadow-xl shadow-black/10", className)}>
      <header className="flex items-start justify-between gap-4 border-b border-white/7 px-5 py-4">
        <div>
          {eyebrow && <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-400">{eyebrow}</p>}
          <h2 className="font-heading text-sm font-semibold text-slate-100">{title}</h2>
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
