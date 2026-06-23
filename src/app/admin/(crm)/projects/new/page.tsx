import Link from "next/link";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";
import { getLead } from "@/lib/crm/leads";

type Props = {
  searchParams: Promise<{ lead?: string }>;
};

export default async function NewProjectPage({ searchParams }: Props) {
  const { lead: leadId } = await searchParams;
  const lead = leadId ? await getLead(leadId) : null;
  if (leadId && !lead) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/projects"
          className="text-sm text-[var(--muted)] hover:text-[var(--foreground)]"
        >
          ← Back to projects
        </Link>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">New project</h1>
        {lead && (
          <p className="mt-2 text-sm text-[var(--muted)]">
            Prefilled from lead: {lead.name}
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6">
        <ProjectForm
          leadDefaults={
            lead
              ? {
                  title:
                    lead.project_type_label ??
                    lead.summary ??
                    `${lead.name} project`,
                  client_name: lead.company ?? lead.name,
                  client_email: lead.email,
                  project_type: lead.project_type ?? undefined,
                  summary: lead.summary ?? undefined,
                  lead_id: lead.id,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
