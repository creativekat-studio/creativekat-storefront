import { now } from "@/lib/now";

function relativeDate(iso: string): string {
  const then = new Date(iso + "T00:00:00Z");
  const today = new Date();
  const days = Math.floor(
    (Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) -
      Date.UTC(then.getUTCFullYear(), then.getUTCMonth(), then.getUTCDate())) /
      86_400_000,
  );
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.round(days / 7)}w ago`;
  return `${Math.round(days / 30)}mo ago`;
}

export default function NowBar() {
  return (
    <div className="border-b border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-2.5 text-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
        </span>
        <span className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          Now
        </span>
        <p className="flex-1 truncate text-[var(--foreground)]">{now.status}</p>
        <span className="hidden font-mono text-[11px] text-[var(--muted)] sm:inline">
          updated {relativeDate(now.updated)}
        </span>
      </div>
    </div>
  );
}
