import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import { listProjects } from "@/lib/crm/projects";
import { formatDateTime } from "@/lib/crm/format";
import type { ProjectStatus } from "@/lib/crm/types";
import { PROJECT_STATUSES } from "@/lib/crm/types";

type Props = {
  searchParams: Promise<{ status?: string }>;
};

export default async function ProjectsPage({ searchParams }: Props) {
  const { status: statusParam } = await searchParams;
  const status =
    statusParam && PROJECT_STATUSES.includes(statusParam as ProjectStatus)
      ? (statusParam as ProjectStatus)
      : undefined;

  const projects = await listProjects(status);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
            — Projects
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Work</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex rounded-full bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-medium text-white"
        >
          New project
        </Link>
      </div>

      <div className="flex flex-wrap gap-2">
        <FilterPill href="/admin/projects" active={!status} label="All" />
        {PROJECT_STATUSES.map((s) => (
          <FilterPill
            key={s}
            href={`/admin/projects?status=${s}`}
            active={status === s}
            label={s}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] text-[var(--muted)]">
            <tr>
              <th className="px-5 py-3 font-medium">Project</th>
              <th className="hidden px-5 py-3 font-medium md:table-cell">Client</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {projects.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-5 py-10 text-[var(--muted)]">
                  No projects in this view.
                </td>
              </tr>
            ) : (
              projects.map((project) => (
                <tr key={project.id} className="transition hover:bg-[var(--background)]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/projects/${project.id}`} className="block">
                      <p className="font-medium">{project.title}</p>
                      {project.summary && (
                        <p className="mt-1 max-w-md truncate text-[var(--muted)]">
                          {project.summary}
                        </p>
                      )}
                    </Link>
                  </td>
                  <td className="hidden px-5 py-4 text-[var(--muted)] md:table-cell">
                    {project.client_name ?? "—"}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-5 py-4 text-[var(--muted)]">
                    {formatDateTime(project.updated_at)}
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
