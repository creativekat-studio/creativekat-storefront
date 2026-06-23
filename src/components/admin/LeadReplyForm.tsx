"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  leadId: string;
  defaultSubject: string;
  recipientName: string;
};

export default function LeadReplyForm({
  leadId,
  defaultSubject,
  recipientName,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch(`/api/admin/leads/${leadId}/reply`, {
        method: "POST",
        body: data,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error ?? "Could not send reply");

      setSuccess(
        body.delivered
          ? `Reply sent to ${recipientName}.`
          : "Reply saved locally (Resend not configured).",
      );
      form.reset();
      const subjectInput = form.elements.namedItem("subject") as HTMLInputElement;
      if (subjectInput) subjectInput.value = defaultSubject;
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reply");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          — Reply
        </p>
        <h2 className="mt-1 text-lg font-semibold">Send to {recipientName}</h2>
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">Subject</label>
        <input
          name="subject"
          defaultValue={defaultSubject}
          required
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">Message</label>
        <textarea
          name="body"
          rows={8}
          required
          placeholder="Write your reply — attach contracts, proposals, or signed docs below."
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm text-[var(--muted)]">
          Attachments
        </label>
        <input
          type="file"
          name="attachments"
          multiple
          className="block w-full text-sm text-[var(--muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--foreground)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--background)]"
        />
        <p className="mt-1 text-xs text-[var(--muted)]">
          PDFs, contracts, signed docs — up to 10MB each.
        </p>
      </div>

      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {success && (
        <p className="text-sm text-emerald-700 dark:text-emerald-300">{success}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-60"
      >
        {loading ? "Sending…" : "Send reply"}
      </button>
    </form>
  );
}
