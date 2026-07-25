import * as React from "react";
import { AlertCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Reusable labelled form field: real <label> (never placeholder-only), an
 * optional hint, and an accessible inline error message.
 */
export function Field({
  label,
  htmlFor,
  hint,
  error,
  required,
  className,
  children,
}: FieldProps) {
  const hintId = htmlFor && hint ? `${htmlFor}-hint` : undefined;
  const errorId = htmlFor && error ? `${htmlFor}-error` : undefined;
  const describedChild =
    htmlFor &&
    React.isValidElement(children) &&
    (children.props as { id?: string }).id === htmlFor
      ? React.cloneElement(
          children as React.ReactElement<{
            id?: string;
            "aria-describedby"?: string;
            "aria-errormessage"?: string;
            "aria-required"?: boolean;
          }>,
          {
            "aria-describedby": hintId,
            "aria-errormessage": errorId,
            "aria-required": required || undefined,
          },
        )
      : children;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-baseline justify-between gap-2">
        <label
          htmlFor={htmlFor}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required ? (
            <span className="ml-0.5 text-danger" aria-hidden>
              *
            </span>
          ) : null}
        </label>
        {hint ? (
          <span id={hintId} className="text-xs text-muted-foreground">{hint}</span>
        ) : null}
      </div>
      {describedChild}
      {error ? (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1.5 text-xs font-medium text-danger"
        >
          <AlertCircle className="size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}
