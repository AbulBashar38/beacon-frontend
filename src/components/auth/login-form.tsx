"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowRight, CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/contexts/auth-context";

const schema = z.object({
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

const demoAdminCredentials = {
  email: "abulbasarofficial5403+admin@gmail.com",
  password: "12345678Aa#",
} as const;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: true },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [destination, setDestination] = useState("/");
  const [demoFilled, setDemoFilled] = useState(false);

  function fillDemoAdminCredentials() {
    setValue("email", demoAdminCredentials.email, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("password", demoAdminCredentials.password, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
    setValue("remember", false, {
      shouldDirty: true,
    });
    clearErrors();
    setServerError(null);
    setDemoFilled(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      const user = await login(values.email, values.password, values.remember ?? true);
      const target = user.role === "admin" ? "/admin/dashboard" : "/dashboard";
      setDestination(target);
      setDone(true);
      await new Promise((resolve) => setTimeout(resolve, 450));
      router.replace(target);
    } catch (error) {
      setServerError(getApiErrorMessage(error, "We couldn't sign you in. Check your details and retry."));
      return;
    }
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <AuthSuccess key="done" destination={destination} />
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-6"
        >
          <AuthHeader
            eyebrow="Account access"
            title="Welcome back to Beacon"
            subtitle={
              <>
                New to Beacon?{" "}
                <Link
                  href="/register"
                  className="font-medium text-primary underline-offset-4 hover:underline"
                >
                  Create an account
                </Link>
              </>
            }
          />

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
            <section
              aria-labelledby="admin-demo-title"
              className="rounded-2xl border border-primary/15 bg-primary/[0.045] p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl border border-primary/15 bg-white text-primary shadow-sm">
                  <ShieldCheck className="size-4.5" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 id="admin-demo-title" className="text-sm font-semibold text-foreground">
                      Explore the admin workspace
                    </h2>
                    <span className="rounded-full border border-primary/15 bg-white/70 px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.1em] text-primary">
                      Hackathon demo
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Fill the showcase account to explore national metrics, the live map, issue triage, and report updates.
                  </p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-3 h-11 w-full border-primary/15 bg-white text-foreground shadow-sm hover:border-primary/25 hover:bg-white hover:text-primary"
                onClick={fillDemoAdminCredentials}
                disabled={isSubmitting}
              >
                {demoFilled ? <CheckCircle2 /> : <KeyRound />}
                {demoFilled ? "Admin credentials added" : "Use admin demo account"}
              </Button>
              <p
                role="status"
                aria-live="polite"
                className="mt-2 text-center text-[10px] leading-4 text-muted-foreground"
              >
                {demoFilled
                  ? "The form is ready. Select Sign in to open the admin dashboard."
                  : "For judging and product exploration only. Remember me will be turned off."}
              </p>
            </section>

            {serverError ? (
              <FormAlert variant="error">{serverError}</FormAlert>
            ) : null}

            <Field
              label="Email"
              htmlFor="email"
              error={errors.email?.message}
              required
            >
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                aria-invalid={!!errors.email}
                {...register("email", { onChange: () => setDemoFilled(false) })}
              />
            </Field>

            <Field
              label="Password"
              htmlFor="password"
              error={errors.password?.message}
              required
            >
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                {...register("password", { onChange: () => setDemoFilled(false) })}
              />
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex min-h-11 items-center gap-2 text-sm text-muted-foreground select-none">
                <input
                  type="checkbox"
                  className="size-[18px] rounded border-input accent-primary"
                  {...register("remember")}
                />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              size="xl"
              variant="hero"
              disabled={isSubmitting}
              className="mt-1 h-13 w-full bg-[var(--landing-ink)] text-white shadow-[0_18px_40px_-24px_var(--landing-ink)] hover:bg-[var(--landing-ink-soft)]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" data-icon="inline-start" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight data-icon="inline-end" />
                </>
              )}
            </Button>

            <p className="flex items-center justify-center gap-2 text-center text-[10px] leading-4 text-muted-foreground">
              <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
              Your session is protected and routed according to your account role.
            </p>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AuthSuccess({ destination }: { destination: string }) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex size-16 items-center justify-center rounded-2xl border border-success/15 bg-success/10"
      >
        <CheckCircle2 className="size-8 text-success" />
      </motion.span>
      <div className="space-y-1.5">
        <h1 className="font-heading text-3xl font-semibold tracking-[-0.035em]">
          You&apos;re signed in
        </h1>
        <p className="text-sm text-muted-foreground">Welcome back to Beacon. Opening your workspace…</p>
      </div>
      <Button asChild size="xl" variant="hero" className="h-13 w-full bg-[var(--landing-ink)] text-white hover:bg-[var(--landing-ink-soft)]">
        <Link href={destination}>
          Continue
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </motion.div>
  );
}
