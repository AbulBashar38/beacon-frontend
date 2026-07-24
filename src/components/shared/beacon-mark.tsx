import { cn } from "@/lib/utils";

/** Beacon brand mark — a signal pulse radiating from a located point. */
export function BeaconMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        d="M9 20.5a9 9 0 0 1 14 0"
        className="stroke-primary-foreground/45"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <path
        d="M12 18.5a5 5 0 0 1 8 0"
        className="stroke-primary-foreground/70"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="16" cy="15.5" r="2.4" className="fill-primary-foreground" />
      <path
        d="M16 17.5v4"
        className="stroke-primary-foreground"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function BeaconWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <BeaconMark />
      <span className="font-heading text-lg font-bold tracking-tight">
        Beacon
      </span>
    </span>
  );
}
