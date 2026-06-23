import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { listLeads } from "@/lib/crm/leads";
import { formatDateTime, leadSourceLabel } from "@/lib/crm/format";
import type { LeadStatus } from "@/lib/crm/types";
import { LEAD_STATUSES } from "@/lib/crm/types";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function LeadsPage({ searchParams }: Props) {
  const { status: statusParam } = await searchParams;
  const status =
    statusParam && LEAD_STATUSES.includes(statusParam as LeadStatus)
      ? (statusParam as LeadStatus)
      : undefined;

  const leads = await listLeads(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            — Inbox
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Leads</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterPill href="/admin/leads" active={!status} label="All" />
          {LEAD_STATUSES.map((s) => (
            <FilterPill
              key={s}
              href={`/admin/leads?status=${s}`}
              active={status === s}
              label={s}
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3 font-medium">Contact</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Source</th>
              <th className="hidden px-5 py-3 font-medium lg:table-cell">Summary</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-[var(--muted)]">
                  No leads in this view.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="transition hover:bg-[var(--background)]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/leads/${lead.id}`} className="block">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-[var(--muted)]">{lead.email}</p>
                    </Link>
                  </td>
                  <td className="hidden px-5 py-4 text-[var(--muted)] md:table-cell">
                    {leadSourceLabel(lead.source)}
                  </td>
                  <td className="hidden max-w-xs truncate px-5 py-4 text-[var(--muted)] lg:table-cell">
                    {lead.summary ?? lead.message ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-5 py-4 text-[var(--muted)]">
                    {formatDateTime(lead.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FilterPill({
  href,
  active,
  label,
}: {
  href: string;
  active: boolean;
  label: string;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1.5 text-sm capitalize transition ${
        active
          ? "bg-[var(--foreground)] text-[var(--background)]"
          : "border border-[var(--border)] text-[var(--muted)] hover:text-[var(--foreground)]"
      }`}
    >
      {label}
    </Link>
  );
}
