"use client";

import { useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/crm/types";
import {
  DELIVERABLE_STATUSES,
  draftFromProject,
  documentFilename,
  type DeliverableStatus,
  type MilestoneCompletionDraft,
  type MilestoneDeliverableRow,
  type MilestonePendingItem,
} from "@/lib/crm/milestoneCompletion";
import MilestoneCompletionDocument from "@/components/admin/MilestoneCompletionDocument";

type Props = {
  project: Project;
};

export default function MilestoneCompletionGenerator({ project }: Props) {
  const [draft, setDraft] = useState<MilestoneCompletionDraft>(() =>
    draftFromProject(project),
  );

  function update<K extends keyof MilestoneCompletionDraft>(
    key: K,
    value: MilestoneCompletionDraft[K],
  ) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function updateDeliverable(
    id: string,
    patch: Partial<MilestoneDeliverableRow>,
  ) {
    setDraft((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) =>
        d.id === id ? { ...d, ...patch } : d,
      ),
    }));
  }

  function updatePending(id: string, patch: Partial<MilestonePendingItem>) {
    setDraft((prev) => ({
      ...prev,
      pendingItems: prev.pendingItems.map((item) =>
        item.id === id ? { ...item, ...patch } : item,
      ),
    }));
  }

  function addDeliverable() {
    const id = `custom_${Date.now()}`;
    setDraft((prev) => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        { id, label: "", status: "Ongoing" },
      ],
    }));
  }

  function removeDeliverable(id: string) {
    setDraft((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((d) => d.id !== id),
    }));
  }

  function addPending() {
    const id = `pending_${Date.now()}`;
    setDraft((prev) => ({
      ...prev,
      pendingItems: [
        ...prev.pendingItems,
        {
          id,
          label: "",
          responsible: draft.clientName.trim() || "Client",
        },
      ],
    }));
  }

  function removePending(id: string) {
    setDraft((prev) => ({
      ...prev,
      pendingItems: prev.pendingItems.filter((item) => item.id !== id),
    }));
  }

  function resetFromProject() {
    setDraft(draftFromProject(project, { phaseLabel: draft.phaseLabel }));
  }

  function printDocument() {
    const previousTitle = document.title;
    document.title = documentFilename(draft).replace(/\.pdf$/i, "");
    window.print();
    document.title = previousTitle;
  }

  return (
    <div className="space-y-6">
      <div className="print:hidden flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href={`/admin/projects/${project.id}`}
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Back to project
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Milestone completion
          </h1>
          <p className="mt-2 max-w-xl text-sm text-[var(--muted)]">
            Generate a phase completion document from this project&apos;s
            deliverables. Edit the fields, then print or save as PDF.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={resetFromProject}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--foreground)] hover:text-[var(--foreground)]"
          >
            Reset from project
          </button>
          <button
            type="button"
            onClick={printDocument}
            className="rounded-full bg-[var(--foreground)] px-4 py-2 text-sm font-medium text-[var(--background)]"
          >
            Print / Save PDF
          </button>
        </div>
      </div>

      <div className="print:hidden grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <form
          className="space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5"
          onSubmit={(e) => e.preventDefault()}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            — Document details
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Phase"
              value={draft.phaseLabel}
              onChange={(v) => update("phaseLabel", v)}
              placeholder="Phase 1"
            />
            <Field
              label="Document date"
              type="date"
              value={draft.documentDate}
              onChange={(v) => update("documentDate", v)}
            />
            <Field
              label="Project title"
              value={draft.projectTitle}
              onChange={(v) => update("projectTitle", v)}
              className="sm:col-span-2"
            />
            <Field
              label="Client"
              value={draft.clientName}
              onChange={(v) => update("clientName", v)}
            />
            <Field
              label="Client representative"
              value={draft.clientRepresentative}
              onChange={(v) => update("clientRepresentative", v)}
              placeholder="e.g. Ralph Lim"
            />
            <Field
              label="Developer"
              value={draft.developerName}
              onChange={(v) => update("developerName", v)}
            />
            <Field
              label="Developer representative"
              value={draft.developerRepresentative}
              onChange={(v) => update("developerRepresentative", v)}
            />
            <Field
              label="Milestone payment"
              value={draft.paymentAmount}
              onChange={(v) => update("paymentAmount", v)}
              placeholder="₱27,000"
              className="sm:col-span-2"
            />
          </div>

          <TextArea
            label="Status summary"
            value={draft.statusSummary}
            onChange={(v) => update("statusSummary", v)}
            rows={4}
          />
          <TextArea
            label="Payment note"
            value={draft.paymentNote}
            onChange={(v) => update("paymentNote", v)}
            rows={3}
          />
          <TextArea
            label="Next steps note"
            value={draft.nextStepsNote}
            onChange={(v) => update("nextStepsNote", v)}
            rows={2}
          />

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm text-[var(--muted)]">Deliverables checklist</p>
              <button
                type="button"
                onClick={addDeliverable}
                className="text-xs text-[var(--muted)] underline decoration-dotted underline-offset-4"
              >
                Add item
              </button>
            </div>
            <ul className="space-y-2">
              {draft.deliverables.map((item) => (
                <li
                  key={item.id}
                  className="grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 sm:grid-cols-[minmax(0,1fr)_140px_auto]"
                >
                  <input
                    value={item.label}
                    onChange={(e) =>
                      updateDeliverable(item.id, { label: e.target.value })
                    }
                    placeholder="Deliverable"
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  />
                  <select
                    value={item.status}
                    onChange={(e) =>
                      updateDeliverable(item.id, {
                        status: e.target.value as DeliverableStatus,
                      })
                    }
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  >
                    {DELIVERABLE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => removeDeliverable(item.id)}
                    className="rounded-lg px-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-sm text-[var(--muted)]">Pending items</p>
              <button
                type="button"
                onClick={addPending}
                className="text-xs text-[var(--muted)] underline decoration-dotted underline-offset-4"
              >
                Add item
              </button>
            </div>
            <ul className="space-y-2">
              {draft.pendingItems.map((item) => (
                <li
                  key={item.id}
                  className="grid gap-2 rounded-xl border border-[var(--border)] bg-[var(--background)] p-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)_auto]"
                >
                  <input
                    value={item.label}
                    onChange={(e) =>
                      updatePending(item.id, { label: e.target.value })
                    }
                    placeholder="Pending item"
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  />
                  <input
                    value={item.responsible}
                    onChange={(e) =>
                      updatePending(item.id, { responsible: e.target.value })
                    }
                    placeholder="Responsible party"
                    className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removePending(item.id)}
                    className="rounded-lg px-2 text-xs text-[var(--muted)] hover:text-[var(--foreground)]"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </form>

        <div className="rounded-2xl border border-[var(--border)] bg-neutral-100 p-4 dark:bg-neutral-900/40">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            — Preview
          </p>
          <div className="overflow-auto rounded-xl border border-neutral-200">
            <MilestoneCompletionDocument draft={draft} />
          </div>
        </div>
      </div>

      <div className="hidden print:block">
        <MilestoneCompletionDocument draft={draft} />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm text-[var(--muted)]">{label}</label>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm text-[var(--muted)]">{label}</label>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5 text-sm focus:border-violet-500 focus:outline-none"
      />
    </div>
  );
}
