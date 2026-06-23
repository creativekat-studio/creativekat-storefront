"use client";

import { useRouter } from "next/navigation";
import { LEAD_STATUSES, type LeadStatus } from "@/lib/crm/types";

export default function LeadStatusSelect({
  leadId,
  status,
}: {
  leadId: string;
  status: LeadStatus;
}) {
  const router = useRouter();

  async function onChange(next: LeadStatus) {
    await fetch(`/api/admin/leads/${leadId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    router.refresh();
  }

  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value as LeadStatus)}
      className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-sm capitalize focus:border-violet-500 focus:outline-none"
    >
      {LEAD_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
