"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrength } from "@/components/auth/password-strength";
import { getApiErrorMessage } from "@/lib/api/client";
import { useAuth } from "@/contexts/auth-context";

const schema = z
  .object({
    name: z.string().min(2, "Enter your full name").max(80),
    email: z.string().min(1, "Enter your email").email("Enter a valid email"),
    password: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/\d/, "Include a number"),
    confirm: z.string().min(1, "Re-enter your password"),
    terms: z.literal(true, {
      message: "Please accept the terms to continue",
    }),
  })
  .refine((v) => v.password === v.confirm, {
    path: ["confirm"],
    message: "Passwords don't match",
  });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
  const router = useRouter();
  const { register: registerAccount } = useAuth();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const password = useWatch({ control, name: "password" }) ?? "";

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await registerAccount(values.name, values.email, values.password);
    } catch (error) {
      setServerError(getApiErrorMessage(error, "We couldn't create your account. Please try again."));
      return;
    }
    setDone(true);
    await new Promise((resolve) => setTimeout(resolve, 450));
    router.replace("/dashboard");
  });

  if (done) {
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
            Account created
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome to Beacon. You&apos;re all set to report and track civic
            issues.
          </p>
        </div>
        <Button asChild size="xl" variant="hero" className="h-13 w-full bg-[var(--landing-ink)] text-white hover:bg-[var(--landing-ink-soft)]">
          <Link href="/dashboard">
            Continue to dashboard
            <ArrowRight data-icon="inline-end" />
          </Link>
        </Button>
      </motion.div>
    );
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key="form"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6"
      >
        <AuthHeader
          eyebrow="Citizen account"
          title="Create your Beacon account"
          subtitle={
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </>
          }
        />

        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
          {serverError ? (
            <FormAlert variant="error">{serverError}</FormAlert>
          ) : null}

          <Field
            label="Full name"
            htmlFor="name"
            error={errors.name?.message}
            required
          >
            <Input
              id="name"
              autoComplete="name"
              placeholder="e.g. Ayesha Rahman"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
          </Field>

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
              {...register("email")}
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
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={!!errors.password}
              {...register("password")}
            />
            <PasswordStrength value={password} />
          </Field>

          <Field
            label="Confirm password"
            htmlFor="confirm"
            error={errors.confirm?.message}
            required
          >
            <PasswordInput
              id="confirm"
              autoComplete="new-password"
              placeholder="Re-enter your password"
              aria-invalid={!!errors.confirm}
              {...register("confirm")}
            />
          </Field>

          <div className="flex flex-col gap-1.5">
            <label className="flex min-h-11 items-start gap-2.5 text-sm leading-5 text-muted-foreground select-none">
              <input
                type="checkbox"
                className="mt-0.5 size-[18px] shrink-0 rounded border-input accent-primary"
                aria-invalid={!!errors.terms}
                {...register("terms")}
              />
              <span>
                I understand that Beacon will use these account details to
                provide authenticated report and tracking access.
              </span>
            </label>
            {errors.terms?.message ? (
              <p role="alert" className="text-xs font-medium text-danger">
                {errors.terms.message}
              </p>
            ) : null}
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
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>

          <p className="flex items-center justify-center gap-2 text-center text-[10px] leading-4 text-muted-foreground">
            <ShieldCheck className="size-3.5 text-primary" aria-hidden="true" />
            Your account keeps your reports and progress history in one place.
          </p>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}
