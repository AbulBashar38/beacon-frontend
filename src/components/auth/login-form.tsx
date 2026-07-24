"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { AuthHeader } from "@/components/auth/auth-header";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialButtons } from "@/components/auth/social-buttons";
import { AuthDivider } from "@/components/auth/auth-divider";

const schema = z.object({
  email: z.string().min(1, "Enter your email").email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean().optional(),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { email: "", password: "", remember: true },
  });

  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    await new Promise((r) => setTimeout(r, 900));
    // Demo behaviour: any address beginning "error" simulates a failure.
    if (values.email.startsWith("error")) {
      setServerError("We couldn't sign you in. Check your details and retry.");
      return;
    }
    setDone(true);
  });

  return (
    <AnimatePresence mode="wait" initial={false}>
      {done ? (
        <AuthSuccess key="done" />
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="flex flex-col gap-6"
        >
          <AuthHeader
            title="Welcome back"
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

          <SocialButtons label="Sign in" />

          <AuthDivider />

          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
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
                autoComplete="current-password"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground select-none">
                <input
                  type="checkbox"
                  className="size-4 rounded border-input accent-primary"
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
              className="mt-1 w-full"
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
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function AuthSuccess() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center gap-5 text-center"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="flex size-16 items-center justify-center rounded-2xl bg-success/10"
      >
        <CheckCircle2 className="size-8 text-success" />
      </motion.span>
      <div className="space-y-1.5">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          You&apos;re signed in
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back to Beacon. Let&apos;s get you moving.
        </p>
      </div>
      <Button asChild size="xl" variant="hero" className="w-full">
        <Link href="/">
          Continue
          <ArrowRight data-icon="inline-end" />
        </Link>
      </Button>
    </motion.div>
  );
}
