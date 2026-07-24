"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion } from "motion/react";
import {
  Loader2,
  LocateFixed,
  ImagePlus,
  X,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/forms/field";
import { FormAlert } from "@/components/forms/form-alert";
import { AddressFinder } from "@/components/forms/address-finder";
import { issueCategories, toneClasses } from "@/lib/landing-data";
import { getApiErrorMessage } from "@/lib/api/client";
import { reportApi, type ApiReportCategory } from "@/lib/api/report-api";
import { reverseGeocodeBangladesh } from "@/lib/mapbox-geocoding";

const severities = [
  { value: "low", label: "Low", color: "var(--map-heat-low)" },
  { value: "medium", label: "Moderate", color: "var(--map-heat-medium)" },
  { value: "high", label: "Critical", color: "var(--map-heat-high)" },
] as const;

const schema = z.object({
  category: z.string().min(1, "Choose the type of issue"),
  title: z
    .string()
    .min(6, "Add a short, clear title (at least 6 characters)")
    .max(90, "Keep the title under 90 characters"),
  description: z
    .string()
    .min(15, "Tell us a little more so the right team can act")
    .max(600, "Keep the description under 600 characters"),
  severity: z.enum(["low", "medium", "high"]),
  location: z.string().min(4, "Add an address, area or landmark"),
  contact: z
    .string()
    .max(60)
    .optional()
    .or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

const MAX_IMAGE_MB = 8;

const apiCategory: Record<string, ApiReportCategory> = {
  pothole: "pothole",
  streetlight: "broken_streetlight",
  "water-leak": "water_leak",
  dumping: "illegal_dumping",
  drainage: "other",
  "road-hazard": "other",
};

export function QuickReportForm() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: { severity: "medium", category: "", location: "" },
  });

  const [photo, setPhoto] = useState<{ url: string; name: string } | null>(
    null,
  );
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<{
    code: string;
    title: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const category = useWatch({ control, name: "category" });
  const severity = useWatch({ control, name: "severity" });
  const location = useWatch({ control, name: "location" });

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;
    setPhotoError(null);
    if (!file.type.startsWith("image/")) {
      setPhotoError("That file isn't an image.");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      setPhotoError(`Image must be under ${MAX_IMAGE_MB}MB.`);
      return;
    }
    if (photo) URL.revokeObjectURL(photo.url);
    setPhoto({ url: URL.createObjectURL(file), name: file.name });
  }

  function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      setLocationError("Location services are not supported by this browser.");
      return;
    }
    setLocating(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        void reverseGeocodeBangladesh(latitude, longitude)
          .then((address) => {
            setValue("location", address.fullAddress, {
              shouldValidate: true,
              shouldTouch: true,
            });
            setCoordinates({ latitude: address.latitude, longitude: address.longitude });
          })
          .catch(() => {
            setLocationError("We found your position but could not resolve a structured address. Search for a nearby road or landmark.");
          })
          .finally(() => setLocating(false));
      },
      () => {
        setLocating(false);
        setLocationError("Location permission was denied. Search for the address instead.");
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }

  async function copyCode() {
    if (!submitted) return;
    await navigator.clipboard.writeText(submitted.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      const report = await reportApi.create({
        description: `${values.title}\n\n${values.description}\n\nCitizen urgency: ${values.severity}`,
        locationText: values.location,
        contact: values.contact || undefined,
        category: apiCategory[values.category] ?? "other",
        language: "en",
        latitude: coordinates?.latitude,
        longitude: coordinates?.longitude,
        imageUrls: [],
      });
      setSubmitted({ code: report.trackingCode, title: values.title });
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, "We couldn't submit this report. Please try again."));
    }
  });

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-elevated)]">
      <div className="border-b border-border bg-surface-muted/50 px-6 py-4 sm:px-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
            <span className="size-1.5 rounded-full bg-success" />
            No sign-in needed
          </span>
          <span className="text-xs text-muted-foreground">
            Takes about a minute
          </span>
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {submitted ? (
          <SuccessState
            key="success"
            code={submitted.code}
            title={submitted.title}
            copied={copied}
            onCopy={copyCode}
            onReset={() => {
              setSubmitted(null);
              setPhoto(null);
              window.location.hash = "#report";
            }}
          />
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={onSubmit}
            noValidate
            className="flex flex-col gap-6 p-6 sm:p-8"
          >
            {submitError ? <FormAlert variant="error">{submitError}</FormAlert> : null}

            {/* category */}
            <Field
              label="What's the problem?"
              error={errors.category?.message}
              required
            >
              <input type="hidden" {...register("category")} />
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {issueCategories.map((c) => {
                  const active = category === c.id;
                  const tone = toneClasses[c.tone];
                  const Icon = c.icon;
                  return (
                    <button
                      type="button"
                      key={c.id}
                      onClick={() =>
                        setValue("category", c.id, {
                          shouldValidate: true,
                          shouldTouch: true,
                        })
                      }
                      aria-pressed={active}
                      className={cn(
                        "group flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition-all",
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-primary/30 hover:bg-muted/50",
                      )}
                    >
                      <span
                        className={cn(
                          "flex size-8 shrink-0 items-center justify-center rounded-lg",
                          tone.tile,
                        )}
                      >
                        <Icon className={cn("size-4", tone.icon)} />
                      </span>
                      <span className="text-xs font-medium leading-tight">
                        {c.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field
              label="Title"
              htmlFor="qr-title"
              error={errors.title?.message}
              required
            >
              <Input
                id="qr-title"
                placeholder="e.g. Large pothole near the school gate"
                aria-invalid={!!errors.title}
                {...register("title")}
              />
            </Field>

            <Field
              label="Description"
              htmlFor="qr-desc"
              hint="What, where and how bad?"
              error={errors.description?.message}
              required
            >
              <Textarea
                id="qr-desc"
                rows={3}
                placeholder="Describe the issue and anything that helps the response team locate and prioritise it."
                aria-invalid={!!errors.description}
                {...register("description")}
              />
            </Field>

            {/* severity */}
            <Field label="How urgent is it?" required>
              <div className="grid grid-cols-3 gap-2">
                {severities.map((s) => {
                  const active = severity === s.value;
                  return (
                    <button
                      type="button"
                      key={s.value}
                      onClick={() =>
                        setValue("severity", s.value, { shouldTouch: true })
                      }
                      aria-pressed={active}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-medium transition-all",
                        active
                          ? "border-transparent text-foreground ring-2"
                          : "border-border text-muted-foreground hover:bg-muted/50",
                      )}
                      style={
                        active
                          ? ({
                              backgroundColor: `color-mix(in oklch, ${s.color}, transparent 88%)`,
                              // ring color
                              "--tw-ring-color": s.color,
                            } as React.CSSProperties)
                          : undefined
                      }
                    >
                      <span
                        className="size-2 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      {s.label}
                    </button>
                  );
                })}
              </div>
            </Field>

            {/* location */}
            <Field
              label="Location"
              htmlFor="qr-location"
              error={errors.location?.message ?? locationError ?? undefined}
              required
            >
              <div className="flex flex-col gap-2 sm:flex-row">
                <input type="hidden" {...register("location")} />
                <AddressFinder
                  value={location}
                  invalid={Boolean(errors.location || locationError)}
                  onValueChange={(nextLocation) => {
                    setLocationError(null);
                    setCoordinates(null);
                    setValue("location", nextLocation, {
                      shouldValidate: true,
                      shouldTouch: true,
                    });
                  }}
                  onSelect={(address) => {
                    setLocationError(null);
                    setCoordinates({
                      latitude: address.latitude,
                      longitude: address.longitude,
                    });
                    setValue("location", address.fullAddress, {
                      shouldValidate: true,
                      shouldTouch: true,
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={useCurrentLocation}
                  disabled={locating}
                  className="justify-center"
                >
                  {locating ? (
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                  ) : (
                    <LocateFixed data-icon="inline-start" />
                  )}
                  Use my location
                </Button>
              </div>
            </Field>

            {/* photo (optional) */}
            <Field label="Photo" hint="Optional">
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
              {photo ? (
                <div className="flex items-center gap-3 rounded-xl border border-border p-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.url}
                    alt="Selected evidence preview"
                    className="size-14 rounded-lg object-cover"
                  />
                  <span className="flex-1 truncate text-sm text-muted-foreground">
                    {photo.name}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Remove photo"
                    onClick={() => {
                      URL.revokeObjectURL(photo.url);
                      setPhoto(null);
                    }}
                  >
                    <X />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFiles(e.dataTransfer.files);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  <ImagePlus className="size-4" />
                  Add a photo — tap to capture or drop a file
                </button>
              )}
              {photoError ? (
                <p role="alert" className="text-xs font-medium text-danger">
                  {photoError}
                </p>
              ) : null}
            </Field>

            <Field
              label="Contact"
              htmlFor="qr-contact"
              hint="Optional — for status updates"
              error={errors.contact?.message}
            >
              <Input
                id="qr-contact"
                placeholder="Phone or email"
                {...register("contact")}
              />
            </Field>

            <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted-foreground">
                You’ll get a public tracking code to follow progress.
              </p>
              <Button
                type="submit"
                size="xl"
                variant="hero"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" data-icon="inline-start" />
                    Submitting…
                  </>
                ) : (
                  <>
                    Submit report
                    <ArrowRight data-icon="inline-end" />
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function SuccessState({
  code,
  title,
  copied,
  onCopy,
  onReset,
}: {
  code: string;
  title: string;
  copied: boolean;
  onCopy: () => void;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center gap-5 p-8 text-center sm:p-12"
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
        <h3 className="font-heading text-2xl font-semibold tracking-tight">
          Report submitted
        </h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thanks — “{title}” is now in the queue and routed to the right
          department. Save your tracking code to follow it.
        </p>
      </div>

      <div className="w-full max-w-xs rounded-2xl border border-border bg-surface-muted/50 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Public tracking code
        </p>
        <div className="mt-2 flex items-center justify-center gap-2">
          <span className="font-mono text-xl font-semibold tracking-tight">
            {code}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Copy tracking code"
            onClick={onCopy}
          >
            {copied ? (
              <Check className="text-success" />
            ) : (
              <Copy />
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button asChild size="lg" variant="outline">
          <a href="/track">Track this report</a>
        </Button>
        <Button type="button" size="lg" variant="ghost" onClick={onReset}>
          Report another issue
        </Button>
      </div>
    </motion.div>
  );
}
