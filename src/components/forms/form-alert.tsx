import { AlertCircle, CheckCircle2, Info } from "lucide-react";

import { cn } from "@/lib/utils";

const styles = {
  error: {
    icon: AlertCircle,
    className: "border-danger/30 bg-danger/8 text-danger",
  },
  success: {
    icon: CheckCircle2,
    className: "border-success/30 bg-success/10 text-success",
  },
  info: {
    icon: Info,
    className: "border-info/30 bg-info/10 text-info",
  },
} as const;

export function FormAlert({
  variant = "error",
  children,
  className,
}: {
  variant?: keyof typeof styles;
  children: React.ReactNode;
  className?: string;
}) {
  const { icon: Icon, className: tone } = styles[variant];
  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-3 text-sm font-medium",
        tone,
        className,
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
