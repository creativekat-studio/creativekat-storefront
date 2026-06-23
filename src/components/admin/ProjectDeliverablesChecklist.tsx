"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Deliverable } from "@/lib/crm/types";
import {
  formatDate,
  todayLocalDate,
  toDateInputValue,
} from "@/lib/crm/format";
import { defaultDeliverables, deliverablesProgress } from "@/lib/crm/deliverables";

type Props = {
  projectId: string;
  projectType: string | null;
  initial: Deliverable[];
};

export default function ProjectDeliverablesChecklist({
  projectId,
  projectType,
  initial,
}: Props) {
  const router = useRouter();
  const [items, setItems] = useState<Deliverable[]>(initial);
  const [saving, setSaving] = useState(false);
  const [newLabel, setNewLabel] = useState("");

  const progress = deliverablesProgress(items);

  async function persist(next: Deliverable[]) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${projectId}/deliverables`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deliverables: next }),
      });
      if (!res.ok) throw new Error("Could not save");
      setItems(next);
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function toggle(id: string) {
    const next = items.map((d) =>
      d.id === id
        ? {
            ...d,
            done: !d.done,
            done_at: !d.done ? todayLocalDate() : undefined,
          }
        : d,
    );
    void persist(next);
  }

  function updateDate(id: string, value: string) {
    if (!value) return;
    const next = items.map((d) =>
      d.id === id ? { ...d, done: true, done_at: value } : d,
    );
    void persist(next);
  }

  function move(id: string, direction: -1 | 1) {
    const index = items.findIndex((d) => d.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    void persist(next);
  }

  function addItem() {
    const label = newLabel.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, "_").slice(0, 40);
    const next = [...items, { id, label, done: false }];
    setNewLabel("");
    void persist(next);
  }

  function resetDefaults() {
    if (!confirm("Reset deliverables to the default checklist?")) return;
    void persist(defaultDeliverables(projectType));
  }

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            — Deliverables
          </p>
          <h2 className="mt-1 text-lg font-semibold">Checklist</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {progress.done} of {progress.total} complete
          </p>
        </div>
        <button
          type="button"
          onClick={resetDefaults}
          className="text-xs text-[var(--muted)] underline decoration-dotted underline-offset-4"
        >
          Reset defaults
        </button>
      </div>

      <ul className="mt-5 space-y-2">
        {items.map((item, index) => (
          <li key={item.id}>
            <div className="flex items-center gap-1 rounded-xl border border-transparent px-1 py-1 transition hover:border-[var(--border)] hover:bg-[var(--background)]">
              <div className="flex shrink-0 flex-col">
                <MoveButton
                  label="Move up"
                  disabled={saving || index === 0}
                  onClick={() => move(item.id, -1)}
                >
                  ↑
                </MoveButton>
                <MoveButton
                  label="Move down"
                  disabled={saving || index === items.length - 1}
                  onClick={() => move(item.id, 1)}
                >
                  ↓
                </MoveButton>
              </div>
              <div className="flex min-w-0 flex-1 items-center gap-3 px-1 py-1">
                <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => toggle(item.id)}
                    disabled={saving}
                    className="shrink-0 rounded border-[var(--border)]"
                  />
                  <span
                    className={`truncate text-sm ${item.done ? "text-[var(--muted)] line-through" : ""}`}
                  >
                    {item.label}
                  </span>
                </label>
                {item.done && (
                  <input
                    type="date"
                    value={toDateInputValue(item.done_at)}
                    onChange={(e) => updateDate(item.id, e.target.value)}
                    disabled={saving}
                    aria-label={`Date for ${item.label}`}
                    className="shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] px-2 py-1 text-xs text-[var(--foreground)] focus:border-violet-500 focus:outline-none"
                  />
                )}
                {item.sent_at && !item.done && (
                  <span className="shrink-0 text-xs text-[var(--muted)]">
                    Sent {formatDate(item.sent_at)}
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-4 flex gap-2">
        <input
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add custom item…"
          className="min-w-0 flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addItem();
            }
          }}
        />
        <button
          type="button"
          onClick={addItem}
          disabled={saving || !newLabel.trim()}
          className="rounded-full border border-[var(--border)] px-4 py-2 text-sm disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </section>
  );
}

function MoveButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-6 w-6 items-center justify-center rounded text-xs text-[var(--muted)] transition hover:bg-[var(--border)] hover:text-[var(--foreground)] disabled:opacity-25"
    >
      {children}
    </button>
  );
}
