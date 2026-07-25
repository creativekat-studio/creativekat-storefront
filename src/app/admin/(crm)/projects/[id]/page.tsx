import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";
import ProjectDeliverablesChecklist from "@/components/admin/ProjectDeliverablesChecklist";
import ProjectClientEmailForm from "@/components/admin/ProjectClientEmailForm";
import ProjectClientEmailHistory from "@/components/admin/ProjectClientEmailHistory";
import StatusBadge from "@/components/admin/StatusBadge";
import { getLead } from "@/lib/crm/leads";
import {
  listProjectAttachments,
  listProjectMessages,
} from "@/lib/crm/projectMessages";
import { getProject } from "@/lib/crm/projects";
import { formatDateTime } from "@/lib/crm/format";

type Props = { params: Promise<{ id: string }> };

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const project = await getProject(id);
  if (!project) notFound();

  const lead = project.lead_id ? await getLead(project.lead_id) : null;
  const messages = await listProjectMessages(id);
  const messagesWithAttachments = await Promise.all(
    messages.map(async (message) => ({
      message,
      attachments: await listProjectAttachments(message.id),
    })),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/projects"
            className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
          >
            ← Back to projects
          </Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            {project.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <StatusBadge status={project.status} />
            <span className="text-sm text-[var(--muted)]">
              Updated {formatDateTime(project.updated_at)}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/projects/${project.id}/milestone`}
            className="rounded-full border border-[var(--border)] px-4 py-2 text-sm transition hover:border-[var(--foreground)]"
          >
            Milestone completion
          </Link>
          <DeleteProjectButton projectId={project.id} />
        </div>
      </div>

      {lead && (
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-5 py-4 text-sm">
          Linked lead:{" "}
          <Link href={`/admin/leads/${lead.id}`} className="font-medium underline">
            {lead.name}
          </Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ProjectDeliverablesChecklist
            projectId={project.id}
            projectType={project.project_type}
            initial={project.deliverables}
          />
          <ProjectClientEmailHistory
            items={[...messagesWithAttachments]
              .reverse()
              .map(({ message, attachments }) => ({
                id: message.id,
                subject: message.subject,
                body: message.body,
                created_at: message.created_at,
                deliverable_id: message.deliverable_id,
                attachments: attachments.map((a) => ({
                  id: a.id,
                  filename: a.filename,
                })),
              }))}
          />
        </div>
        <ProjectClientEmailForm
          projectId={project.id}
          projectTitle={project.title}
          clientName={project.client_name}
          clientEmail={project.client_email}
          deliverables={project.deliverables}
        />
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <p className="mb-4 font-mono text-[11px] uppercase tracking-widest text-[var(--muted)]">
          — Project details
        </p>
        <ProjectForm project={project} />
      </div>
    </div>
  );
}
