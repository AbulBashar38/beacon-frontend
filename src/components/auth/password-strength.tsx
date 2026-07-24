import { cn } from "@/lib/utils";

export type Strength = 0 | 1 | 2 | 3 | 4;

/** Lightweight, dependency-free password scoring for UI feedback only. */
export function scorePassword(value: string): Strength {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (value.length >= 12) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value) && /[^A-Za-z0-9]/.test(value)) score++;
  return Math.min(score, 4) as Strength;
}

const meta: Record<Exclude<Strength, 0>, { label: string; color: string }> = {
  1: { label: "Weak", color: "var(--danger)" },
  2: { label: "Fair", color: "var(--warning)" },
  3: { label: "Good", color: "var(--info)" },
  4: { label: "Strong", color: "var(--success)" },
};

export function PasswordStrength({ value }: { value: string }) {
  const score = scorePassword(value);
  if (!value) return null;
  const info = meta[score as Exclude<Strength, 0>] ?? meta[1];

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="flex flex-1 gap-1">
        {[1, 2, 3, 4].map((seg) => (
          <span
            key={seg}
            className={cn(
              "h-1 flex-1 rounded-full transition-colors",
              seg <= score ? "" : "bg-border",
            )}
            style={seg <= score ? { backgroundColor: info.color } : undefined}
          />
        ))}
      </div>
      <span
        className="w-12 shrink-0 text-right text-xs font-medium"
        style={{ color: info.color }}
      >
        {info.label}
      </span>
    </div>
  );
}
