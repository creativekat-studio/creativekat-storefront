"use client";

import { useState } from "react";
import { formatDate, formatDateTime } from "@/lib/crm/format";

export type ClientEmailHistoryItem = {
  id: string;
  subject: string;
  body: string;
  created_at: string;
  deliverable_id: string | null;
  attachments: { id: string; filename: string }[];
};

const PREVIEW_LINES = 6;

function previewBody(body: string): { preview: string; isTruncated: boolean } {
  const lines = body.split("\n");
  if (lines.length <= PREVIEW_LINES) {
    return { preview: body, isTruncated: false };
  }
  return {
    preview: lines.slice(0, PREVIEW_LINES).join("\n"),
    isTruncated: true,
  };
}

function HistoryMessageBody({ body }: { body: string }) {
  const [showFull, setShowFull] = useState(false);
  const { preview, isTruncated } = previewBody(body);

  return (
    <div>
      <p className="whitespace-pre-wrap text-sm text-[var(--muted)]">
        {showFull || !isTruncated ? body : preview}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={() => setShowFull((v) => !v)}
          className="mt-2 text-xs text-[var(--foreground)] underline decoration-dotted underline-offset-4"
        >
          {showFull ? "Show less" : "See more"}
        </button>
      )}
    </div>
  );
}

export default function ProjectClientEmailHistory({
  items,
}: {
  items: ClientEmailHistoryItem[];
}) {
  const [open, setOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (items.length === 0) return null;

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--background)]"
      >
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            — Sent history
          </p>
          <p className="mt-0.5 text-sm text-[var(--foreground)]">
            {items.length} email{items.length === 1 ? "" : "s"} to client
          </p>
        </div>
        <span className="text-sm text-[var(--muted)]">{open ? "Hide ↑" : "Show ↓"}</span>
      </button>

      {open && (
        <ul className="max-h-96 divide-y divide-[var(--border)] overflow-y-auto border-t border-[var(--border)]">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : item.id)
                  }
                  className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition hover:bg-[var(--background)]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">
                      {item.subject}
                    </span>
                    <span className="mt-0.5 block text-xs text-[var(--muted)]">
                      {formatDate(item.created_at)}
                      {item.deliverable_id &&
                        ` · ${item.deliverable_id.replace(/_/g, " ")}`}
                      {item.attachments.length > 0 &&
                        ` · ${item.attachments.length} file${item.attachments.length === 1 ? "" : "s"}`}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-[var(--muted)]">
                    {isExpanded ? "−" : "+"}
                  </span>
                </button>

                {isExpanded && (
                  <div className="space-y-3 border-t border-[var(--border)] bg-[var(--background)] px-4 py-3">
                    <p className="text-xs text-[var(--muted)]">
                      {formatDateTime(item.created_at)}
                    </p>
                    <HistoryMessageBody body={item.body} />
                    {item.attachments.length > 0 && (
                      <ul className="flex flex-wrap gap-2">
                        {item.attachments.map((att) => (
                          <li key={att.id}>
                            <a
                              href={`/api/admin/attachments/${att.id}`}
                              className="inline-flex rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs hover:border-violet-500/50"
                            >
                              {att.filename}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
