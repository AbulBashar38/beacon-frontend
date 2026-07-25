import { LockKeyhole } from "lucide-react";

export function AuthHeader({
  eyebrow = "Secure account access",
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 font-mono text-[9px] font-semibold uppercase tracking-[0.15em] text-primary">
        <LockKeyhole className="size-3.5" aria-hidden="true" />
        {eyebrow}
      </div>
      <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-[2rem]">
        {title}
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {subtitle}
      </p>
    </div>
  );
}
