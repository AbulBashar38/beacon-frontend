import Link from "next/link";
import { ArrowLeft, MailWarning, ShieldAlert } from "lucide-react";

import { AuthHeader } from "@/components/auth/auth-header";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  return (
    <div className="flex flex-col gap-6">
      <AuthHeader
        eyebrow="Account recovery"
        title="Password recovery"
        subtitle="Email-based password reset is not connected to the Beacon authentication service yet."
      />

      <div
        role="status"
        className="rounded-2xl border border-warning/20 bg-warning/[0.07] p-5"
      >
        <span className="grid size-11 place-items-center rounded-xl bg-warning/12 text-warning">
          <MailWarning className="size-5" aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-sm font-semibold">Recovery email unavailable</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          No reset message has been sent. Return to sign in and retry your
          credentials. Administrators should use their organization&apos;s
          approved account-support process if access cannot be restored.
        </p>
      </div>

      <div className="flex items-start gap-2.5 rounded-xl border border-black/7 bg-[var(--landing-paper)] p-3.5 text-xs leading-5 text-muted-foreground">
        <ShieldAlert className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        Beacon will only enable this flow when a real, secure reset endpoint is
        available.
      </div>

      <Button
        asChild
        size="xl"
        className="h-13 w-full bg-[var(--landing-ink)] text-white hover:bg-[var(--landing-ink-soft)]"
      >
        <Link href="/login">
          <ArrowLeft data-icon="inline-start" />
          Back to sign in
        </Link>
      </Button>
    </div>
  );
}
