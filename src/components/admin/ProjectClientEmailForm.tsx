"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Deliverable } from "@/lib/crm/types";
import {
  EMAIL_TEMPLATES,
  fillEmailTemplate,
} from "@/lib/crm/deliverables";

type Props = {
  projectId: string;
  projectTitle: string;
  clientName: string | null;
  clientEmail: string | null;
  deliverables: Deliverable[];
};

export default function ProjectClientEmailForm({
  projectId,
  projectTitle,
  clientName,
  clientEmail,
  deliverables,
}: Props) {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [deliverableId, setDeliverableId] = useState("");
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const vars = {
    project: projectTitle,
    client: clientName ?? clientEmail ?? "",
  };

  function applyTemplate(key: keyof typeof EMAIL_TEMPLATES) {
    const tpl = EMAIL_TEMPLATES[key];
    setSubject(fillEmailTemplate(tpl.subject, vars));
    setBody(fillEmailTemplate(tpl.body, vars));
    if (tpl.deliverableId) setDeliverableId(tpl.deliverableId);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!clientEmail) {
      setError("Add a client email on this project first.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const data = new FormData(form);
    if (includeChecklist) data.set("include_checklist", "on");
    else data.delete("include_checklist");

    try {
      const res = await fetch(`/api/admin/projects/${projectId}/send`, {
        method: "POST",
        body: data,
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(payload.error ?? "Could not send");

      setSuccess(
        payload.delivered
          ? `Sent to ${clientEmail}.`
          : "Saved locally (Resend not configured).",
      );
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send");
    } finally {
      setLoading(false);
    }
  }

  if (!clientEmail) {
    return (
      <section className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface)] p-5">
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          — Client email
        </p>
        <p className="mt-3 text-sm text-[var(--muted)]">
          Add a client email in the project details below to send proposals and
          agreements.
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
    >
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          — Client email
        </p>
        <h2 className="mt-1 text-lg font-semibold">Send to {clientName ?? clientEmail}</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">{clientEmail}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <QuickButton label="Proposal" onClick={() => applyTemplate("proposal")} />
        <QuickButton label="Service agreement" onClick={() => applyTemplate("agreement")} />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">Subject</label>
        <input
          name="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">Message</label>
        <textarea
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          required
          placeholder="Attach the proposal or agreement PDF below."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">
          Mark deliverable as sent
        </label>
        <select
          name="deliverable_id"
          value={deliverableId}
          onChange={(e) => setDeliverableId(e.target.value)}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        >
          <option value="">None</option>
          {deliverables.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">Attachments</label>
        <input
          type="file"
          name="attachments"
          multiple
          className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--background)]"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          Attach PROPOSAL.pdf, AGREEMENT.pdf, etc. — up to 10MB each.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={includeChecklist}
          onChange={(e) => setIncludeChecklist(e.target.checked)}
          className="rounded border-[var(--border)]"
        />
        Include deliverables checklist in email
      </label>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send to client"}
      </button>
    </form>
  );
}

function QuickButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-[var(--border)] px-3 py-1.5 text-sm transition hover:border-violet-500/50"
    >
      {label}
    </button>
  );
}
