import Link from "next/link";
import StatusBadge from "@/components/admin/StatusBadge";
import {
  countActiveProjects,
  countProjectsByStatus,
  listProjects,
} from "@/lib/crm/projects";
import {
  countLeadsByStatus,
  countNewLeads,
  listLeads,
} from "@/lib/crm/leads";
import { formatDateTime, leadSourceLabel } from "@/lib/crm/format";

export default async function AdminDashboardPage() {
  const [newLeads, activeProjects, recentLeads, recentProjects, leadCounts, projectCounts] =
    await Promise.all([
      countNewLeads(),
      countActiveProjects(),
      listLeads(),
      listProjects(),
      countLeadsByStatus(),
      countProjectsByStatus(),
    ]);

  const inbox = recentLeads.slice(0, 5);
  const projects = recentProjects.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          — Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Studio CRM</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="New inbox" value={newLeads} href="/admin/leads?status=new" />
        <StatCard label="Active projects" value={activeProjects} href="/admin/projects?status=active" />
        <StatCard label="Open leads" value={(leadCounts.open ?? 0) + (leadCounts.replied ?? 0)} href="/admin/leads" />
        <StatCard label="Delivered" value={projectCounts.delivered ?? 0} href="/admin/projects?status=delivered" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-medium">Recent inbox</h2>
            <Link href="/admin/leads" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              View all →
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {inbox.length === 0 ? (
              <li className="px-5 py-8 text-sm text-[var(--muted)]">No leads yet.</li>
            ) : (
              inbox.map((lead) => (
                <li key={lead.id}>
                  <Link
                    href={`/admin/leads/${lead.id}`}
                    className="flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-[var(--background)]"
                  >
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {leadSourceLabel(lead.source)}
                        {lead.summary ? ` · ${lead.summary}` : ""}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={lead.status} />
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {formatDateTime(lead.created_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)]">
          <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
            <h2 className="font-medium">Recent projects</h2>
            <Link href="/admin/projects/new" className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]">
              New project →
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {projects.length === 0 ? (
              <li className="px-5 py-8 text-sm text-[var(--muted)]">No projects yet.</li>
            ) : (
              projects.map((project) => (
                <li key={project.id}>
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="flex items-start justify-between gap-4 px-5 py-4 transition hover:bg-[var(--background)]"
                  >
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)]">
                        {project.client_name ?? "No client set"}
                      </p>
                    </div>
                    <div className="text-right">
                      <StatusBadge status={project.status} />
                      <p className="mt-2 text-xs text-[var(--muted)]">
                        {formatDateTime(project.updated_at)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 transition hover:border-violet-500/40"
    >
      <p className="text-sm text-[var(--muted)]">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </Link>
  );
}
