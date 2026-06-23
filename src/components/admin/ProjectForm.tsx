"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Project } from "@/lib/crm/types";
import { PROJECT_STATUSES } from "@/lib/crm/types";

type Props = {
  project?: Project;
  leadDefaults?: {
    title?: string;
    client_name?: string;
    client_email?: string;
    project_type?: string;
    summary?: string;
    lead_id?: string;
  };
};

export default function ProjectForm({ project, leadDefaults }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const payload = {
      ...data,
      publish_to_site: data.publish_to_site === "on",
    };

    const url = project
      ? `/api/admin/projects/${project.id}`
      : "/api/admin/projects";
    const method = project ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Could not save project");

      router.push(`/admin/projects/${body.project.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save project");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Project title"
          name="title"
          defaultValue={project?.title ?? leadDefaults?.title ?? ""}
          required
        />
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]">Status</label>
          <select
            name="status"
            defaultValue={project?.status ?? "lead"}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
          >
            {PROJECT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <Field
          label="Client name"
          name="client_name"
          defaultValue={project?.client_name ?? leadDefaults?.client_name ?? ""}
        />
        <Field
          label="Client email"
          name="client_email"
          type="email"
          defaultValue={project?.client_email ?? leadDefaults?.client_email ?? ""}
        />
        <div>
          <label className="mb-1.5 block text-sm text-[var(--muted)]">
            Project type
          </label>
          <select
            name="project_type"
            defaultValue={project?.project_type ?? leadDefaults?.project_type ?? ""}
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
          >
            <option value="">General</option>
            <option value="shop">Online shop / storefront</option>
            <option value="website">Website / web app</option>
            <option value="logo">Logo / brand identity</option>
            <option value="brand-system">Brand system</option>
          </select>
        </div>
        <Field
          label="Budget / value"
          name="value"
          defaultValue={project?.value ?? ""}
        />
        <Field
          label="Timeline"
          name="timeline"
          defaultValue={project?.timeline ?? ""}
        />
        <Field
          label="Live URL"
          name="live_url"
          defaultValue={project?.live_url ?? ""}
        />
        <Field
          label="Portfolio slug"
          name="slug"
          defaultValue={project?.slug ?? ""}
          hint="Optional — for linking to a case study later"
        />
      </div>

      <TextArea
        label="Summary"
        name="summary"
        defaultValue={project?.summary ?? leadDefaults?.summary ?? ""}
      />
      <TextArea label="Internal notes" name="notes" defaultValue={project?.notes ?? ""} />

      {leadDefaults?.lead_id && (
        <input type="hidden" name="lead_id" value={leadDefaults.lead_id} />
      )}

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="publish_to_site"
          defaultChecked={project?.publish_to_site ?? false}
          className="rounded border-[var(--border)]"
        />
        Flag for portfolio / site publishing
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[var(--foreground)] px-5 py-2.5 text-sm font-medium text-[var(--background)] disabled:opacity-60"
        >
          {loading ? "Saving…" : project ? "Save changes" : "Create project"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required = false,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-[var(--muted)]">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
      />
      {hint && <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>}
    </div>
  );
}

function TextArea({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-[var(--muted)]">{label}</label>
      <textarea
        name={name}
        rows={4}
        defaultValue={defaultValue}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
      />
    </div>
  );
}
