"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { standards } from "@/content/site";
import {
  ACCEPTED_UPLOADS,
  MAX_UPLOAD_BYTES,
  PREFILL_EVENT,
  REQUIREMENT_OPTIONS,
  type QuoteFieldErrors,
} from "@/lib/quote-constants";
import { Icon } from "./Icon";

type Status = { state: "idle" | "sending" | "sent" | "error"; message?: string };

function Field({
  id,
  label,
  error,
  optional,
  children,
  className = "",
}: {
  id: string;
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-2 flex items-baseline justify-between text-sm font-semibold text-ink">
        {label}
        {optional && <span className="text-xs font-normal text-ink-muted">Optional</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function QuoteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<QuoteFieldErrors>({});
  const [requirement, setRequirement] = useState("");
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setStartedAt(Date.now());
    const onPrefill = (e: Event) => {
      const value = (e as CustomEvent<string>).detail;
      if ((REQUIREMENT_OPTIONS as readonly string[]).includes(value)) setRequirement(value);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const a11y = (name: keyof QuoteFieldErrors) =>
    errors[name] ? { "aria-invalid": true as const, "aria-describedby": `q-${name}-error` } : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const file = data.get("document");
    if (file instanceof File && file.size > MAX_UPLOAD_BYTES) {
      setErrors({ document: "Attachments must be 5 MB or smaller." });
      return;
    }

    setStatus({ state: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/quote", { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as { error?: string; fields?: QuoteFieldErrors };
      if (res.ok) {
        setStatus({ state: "sent" });
        form.reset();
        setRequirement("");
        setFileName("");
        return;
      }
      if (body.fields) setErrors(body.fields);
      setStatus({ state: "error", message: body.error ?? "Something went wrong. Please try again." });
    } catch {
      setStatus({ state: "error", message: "Network error. Please check your connection and try again." });
    }
  }

  if (status.state === "sent") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        role="status"
        className="flex min-h-[28rem] flex-col items-center justify-center rounded-3xl bg-white p-10 text-center"
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-sky text-navy">
          <Icon name="check" className="h-8 w-8" strokeWidth={2} />
        </span>
        <h3 className="mt-6 text-2xl font-extrabold">Enquiry received</h3>
        <p className="mt-3 max-w-sm text-ink-soft">
          Thank you. Our team will review your requirement and get back to you with the next steps.
        </p>
        <button type="button" onClick={() => setStatus({ state: "idle" })} className="btn-ghost mt-8">
          Send another enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className="relative rounded-3xl bg-white p-6 sm:p-9" aria-describedby="quote-status">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="q-name" label="Name" error={errors.name}>
          <input id="q-name" name="name" required minLength={2} maxLength={100} autoComplete="name" className="field" {...a11y("name")} />
        </Field>
        <Field id="q-company" label="Company" optional error={errors.company}>
          <input id="q-company" name="company" maxLength={120} autoComplete="organization" className="field" {...a11y("company")} />
        </Field>
        <Field id="q-phone" label="Phone" error={errors.phone}>
          <input
            id="q-phone"
            name="phone"
            type="tel"
            required
            inputMode="tel"
            pattern="\+?[\d\s\(\)\-]{8,18}"
            autoComplete="tel"
            className="field"
            {...a11y("phone")}
          />
        </Field>
        <Field id="q-email" label="Email" error={errors.email}>
          <input id="q-email" name="email" type="email" required maxLength={160} autoComplete="email" className="field" {...a11y("email")} />
        </Field>
        <Field id="q-product" label="Product / sample" error={errors.product}>
          <input
            id="q-product"
            name="product"
            required
            minLength={2}
            maxLength={150}
            placeholder="e.g. HDPE pipe, packaged water"
            className="field"
            {...a11y("product")}
          />
        </Field>
        <Field id="q-requirement" label="Testing requirement" error={errors.requirement}>
          <select
            id="q-requirement"
            name="requirement"
            required
            value={requirement}
            onChange={(e) => setRequirement(e.target.value)}
            className="field appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23486581%22 stroke-width=%222%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_1rem_center] bg-no-repeat pr-10"
            {...a11y("requirement")}
          >
            <option value="" disabled>
              Select a service
            </option>
            {REQUIREMENT_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </Field>
        <Field id="q-standard" label="Standard / specification" optional error={errors.standard} className="sm:col-span-2">
          <input
            id="q-standard"
            name="standard"
            maxLength={80}
            list="q-standard-list"
            placeholder="e.g. IS 4985 — or leave blank if unsure"
            className="field"
            {...a11y("standard")}
          />
          <datalist id="q-standard-list">
            {standards.map((s) => (
              <option key={s.code} value={s.code}>
                {s.title ?? s.code}
              </option>
            ))}
          </datalist>
        </Field>
        <Field id="q-message" label="Message" optional error={errors.message} className="sm:col-span-2">
          <textarea
            id="q-message"
            name="message"
            rows={4}
            maxLength={2000}
            placeholder="Purpose of testing, number of samples, timelines…"
            className="field resize-y"
            {...a11y("message")}
          />
        </Field>

        <Field id="q-document" label="Supporting document" optional error={errors.document} className="sm:col-span-2">
          <label
            htmlFor="q-document"
            className="flex cursor-pointer items-center gap-4 rounded-xl border border-dashed border-blue/30 bg-sky/40 px-4 py-4 transition hover:border-blue/60 hover:bg-sky focus-within:ring-4 focus-within:ring-blue-bright/15"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white text-navy shadow-sm">
              <Icon name="upload" className="h-5 w-5" />
            </span>
            <span className="min-w-0 text-sm">
              <span className="block truncate font-semibold text-navy">{fileName || "Attach a specification, drawing or PO"}</span>
              <span className="text-ink-muted">PDF, JPG or PNG · up to 5 MB</span>
            </span>
            <input
              id="q-document"
              name="document"
              type="file"
              accept={ACCEPTED_UPLOADS}
              className="sr-only"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
              {...a11y("document")}
            />
          </label>
        </Field>
      </div>

      {/* Anti-spam: honeypot (hidden from people and assistive tech) + fill-time stamp */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>
      <input type="hidden" name="startedAt" value={startedAt} />

      <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-muted sm:max-w-xs">
          Your details are used only to respond to this enquiry.
        </p>
        <button type="submit" disabled={status.state === "sending"} className="btn-primary disabled:cursor-wait disabled:opacity-70">
          {status.state === "sending" ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Sending…
            </>
          ) : (
            <>
              Send enquiry <Icon name="arrow" className="h-4 w-4" strokeWidth={2} />
            </>
          )}
        </button>
      </div>

      <div id="quote-status" aria-live="polite">
        <AnimatePresence>
          {status.state === "error" && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {status.message}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
