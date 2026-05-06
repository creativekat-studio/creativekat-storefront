"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function InquiryForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError(null);

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col justify-center rounded-2xl border border-neutral-200 p-8 dark:border-neutral-800">
        <p className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          Sent
        </p>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">
          Thanks — got it.
        </h3>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          We&apos;ll reply from hello@creativekat.studio shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 self-start text-sm underline decoration-dotted underline-offset-4"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col gap-4 rounded-2xl border border-neutral-200 p-6 dark:border-neutral-800"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Company / project" name="company" />
      <div>
        <label className="mb-1.5 block text-sm text-neutral-600 dark:text-neutral-400">
          About
        </label>
        <select
          name="topic"
          defaultValue="general"
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:focus:border-white"
        >
          <option value="general">General inquiry</option>
          <option value="disenio.studio">disenio.studio</option>
          <option value="collaboration">Collaboration</option>
          <option value="licensing">Licensing</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm text-neutral-600 dark:text-neutral-400">
          Message
        </label>
        <textarea
          name="message"
          required
          rows={5}
          className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:focus:border-white"
        />
      </div>
      {/* honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-neutral-500">
          Sends to hello@creativekat.studio
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
        >
          {status === "submitting" ? "Sending…" : "Send inquiry"}
        </button>
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-neutral-600 dark:text-neutral-400">
        {label}
        {required && <span className="ml-0.5 text-neutral-400">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className="w-full rounded-lg border border-neutral-300 bg-transparent px-3 py-2 text-sm focus:border-neutral-900 focus:outline-none dark:border-neutral-700 dark:focus:border-white"
      />
    </div>
  );
}
