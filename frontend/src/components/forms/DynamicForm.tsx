"use client";

import { CheckCircle2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { env } from "@/env";
import type { FormField, FormSchema, Locale } from "@/lib/api/types";
import { cn } from "@/lib/cn";

import { Turnstile } from "./Turnstile";

const HONEYPOT = "website_url";

export function DynamicForm({
  schema,
  presets,
}: {
  schema: FormSchema;
  presets?: Record<string, string>;
}) {
  const t = useTranslations("forms");
  const locale = useLocale() as Locale;
  // Captured once at mount; used for the server-side minimum-fill-time spam check.
  const [startedAt] = useState(() => Date.now());
  const [token, setToken] = useState("");
  const [reference, setReference] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<Record<string, unknown>>();

  // Prefill fields from query presets (e.g. ?sector=… / ?package=…).
  useEffect(() => {
    if (!presets) return;
    for (const [key, value] of Object.entries(presets)) {
      if (schema.fields.some((f) => f.key === key)) setValue(key, value);
    }
  }, [presets, schema.fields, setValue]);

  const onSubmit = async (values: Record<string, unknown>) => {
    setSubmitError(null);
    const fd = new FormData();

    for (const field of schema.fields) {
      const value = values[field.key];
      if (field.type === "file") {
        const list = value as FileList | undefined;
        if (list && list[0]) fd.append(`data[${field.key}]`, list[0]);
      } else if (field.type === "multiselect") {
        const arr = (Array.isArray(value) ? value : value ? [value] : []) as string[];
        arr.forEach((v) => fd.append(`data[${field.key}][]`, v));
      } else if (field.type === "checkbox") {
        if (value) fd.append(`data[${field.key}]`, "1");
      } else if (value != null && value !== "") {
        fd.append(`data[${field.key}]`, String(value));
      }
    }
    fd.append(HONEYPOT, String(values[HONEYPOT] ?? ""));
    fd.append("_started_at", String(startedAt));
    fd.append("captcha_token", token);

    const res = await fetch(
      `${env.NEXT_PUBLIC_API_URL}/api/v1/${locale}/forms/${schema.key}/submissions`,
      { method: "POST", headers: { Accept: "application/json" }, body: fd },
    );

    if (res.status === 201) {
      const json = (await res.json()) as { reference: string };
      setReference(json.reference);
      return;
    }

    if (res.status === 422) {
      const json = (await res.json()) as { errors?: Record<string, string[]> };
      for (const [key, messages] of Object.entries(json.errors ?? {})) {
        setError(key.replace(/^data\./, ""), { message: messages[0] });
      }
      setSubmitError(t("genericError"));
      return;
    }

    setSubmitError(t("genericError"));
  };

  if (reference) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-8 text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" aria-hidden />
        <h2 className="text-xl font-bold text-fg">{t("successTitle")}</h2>
        <p className="mt-2 text-muted">{t("successBody", { reference })}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5" aria-live="polite">
      {schema.fields.map((field) => (
        <Field key={field.key} field={field} register={register} error={errors[field.key]?.message as string | undefined} />
      ))}

      {/* Honeypot — visually hidden, must stay empty. */}
      <div aria-hidden className="absolute -left-[9999px]" tabIndex={-1}>
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" {...register(HONEYPOT)} />
        </label>
      </div>

      {schema.notice ? (
        <p className="rounded-[var(--radius)] border border-border bg-surface p-4 text-sm text-muted">
          {schema.notice}
        </p>
      ) : null}

      <Turnstile siteKey={env.NEXT_PUBLIC_TURNSTILE_SITE_KEY} onToken={setToken} />

      {submitError ? (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={isSubmitting}>
        {isSubmitting ? t("submitting") : t("submit")}
      </Button>
    </form>
  );
}

type Register = ReturnType<typeof useForm<Record<string, unknown>>>["register"];

function Field({
  field,
  register,
  error,
}: {
  field: FormField;
  register: Register;
  error?: string;
}) {
  const t = useTranslations("forms");
  const id = `f_${field.key}`;
  const required = field.is_required ? { required: t("required") } : {};
  const labelEl = (
    <label htmlFor={id} className="mb-1 block text-sm font-medium text-fg">
      {field.label}
      {field.is_required ? <span className="text-red-600"> *</span> : null}
    </label>
  );
  const inputClass = cn(
    "w-full rounded-[var(--radius)] border bg-bg px-3 py-2.5 text-sm outline-none focus:border-primary",
    error ? "border-red-500" : "border-border",
  );

  const control = (() => {
    switch (field.type) {
      case "textarea":
        return <textarea id={id} rows={5} className={inputClass} {...register(field.key, required)} />;
      case "select":
        return (
          <select id={id} className={inputClass} {...register(field.key, required)}>
            <option value="">—</option>
            {field.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        );
      case "multiselect":
        return (
          <div className="grid gap-2 sm:grid-cols-2">
            {field.options.map((o) => (
              <label key={o.value} className="flex items-center gap-2 text-sm">
                <input type="checkbox" value={o.value} {...register(field.key, required)} />
                {o.label}
              </label>
            ))}
          </div>
        );
      case "checkbox":
        return (
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" id={id} {...register(field.key, required)} />
            {field.help}
          </label>
        );
      case "file":
        return <input type="file" id={id} className={inputClass} {...register(field.key, required)} />;
      case "date":
        return <input type="date" id={id} className={inputClass} {...register(field.key, required)} />;
      case "email":
        return (
          <input
            type="email"
            id={id}
            className={inputClass}
            {...register(field.key, { ...required, pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: t("invalidEmail") } })}
          />
        );
      default:
        return (
          <input
            type={field.type === "phone" ? "tel" : "text"}
            id={id}
            className={inputClass}
            {...register(field.key, required)}
          />
        );
    }
  })();

  return (
    <div>
      {field.type !== "checkbox" ? labelEl : null}
      {control}
      {field.help && field.type !== "checkbox" ? (
        <p className="mt-1 text-xs text-muted">{field.help}</p>
      ) : null}
      {error ? (
        <p role="alert" className="mt-1 text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
