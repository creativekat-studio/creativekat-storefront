export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function formatDate(iso: string): string {
  return parseStoredDate(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** YYYY-MM-DD in local timezone — for date inputs and auto-fill on check. */
export function todayLocalDate(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function parseStoredDate(stored: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(stored)) {
    return new Date(`${stored}T12:00:00`);
  }
  return new Date(stored);
}

export function toDateInputValue(stored?: string): string {
  if (!stored) return todayLocalDate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(stored)) return stored;
  const d = parseStoredDate(stored);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function leadSourceLabel(source: string): string {
  return source === "project-brief" ? "Project brief" : "Inquiry";
}

export function statusLabel(status: string): string {
  return status.replace(/-/g, " ");
}
