import { statusLabel } from "@/lib/crm/format";

const tone: Record<string, string> = {
  new: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  open: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  replied: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  qualified: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  won: "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200",
  closed: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
  lead: "bg-violet-100 text-violet-800 dark:bg-violet-950 dark:text-violet-200",
  discovery: "bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-200",
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  review: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  delivered: "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200",
  archived: "bg-stone-200 text-stone-700 dark:bg-stone-800 dark:text-stone-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ${tone[status] ?? "bg-[var(--border)] text-[var(--muted)]"}`}
    >
      {statusLabel(status)}
    </span>
  );
}
